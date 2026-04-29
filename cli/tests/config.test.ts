import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { existsSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { globalConfigDir } from '../src/lib/config.ts';

describe('globalConfigDir', () => {
  let tmp: string;
  let homeBackup: string | undefined;

  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), 'aipe-cfg-'));
    homeBackup = process.env.HOME;
    process.env.HOME = tmp;
  });

  afterEach(() => {
    if (homeBackup === undefined) delete process.env.HOME;
    else process.env.HOME = homeBackup;
    rmSync(tmp, { recursive: true, force: true });
  });

  it('returns ~/.config/aipe when it exists', () => {
    mkdirSync(join(tmp, '.config', 'aipe'), { recursive: true });
    expect(globalConfigDir()).toBe(join(tmp, '.config', 'aipe'));
  });

  it('returns null when ~/.config/aipe does not exist', () => {
    expect(globalConfigDir()).toBeNull();
    expect(existsSync(join(tmp, '.config', 'aipe'))).toBe(false);
  });
});
