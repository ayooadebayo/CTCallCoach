import { PATH_LABELS } from '../lib/labels';

interface PathBadgeProps {
  code: string;
  variant?: 'primary' | 'overlay';
}

export function PathBadge({ code, variant = 'primary' }: PathBadgeProps) {
  const label = PATH_LABELS[code] ?? code;
  const classes =
    variant === 'primary'
      ? 'bg-govuk-blue text-white'
      : 'bg-govuk-orange text-white';

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${classes}`}
    >
      {variant === 'overlay' && <span className="mr-1">+</span>}
      {code} — {label}
    </span>
  );
}
