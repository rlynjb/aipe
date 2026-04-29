import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

// Dev:  src/lib/paths.ts → packageRoot = ../../ = cli/
// Prod: dist/lib/paths.js → packageRoot = ../../ = cli/
export function packageRoot(): string {
  return resolve(here, '..', '..');
}

export function templatesDir(): string {
  // Prod: dist/templates is created by `npm run build` (copy-templates.js).
  const bundled = join(packageRoot(), 'dist', 'templates');
  if (existsSync(bundled)) return bundled;
  // Dev: read from the monorepo source — `cli/` and `prompting/` are siblings.
  return join(packageRoot(), '..', 'prompting', 'specs');
}
