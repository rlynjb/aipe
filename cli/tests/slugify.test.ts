import { describe, expect, it } from 'vitest';
import { slugifyIntent } from '../src/lib/slugify.ts';

describe('slugifyIntent', () => {
  it('lowercases and joins with hyphens', () => {
    expect(slugifyIntent('Add Dark Mode Toggle')).toBe('add-dark-mode-toggle');
  });

  it('strips punctuation', () => {
    expect(slugifyIntent("cart total shows wrong amount!")).toBe('cart-total-shows-wrong-amount');
  });

  it('truncates to 60 characters', () => {
    const long = 'a'.repeat(100);
    expect(slugifyIntent(long).length).toBeLessThanOrEqual(60);
  });

  it('falls back to "spec" when input is empty', () => {
    expect(slugifyIntent('')).toBe('spec');
    expect(slugifyIntent('   ')).toBe('spec');
  });
});
