// Seed: agents (demo / synthetic)
// Three agents: a first-line agent, a revenues adviser, and a QA coach.
// Upserts by email — idempotent.

import { db } from '../client.js';

const DEMO_AGENTS = [
  {
    email: 'laura.chen@acmecitycouncil.gov.uk',
    display_name: 'Laura Chen',
    role: 'agent' as const,
    team: 'Team A — Council Tax',
    skill_level: 2,
    tenure_weeks: 18,
    qa_band: 'developing',
    status: 'active' as const,
  },
  {
    email: 'marcus.webb@acmecitycouncil.gov.uk',
    display_name: 'Marcus Webb',
    role: 'revenues_adviser' as const,
    team: 'Team B — Revenues Specialist',
    skill_level: 4,
    tenure_weeks: 104,
    qa_band: 'proficient',
    status: 'active' as const,
  },
  {
    email: 'priya.kapoor@acmecitycouncil.gov.uk',
    display_name: 'Priya Kapoor',
    role: 'qa_coach' as const,
    team: 'QA and Coaching',
    skill_level: 5,
    tenure_weeks: 208,
    qa_band: 'expert',
    status: 'active' as const,
  },
] as const;

export async function seedAgents(): Promise<void> {
  for (const agent of DEMO_AGENTS) {
    await db.agent.upsert({
      where: { email: agent.email },
      update: {
        display_name: agent.display_name,
        role: agent.role,
        team: agent.team,
        skill_level: agent.skill_level,
        tenure_weeks: agent.tenure_weeks,
        qa_band: agent.qa_band,
        status: agent.status,
      },
      create: { ...agent },
    });
  }

  console.log(`  ✓ ${DEMO_AGENTS.length} demo agents`);
}
