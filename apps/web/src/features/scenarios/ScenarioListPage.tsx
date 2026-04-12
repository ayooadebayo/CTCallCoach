import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listScenarios, listAgents, createSession } from '../../lib/api';
import type { ScenarioSummary, AgentSummary } from '../../lib/api';
import { PATH_LABELS } from '../../lib/labels';

const AGENT_STORAGE_KEY = 'ctcc_selected_agent_id';

const DIFFICULTY_LABEL: Record<number, string> = {
  1: 'Introductory',
  2: 'Standard',
  3: 'Advanced',
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
        // Default to first agent if nothing stored.
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
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading scenarios…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">CTCallCoach</h1>
          <p className="text-xs text-gray-500 mt-0.5">Council Tax Payment Difficulty — Demo</p>
        </div>

        {/* Agent selector */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 font-medium">Agent:</label>
          <select
            value={selectedAgentId}
            onChange={(e) => handleAgentChange(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.display_name} ({a.team})
              </option>
            ))}
          </select>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 rounded-md bg-red-50 border border-red-300 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <h2 className="text-lg font-semibold text-gray-800 mb-4">Select a scenario to begin</h2>

        <div className="space-y-3">
          {scenarios.map((s) => (
            <div
              key={s.id}
              className="rounded-lg bg-white border border-gray-200 p-5 shadow-sm flex items-start justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{s.title}</h3>
                  {s.difficulty_level != null && (
                    <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
                      {DIFFICULTY_LABEL[s.difficulty_level] ?? `Level ${s.difficulty_level}`}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{s.description}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-500">Expected path:</span>
                  <span className="text-xs font-medium text-blue-700">
                    {s.expected_primary_path} — {PATH_LABELS[s.expected_primary_path] ?? s.expected_primary_path}
                  </span>
                  {(s.tags ?? []).map((t) => (
                    <span
                      key={t}
                      className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleStart(s.id)}
                disabled={!selectedAgentId || starting === s.id}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap flex-shrink-0"
              >
                {starting === s.id ? 'Starting…' : 'Start Call →'}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
