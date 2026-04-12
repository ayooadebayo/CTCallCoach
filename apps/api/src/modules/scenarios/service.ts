// Scenario service — loads active demo scenarios from the database.
//
// Scenarios are used in demo_guided and scenario_replay session modes.
// They carry a pre-populated resident profile and account context that the
// session service uses to seed intent signals and vulnerability signals.

import { db } from '../../db/client.js';

export async function listActiveScenarios() {
  return db.scenario.findMany({
    where: { status: 'active' },
    orderBy: [{ difficulty_level: 'asc' }, { created_at: 'asc' }],
    select: {
      id: true,
      title: true,
      description: true,
      scenario_type: true,
      expected_primary_path: true,
      expected_overlay_paths_json: true,
      expected_outcome_code: true,
      expected_escalation_codes_json: true,
      expected_support_codes_json: true,
      difficulty_level: true,
      tags: true,
      status: true,
    },
  });
}

export async function getScenarioById(id: string) {
  return db.scenario.findUniqueOrThrow({ where: { id } });
}
