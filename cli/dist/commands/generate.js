import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { findAipeDir, formatContextForPrompt, loadProjectContext } from "../lib/context.js";
import { globalConfigDir, loadGlobalConfig } from "../lib/config.js";
import { generateSpec, defaultAnthropicClient } from "../lib/llm.js";
import { detectAgent, formatForAgent, saveSpec, VALID_AGENTS } from "../lib/output.js";
import { loadTemplate } from "../lib/templates.js";
import { SPEC_TYPES } from "../types.js";
function assertSpecType(t) {
    if (!SPEC_TYPES.includes(t)) {
        throw new Error(`Unknown spec type: ${t}. Run 'aipe list' to see all types.`);
    }
    return t;
}
function assertAgent(a) {
    if (a === undefined)
        return undefined;
    if (!VALID_AGENTS.includes(a)) {
        throw new Error(`Unknown agent: ${a}. Valid values: ${VALID_AGENTS.join(', ')}`);
    }
    return a;
}
export async function runGenerate(input, deps = {}) {
    const type = assertSpecType(input.type);
    const cfg = loadGlobalConfig();
    const agent = detectAgent(assertAgent(input.agent), cfg.defaultAgent);
    const aipeDir = findAipeDir(process.cwd());
    if (!aipeDir) {
        const fallback = input.outputDir ?? join(process.cwd(), '.aipe', 'specs');
        console.warn(`! No .aipe/ directory found. Generating with empty project context.`);
        console.warn(`  Output will be written under ${fallback}. Run 'aipe init' to set up project context.`);
    }
    const ctx = loadProjectContext(aipeDir, globalConfigDir());
    if (input.contextPath) {
        if (!existsSync(input.contextPath)) {
            throw new Error(`--context file not found: ${input.contextPath}`);
        }
        ctx.projectContext = readFileSync(input.contextPath, 'utf8');
    }
    const template = loadTemplate(type);
    if (input.dryRun) {
        console.log('--- assembled prompt (dry run) ---\n');
        console.log('# Project context\n');
        console.log(formatContextForPrompt(ctx));
        console.log('\n# Spec template\n');
        console.log(template);
        console.log(`\n# Intent\n\n${input.intent}\n`);
        return;
    }
    const client = deps.client ?? defaultAnthropicClient(cfg.model);
    const filled = await generateSpec({ type, intent: input.intent }, template, ctx, client);
    if (input.print) {
        console.log(filled);
        return;
    }
    const baseDir = input.outputDir ?? join(aipeDir ?? join(process.cwd(), '.aipe'), 'specs');
    const savedPath = saveSpec(filled, { type, intent: input.intent, baseDir });
    const formatted = formatForAgent(filled, agent, savedPath);
    // Re-write with agent-specific footer/header (keeps the file self-contained)
    writeFileSync(savedPath, formatted);
    console.log(`✓ Spec saved to ${savedPath}`);
    if (agent === 'claude-code')
        console.log(`  Tell Claude Code: "Read ${savedPath} then implement."`);
    if (agent === 'codex')
        console.log(`  Run: codex "${savedPath}"`);
}
//# sourceMappingURL=generate.js.map