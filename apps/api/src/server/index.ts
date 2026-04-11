import Fastify from 'fastify';
import cors from '@fastify/cors';
import 'dotenv/config';

// Routes — registered as they are implemented
// import sessionsRoute from '../routes/sessions.js';
// import workflowRoute from '../routes/workflow.js';
// import guidanceRoute from '../routes/guidance.js';
// import supportRoute from '../routes/support.js';
// import escalationsRoute from '../routes/escalations.js';
// import wrapupRoute from '../routes/wrapup.js';
// import qaRoute from '../routes/qa.js';
// import analyticsRoute from '../routes/analytics.js';
// import adminRoute from '../routes/admin.js';
// import scenariosRoute from '../routes/scenarios.js';

const server = Fastify({ logger: true });

await server.register(cors, {
  origin: process.env['NODE_ENV'] === 'production' ? false : 'http://localhost:5173',
});

server.get('/health', async () => ({ status: 'ok', ts: new Date().toISOString() }));

const port = parseInt(process.env['PORT'] ?? '3001', 10);

try {
  await server.listen({ port, host: '0.0.0.0' });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
