// Guidance route
//
// GET /guidance?path=PD1&path=PD6 — returns guidance cards filtered by active paths,
// separated by public_policy vs acme_operations.
//
// Path codes are passed as one or more `path` query params.
// Returns only cards whose applicable_contexts array includes at least one of the
// requested path codes.

import type { FastifyInstance } from 'fastify';
import { loadV1ContentBundle } from '@ctcc/content-bundles';

export async function guidanceRoute(app: FastifyInstance): Promise<void> {
  app.get<{
    Querystring: { path?: string | string[] };
  }>('/guidance', async (req, reply) => {
    const rawPath = req.query.path;
    if (!rawPath) {
      return reply.code(400).send({ error: '"path" query param is required' });
    }

    const paths: string[] = Array.isArray(rawPath) ? rawPath : [rawPath];

    const bundle = loadV1ContentBundle();

    const matchesAnyPath = (contexts: string[] | undefined): boolean =>
      (contexts ?? []).some((ctx) => paths.includes(ctx));

    const publicPolicy = bundle.publicPolicyGuidanceCards
      .filter((c) => matchesAnyPath(c.applicable_contexts))
      .map((c) => ({
        code: c.code,
        title: c.title,
        summary: c.summary,
        source_domain: 'public_policy' as const,
        body_markdown: c.body_markdown,
        do_say_text: c.do_say_text,
        do_not_say_text: c.do_not_say_text,
        warning_text: c.warning_text,
      }));

    const acmeOperations = bundle.acmeOperationsGuidanceCards
      .filter((c) => matchesAnyPath(c.applicable_contexts))
      .map((c) => ({
        code: c.code,
        title: c.title,
        summary: c.summary,
        source_domain: 'acme_operations' as const,
        body_markdown: c.body_markdown,
        do_say_text: c.do_say_text,
        do_not_say_text: c.do_not_say_text,
        warning_text: c.warning_text,
      }));

    return { public_policy: publicPolicy, acme_operations: acmeOperations };
  });
}
