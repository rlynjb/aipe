import { cpSync, existsSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const cliRoot = resolve(here, '..');
const src = resolve(cliRoot, '..', 'prompting', 'specs');
const dst = resolve(cliRoot, 'dist', 'templates');

if (!existsSync(src)) {
  console.error(`copy-templates: source missing: ${src}`);
  process.exit(1);
}
if (existsSync(dst)) rmSync(dst, { recursive: true, force: true });
cpSync(src, dst, { recursive: true });
console.log(`copy-templates: copied ${src} → ${dst}`);
