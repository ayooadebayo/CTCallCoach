// Support option routes
//
// GET /support/:sessionId/options
//   Evaluates the workflow for the session, resolves triggered support
//   option codes to full content bundle objects, and returns them.
//
// This is read-only — it does not mutate session state.

import type { FastifyInstance } from 'fastify';
import { evaluateWorkflow } from '../modules/workflow/engine.js';
import { loadV1ContentBundle } from '@ctcc/content-bundles';

export async function supportRoute(app: FastifyInstance): Promise<void> {
  app.get<{ Params: { sessionId: string } }>(
    '/support/:sessionId/options',
    async (req, _reply) => {
      const { sessionId } = req.params;

      // Re-evaluate to get current triggered support codes.
      // evaluateWorkflow throws findUniqueOrThrow if session not found.
      const workflow = await evaluateWorkflow(sessionId);

      const bundle = loadV1ContentBundle();

      // Build lookup map: code → full support option object.
      const catalog = new Map(bundle.supportOptions.map((o) => [o.code, o]));

      const support_options = workflow.supportOptions.flatMap((code) => {
        const item = catalog.get(code);
        if (!item) return [];

        // Build response object — only include source_domain when present
        // (satisfies exactOptionalPropertyTypes).
        const entry: {
          code: string;
          label: string;
          category: string;
          resident_explanation: string;
          internal_handling_note: string;
          requires_specialist_follow_up: boolean;
          source_domain?: string;
        } = {
          code: item.code,
          label: item.label,
          category: item.category,
          resident_explanation: item.resident_explanation,
          internal_handling_note: item.internal_handling_note,
          requires_specialist_follow_up: item.requires_specialist_follow_up ?? false,
        };

        if (item.source_domain) {
          entry.source_domain = item.source_domain;
        }

        return [entry];
      });

      return { support_options };
    },
  );
}
