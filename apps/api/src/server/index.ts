import Fastify from 'fastify';
import cors from '@fastify/cors';
import 'dotenv/config';

import { sessionsRoute } from '../routes/sessions.js';
import { workflowRoute } from '../routes/workflow.js';
import { scenariosRoute } from '../routes/scenarios.js';
import { agentsRoute } from '../routes/agents.js';
import { guidanceRoute } from '../routes/guidance.js';
import { wrapupRoute } from '../routes/wrapup.js';
import { supportRoute } from '../routes/support.js';
import { aiRoute } from '../routes/ai.js';
import { adminRoute } from '../routes/admin.js';

const server = Fastify({ logger: true });

const allowedOrigins = process.env['CORS_ALLOWED_ORIGINS']
  ? process.env['CORS_ALLOWED_ORIGINS'].split(',').map(s => s.trim())
  : ['http://localhost:5173'];

await server.register(cors, {
  origin: allowedOrigins,
  credentials: true,
});

// Health check
server.get('/health', async () => ({ status: 'ok', ts: new Date().toISOString() }));

// Core routes
await server.register(sessionsRoute);
await server.register(workflowRoute);
await server.register(scenariosRoute);
await server.register(agentsRoute);
await server.register(guidanceRoute);
await server.register(wrapupRoute);
await server.register(supportRoute);
await server.register(aiRoute);
await server.register(adminRoute);

const port = parseInt(process.env['PORT'] ?? '3001', 10);

try {
  await server.listen({ port, host: '0.0.0.0' });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
