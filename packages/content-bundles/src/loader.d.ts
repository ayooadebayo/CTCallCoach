import type { GuidanceCardContent, SupportOptionContent, WordingTemplateContent, WarningContent } from '@ctcc/shared-schemas';
export interface ContentBundle {
    version: string;
    guidance_cards: {
        public_policy: GuidanceCardContent[];
        acme_operations: GuidanceCardContent[];
    };
    support_options: SupportOptionContent[];
    wording_templates: WordingTemplateContent[];
    warnings: WarningContent[];
}
/**
 * Load a named version of the content bundle.
 * Results are cached after first load. Pass force=true to invalidate.
 * Throws if the version is unknown or any file fails validation.
 */
export declare function loadContentBundle(version: string, force?: boolean): ContentBundle;
//# sourceMappingURL=loader.d.ts.map