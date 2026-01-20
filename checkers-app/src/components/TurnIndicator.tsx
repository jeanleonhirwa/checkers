import { useGame } from '../context/GameContext';

export function TurnIndicator() {
  const { gameState, settings } = useGame();
  const { turn, isGameOver, winner } = gameState;
  
  const currentPlayerName = turn === 1 ? settings.player1Name : settings.player2Name;
  const winnerName = winner === 1 ? settings.player1Name : settings.player2Name;
  
  const isComputerThinking = settings.mode === 'vs-computer' && turn === -1 && !isGameOver;
  
  if (isGameOver) {
    return (
      <div className="text-center p-4 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900">
          🎉 {winnerName} Wins! 🎉
        </h2>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center gap-4 p-4 bg-gray-800 rounded-lg shadow-lg">
      <div 
        className={`
          w-8 h-8 rounded-full
          ${turn === 1 
            ? 'bg-gradient-to-br from-red-400 to-red-600' 
            : 'bg-gradient-to-br from-gray-200 to-gray-400'
          }
          shadow-md
        `}
        aria-hidden="true"
      />
      <div className="text-lg">
        <span className="font-semibold">{currentPlayerName}</span>
        <span className="text-gray-400">'s turn</span>
        {isComputerThinking && (
          <span className="ml-2 text-blue-400 animate-pulse">thinking...</span>
        )}
      </div>
    </div>
  );
}
