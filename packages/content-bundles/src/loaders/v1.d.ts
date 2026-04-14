import { type GuidanceCardContent, type SupportOptionContent, type WordingTemplateContent, type WarningContent } from '@ctcc/shared-schemas';
export interface V1ContentBundle {
    publicPolicyGuidanceCards: GuidanceCardContent[];
    acmeOperationsGuidanceCards: GuidanceCardContent[];
    supportOptions: SupportOptionContent[];
    wordingTemplates: WordingTemplateContent[];
    warnings: WarningContent[];
}
/**
 * Load and validate the v1 content bundle from JSON files.
 * Results are cached after the first call; pass force=true to reload.
 * Throws if any file fails Zod validation.
 * Public policy and Acme operations cards are kept as separate arrays.
 */
export declare function loadV1ContentBundle(force?: boolean): V1ContentBundle;
//# sourceMappingURL=v1.d.ts.map