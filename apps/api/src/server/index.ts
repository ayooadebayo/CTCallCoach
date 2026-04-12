import Fastify from 'fastify';
import cors from '@fastify/cors';
import 'dotenv/config';

import { sessionsRoute } from '../routes/sessions.js';
import { workflowRoute } from '../routes/workflow.js';
import { scenariosRoute } from '../routes/scenarios.js';

const server = Fastify({ logger: true });

await server.register(cors, {
  origin: process.env['NODE_ENV'] === 'production' ? false : 'http://localhost:5173',
});

// Health check
server.get('/health', async () => ({ status: 'ok', ts: new Date().toISOString() }));

// Core routes — Step 4: sessions, workflow engine, scenario library
await server.register(sessionsRoute);
await server.register(workflowRoute);
await server.register(scenariosRoute);

const port = parseInt(process.env['PORT'] ?? '3001', 10);

try {
  await server.listen({ port, host: '0.0.0.0' });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
