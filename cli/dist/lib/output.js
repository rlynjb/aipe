import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { slugifyIntent } from "./slugify.js";
const TYPE_TO_FOLDER = {
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
export const VALID_AGENTS = ['claude-code', 'codex', 'cursor', 'generic'];
export function formatForAgent(spec, agent, savedPath) {
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
export function detectAgent(explicit, fallback) {
    if (explicit)
        return explicit;
    if (process.env.CLAUDE_CODE)
        return 'claude-code';
    if (process.env.CODEX_CLI)
        return 'codex';
    return fallback;
}
export function saveSpec(content, opts) {
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
//# sourceMappingURL=output.js.map