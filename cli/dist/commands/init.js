import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const PROJECT_PLACEHOLDERS = {
    'project/context.md': `# Project context

Describe this codebase so an AI agent can implement against it without asking.

## Stack
- runtime, framework, language

## Data model
- entities, relationships, where they live

## File structure
- top-level folders and what lives where

## What must not change
- public API surface, schema fields, ...
`,
    'project/rules.md': `# Project rules

Conventions specific to this repo.

- coding style overrides
- file naming
- testing requirements
`,
    'project/stack.md': `# Project stack

Versions and key libraries.
`,
};
const GLOBAL_PLACEHOLDERS = {
    'global/identity.md': `# Identity

Who you are as a developer (role, focus areas, taste).
`,
    'global/rules.md': `# Global rules

Rules that apply across every project.
`,
    'global/stack.md': `# Global stack

Languages and tools you use across projects.
`,
    'global/skills.md': `# Skills

Capabilities and patterns you reach for by default.
`,
    'config.json': JSON.stringify({ defaultAgent: 'generic', model: 'claude-sonnet-4-6' }, null, 2) + '\n',
};
function writeIfMissing(file, content) {
    if (existsSync(file))
        return false;
    mkdirSync(join(file, '..'), { recursive: true });
    writeFileSync(file, content);
    return true;
}
export async function runInit(opts) {
    if (opts.global) {
        const root = join(homedir(), '.config', 'aipe');
        mkdirSync(root, { recursive: true });
        let created = 0;
        for (const [rel, content] of Object.entries(GLOBAL_PLACEHOLDERS)) {
            if (writeIfMissing(join(root, rel), content))
                created++;
        }
        console.log(`Initialised global config at ${root} (${created} new files).`);
        return;
    }
    const root = join(process.cwd(), '.aipe');
    mkdirSync(join(root, 'specs'), { recursive: true });
    let created = 0;
    for (const [rel, content] of Object.entries(PROJECT_PLACEHOLDERS)) {
        if (writeIfMissing(join(root, rel), content))
            created++;
    }
    console.log(`Initialised .aipe/ in ${process.cwd()} (${created} new files).`);
    console.log(`Edit .aipe/project/context.md, then run: aipe generate <type> "<intent>"`);
}
//# sourceMappingURL=init.js.map