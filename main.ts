import { chmodSync, copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_BYTES = 1_048_576;
const EXPECTED_DIM = 1024;

const rootDir = dirname(fileURLToPath(import.meta.url));
const srcImage = resolve(rootDir, 'entry.png');
const outDir =
  process.env.MAKEFUN_OUTPUT_DIR ?? (existsSync('/output') ? '/output' : join(rootDir, 'out'));
const dstImage = resolve(outDir, 'entry.png');

const raw = readFileSync(srcImage);
const pngMagic = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
if (raw.byteLength === 0 || raw.byteLength > MAX_BYTES || !raw.subarray(0, 8).equals(pngMagic)) {
  throw new Error(`Invalid PNG artifact: size=${raw.byteLength}`);
}
const width = raw.readUInt32BE(16);
const height = raw.readUInt32BE(20);
if (width !== EXPECTED_DIM || height !== EXPECTED_DIM) {
  throw new Error(`Invalid PNG dimensions: ${width}x${height}`);
}

mkdirSync(outDir, { recursive: true, mode: 0o755 });
copyFileSync(srcImage, dstImage);
try {
  chmodSync(dstImage, 0o644);
} catch {
  // Ignore POSIX chmod errors on Windows
}
console.log(`Packaged ${dstImage} (${raw.byteLength} bytes, ${width}x${height})`);
