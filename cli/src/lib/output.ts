import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { slugifyIntent } from './slugify.ts';
import type { AgentTarget, SpecType } from '../types.ts';

const TYPE_TO_FOLDER: Record<SpecType, string> = {
  plan: 'plans',
  feature: 'features',
  debugging: 'bugs',
  curriculum: 'curriculum',
  interview: 'interview',
  audit: 'audits',
  testing: 'testing',
  'user-stories': 'user-stories',
  refactor: 'refactors',
  migration: 'migrations',
  performance: 'performance',
  'prompt-engineering': 'prompts',
  onboarding: 'onboarding',
  integration: 'integrations',
};

export const VALID_AGENTS: readonly AgentTarget[] = ['claude-code', 'codex', 'cursor', 'generic'];

export function formatForAgent(spec: string, agent: AgentTarget, savedPath: string): string {
  switch (agent) {
    case 'claude-code':
      return `${spec}\n\n---\nTo implement: "Read ${savedPath} then implement."\n`;
    case 'codex':
      return `${spec}\n\n---\nTo implement: codex "${savedPath}"\n`;
    case 'cursor':
      return `<!-- spec: ${savedPath} -->\n${spec}`;
    case 'generic':
      return spec;
    default:
      // Unreachable for valid AgentTarget values; guards against runtime strings that bypass validation.
      return spec;
  }
}

export function detectAgent(explicit: AgentTarget | undefined, fallback: AgentTarget): AgentTarget {
  if (explicit) return explicit;
  if (process.env.CLAUDE_CODE) return 'claude-code';
  if (process.env.CODEX_CLI) return 'codex';
  return fallback;
}

export interface SaveOptions {
  type: SpecType;
  intent: string;
  baseDir: string;
}

export function saveSpec(content: string, opts: SaveOptions): string {
  const folder = join(opts.baseDir, TYPE_TO_FOLDER[opts.type]);
  mkdirSync(folder, { recursive: true });
  const slug = slugifyIntent(opts.intent);
  let target = join(folder, `${slug}.md`);
  if (existsSync(target)) {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    target = join(folder, `${slug}-${stamp}.md`);
  }
  writeFileSync(target, content);
  return target;
}
