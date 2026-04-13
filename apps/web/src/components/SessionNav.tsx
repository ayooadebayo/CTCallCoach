import { useNavigate } from 'react-router-dom';

interface SessionNavProps {
  sessionId: string;
  current: 'intake' | 'live' | 'support' | 'wrap-up';
}

const PAGES = [
  { key: 'intake' as const, label: '1. Intake', path: 'intake' },
  { key: 'live' as const, label: '2. Guidance', path: 'live' },
  { key: 'support' as const, label: '3. Support Review', path: 'support' },
  { key: 'wrap-up' as const, label: '4. Wrap-Up', path: 'wrap-up' },
];

/**
 * Horizontal session-page navigation strip.
 * Rendered just below the AppHeader on every session page so the agent
 * can jump between pages without using the browser back button.
 */
export function SessionNav({ sessionId, current }: SessionNavProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-govuk-mid-grey shadow-sm">
      <div className="max-w-5xl mx-auto px-6 flex items-center">
        {/* Back to scenarios */}
        <button
          onClick={() => navigate('/')}
          className="py-3 pr-5 text-xs font-semibold text-govuk-blue hover:text-govuk-blue-dark border-r border-govuk-mid-grey mr-5 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-govuk-yellow"
        >
          ← Scenarios
        </button>

        {/* Page tabs */}
        <nav aria-label="Session pages" className="flex items-center">
          {PAGES.map((page) => {
            const isActive = page.key === current;
            return (
              <button
                key={page.key}
                onClick={() => navigate(`/session/${sessionId}/${page.path}`)}
                className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-govuk-yellow ${
                  isActive
                    ? 'border-govuk-blue text-govuk-blue'
                    : 'border-transparent text-gray-500 hover:text-govuk-black hover:border-govuk-mid-grey'
                }`}
              >
                {page.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
