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

  const baseCard = 'rounded-sm border border-govuk-mid-grey px-4 py-3 text-sm';

  return (
    <div className="space-y-2">
      {warnings.map((w) => (
        <div
          key={w.code}
          className={`${baseCard} ${SEVERITY_COLORS[w.severity] ?? 'border-l-4 border-l-govuk-orange bg-amber-50 text-govuk-black'}`}
        >
          <span className="font-bold uppercase tracking-wide text-xs mr-2">
            {w.severity === 'high_risk' ? 'High Risk' : w.severity}
          </span>
          {w.message}
        </div>
      ))}
      {escalationFlags.map((f) => (
        <div
          key={f.code}
          className={`${baseCard} ${SEVERITY_COLORS[f.severity] ?? 'border-l-4 border-l-govuk-orange bg-amber-50 text-govuk-black'}`}
        >
          <span className="font-bold uppercase tracking-wide text-xs mr-2">
            Escalation — {f.severity}
          </span>
          {f.reason}
        </div>
      ))}
    </div>
  );
}
