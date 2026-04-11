// Session routes
// POST   /sessions          — create session
// GET    /sessions/:id      — get session by ID
// PATCH  /sessions/:id      — update session stage
// POST   /sessions/:id/close — close session
//
// See docs/council_tax_call_coach_technical_prd_v_0.md §15 for API design expectations.
// See docs/council_tax_call_coach_domain_model_and_data_schema_v_0.md §5.4 for CallSession schema.

import type { FastifyInstance } from 'fastify';

export async function sessionsRoute(app: FastifyInstance) {
  app.get('/sessions/:id', async (req, reply) => {
    reply.code(501).send({ error: 'Not implemented' });
  });

  app.post('/sessions', async (req, reply) => {
    reply.code(501).send({ error: 'Not implemented' });
  });
}
