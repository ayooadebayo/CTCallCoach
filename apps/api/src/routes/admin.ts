// Admin/config routes — read-only transparency view
//
// GET /admin/versions  — active WorkflowVersion, ContentVersion, PromptVersion from DB
// GET /admin/catalog   — enquiry types (DB), support options (content bundle),
//                        escalation rules (workflow config), scenario count

import type { FastifyInstance } from 'fastify';
import { db } from '../db/client.js';
import { loadV1ContentBundle } from '@ctcc/content-bundles';
import { loadV1WorkflowConfig } from '@ctcc/workflow-config';

export async function adminRoute(app: FastifyInstance) {
  // ── GET /admin/versions ─────────────────────────────────────────────────────
  app.get('/admin/versions', async (_req, _reply) => {
    const [workflowVersions, contentVersions, promptVersions] = await Promise.all([
      db.workflowVersion.findMany({
        where: { status: 'active' },
        orderBy: { created_at: 'desc' },
        take: 5,
        select: { id: true, version_label: true, status: true, description: true, created_at: true },
      }),
      db.contentVersion.findMany({
        where: { status: 'active' },
        orderBy: { created_at: 'desc' },
        take: 5,
        select: { id: true, version_label: true, status: true, description: true, created_at: true },
      }),
      db.promptVersion.findMany({
        where: { status: 'active' },
        orderBy: { created_at: 'desc' },
        take: 5,
        select: { id: true, version_label: true, status: true, description: true, created_at: true },
      }),
    ]);

    return {
      workflow_versions: workflowVersions,
      content_versions: contentVersions,
      prompt_versions: promptVersions,
    };
  });

  // ── GET /admin/catalog ──────────────────────────────────────────────────────
  app.get('/admin/catalog', async (_req, _reply) => {
    const [enquiryTypes, scenarioCount, bundle, config] = await Promise.all([
      db.enquiryType.findMany({
        orderBy: { code: 'asc' },
        select: {
          id: true,
          code: true,
          label: true,
          description: true,
          category: true,
          is_overlay: true,
        },
      }),
      db.scenario.count({ where: { status: 'active' } }),
      Promise.resolve(loadV1ContentBundle()),
      Promise.resolve(loadV1WorkflowConfig()),
    ]);

    const support_options = bundle.supportOptions.map((o) => ({
      code: o.code,
      label: o.label,
      category: o.category,
      source_domain: o.source_domain ?? null,
      requires_specialist_follow_up: o.requires_specialist_follow_up ?? false,
    }));

    const escalation_rules = config.escalationRules.map((r) => ({
      rule_code: r.rule_code,
      escalation_code: r.escalation_code,
      category: r.category,
      severity: r.severity,
      description: r.description,
      trigger_condition_keys: Object.keys(r.trigger_conditions),
    }));

    return {
      enquiry_types: enquiryTypes,
      support_options,
      escalation_rules,
      scenario_count: scenarioCount,
      question_count: config.questionSteps.length,
    };
  });
}
