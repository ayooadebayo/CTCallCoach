// Analytics routes
// POST /analytics/events  — log a product event

import type { FastifyInstance } from 'fastify';

export async function analyticsRoute(app: FastifyInstance) {
  app.post('/analytics/events', async (_req, reply) => {
    reply.code(501).send({ error: 'Not implemented' });
  });
}
