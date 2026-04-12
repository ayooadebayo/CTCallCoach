// Scenario routes
//
// GET /scenarios       — list all active demo scenarios
// GET /scenarios/:id   — get a single scenario by ID (includes full profile and context)
//
// Scenarios power demo_guided and scenario_replay session modes.
// See docs/council_tax_call_coach_technical_prd_v_0.md §17 for scenario library design.

import type { FastifyInstance } from 'fastify';
import { listActiveScenarios, getScenarioById } from '../modules/scenarios/service.js';

export async function scenariosRoute(app: FastifyInstance): Promise<void> {
  // ── GET /scenarios ──────────────────────────────────────────────────────────
  app.get('/scenarios', async (_req, _reply) => {
    const scenarios = await listActiveScenarios();
    return { scenarios };
  });

  // ── GET /scenarios/:id ──────────────────────────────────────────────────────
  app.get<{ Params: { id: string } }>('/scenarios/:id', async (req, _reply) => {
    const scenario = await getScenarioById(req.params.id);
    return { scenario };
  });
}
