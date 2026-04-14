import { type EnquiryTypeConfig, type QuestionStepConfig, type ClassificationRule, type PathRule, type SupportTriggerRule, type EscalationTriggerRule, type OutcomeRule } from '@ctcc/shared-schemas';
export interface V1WorkflowConfig {
    enquiryTypes: EnquiryTypeConfig[];
    questionSteps: QuestionStepConfig[];
    classificationRules: ClassificationRule[];
    pathRules: PathRule[];
    supportRules: SupportTriggerRule[];
    escalationRules: EscalationTriggerRule[];
    outcomeRules: OutcomeRule[];
}
/**
 * Load and validate the v1 workflow config from JSON files.
 * Results are cached after the first call; pass force=true to reload.
 * Throws if any file fails Zod validation.
 */
export declare function loadV1WorkflowConfig(force?: boolean): V1WorkflowConfig;
//# sourceMappingURL=v1.d.ts.map