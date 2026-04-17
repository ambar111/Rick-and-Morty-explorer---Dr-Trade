import { Link, useLocation } from 'react-router';
import { Home, Heart, BarChart3 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#0d1b2a] flex flex-col">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#97ce4c] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00b5cc] rounded-full blur-3xl" />
      </div>

      <header className="bg-[#1b263b]/90 backdrop-blur-xl border-b border-[#97ce4c]/20 sticky top-0 z-50 shadow-lg shadow-[#97ce4c]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" onClick={scrollToTop} className="flex items-center gap-3 group">
              <div className="w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-110">
                <svg viewBox="0 0 50 50" className="w-full h-full" fill="white">
                  <circle cx="25" cy="25" r="24" fill="none" stroke="white" strokeWidth="2"/>
                  <circle cx="25" cy="25" r="18" fill="white"/>
                  <circle cx="25" cy="25" r="12" fill="#0d1b2a"/>
                  <path d="M25,7 L25,43" stroke="white" strokeWidth="2"/>
                  <path d="M7,25 L43,25" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white hidden sm:block">
                  Rick & Morty
                </h1>
                <p className="text-xs text-[#00b5cc] hidden sm:block">Character Database</p>
              </div>
            </Link>

            <nav className="flex gap-2">
              <Link
                to="/"
                onClick={scrollToTop}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isActive('/')
                    ? 'bg-[#97ce4c] text-[#0d1b2a] shadow-lg shadow-[#97ce4c]/30'
                    : 'text-[#e0fbfc] hover:bg-[#1b263b] hover:text-[#97ce4c]'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <Link
                to="/favorites"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isActive('/favorites')
                    ? 'bg-[#00b5cc] text-[#0d1b2a] shadow-lg shadow-[#00b5cc]/30'
                    : 'text-[#e0fbfc] hover:bg-[#1b263b] hover:text-[#00b5cc]'
                }`}
              >
                <Heart className="w-5 h-5" />
                <span className="hidden sm:inline">Favorites</span>
              </Link>
              <Link
                to="/stats"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isActive('/stats')
                    ? 'bg-[#f77f00] text-[#0d1b2a] shadow-lg shadow-[#f77f00]/30'
                    : 'text-[#e0fbfc] hover:bg-[#1b263b] hover:text-[#f77f00]'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="hidden sm:inline">Stats</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 flex-grow w-full">
        {children}
      </main>

      <footer className="bg-[#1b263b]/60 backdrop-blur-lg border-t border-[#97ce4c]/20 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-[#98c1d9] text-sm">
            Ambar Tiburcio | Prueba Tecnica Dr Trade | Rick and Morty API
          </p>
        </div>
      </footer>
    </div>
  );
};