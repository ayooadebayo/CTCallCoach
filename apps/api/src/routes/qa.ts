// QA routes
// GET  /qa               — get review queue
// GET  /qa/:sessionId    — get review details
// POST /qa/:sessionId    — submit review

import type { FastifyInstance } from 'fastify';

export async function qaRoute(app: FastifyInstance) {
  app.get('/qa', async (_req, reply) => {
    reply.code(501).send({ error: 'Not implemented' });
  });
}
