import { existsSync, readFileSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export function globalConfigDir(): string | null {
  const dir = join(homedir(), '.config', 'aipe');
  if (existsSync(dir) && statSync(dir).isDirectory()) return dir;
  return null;
}

export interface GlobalConfig {
  defaultAgent: 'claude-code' | 'codex' | 'cursor' | 'generic';
  model: string;
}

const DEFAULTS: GlobalConfig = {
  defaultAgent: 'generic',
  model: 'claude-sonnet-4-6',
};

export function loadGlobalConfig(): GlobalConfig {
  const dir = globalConfigDir();
  if (!dir) return { ...DEFAULTS };
  const file = join(dir, 'config.json');
  if (!existsSync(file)) return { ...DEFAULTS };
  try {
    const parsed = JSON.parse(readFileSync(file, 'utf8')) as Partial<GlobalConfig>;
    return { ...DEFAULTS, ...parsed };
  } catch {
    return { ...DEFAULTS };
  }
}
