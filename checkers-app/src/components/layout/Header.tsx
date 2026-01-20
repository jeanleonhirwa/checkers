import { Link, useLocation } from 'react-router-dom';
import { Container } from '../ui';

export function Header() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="bg-black text-white">
      <Container maxWidth="xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity"
          >
            CHECKERS
          </Link>
          
          {/* Navigation */}
          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className={`
                px-4 py-2 text-sm font-medium transition-colors
                ${isActive('/') 
                  ? 'bg-white text-black' 
                  : 'text-white hover:bg-gray-800'
                }
              `}
            >
              Home
            </Link>
            <Link
              to="/play"
              className={`
                px-4 py-2 text-sm font-medium transition-colors
                ${isActive('/play') 
                  ? 'bg-white text-black' 
                  : 'text-white hover:bg-gray-800'
                }
              `}
            >
              Play
            </Link>
            <Link
              to="/rules"
              className={`
                px-4 py-2 text-sm font-medium transition-colors
                ${isActive('/rules') 
                  ? 'bg-white text-black' 
                  : 'text-white hover:bg-gray-800'
                }
              `}
            >
              Rules
            </Link>
            <Link
              to="/settings"
              className={`
                px-4 py-2 text-sm font-medium transition-colors
                ${isActive('/settings') 
                  ? 'bg-white text-black' 
                  : 'text-white hover:bg-gray-800'
                }
              `}
            >
              Settings
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
}
