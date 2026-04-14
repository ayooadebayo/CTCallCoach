// Content bundle general loader
// Provides a version-agnostic loadContentBundle(version) API.
// Validation is delegated to the version-specific loader which uses fs + Zod.
//
// IMPORTANT: Public policy cards and Acme operations cards are always stored and
// returned separately. Never merge them into a single undifferentiated array.
import { loadV1ContentBundle } from './loaders/v1.js';
function toBundle(version, b) {
    return {
        version,
        guidance_cards: {
            public_policy: b.publicPolicyGuidanceCards,
            acme_operations: b.acmeOperationsGuidanceCards,
        },
        support_options: b.supportOptions,
        wording_templates: b.wordingTemplates,
        warnings: b.warnings,
    };
}
/**
 * Load a named version of the content bundle.
 * Results are cached after first load. Pass force=true to invalidate.
 * Throws if the version is unknown or any file fails validation.
 */
export function loadContentBundle(version, force = false) {
    switch (version) {
        case 'v1':
            return toBundle('v1', loadV1ContentBundle(force));
        default:
            throw new Error(`Unknown content bundle version: "${version}". Supported: v1`);
    }
}
//# sourceMappingURL=loader.js.map