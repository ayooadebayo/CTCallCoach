// Escalation routes
// GET  /escalations/:sessionId/flags  — get active escalation flags
// POST /escalations/:sessionId/confirm — confirm escalation
// POST /escalations/:sessionId/dismiss — dismiss escalation with reason

import type { FastifyInstance } from 'fastify';

export async function escalationsRoute(app: FastifyInstance) {
  app.get('/escalations/:sessionId/flags', async (_req, reply) => {
    reply.code(501).send({ error: 'Not implemented' });
  });
}
