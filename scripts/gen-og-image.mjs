// Generates public/og-image.png (1200x630) for social share cards (OG/Twitter).
// propic.jpeg is 800x800 square — wrong ratio for cards — so we composite a
// circular avatar + name/role onto a 1200x630 brand-colored canvas.
// Runs on prebuild alongside gen-seo-files.mjs.
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pub = resolve(root, "public");

const W = 1200,
    H = 630,
    BG = "#010409", // matches theme-color / manifest background
    FG = "#f0f6fc",
    MUTED = "#8b949e",
    AVATAR = 320;

// Circular-masked avatar from the existing square profile picture.
const avatar = await sharp(resolve(pub, "propic.jpeg"))
    .resize(AVATAR, AVATAR, { fit: "cover" })
    .composite([
        {
            input: Buffer.from(
                `<svg width="${AVATAR}" height="${AVATAR}"><circle cx="${AVATAR / 2}" cy="${AVATAR / 2}" r="${AVATAR / 2}"/></svg>`
            ),
            blend: "dest-in",
        },
    ])
    .png()
    .toBuffer();

const text = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .name { fill:${FG}; font-family:sans-serif; font-weight:700; font-size:60px; }
    .role { fill:${MUTED}; font-family:sans-serif; font-weight:400; font-size:36px; }
  </style>
  <text x="540" y="300" class="name">Alessandro Carella</text>
  <text x="540" y="356" class="role">Data Scientist</text>
</svg>`);

await sharp({
    create: { width: W, height: H, channels: 4, background: BG },
})
    .composite([
        { input: avatar, left: 130, top: Math.round((H - AVATAR) / 2) },
        { input: text, left: 0, top: 0 },
    ])
    .png()
    .toFile(resolve(pub, "og-image.png"));

console.log("[gen-og] public/og-image.png (1200x630)");
