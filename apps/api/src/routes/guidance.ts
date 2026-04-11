// Guidance routes
// GET /guidance/:sessionId/cards    — get contextual guidance cards
// GET /guidance/:sessionId/wording  — get suggested wording
//
// See docs/council_tax_call_coach_technical_prd_v_0.md §8.4 for guidance service responsibilities.

import type { FastifyInstance } from 'fastify';

export async function guidanceRoute(app: FastifyInstance) {
  app.get('/guidance/:sessionId/cards', async (_req, reply) => {
    reply.code(501).send({ error: 'Not implemented' });
  });
}
