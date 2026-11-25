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
if (raw.byteLength === 0 || raw.byteLength > MAX_BYTES) {
  throw new Error(`Invalid artifact size: ${raw.byteLength}`);
}

mkdirSync(outDir, { recursive: true, mode: 0o755 });
copyFileSync(srcImage, dstImage);
try {
  chmodSync(dstImage, 0o644);
} catch {
  // Ignore chmod on Windows
}
