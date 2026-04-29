import type { SpecRequest } from '../types.ts';

type GenerateRequest = Omit<SpecRequest, 'type'> & { type: string };

export async function runGenerate(_request: GenerateRequest): Promise<void> {
  console.log('generate: not yet implemented');
}
