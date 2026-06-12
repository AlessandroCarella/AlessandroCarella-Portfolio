// Generates public/robots.txt + public/sitemap.xml from the single SITE_URL
// source and projects-config.json. Runs automatically on `prebuild`.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { SITE_URL } from "../site.config.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cfg = JSON.parse(
    readFileSync(resolve(root, "public/projects/projects-config.json"), "utf8")
);

const routes = [
    { loc: "/home", changefreq: "monthly", priority: "1.0" },
    { loc: "/projects", changefreq: "monthly", priority: "0.9" },
    { loc: "/resume", changefreq: "monthly", priority: "0.9" },
    ...cfg.map((p) => ({ loc: `/projects/${p.slug}`, priority: "0.7" })),
];

const body = routes
    .map((r) => {
        const cf = r.changefreq
            ? `<changefreq>${r.changefreq}</changefreq>`
            : "";
        return `  <url><loc>${SITE_URL}${r.loc}</loc>${cf}<priority>${r.priority}</priority></url>`;
    })
    .join("\n");

writeFileSync(
    resolve(root, "public/sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
);

writeFileSync(
    resolve(root, "public/robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
);

console.log(
    `[gen-seo] ${routes.length} urls -> public/sitemap.xml + robots.txt (${SITE_URL})`
);
