import { SEVERITY_COLORS } from '../lib/labels';

interface Warning {
  code: string;
  severity: string;
  message: string;
}

interface EscalationFlag {
  code: string;
  category: string;
  severity: string;
  reason: string;
}

interface WarningBannerProps {
  warnings?: Warning[];
  escalationFlags?: EscalationFlag[];
}

export function WarningBanner({ warnings = [], escalationFlags = [] }: WarningBannerProps) {
  if (warnings.length === 0 && escalationFlags.length === 0) return null;

  return (
    <div className="space-y-2">
      {warnings.map((w) => (
        <div
          key={w.code}
          className={`rounded-md border px-4 py-3 text-sm ${SEVERITY_COLORS[w.severity] ?? 'bg-gray-50 border-gray-300 text-gray-800'}`}
        >
          <span className="font-semibold uppercase tracking-wide text-xs mr-2">
            {w.severity === 'high_risk' ? 'High Risk' : w.severity}
          </span>
          {w.message}
        </div>
      ))}
      {escalationFlags.map((f) => (
        <div
          key={f.code}
          className={`rounded-md border px-4 py-3 text-sm ${SEVERITY_COLORS[f.severity] ?? 'bg-orange-50 border-orange-400 text-orange-900'}`}
        >
          <span className="font-semibold uppercase tracking-wide text-xs mr-2">
            Escalation — {f.severity}
          </span>
          {f.reason}
        </div>
      ))}
    </div>
  );
}
