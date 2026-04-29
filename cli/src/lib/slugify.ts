import slugifyLib from 'slugify';

export function slugifyIntent(intent: string): string {
  const slug = slugifyLib(intent, { lower: true, strict: true, trim: true });
  if (!slug) return 'spec';
  return slug.slice(0, 60);
}
