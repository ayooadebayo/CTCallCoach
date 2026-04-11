// Support option routes
// GET /support/:sessionId/options — get surfaced support options for session

import type { FastifyInstance } from 'fastify';

export async function supportRoute(app: FastifyInstance) {
  app.get('/support/:sessionId/options', async (_req, reply) => {
    reply.code(501).send({ error: 'Not implemented' });
  });
}
