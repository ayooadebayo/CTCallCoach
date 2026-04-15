import { Link } from 'react-router-dom';

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
      <div className="max-w-5xl mx-auto px-4 py-3 sm:px-6 flex flex-wrap items-start gap-3 md:items-center md:min-h-[56px]">
        {/* Branding — links to landing page */}
        <Link to="/" className="flex-shrink-0 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-govuk-yellow rounded-sm">
          <p className="text-white font-bold text-sm leading-tight">🏛 Acme City Council</p>
          <p className="hidden text-blue-200 text-xs mt-0.5 leading-tight sm:block">
            Council Tax Payment Difficulty — Call Coach
          </p>
        </Link>

        {/* Centre: page title */}
        {pageTitle ? (
          <div className="min-w-0 flex-1 md:px-4">
            <p className="text-white font-semibold text-sm truncate">{pageTitle}</p>
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {/* Right slot */}
        {right && (
          <div className="w-full flex items-center justify-start pt-1 md:w-auto md:flex-shrink-0 md:justify-end md:pt-0">
            {right}
          </div>
        )}
      </div>
    </header>
  );
}
