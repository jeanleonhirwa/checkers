import { Link } from 'react-router-dom';
import { Container, Button, Card } from '../components/ui';
import { Board } from '../components/Board';
import { useGame } from '../context/GameContext';
import { countPieces } from '../engine/board';

export function GamePage() {
  const { gameState, settings, undoMove, redoMove, newGame } = useGame();
  const { turn, isGameOver, winner } = gameState;
  const pieces = countPieces(gameState.board);
  
  const canUndo = gameState.historyIndex > 0;
  const canRedo = gameState.historyIndex < gameState.history.length - 1;
  
  const currentPlayerName = turn === 1 ? settings.player1Name : settings.player2Name;
  const winnerName = winner === 1 ? settings.player1Name : settings.player2Name;
  const isComputerThinking = settings.mode === 'vs-computer' && turn === -1 && !isGameOver;
  
  return (
    <Container maxWidth="lg">
      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Game Board */}
        <div className="flex-shrink-0">
          <Board />
        </div>
        
        {/* Game Info Sidebar */}
        <div className="w-full lg:w-72 space-y-6">
          {/* Turn / Winner Display */}
          <Card variant="outlined" padding="md">
            {isGameOver ? (
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Game Over</p>
                <p className="text-2xl font-bold">{winnerName} Wins!</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Current Turn</p>
                <div className="flex items-center justify-center gap-3">
                  <div 
                    className={`w-6 h-6 rounded-full border-2 border-black ${
                      turn === 1 ? 'bg-black' : 'bg-white'
                    }`}
                  />
                  <span className="text-xl font-semibold">{currentPlayerName}</span>
                </div>
                {isComputerThinking && (
                  <p className="text-sm text-gray-500 mt-2 animate-pulse">Thinking...</p>
                )}
              </div>
            )}
          </Card>
          
          {/* Score */}
          <Card variant="default" padding="md">
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-4 text-center">Score</p>
            <div className="flex justify-between items-center">
              {/* Player 1 */}
              <div className="text-center">
                <div className="w-8 h-8 rounded-full bg-black mx-auto mb-2" />
                <p className="text-sm font-medium">{settings.player1Name}</p>
                <p className="text-2xl font-bold">{pieces.player1}</p>
                {pieces.player1Kings > 0 && (
                  <p className="text-xs text-gray-500">{pieces.player1Kings} kings</p>
                )}
              </div>
              
              <span className="text-gray-300 text-2xl font-light">vs</span>
              
              {/* Player 2 */}
              <div className="text-center">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-black mx-auto mb-2" />
                <p className="text-sm font-medium">{settings.player2Name}</p>
                <p className="text-2xl font-bold">{pieces.player2}</p>
                {pieces.player2Kings > 0 && (
                  <p className="text-xs text-gray-500">{pieces.player2Kings} kings</p>
                )}
              </div>
            </div>
          </Card>
          
          {/* Controls */}
          <Card variant="default" padding="md">
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={undoMove}
                  disabled={!canUndo}
                  className="flex-1"
                >
                  ← Undo
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={redoMove}
                  disabled={!canRedo}
                  className="flex-1"
                >
                  Redo →
                </Button>
              </div>
              <Button 
                variant="primary" 
                fullWidth 
                onClick={newGame}
              >
                New Game
              </Button>
              <Link to="/" className="block">
                <Button variant="ghost" fullWidth size="sm">
                  ← Back to Menu
                </Button>
              </Link>
            </div>
          </Card>
          
          {/* Game Mode Info */}
          <div className="text-center text-xs text-gray-400">
            <p>
              {settings.mode === 'vs-computer' 
                ? `Playing vs AI (${settings.aiDepth <= 2 ? 'Easy' : settings.aiDepth <= 4 ? 'Medium' : 'Hard'})`
                : 'Two Player Mode'
              }
            </p>
            <Link to="/settings" className="underline hover:text-gray-600">
              Change settings
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
