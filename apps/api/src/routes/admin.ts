// Admin/config routes
// GET /admin/versions           — list active workflow/content/prompt versions
// GET /admin/scenarios          — list all scenarios
// GET /admin/support-options    — list support option catalog
// GET /admin/escalation-catalog — list escalation definitions

import type { FastifyInstance } from 'fastify';

export async function adminRoute(app: FastifyInstance) {
  app.get('/admin/versions', async (_req, reply) => {
    reply.code(501).send({ error: 'Not implemented' });
  });
}
