import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runGenerate } from '../../src/commands/generate.ts';
import type { LLMClient } from '../../src/lib/llm.ts';

describe('runGenerate', () => {
  let tmp: string;
  let cwdBackup: string;

  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), 'aipe-gen-'));
    cwdBackup = process.cwd();
    process.chdir(tmp);
  });

  afterEach(() => {
    process.chdir(cwdBackup);
    rmSync(tmp, { recursive: true, force: true });
  });

  it('saves filled spec to .aipe/specs/<plural>/<slug>.md and prints the path', async () => {
    mkdirSync(join(tmp, '.aipe', 'project'), { recursive: true });
    writeFileSync(join(tmp, '.aipe', 'project', 'context.md'), 'TS + Next.js');
    mkdirSync(join(tmp, '.aipe', 'specs'), { recursive: true });

    const fake: LLMClient = {
      async generate(_s, _u) {
        return '## Filled\n\nbody';
      },
    };
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});

    await runGenerate(
      {
        type: 'feature',
        intent: 'add dark mode toggle',
        agent: 'generic',
      },
      { client: fake },
    );

    const saved = join(tmp, '.aipe', 'specs', 'features', 'add-dark-mode-toggle.md');
    expect(existsSync(saved)).toBe(true);
    expect(readFileSync(saved, 'utf8')).toContain('## Filled');
    expect(log.mock.calls.flat().join('\n')).toContain(saved);
    log.mockRestore();
  });

  it('rejects unknown spec types with a clear error', async () => {
    const fake: LLMClient = { async generate() { return ''; } };
    await expect(
      runGenerate({ type: 'nonsense', intent: 'x', agent: 'generic' }, { client: fake }),
    ).rejects.toThrow(/unknown spec type/i);
  });

  it('rejects unknown agent values before saving any file', async () => {
    let called = false;
    const fake: LLMClient = {
      async generate() {
        called = true;
        return 'should not be reached';
      },
    };
    await expect(
      runGenerate({ type: 'feature', intent: 'x', agent: 'foo' }, { client: fake }),
    ).rejects.toThrow(/unknown agent/i);
    expect(called).toBe(false);
  });

  it('--dry-run skips the LLM and writes the assembled prompt', async () => {
    let called = false;
    const fake: LLMClient = {
      async generate() {
        called = true;
        return 'should not be saved';
      },
    };
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});

    await runGenerate(
      { type: 'feature', intent: 'add dark mode', agent: 'generic', dryRun: true },
      { client: fake },
    );

    expect(called).toBe(false);
    const out = log.mock.calls.flat().join('\n');
    expect(out).toContain('# Feature Spec');
    expect(out).toContain('add dark mode');
    log.mockRestore();
  });

  it('--print writes to stdout and does not save a file', async () => {
    const fake: LLMClient = { async generate() { return '## Filled\n\nbody'; } };
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});

    await runGenerate(
      { type: 'feature', intent: 'add dark mode', agent: 'generic', print: true },
      { client: fake },
    );

    expect(existsSync(join(tmp, '.aipe', 'specs', 'features'))).toBe(false);
    expect(log.mock.calls.flat().join('\n')).toContain('## Filled');
    log.mockRestore();
  });
});
