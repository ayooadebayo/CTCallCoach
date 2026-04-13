interface AppHeaderProps {
  pageTitle?: string;
  right?: React.ReactNode;
}

/**
 * Shared GDS-style header bar used on every page.
 * Branding is always on the left; optional page title in the centre;
 * optional slot on the right (stage progress, agent selector, etc.).
 */
export function AppHeader({ pageTitle, right }: AppHeaderProps) {
  return (
    <header className="bg-govuk-blue">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-4 min-h-[56px]">
        {/* Branding */}
        <div className="flex-shrink-0">
          <p className="text-white font-bold text-sm leading-tight">🏛 Acme City Council</p>
          <p className="text-blue-200 text-xs mt-0.5 leading-tight">
            Council Tax Payment Difficulty — Call Coach
          </p>
        </div>

        {/* Centre: page title */}
        {pageTitle ? (
          <div className="flex-1 px-4 min-w-0">
            <p className="text-white font-semibold text-sm truncate">{pageTitle}</p>
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {/* Right slot */}
        {right && (
          <div className="flex-shrink-0 flex items-center gap-3">{right}</div>
        )}
      </div>
    </header>
  );
}
