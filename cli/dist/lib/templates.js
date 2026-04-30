import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { templatesDir } from "./paths.js";
import { SPEC_TYPES } from "../types.js";
const DESCRIPTIONS = {
    plan: 'Multi-phase project plan you can resume across sessions',
    feature: 'Build something new — data model, behaviour, UI, constraints',
    debugging: 'Bug keeps coming back — instrument, observe, fix from evidence',
    curriculum: 'Turn a codebase into a learning resource',
    interview: 'Prepare to defend a project in an interview',
    audit: 'Review existing code before adding features',
    testing: 'Write or improve tests',
    'user-stories': 'Rewrite tasks in different personas',
    refactor: 'Restructure without changing behaviour',
    migration: 'Change a schema, dependency, or storage layer',
    performance: 'Diagnose speed or bundle size issues',
    'prompt-engineering': 'Fix AI output quality',
    onboarding: 'Generate context docs for a new codebase',
    integration: 'Connect an external service',
};
export function listTemplates() {
    return SPEC_TYPES.map((type) => ({ type, description: DESCRIPTIONS[type] }));
}
export function loadTemplate(type) {
    if (!SPEC_TYPES.includes(type)) {
        throw new Error(`Unknown spec type: ${type}`);
    }
    const file = join(templatesDir(), `${type}.md`);
    return readFileSync(file, 'utf8');
}
//# sourceMappingURL=templates.js.map