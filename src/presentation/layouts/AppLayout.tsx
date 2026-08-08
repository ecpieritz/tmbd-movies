import { Link, NavLink, Outlet, type NavLinkRenderProps } from 'react-router';

function getNavigationClassName({ isActive }: NavLinkRenderProps): string {
  const baseClassName = 'rounded-control px-3 py-2 text-sm font-medium transition-colors';

  return isActive
    ? `${baseClassName} bg-brand text-white`
    : `${baseClassName} text-content-muted hover:bg-card hover:text-content`;
}

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-page text-content">
      <header className="border-b border-divider bg-panel">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-xl font-bold text-accent" aria-label="MovieDB home">
            MovieDB
          </Link>

          <nav aria-label="Primary navigation" className="flex items-center gap-2">
            <NavLink to="/" end className={getNavigationClassName}>
              Home
            </NavLink>
            <NavLink to="/favorites" className={getNavigationClassName}>
              Favorites
            </NavLink>
          </nav>
        </div>
      </header>

      <main id="main-content" className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
