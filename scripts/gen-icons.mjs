// Rasterizes favicon / touch-icon PNGs from public/icon-source.png (derived from icon.ico) via sharp.
// Run after changing the source image: `npm run gen:icons`.
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const pub = resolve(dirname(fileURLToPath(import.meta.url)), "..", "public");
const src = resolve(pub, "icon-source.png");

const sizes = {
    "favicon-16x16.png": 16,
    "favicon-32x32.png": 32,
    "apple-touch-icon.png": 180,
    "android-chrome-192x192.png": 192,
    "android-chrome-512x512.png": 512,
};

for (const [name, size] of Object.entries(sizes)) {
    await sharp(src)
        .resize(size, size, {
            fit: "cover",
            position: sharp.strategy.attention,
        })
        .png()
        .toFile(resolve(pub, name));
    console.log(`[gen-icons] ${name} (${size}x${size})`);
}
