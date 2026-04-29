import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { findAipeDir } from '../src/lib/context.ts';

describe('findAipeDir', () => {
  let tmp: string;

  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), 'aipe-find-'));
  });

  afterEach(() => {
    rmSync(tmp, { recursive: true, force: true });
  });

  it('returns null when no .aipe/ exists in cwd or ancestors', () => {
    expect(findAipeDir(tmp)).toBeNull();
  });

  it('finds .aipe/ in cwd', () => {
    mkdirSync(join(tmp, '.aipe'));
    expect(findAipeDir(tmp)).toBe(join(tmp, '.aipe'));
  });

  it('finds .aipe/ in a parent directory', () => {
    mkdirSync(join(tmp, '.aipe'));
    const child = join(tmp, 'a', 'b', 'c');
    mkdirSync(child, { recursive: true });
    expect(findAipeDir(child)).toBe(join(tmp, '.aipe'));
  });
});
