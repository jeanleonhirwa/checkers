import { Link } from 'react-router-dom';
import { Container, Button, Card } from '../components/ui';
import { useGame } from '../context/GameContext';

export function HomePage() {
  const { setMode, newGame } = useGame();
  
  const handleStartGame = (mode: 'two-player' | 'vs-computer') => {
    setMode(mode);
    newGame();
  };
  
  return (
    <Container maxWidth="md" className="py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl sm:text-6xl font-bold text-black mb-4 tracking-tight">
          CHECKERS
        </h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          The classic strategy board game. Challenge a friend or test your skills against the computer.
        </p>
      </div>
      
      {/* Game Mode Selection */}
      <div className="grid sm:grid-cols-2 gap-6 mb-12">
        {/* Two Player Mode */}
        <Card variant="outlined" padding="lg" className="text-center hover:bg-gray-50 transition-colors">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Two Players</h2>
            <p className="text-sm text-gray-500">
              Play against a friend on the same device
            </p>
          </div>
          <Link to="/play" onClick={() => handleStartGame('two-player')}>
            <Button variant="primary" fullWidth>
              Start Game
            </Button>
          </Link>
        </Card>
        
        {/* VS Computer Mode */}
        <Card variant="outlined" padding="lg" className="text-center hover:bg-gray-50 transition-colors">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">VS Computer</h2>
            <p className="text-sm text-gray-500">
              Challenge the AI at various difficulty levels
            </p>
          </div>
          <Link to="/play" onClick={() => handleStartGame('vs-computer')}>
            <Button variant="outline" fullWidth>
              Play AI
            </Button>
          </Link>
        </Card>
      </div>
      
      {/* Quick Links */}
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-4">
          New to Checkers?
        </p>
        <Link to="/rules">
          <Button variant="ghost" size="sm">
            Learn the Rules →
          </Button>
        </Link>
      </div>
    </Container>
  );
}
