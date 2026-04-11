// Content bundle loader
// Loads and validates versioned content for guidance cards, support options, and wording.

import type {
  GuidanceCardContent,
  SupportOptionContent,
  WordingTemplateContent,
} from '@ctcc/shared-schemas';

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

export interface WarningContent {
  code: string;
  severity: 'informational' | 'caution' | 'high_risk';
  message: string;
  applicable_contexts: string[];
}

export async function loadContentBundle(version: string): Promise<ContentBundle> {
  const [publicPolicyCards, acmeOperationsCards, supportOptions, wordingTemplates, warnings] =
    await Promise.all([
      import(`./versions/${version}/public-policy/guidance-cards.json`, {
        assert: { type: 'json' },
      }),
      import(`./versions/${version}/acme-operations/guidance-cards.json`, {
        assert: { type: 'json' },
      }),
      import(`./versions/${version}/support-options/catalog.json`, { assert: { type: 'json' } }),
      import(`./versions/${version}/wording/templates.json`, { assert: { type: 'json' } }),
      import(`./versions/${version}/warnings/catalog.json`, { assert: { type: 'json' } }),
    ]);

  return {
    version,
    guidance_cards: {
      public_policy: publicPolicyCards.default as GuidanceCardContent[],
      acme_operations: acmeOperationsCards.default as GuidanceCardContent[],
    },
    support_options: supportOptions.default as SupportOptionContent[],
    wording_templates: wordingTemplates.default as WordingTemplateContent[],
    warnings: warnings.default as WarningContent[],
  };
}
