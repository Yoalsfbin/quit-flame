import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col">
      <header className="px-4 sm:px-6 py-3 border-b border-border flex items-center gap-4 sticky top-0 bg-bg/95 backdrop-blur z-10">
        {!isHome && (
          <button
            onClick={() => navigate(-1)}
            className="text-text-muted hover:text-text transition min-w-[44px] min-h-[44px] flex items-center"
          >
            ←
          </button>
        )}
        <h1
          className="text-lg font-medium tracking-tight cursor-pointer"
          onClick={() => navigate('/')}
        >
          <span className="text-primary">Quit</span>Flame
        </h1>
      </header>
      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8 max-w-lg mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
