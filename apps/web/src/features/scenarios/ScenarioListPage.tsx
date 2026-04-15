import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { listScenarios, listAgents, createSession } from '../../lib/api';
import type { ScenarioSummary, AgentSummary } from '../../lib/api';
import { PATH_LABELS } from '../../lib/labels';
import { AppHeader } from '../../components/AppHeader';

const AGENT_STORAGE_KEY = 'ctcc_selected_agent_id';

const DIFFICULTY_LABEL: Record<number, string> = {
  1: 'Introductory',
  2: 'Standard',
  3: 'Advanced',
};

const DIFFICULTY_BADGE: Record<number, string> = {
  1: 'bg-govuk-green text-white',
  2: 'bg-govuk-blue text-white',
  3: 'bg-govuk-orange text-white',
};

export function ScenarioListPage() {
  const navigate = useNavigate();

  const [scenarios, setScenarios] = useState<ScenarioSummary[]>([]);
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(
    () => localStorage.getItem(AGENT_STORAGE_KEY) ?? '',
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([listScenarios(), listAgents()])
      .then(([s, a]) => {
        setScenarios(s);
        setAgents(a);
        if (!localStorage.getItem(AGENT_STORAGE_KEY) && a.length > 0) {
          setSelectedAgentId(a[0]!.id);
          localStorage.setItem(AGENT_STORAGE_KEY, a[0]!.id);
        }
      })
      .catch((e: unknown) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  function handleAgentChange(id: string) {
    setSelectedAgentId(id);
    localStorage.setItem(AGENT_STORAGE_KEY, id);
  }

  async function handleStart(scenarioId: string) {
    if (!selectedAgentId) return;
    setStarting(scenarioId);
    try {
      const result = await createSession({
        agent_id: selectedAgentId,
        scenario_id: scenarioId,
        session_mode: 'demo_guided',
      });
      navigate(`/session/${result.session.id}/intake`);
    } catch (e: unknown) {
      setError(String(e));
      setStarting(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-govuk-light-grey text-gray-500">
        Loading scenarios…
      </div>
    );
  }

  const agentSelector = (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <label className="text-blue-100 text-sm font-medium whitespace-nowrap">Agent:</label>
        <select
          value={selectedAgentId}
          onChange={(e) => handleAgentChange(e.target.value)}
          className="rounded-sm border-0 bg-white px-3 py-1.5 text-sm text-govuk-black focus:outline-none focus:ring-4 focus:ring-govuk-yellow"
        >
          {agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.display_name} ({a.team})
            </option>
          ))}
        </select>
      </div>
      <Link
        to="/admin"
        className="text-sm text-blue-200 hover:text-white font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-govuk-yellow"
      >
        Admin →
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-govuk-light-grey">
      <AppHeader right={agentSelector} />

      <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6">
        {error && (
          <div className="mb-6 rounded-sm border border-govuk-mid-grey border-l-4 border-l-govuk-red bg-red-50 px-4 py-3 text-sm text-govuk-black">
            <p className="font-bold text-govuk-red mb-1">Error</p>
            {error}
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-govuk-black">Select a scenario to begin</h2>
          <p className="text-sm text-gray-600 mt-1">
            Choose a practice scenario below to start a guided call coaching session.
          </p>
        </div>

        <div className="space-y-4">
          {scenarios.map((s) => (
            <div
              key={s.id}
              className="rounded-sm border border-govuk-mid-grey bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 min-w-0">
                  {/* Title + difficulty badge */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="font-bold text-govuk-black text-base">{s.title}</h3>
                    {s.difficulty_level != null && (
                      <span
                        className={`text-xs rounded-full px-2.5 py-0.5 font-bold ${DIFFICULTY_BADGE[s.difficulty_level] ?? 'bg-gray-100 text-gray-700'}`}
                      >
                        {DIFFICULTY_LABEL[s.difficulty_level] ?? `Level ${s.difficulty_level}`}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3">{s.description}</p>

                  {/* Path + tags */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-500 font-medium">Expected path:</span>
                    <span className="text-xs font-bold text-govuk-blue bg-sky-50 border border-sky-300 rounded-full px-2.5 py-0.5">
                      {s.expected_primary_path} —{' '}
                      {PATH_LABELS[s.expected_primary_path] ?? s.expected_primary_path}
                    </span>
                    {(s.tags ?? []).map((t) => (
                      <span
                        key={t}
                        className="text-xs bg-govuk-light-grey text-gray-600 rounded-full px-2 py-0.5 border border-govuk-mid-grey"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => handleStart(s.id)}
                  disabled={!selectedAgentId || starting === s.id}
                  className="w-full rounded-[2px] bg-govuk-green px-5 py-2.5 text-sm font-bold text-white hover:bg-govuk-green-dark disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-govuk-yellow whitespace-nowrap sm:w-auto sm:flex-shrink-0"
                >
                  {starting === s.id ? 'Starting…' : 'Start Call →'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
