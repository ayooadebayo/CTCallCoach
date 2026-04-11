// Seed: enquiry_types (PD1-PD8)
// Source: packages/workflow-config/src/versions/v1/enquiry-types.json
// Upserts by code — idempotent.

import { db } from '../client.js';
import { loadV1WorkflowConfig } from '@ctcc/workflow-config';

export async function seedEnquiryTypes(): Promise<void> {
  const { enquiryTypes } = loadV1WorkflowConfig();

  for (const et of enquiryTypes) {
    await db.enquiryType.upsert({
      where: { code: et.code },
      update: {
        label: et.label,
        description: et.description,
        category: et.category,
        is_overlay: et.is_overlay,
        sort_order: et.sort_order ?? null,
        status: 'active',
      },
      create: {
        code: et.code,
        label: et.label,
        description: et.description,
        category: et.category,
        is_overlay: et.is_overlay,
        sort_order: et.sort_order ?? null,
        status: 'active',
        version: 'v1',
      },
    });
  }

  console.log(`  ✓ ${enquiryTypes.length} enquiry types (PD1-PD8)`);
}
