import { Link } from 'react-router-dom';
import { Container, Button, Card, Select } from '../components/ui';
import { useGame } from '../context/GameContext';
import type { GameMode } from '../types';

export function SettingsPage() {
  const { settings, setMode, setAIDepth, newGame } = useGame();
  
  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMode(e.target.value as GameMode);
  };
  
  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAIDepth(parseInt(e.target.value, 10));
  };
  
  const handleApplyAndPlay = () => {
    newGame();
  };
  
  return (
    <Container maxWidth="sm" className="py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Configure your game preferences</p>
      </div>
      
      <Card variant="outlined" padding="lg" className="mb-8">
        <div className="space-y-6">
          {/* Game Mode */}
          <div>
            <Select
              id="game-mode"
              label="Game Mode"
              value={settings.mode}
              onChange={handleModeChange}
              fullWidth
            >
              <option value="two-player">Two Players (Pass & Play)</option>
              <option value="vs-computer">VS Computer</option>
            </Select>
          </div>
          
          {/* AI Difficulty - Only shown in vs-computer mode */}
          {settings.mode === 'vs-computer' && (
            <div>
              <Select
                id="ai-difficulty"
                label="AI Difficulty"
                value={settings.aiDepth}
                onChange={handleDifficultyChange}
                fullWidth
              >
                <option value="2">Easy</option>
                <option value="4">Medium</option>
                <option value="6">Hard</option>
              </Select>
              <p className="text-xs text-gray-500 mt-2">
                Higher difficulty means the AI will think more moves ahead.
              </p>
            </div>
          )}
        </div>
      </Card>
      
      {/* Current Settings Summary */}
      <Card variant="default" padding="md" className="mb-8">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
          Current Configuration
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Mode:</span>
            <span className="font-medium">
              {settings.mode === 'two-player' ? 'Two Players' : 'VS Computer'}
            </span>
          </div>
          {settings.mode === 'vs-computer' && (
            <div className="flex justify-between">
              <span className="text-gray-600">AI Difficulty:</span>
              <span className="font-medium">
                {settings.aiDepth <= 2 ? 'Easy' : settings.aiDepth <= 4 ? 'Medium' : 'Hard'}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Player 1:</span>
            <span className="font-medium">{settings.player1Name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Player 2:</span>
            <span className="font-medium">{settings.player2Name}</span>
          </div>
        </div>
      </Card>
      
      {/* Actions */}
      <div className="space-y-3">
        <Link to="/play" className="block">
          <Button variant="primary" fullWidth size="lg" onClick={handleApplyAndPlay}>
            Apply & Start New Game
          </Button>
        </Link>
        <Link to="/" className="block">
          <Button variant="ghost" fullWidth>
            ← Back to Menu
          </Button>
        </Link>
      </div>
    </Container>
  );
}
