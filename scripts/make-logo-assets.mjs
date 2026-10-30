/**
 * Makes web-ready brand assets from public/images/logo.png:
 *  - src/assets/brand/logo-icon.png  (icon only, transparent background, 256px)
 *  - public/favicon.png              (48px)
 *  - public/apple-touch-icon.png     (180px, on white, as iOS expects)
 *
 * The header shows this icon next to the wordmark set in live text, which stays
 * sharp at any size and is readable by screen readers and search engines.
 *
 * Run: node scripts/make-logo-assets.mjs
 */
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const root = new URL('..', import.meta.url).pathname;
const LOGO = `${root}public/images/logo.png`;

const meta = await sharp(LOGO).metadata();
const W = meta.width;
const H = meta.height;

// Icon area: centre of the image, above the wordmark.
const left = Math.round(W * 0.32);
const top = Math.round(H * 0.26);
const width = Math.round(W * 0.36);
const height = Math.round(H * 0.34);

const { data, info } = await sharp(LOGO)
  .extract({ left, top, width, height })
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

// "Colour to alpha" against white: background becomes transparent and the
// anti-aliased edges keep their true colour instead of a white halo.
const out = Buffer.alloc(info.width * info.height * 4);
for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
  const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
  const a = Math.max(255 - r, 255 - g, 255 - b) / 255;
  if (a < 0.04) continue; // background: leave fully transparent
  const un = (c) => Math.round(Math.min(255, Math.max(0, 255 - (255 - c) / a)));
  out[j] = un(r);
  out[j + 1] = un(g);
  out[j + 2] = un(b);
  out[j + 3] = Math.round(a * 255);
}

const icon = sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).trim();
const trimmed = await icon.png().toBuffer();

mkdirSync(`${root}src/assets/brand`, { recursive: true });
await sharp(trimmed)
  .resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(`${root}src/assets/brand/logo-icon.png`);

await sharp(trimmed)
  .resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(`${root}public/favicon.png`);

await sharp(trimmed)
  .resize(148, 148, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .extend({ top: 16, bottom: 16, left: 16, right: 16, background: '#FFFFFF' })
  .flatten({ background: '#FFFFFF' })
  .png()
  .toFile(`${root}public/apple-touch-icon.png`);

console.log('Wrote src/assets/brand/logo-icon.png, public/favicon.png, public/apple-touch-icon.png');
