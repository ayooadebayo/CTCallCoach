// Workflow config v1 loader
// Reads JSON rule files from src/versions/v1/, validates with Zod schemas, and returns typed config.
//
// This path resolution works from both src/loaders/ (source) and dist/loaders/ (compiled),
// because the JSON files always live in src/versions/v1/ relative to the package root.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { z } from 'zod';
import {
  EnquiryTypeConfigSchema,
  QuestionStepConfigSchema,
  ClassificationRuleSchema,
  PathRuleSchema,
  SupportTriggerRuleSchema,
  EscalationTriggerRuleSchema,
  OutcomeRuleSchema,
  type EnquiryTypeConfig,
  type QuestionStepConfig,
  type ClassificationRule,
  type PathRule,
  type SupportTriggerRule,
  type EscalationTriggerRule,
  type OutcomeRule,
} from '@ctcc/shared-schemas';

const _dir = dirname(fileURLToPath(import.meta.url));
// Go up two levels from {src|dist}/loaders/ to reach package root, then into src/versions/v1/
const V1_DIR = join(_dir, '../../src/versions/v1');

function loadAndValidate<S extends z.ZodTypeAny>(filename: string, schema: S): z.output<S> {
  const raw: unknown = JSON.parse(readFileSync(join(V1_DIR, filename), 'utf-8'));
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw new Error(
      `Workflow config validation failed for ${filename}:\n${result.error.toString()}`,
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return result.data as z.output<S>;
}

export interface V1WorkflowConfig {
  enquiryTypes: EnquiryTypeConfig[];
  questionSteps: QuestionStepConfig[];
  classificationRules: ClassificationRule[];
  pathRules: PathRule[];
  supportRules: SupportTriggerRule[];
  escalationRules: EscalationTriggerRule[];
  outcomeRules: OutcomeRule[];
}

let _cache: V1WorkflowConfig | null = null;

/**
 * Load and validate the v1 workflow config from JSON files.
 * Results are cached after the first call; pass force=true to reload.
 * Throws if any file fails Zod validation.
 */
export function loadV1WorkflowConfig(force = false): V1WorkflowConfig {
  if (_cache !== null && !force) return _cache;

  const config: V1WorkflowConfig = {
    enquiryTypes: loadAndValidate('enquiry-types.json', EnquiryTypeConfigSchema.array()),
    questionSteps: loadAndValidate('question-steps.json', QuestionStepConfigSchema.array()),
    classificationRules: loadAndValidate(
      'classification-rules.json',
      ClassificationRuleSchema.array(),
    ),
    pathRules: loadAndValidate('path-rules.json', PathRuleSchema.array()),
    supportRules: loadAndValidate('support-rules.json', SupportTriggerRuleSchema.array()),
    escalationRules: loadAndValidate(
      'escalation-rules.json',
      EscalationTriggerRuleSchema.array(),
    ),
    outcomeRules: loadAndValidate('outcome-rules.json', OutcomeRuleSchema.array()),
  };
  _cache = config;
  return config;
}
