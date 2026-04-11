// Scenario routes
// GET  /scenarios        — list available scenarios
// GET  /scenarios/:id    — get scenario by ID
//
// See docs/council_tax_call_coach_technical_prd_v_0.md §17 for scenario library design.

import type { FastifyInstance } from 'fastify';

export async function scenariosRoute(app: FastifyInstance) {
  app.get('/scenarios', async (_req, reply) => {
    reply.code(501).send({ error: 'Not implemented' });
  });

  app.get('/scenarios/:id', async (_req, reply) => {
    reply.code(501).send({ error: 'Not implemented' });
  });
}
