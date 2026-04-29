import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { packageRoot, templatesDir } from '../src/lib/paths.ts';

describe('paths', () => {
  it('packageRoot points at a directory containing package.json', () => {
    expect(existsSync(join(packageRoot(), 'package.json'))).toBe(true);
  });

  it('templatesDir contains feature.md', () => {
    expect(existsSync(join(templatesDir(), 'feature.md'))).toBe(true);
  });
});
