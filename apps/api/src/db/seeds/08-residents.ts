// Seed: residents (synthetic demo profiles)
// Three synthetic residents corresponding to the three demo scenarios.
// Uses findFirst + create pattern (no natural unique key on resident).

import { db } from '../client.js';

const DEMO_RESIDENTS = [
  {
    display_label: 'Mr J Taylor (synthetic)',
    caller_role: 'account_holder' as const,
    authentication_status: 'authenticated' as const,
    data_origin: 'synthetic' as const,
    account_reference: 'ACME-2024-001',
    liable_party_name: 'James Taylor',
    address_line_1: '14 Acme Street',
    postcode: 'AC1 1AA',
    known_support_flags: [] as string[],
  },
  {
    display_label: 'Ms A Patel (synthetic)',
    caller_role: 'account_holder' as const,
    authentication_status: 'authenticated' as const,
    data_origin: 'synthetic' as const,
    account_reference: 'ACME-2024-002',
    liable_party_name: 'Aisha Patel',
    address_line_1: '7 Council Way',
    postcode: 'AC2 2BB',
    known_support_flags: [] as string[],
  },
  {
    display_label: 'Mrs S Williams (synthetic)',
    caller_role: 'account_holder' as const,
    authentication_status: 'partial' as const,
    data_origin: 'synthetic' as const,
    account_reference: 'ACME-2024-003',
    liable_party_name: 'Susan Williams',
    address_line_1: '3 Elm Close',
    postcode: 'AC3 3CC',
    communication_needs: 'May need extra time. Carer may be present on call.',
    known_support_flags: ['caring_responsibility'],
  },
];

export interface SeededResidents {
  ids: string[];
}

export async function seedResidents(): Promise<SeededResidents> {
  const ids: string[] = [];

  for (const resident of DEMO_RESIDENTS) {
    const existing = await db.resident.findFirst({
      where: { display_label: resident.display_label },
      select: { id: true },
    });

    if (existing) {
      ids.push(existing.id);
    } else {
      const created = await db.resident.create({ data: resident });
      ids.push(created.id);
    }
  }

  console.log(`  ✓ ${DEMO_RESIDENTS.length} synthetic residents`);
  return { ids };
}
