import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(fileURLToPath(import.meta.url));
const srcImage = join(rootDir, 'entry.png');
const outDir =
  process.env.MAKEFUN_OUTPUT_DIR ?? (existsSync('/output') ? '/output' : join(rootDir, 'out'));

mkdirSync(outDir, { recursive: true });
copyFileSync(srcImage, join(outDir, 'entry.png'));
