/**
 * Samples the brand colours from public/images/logo.png.
 *
 * The wordmark sits on one line under the icon: "Hyperfocus" in dark teal on
 * the left, "Health" in mint on the right. For each word we take every
 * clearly-coloured pixel in its area (ignoring the white background and the
 * soft anti-aliased edges) and report the most common exact colour, which is
 * the solid fill of the letters.
 *
 * Run: node scripts/sample-logo-colours.mjs
 */
import sharp from 'sharp';

const LOGO = new URL('../public/images/logo.png', import.meta.url).pathname;

const { data, info } = await sharp(LOGO).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

const hex = (r, g, b) => '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase();

/** Fraction-based regions so this keeps working if the logo is re-exported at another size. */
const regions = {
  'Dark teal ("Hyperfocus")': { x0: 0.05, x1: 0.6, y0: 0.62, y1: 0.72 },
  'Mint ("Health")': { x0: 0.63, x1: 0.95, y0: 0.62, y1: 0.72 },
  'Icon (whole)': { x0: 0.33, x1: 0.67, y0: 0.27, y1: 0.6 },
};

function sample({ x0, x1, y0, y1 }) {
  const counts = new Map();
  let total = 0;
  for (let y = Math.floor(y0 * height); y < Math.floor(y1 * height); y++) {
    for (let x = Math.floor(x0 * width); x < Math.floor(x1 * width); x++) {
      const i = (y * width + x) * channels;
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
      // Skip background and anti-aliased edges: keep pixels far from white.
      const distanceFromWhite = Math.hypot(255 - r, 255 - g, 255 - b);
      if (distanceFromWhite < 150) continue;
      const key = hex(r, g, b);
      counts.set(key, (counts.get(key) ?? 0) + 1);
      total++;
    }
  }
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  return { total, top };
}

console.log(`Logo: ${width} x ${height}px\n`);
for (const [label, region] of Object.entries(regions)) {
  const { total, top } = sample(region);
  console.log(`${label}: ${total} coloured pixels`);
  for (const [colour, n] of top) console.log(`  ${colour}  ${((n / total) * 100).toFixed(1)}%`);
  console.log('');
}
