import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { findAipeDir, loadProjectContext, formatContextForPrompt } from '../src/lib/context.ts';

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

describe('loadProjectContext', () => {
  let tmp: string;

  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), 'aipe-ctx-'));
  });

  afterEach(() => {
    rmSync(tmp, { recursive: true, force: true });
  });

  it('returns empty context when neither dir provided', () => {
    expect(loadProjectContext(null, null)).toEqual({});
  });

  it('reads project files when present', () => {
    const aipe = join(tmp, '.aipe');
    mkdirSync(join(aipe, 'project'), { recursive: true });
    writeFileSync(join(aipe, 'project', 'context.md'), 'hello project');
    const ctx = loadProjectContext(aipe, null);
    expect(ctx.projectContext).toBe('hello project');
    expect(ctx.projectRules).toBeUndefined();
  });

  it('reads global files when present', () => {
    const root = join(tmp, '.config', 'aipe');
    mkdirSync(join(root, 'global'), { recursive: true });
    writeFileSync(join(root, 'global', 'identity.md'), 'i am rein');
    const ctx = loadProjectContext(null, root);
    expect(ctx.identity).toBe('i am rein');
  });
});

describe('formatContextForPrompt', () => {
  it('returns sentinel when context is empty', () => {
    expect(formatContextForPrompt({})).toBe('(no context provided)');
  });

  it('joins non-empty sections under H2 headings', () => {
    const out = formatContextForPrompt({ identity: 'me', projectContext: 'app' });
    expect(out).toContain('## Identity');
    expect(out).toContain('me');
    expect(out).toContain('## Project context');
    expect(out).toContain('app');
  });

  it('skips whitespace-only sections', () => {
    const out = formatContextForPrompt({ identity: '   \n', projectContext: 'real' });
    expect(out).not.toContain('## Identity');
    expect(out).toContain('## Project context');
  });
});
