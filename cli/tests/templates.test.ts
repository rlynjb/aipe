import { describe, expect, it } from 'vitest';
import { listTemplates, loadTemplate } from '../src/lib/templates.ts';

describe('templates', () => {
  it('lists exactly 14 spec types with descriptions', () => {
    const all = listTemplates();
    expect(all).toHaveLength(14);
    for (const t of all) {
      expect(t.description.length).toBeGreaterThan(5);
    }
  });

  it('loadTemplate("feature") returns markdown beginning with "# Feature Spec"', () => {
    const md = loadTemplate('feature');
    expect(md.split('\n')[0]).toBe('# Feature Spec');
  });

  it('loadTemplate("debugging") contains the bug-report scaffold', () => {
    const md = loadTemplate('debugging');
    expect(md).toContain('Steps to reproduce');
  });

  it('loadTemplate throws for unknown type', () => {
    // @ts-expect-error - testing runtime rejection of bad input
    expect(() => loadTemplate('nonexistent')).toThrow(/unknown spec type/i);
  });
});
