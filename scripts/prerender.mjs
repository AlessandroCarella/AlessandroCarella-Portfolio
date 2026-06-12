// Static prerender of the CSR SPA — SEO report §1 / §16 task 7.
//
// This app loads ALL content client-side via fetch() (/content/*.json,
// per-project .json/.html), so Node-SSR approaches would only capture the
// loading spinner. Instead we run the REAL built app in headless Chromium:
// after `vite build`, serve dist/, crawl every route, wait for the fetched
// content to render, then write the fully-rendered DOM (incl. react-helmet
// <head>) to dist/<route>/index.html. Non-JS crawlers (Bing, DuckDuckGo) and
// social/LLM scrapers (LinkedIn, Slack, X) then see real content + per-route
// meta on every deep link instead of an empty <div id="root">.
//
// Runs automatically on `postbuild`. BEST-EFFORT: any failure (e.g. Chromium
// unavailable in the CI build image) logs a warning and exits 0, so the deploy
// still ships the plain SPA shell — which works via the _redirects fallback,
// just without prerendered HTML for that route.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import { preview } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = resolve(root, "dist");

const cfg = JSON.parse(
    readFileSync(resolve(root, "public/projects/projects-config.json"), "utf8")
);

// route -> output file + a selector that only appears AFTER the route's
// runtime fetch has resolved and its content has rendered.
const routes = [
    { path: "/home", out: "home/index.html", ready: "main.main-content" },
    { path: "/projects", out: "projects/index.html", ready: ".projects-grid" },
    { path: "/resume", out: "resume/index.html", ready: ".skill-tag" },
    ...cfg.map((p) => ({
        path: `/projects/${p.slug}`,
        out: `projects/${p.slug}/index.html`,
        ready: ".project-main-title",
    })),
];

const NAV_TIMEOUT = 30000; // per-route hard cap
const SETTLE_MS = 700; // let react-helmet-async flush <title>/meta into <head>

async function main() {
    let puppeteer;
    try {
        puppeteer = (await import("puppeteer")).default;
    } catch {
        console.warn(
            "[prerender] puppeteer not installed — skipping (SPA shell ships as-is)."
        );
        return;
    }

    const server = await preview({
        preview: { port: 4179, strictPort: false },
    });
    const base = server.resolvedUrls.local[0].replace(/\/$/, "");

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
    } catch (err) {
        console.warn(
            `[prerender] Chromium launch failed — skipping. ${err.message.split("\n")[0]}`
        );
        await server.close();
        return;
    }

    let ok = 0;
    const failed = [];

    for (const r of routes) {
        const page = await browser.newPage();
        try {
            // Block 3rd-party requests (e.g. the GitHub contributions API behind
            // the calendar) — not SEO content and they can stall the crawl.
            // Everything the page actually needs is served from dist/ on `base`.
            await page.setRequestInterception(true);
            page.on("request", (req) => {
                const u = req.url();
                if (
                    u.startsWith(base) ||
                    u.startsWith("data:") ||
                    u.startsWith("blob:")
                ) {
                    req.continue();
                } else {
                    req.abort();
                }
            });

            await page.goto(base + r.path, {
                waitUntil: "domcontentloaded",
                timeout: NAV_TIMEOUT,
            });
            await page.waitForSelector(r.ready, { timeout: NAV_TIMEOUT });
            await new Promise((res) => setTimeout(res, SETTLE_MS));

            // De-duplicate <head>: react-helmet-async appends per-route tags
            // marked data-rh="true". index.html also ships static (homepage)
            // description/og/twitter as a no-JS fallback — without this they'd
            // both end up in the frozen HTML and a scraper could read the wrong
            // (home) card on an inner page. Drop each static meta/canonical that
            // Helmet has overridden; keep the static Person/WebSite JSON-LD (the
            // Helmet BreadcrumbList is a different, additive schema).
            await page.evaluate(() => {
                const keyOf = (el) => {
                    if (el.tagName === "META") {
                        const k =
                            el.getAttribute("name") ||
                            el.getAttribute("property");
                        return k ? `meta:${k}` : null;
                    }
                    if (el.tagName === "LINK" && el.rel === "canonical")
                        return "link:canonical";
                    return null; // never dedupe <script> (JSON-LD is additive)
                };
                const managed = new Set();
                document.head
                    .querySelectorAll('[data-rh="true"]')
                    .forEach((el) => {
                        const k = keyOf(el);
                        if (k) managed.add(k);
                    });
                document.head
                    .querySelectorAll('meta, link[rel="canonical"]')
                    .forEach((el) => {
                        if (el.getAttribute("data-rh") === "true") return;
                        const k = keyOf(el);
                        if (k && managed.has(k)) el.remove();
                    });
            });

            const html = await page.content();
            const outFile = join(distDir, r.out);
            mkdirSync(dirname(outFile), { recursive: true });
            writeFileSync(outFile, html);

            // "/" client-redirects to /home — serve the prerendered home there
            // too, replacing the empty shell (also the SPA 404 fallback doc).
            if (r.path === "/home") {
                writeFileSync(join(distDir, "index.html"), html);
            }

            ok++;
            console.log(`[prerender] OK  ${r.path} -> dist/${r.out}`);
        } catch (err) {
            failed.push(r.path);
            console.warn(
                `[prerender] FAIL ${r.path} (${err.message.split("\n")[0]})`
            );
        } finally {
            await page.close();
        }
    }

    await browser.close();
    await server.close();

    console.log(
        `[prerender] done: ${ok}/${routes.length} routes prerendered` +
            (failed.length
                ? `; SPA-shell fallback for: ${failed.join(", ")}`
                : "")
    );
}

main().catch((err) => {
    console.warn(`[prerender] skipped due to error: ${err.message}`);
    process.exit(0);
});
