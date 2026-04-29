export const SPEC_TYPES = [
  'plan',
  'feature',
  'debugging',
  'curriculum',
  'interview',
  'audit',
  'testing',
  'user-stories',
  'refactor',
  'migration',
  'performance',
  'prompt-engineering',
  'onboarding',
  'integration',
] as const;

export type SpecType = (typeof SPEC_TYPES)[number];

export type AgentTarget = 'claude-code' | 'codex' | 'cursor' | 'generic';

export interface SpecRequest {
  type: SpecType;
  intent: string;
  contextPath?: string;
  outputDir?: string;
  agent?: AgentTarget;
  dryRun?: boolean;
  print?: boolean;
}

export interface SpecResult {
  type: SpecType;
  intent: string;
  content: string;
  savedTo?: string;
}

export interface ProjectContext {
  identity?: string;
  globalRules?: string;
  globalStack?: string;
  globalSkills?: string;
  projectContext?: string;
  projectRules?: string;
  projectStack?: string;
}

export interface TemplateInfo {
  type: SpecType;
  description: string;
}
