import { PATH_LABELS, PATH_COLORS } from '../lib/labels';

interface PathBadgeProps {
  code: string;
  variant?: 'primary' | 'overlay';
}

export function PathBadge({ code, variant = 'primary' }: PathBadgeProps) {
  const label = PATH_LABELS[code] ?? code;
  const color = PATH_COLORS[code] ?? 'bg-gray-100 text-gray-700';
  const ring = variant === 'overlay' ? 'ring-1 ring-inset opacity-80' : '';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color} ${ring}`}
    >
      {variant === 'overlay' && <span className="mr-1 text-xs">+</span>}
      {code} — {label}
    </span>
  );
}
