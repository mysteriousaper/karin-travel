// Generates tiny blurred placeholders for every photo in /public/images.
// Run once after adding photos: `npm run blur`
import sharp from 'sharp';
import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const dir = path.join(process.cwd(), 'public', 'images');
const out = path.join(process.cwd(), 'src', 'lib', 'blur.json');

const files = (await readdir(dir)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
const map = {};
for (const file of files) {
  const buf = await sharp(path.join(dir, file)).resize(16).blur(1.2).jpeg({ quality: 50 }).toBuffer();
  map[`/images/${file}`] = `data:image/jpeg;base64,${buf.toString('base64')}`;
}
await writeFile(out, JSON.stringify(map, null, 0));
console.log(`Wrote ${files.length} placeholders to src/lib/blur.json`);
