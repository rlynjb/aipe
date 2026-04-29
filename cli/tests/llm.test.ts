import { describe, expect, it } from 'vitest';
import type { LLMClient } from '../src/lib/llm.ts';
import { generateSpec } from '../src/lib/llm.ts';

describe('generateSpec', () => {
  it('passes template + context + intent to the client and returns its output', async () => {
    let captured: { system: string; user: string } | null = null;
    const fake: LLMClient = {
      async generate(system, user) {
        captured = { system, user };
        return '## Filled spec\n\nbody';
      },
    };

    const out = await generateSpec(
      { type: 'feature', intent: 'add dark mode' },
      '# Feature Spec\n\n[paste your spec ...]',
      { projectContext: 'Next.js app, Tailwind' },
      fake,
    );

    expect(out).toBe('## Filled spec\n\nbody');
    expect(captured).not.toBeNull();
    expect(captured!.user).toContain('add dark mode');
    expect(captured!.user).toContain('# Feature Spec');
    expect(captured!.user).toContain('Next.js app, Tailwind');
    expect(captured!.system).toMatch(/spec assistant/i);
    expect(captured!.system).toMatch(/no \[brackets\]/i);
  });

  it('uses "(no context provided)" when context is empty', async () => {
    let user = '';
    const fake: LLMClient = {
      async generate(_, u) {
        user = u;
        return 'ok';
      },
    };
    await generateSpec({ type: 'feature', intent: 'x' }, 'TEMPLATE', {}, fake);
    expect(user).toContain('(no context provided)');
  });
});
