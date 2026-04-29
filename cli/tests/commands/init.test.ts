import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runInit } from '../../src/commands/init.ts';

describe('runInit (project)', () => {
  let tmp: string;
  let cwdBackup: string;

  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), 'aipe-init-'));
    cwdBackup = process.cwd();
    process.chdir(tmp);
  });

  afterEach(() => {
    process.chdir(cwdBackup);
    rmSync(tmp, { recursive: true, force: true });
  });

  it('creates the project scaffold under .aipe/', async () => {
    await runInit({ global: false });
    expect(existsSync(join(tmp, '.aipe', 'project', 'context.md'))).toBe(true);
    expect(existsSync(join(tmp, '.aipe', 'project', 'rules.md'))).toBe(true);
    expect(existsSync(join(tmp, '.aipe', 'project', 'stack.md'))).toBe(true);
    expect(existsSync(join(tmp, '.aipe', 'specs'))).toBe(true);
  });

  it('writes a non-empty context.md placeholder', async () => {
    await runInit({ global: false });
    const content = readFileSync(join(tmp, '.aipe', 'project', 'context.md'), 'utf8');
    expect(content).toContain('Project context');
  });

  it('does not overwrite an existing context.md', async () => {
    await runInit({ global: false });
    const path = join(tmp, '.aipe', 'project', 'context.md');
    const stamp = '## CUSTOM CONTENT — DO NOT OVERWRITE';
    const existing = readFileSync(path, 'utf8');
    const { writeFileSync } = await import('node:fs');
    writeFileSync(path, existing + '\n' + stamp);
    await runInit({ global: false });
    expect(readFileSync(path, 'utf8')).toContain(stamp);
  });
});
