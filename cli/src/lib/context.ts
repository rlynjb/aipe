import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { ProjectContext } from '../types.ts';

export function findAipeDir(start: string): string | null {
  let current = start;
  while (true) {
    const candidate = join(current, '.aipe');
    if (existsSync(candidate) && statSync(candidate).isDirectory()) {
      return candidate;
    }
    const parent = dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

function readIfExists(file: string): string | undefined {
  return existsSync(file) ? readFileSync(file, 'utf8') : undefined;
}

export function loadProjectContext(aipeDir: string | null, globalDir: string | null): ProjectContext {
  const ctx: ProjectContext = {};
  if (globalDir) {
    ctx.identity = readIfExists(join(globalDir, 'global', 'identity.md'));
    ctx.globalRules = readIfExists(join(globalDir, 'global', 'rules.md'));
    ctx.globalStack = readIfExists(join(globalDir, 'global', 'stack.md'));
    ctx.globalSkills = readIfExists(join(globalDir, 'global', 'skills.md'));
  }
  if (aipeDir) {
    ctx.projectContext = readIfExists(join(aipeDir, 'project', 'context.md'));
    ctx.projectRules = readIfExists(join(aipeDir, 'project', 'rules.md'));
    ctx.projectStack = readIfExists(join(aipeDir, 'project', 'stack.md'));
  }
  return ctx;
}

export function formatContextForPrompt(ctx: ProjectContext): string {
  const blocks: string[] = [];
  const add = (heading: string, body?: string) => {
    if (body && body.trim()) blocks.push(`## ${heading}\n\n${body.trim()}`);
  };
  add('Identity', ctx.identity);
  add('Global rules', ctx.globalRules);
  add('Global stack', ctx.globalStack);
  add('Global skills', ctx.globalSkills);
  add('Project context', ctx.projectContext);
  add('Project rules', ctx.projectRules);
  add('Project stack', ctx.projectStack);
  if (blocks.length === 0) return '(no context provided)';
  return blocks.join('\n\n');
}
