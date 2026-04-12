// Agents route
//
// GET /agents — list active agents for demo agent selector
//
// Only active agents are returned. Used by the frontend to populate the
// agent selector on the scenario list page.

import type { FastifyInstance } from 'fastify';
import { db } from '../db/client.js';

export async function agentsRoute(app: FastifyInstance): Promise<void> {
  app.get('/agents', async (_req, _reply) => {
    const agents = await db.agent.findMany({
      where: { status: 'active' },
      select: {
        id: true,
        display_name: true,
        role: true,
        team: true,
        skill_level: true,
      },
      orderBy: [{ skill_level: 'asc' }, { display_name: 'asc' }],
    });
    return agents;
  });
}
