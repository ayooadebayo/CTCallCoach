// Wrap-up routes
// POST /wrapup/:sessionId/summary   — generate summary draft
// POST /wrapup/:sessionId/note      — save case note
// POST /wrapup/:sessionId/outcome   — save call outcome
// POST /wrapup/:sessionId/coaching  — generate coaching feedback

import type { FastifyInstance } from 'fastify';

export async function wrapupRoute(app: FastifyInstance) {
  app.post('/wrapup/:sessionId/summary', async (_req, reply) => {
    reply.code(501).send({ error: 'Not implemented' });
  });
}
