// Workflow routes
// POST /workflow/classify          — classify enquiry
// POST /workflow/respond           — submit fact / question response
// GET  /workflow/:sessionId/next   — get next step from workflow engine
// POST /workflow/override          — override classification or path
//
// See docs/council_tax_call_coach_workflow_specification_v_0.md for workflow logic.
// See apps/api/src/workflow/ for the engine implementation.

import type { FastifyInstance } from 'fastify';

export async function workflowRoute(app: FastifyInstance) {
  app.post('/workflow/classify', async (_req, reply) => {
    reply.code(501).send({ error: 'Not implemented' });
  });

  app.get('/workflow/:sessionId/next', async (_req, reply) => {
    reply.code(501).send({ error: 'Not implemented' });
  });
}
