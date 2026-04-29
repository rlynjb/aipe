import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { findAipeDir, formatContextForPrompt, loadProjectContext } from '../lib/context.ts';
import { globalConfigDir, loadGlobalConfig } from '../lib/config.ts';
import { generateSpec, defaultAnthropicClient, type LLMClient } from '../lib/llm.ts';
import { detectAgent, formatForAgent, saveSpec } from '../lib/output.ts';
import { loadTemplate } from '../lib/templates.ts';
import { SPEC_TYPES, type AgentTarget, type SpecType } from '../types.ts';

export interface RunGenerateInput {
  type: string;
  intent: string;
  contextPath?: string;
  outputDir?: string;
  agent?: AgentTarget;
  dryRun?: boolean;
  print?: boolean;
}

export interface RunGenerateDeps {
  client?: LLMClient;
}

function assertSpecType(t: string): SpecType {
  if (!(SPEC_TYPES as readonly string[]).includes(t)) {
    throw new Error(`Unknown spec type: ${t}. Run 'aipe list' to see all types.`);
  }
  return t as SpecType;
}

export async function runGenerate(
  input: RunGenerateInput,
  deps: RunGenerateDeps = {},
): Promise<void> {
  const type = assertSpecType(input.type);
  const cfg = loadGlobalConfig();
  const agent = detectAgent(input.agent, cfg.defaultAgent);

  const aipeDir = findAipeDir(process.cwd());
  if (!aipeDir) {
    console.warn(
      `! No .aipe/ directory found. Generating with empty project context. Run 'aipe init' to add one.`,
    );
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
  if (agent === 'claude-code') console.log(`  Tell Claude Code: "Read ${savedPath} then implement."`);
  if (agent === 'codex') console.log(`  Run: codex "${savedPath}"`);
}
