import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { detectAgent, formatForAgent, saveSpec } from '../src/lib/output.ts';

describe('formatForAgent', () => {
  const body = '# Spec\n\ncontent';

  it('claude-code appends an implement footer', () => {
    const out = formatForAgent(body, 'claude-code', '.aipe/specs/features/x.md');
    expect(out).toContain(body);
    expect(out).toContain('Read .aipe/specs/features/x.md then implement.');
  });

  it('codex appends a codex invocation footer', () => {
    const out = formatForAgent(body, 'codex', '.aipe/specs/features/x.md');
    expect(out).toContain('codex ".aipe/specs/features/x.md"');
  });

  it('cursor prepends a spec marker comment', () => {
    const out = formatForAgent(body, 'cursor', '.aipe/specs/features/x.md');
    expect(out.startsWith('<!-- spec: .aipe/specs/features/x.md -->')).toBe(true);
  });

  it('generic returns the body unchanged', () => {
    expect(formatForAgent(body, 'generic', 'whatever.md')).toBe(body);
  });
});

describe('detectAgent', () => {
  const orig = { ...process.env };
  afterEach(() => {
    process.env = { ...orig };
  });

  it('returns claude-code when CLAUDE_CODE is set', () => {
    process.env.CLAUDE_CODE = '1';
    delete process.env.CODEX_CLI;
    expect(detectAgent(undefined, 'generic')).toBe('claude-code');
  });

  it('returns codex when CODEX_CLI is set', () => {
    delete process.env.CLAUDE_CODE;
    process.env.CODEX_CLI = '1';
    expect(detectAgent(undefined, 'generic')).toBe('codex');
  });

  it('returns the explicit override even if env is set', () => {
    process.env.CLAUDE_CODE = '1';
    expect(detectAgent('cursor', 'generic')).toBe('cursor');
  });

  it('falls back to the default when nothing is set', () => {
    delete process.env.CLAUDE_CODE;
    delete process.env.CODEX_CLI;
    expect(detectAgent(undefined, 'generic')).toBe('generic');
  });
});

describe('saveSpec', () => {
  let tmp: string;

  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), 'aipe-save-'));
  });

  afterEach(() => {
    rmSync(tmp, { recursive: true, force: true });
  });

  it('writes to <root>/<typePlural>/<slug>.md and returns the path', () => {
    const p = saveSpec('hello', { type: 'feature', intent: 'Add Dark Mode', baseDir: tmp });
    expect(p).toBe(join(tmp, 'features', 'add-dark-mode.md'));
    expect(readFileSync(p, 'utf8')).toBe('hello');
  });

  it('appends a timestamp suffix on conflict instead of overwriting', () => {
    mkdirSync(join(tmp, 'features'), { recursive: true });
    writeFileSync(join(tmp, 'features', 'add-dark-mode.md'), 'old');
    const p = saveSpec('new', { type: 'feature', intent: 'add dark mode', baseDir: tmp });
    expect(p).not.toBe(join(tmp, 'features', 'add-dark-mode.md'));
    expect(readFileSync(p, 'utf8')).toBe('new');
    expect(readFileSync(join(tmp, 'features', 'add-dark-mode.md'), 'utf8')).toBe('old');
    expect(existsSync(p)).toBe(true);
  });
});
