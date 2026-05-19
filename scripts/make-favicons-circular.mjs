import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.resolve(__dirname, '..', 'packages', 'frontend', 'src', 'assets');

async function circlePng(filePath) {
  const buffer = await fs.readFile(filePath);
  const png = PNG.sync.read(buffer);
  const { width, height, data } = png;
  const cx = (width - 1) / 2;
  const cy = (height - 1) / 2;
  const r = Math.min(width, height) / 2;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let mask;
      if (dist <= r - 1) mask = 1;
      else if (dist >= r) mask = 0;
      else mask = r - dist;
      const i = (y * width + x) * 4;
      data[i + 3] = Math.round(data[i + 3] * mask);
    }
  }
  const out = PNG.sync.write(png);
  await fs.writeFile(filePath, out);
  return { size: width, data: out };
}

function buildIco(entries) {
  const headerSize = 6 + 16 * entries.length;
  const totalSize = headerSize + entries.reduce((a, e) => a + e.data.length, 0);
  const buf = Buffer.alloc(totalSize);
  buf.writeUInt16LE(0, 0);
  buf.writeUInt16LE(1, 2);
  buf.writeUInt16LE(entries.length, 4);

  let dataOffset = headerSize;
  entries.forEach((entry, i) => {
    const dirOffset = 6 + 16 * i;
    const sz = entry.size >= 256 ? 0 : entry.size;
    buf.writeUInt8(sz, dirOffset + 0);
    buf.writeUInt8(sz, dirOffset + 1);
    buf.writeUInt8(0, dirOffset + 2);
    buf.writeUInt8(0, dirOffset + 3);
    buf.writeUInt16LE(1, dirOffset + 4);
    buf.writeUInt16LE(32, dirOffset + 6);
    buf.writeUInt32LE(entry.data.length, dirOffset + 8);
    buf.writeUInt32LE(dataOffset, dirOffset + 12);
    entry.data.copy(buf, dataOffset);
    dataOffset += entry.data.length;
  });
  return buf;
}

const png16 = await circlePng(path.join(assetsDir, 'favicon-16x16.png'));
const png32 = await circlePng(path.join(assetsDir, 'favicon-32x32.png'));
const ico = buildIco([png16, png32]);
await fs.writeFile(path.join(assetsDir, 'favicon.ico'), ico);

console.log('Favicons circled: favicon-16x16.png, favicon-32x32.png, favicon.ico');
