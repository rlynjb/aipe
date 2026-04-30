import { existsSync, readFileSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
export function globalConfigDir() {
    const dir = join(homedir(), '.config', 'aipe');
    if (existsSync(dir) && statSync(dir).isDirectory())
        return dir;
    return null;
}
const DEFAULTS = {
    defaultAgent: 'generic',
    model: 'claude-sonnet-4-6',
};
export function loadGlobalConfig() {
    const dir = globalConfigDir();
    if (!dir)
        return { ...DEFAULTS };
    const file = join(dir, 'config.json');
    if (!existsSync(file))
        return { ...DEFAULTS };
    try {
        const parsed = JSON.parse(readFileSync(file, 'utf8'));
        return { ...DEFAULTS, ...parsed };
    }
    catch {
        return { ...DEFAULTS };
    }
}
//# sourceMappingURL=config.js.map