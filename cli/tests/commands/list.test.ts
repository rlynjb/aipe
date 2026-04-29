import { describe, expect, it, vi } from 'vitest';
import { runList } from '../../src/commands/list.ts';

describe('runList', () => {
  it('prints all 14 spec types and descriptions', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    await runList();
    const output = log.mock.calls.map((c) => c.join(' ')).join('\n');
    expect(output).toContain('feature');
    expect(output).toContain('debugging');
    expect(output).toContain('integration');
    expect(output.match(/^\s{2}\w/gm)?.length ?? 0).toBeGreaterThanOrEqual(14);
    log.mockRestore();
  });
});
