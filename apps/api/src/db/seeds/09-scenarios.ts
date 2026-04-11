// Seed: scenarios (demo / synthetic)
// Three demo scenarios covering PD1, PD4, and PD2+PD6+PD7 paths.
// Uses findFirst + create pattern (title is treated as unique per demo).
//
// Scenario 1: PD1 — early stage, no notice, difficulty_level 1
// Scenario 2: PD4 — summons stage, escalation required, difficulty_level 3
// Scenario 3: PD2 + PD6 + PD7 — reminder + support overlay + vulnerability overlay, difficulty_level 2

import { db } from '../client.js';

export async function seedScenarios(residentIds: string[]): Promise<void> {
  const [taylorId, patelId, williamsId] = residentIds;

  if (taylorId === undefined || patelId === undefined || williamsId === undefined) {
    throw new Error('seedScenarios requires exactly 3 resident IDs from seedResidents()');
  }

  const DEMO_SCENARIOS = [
    {
      title: 'PD1 — Early stage payment difficulty',
      description:
        'Mr Taylor is struggling to keep up with current-year instalments. No formal notice received. ' +
        'Good demo for the PD1 early-stage path, positive early-contact framing, and support signposting check.',
      scenario_type: 'payment_difficulty',
      resident_profile_json: {
        display_label: 'Mr J Taylor (synthetic)',
        caller_role: 'account_holder',
        income_change: true,
        benefits_or_low_income: false,
        vulnerability_detected: false,
      },
      account_context_json: {
        account_reference: 'ACME-2024-001',
        notice_type: 'no_notice',
        year: '2024/25',
        instalments_missed: 1,
        intent: 'struggling_to_pay',
      },
      expected_primary_path: 'PD1' as const,
      expected_overlay_paths_json: [],
      expected_outcome_code: 'info_only' as const,
      expected_support_codes_json: ['SO_PAYMENT_DIFFICULTY_GENERAL'],
      difficulty_level: 1,
      tags: ['pd1', 'early_stage', 'no_notice', 'demo'],
      status: 'active' as const,
    },
    {
      title: 'PD4 — Summons stage with escalation',
      description:
        'Ms Patel has received a court summons. Complex higher-risk case requiring specialist review. ' +
        'Good demo for PD4 safer-handling path, escalation flag, and the breathing space check.',
      scenario_type: 'arrears',
      resident_profile_json: {
        display_label: 'Ms A Patel (synthetic)',
        caller_role: 'account_holder',
        income_change: true,
        benefits_or_low_income: false,
        vulnerability_detected: false,
      },
      account_context_json: {
        account_reference: 'ACME-2024-002',
        notice_type: 'summons_or_court',
        year: '2024/25',
        instalments_missed: 5,
        intent: 'time_to_pay',
      },
      expected_primary_path: 'PD4' as const,
      expected_overlay_paths_json: [],
      expected_outcome_code: 'specialist_review_referred' as const,
      expected_escalation_codes_json: ['ESC_HIGHER_RISK_RECOVERY'],
      expected_support_codes_json: ['SO_SPECIALIST_REVIEW', 'SO_DEBT_ADVICE'],
      difficulty_level: 3,
      tags: ['pd4', 'summons', 'escalation', 'higher_risk', 'demo'],
      status: 'active' as const,
    },
    {
      title: 'PD2 + PD6 + PD7 — Reminder with support and vulnerability overlays',
      description:
        'Mrs Williams has a reminder-stage difficulty, is on a low income (PD6 support overlay), ' +
        'and has a caring responsibility vulnerability (PD7 overlay). ' +
        'Good demo for multi-overlay handling, vulnerability-sensitive call pacing, and CTR signposting.',
      scenario_type: 'support_route',
      resident_profile_json: {
        display_label: 'Mrs S Williams (synthetic)',
        caller_role: 'account_holder',
        income_change: true,
        benefits_or_low_income: true,
        vulnerability_detected: true,
        vulnerability_categories: ['caring_responsibility'],
      },
      account_context_json: {
        account_reference: 'ACME-2024-003',
        notice_type: 'reminder',
        year: '2024/25',
        instalments_missed: 2,
        intent: 'check_available_help',
      },
      expected_primary_path: 'PD2' as const,
      expected_overlay_paths_json: ['PD6', 'PD7'],
      expected_outcome_code: 'support_signposted' as const,
      expected_support_codes_json: ['SO_CTR_SIGNPOST', 'SO_COMMUNICATION_SUPPORT'],
      difficulty_level: 2,
      tags: ['pd2', 'pd6', 'pd7', 'vulnerability', 'ctr', 'support_overlay', 'demo'],
      status: 'active' as const,
    },
  ];

  let created = 0;
  for (const scenario of DEMO_SCENARIOS) {
    const existing = await db.scenario.findFirst({
      where: { title: scenario.title },
      select: { id: true },
    });

    if (!existing) {
      await db.scenario.create({ data: scenario });
      created++;
    }
  }

  console.log(
    `  ✓ ${DEMO_SCENARIOS.length} demo scenarios (${created} created, ${DEMO_SCENARIOS.length - created} already existed)`,
  );
}
