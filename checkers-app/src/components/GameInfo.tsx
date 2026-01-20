import { useGame } from '../context/GameContext';
import { countPieces } from '../engine/board';

export function GameInfo() {
  const { gameState, settings } = useGame();
  const pieces = countPieces(gameState.board);
  
  return (
    <div className="flex gap-6 p-4 bg-gray-800 rounded-lg shadow-lg">
      {/* Player 1 info */}
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-md" />
        <div>
          <div className="text-sm font-medium text-gray-300">{settings.player1Name}</div>
          <div className="text-lg font-bold text-white">
            {pieces.player1} 
            {pieces.player1Kings > 0 && (
              <span className="text-yellow-400 text-sm ml-1">({pieces.player1Kings}♔)</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="text-gray-500 text-2xl font-bold self-center">vs</div>
      
      {/* Player 2 info */}
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 shadow-md" />
        <div>
          <div className="text-sm font-medium text-gray-300">{settings.player2Name}</div>
          <div className="text-lg font-bold text-white">
            {pieces.player2}
            {pieces.player2Kings > 0 && (
              <span className="text-yellow-400 text-sm ml-1">({pieces.player2Kings}♔)</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
