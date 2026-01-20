import React from 'react';
import { useGame } from '../context/GameContext';
import { GameMode } from '../types';

export function Controls() {
  const { 
    gameState, 
    settings, 
    undoMove, 
    redoMove, 
    newGame, 
    setMode,
    setAIDepth 
  } = useGame();
  
  const canUndo = gameState.historyIndex > 0;
  const canRedo = gameState.historyIndex < gameState.history.length - 1;
  
  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMode(e.target.value as GameMode);
  };
  
  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAIDepth(parseInt(e.target.value, 10));
  };
  
  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
      {/* Game mode selector */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <label htmlFor="mode-select" className="text-sm font-medium text-gray-300">
          Game Mode:
        </label>
        <select
          id="mode-select"
          value={settings.mode}
          onChange={handleModeChange}
          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="two-player">Two Players (Pass & Play)</option>
          <option value="vs-computer">vs Computer</option>
        </select>
      </div>
      
      {/* AI Difficulty (only shown in vs-computer mode) */}
      {settings.mode === 'vs-computer' && (
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <label htmlFor="difficulty-select" className="text-sm font-medium text-gray-300">
            Difficulty:
          </label>
          <select
            id="difficulty-select"
            value={settings.aiDepth}
            onChange={handleDifficultyChange}
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="2">Easy</option>
            <option value="4">Medium</option>
            <option value="6">Hard</option>
          </select>
        </div>
      )}
      
      {/* Action buttons */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={undoMove}
          disabled={!canUndo}
          className={`
            px-4 py-2 rounded-md font-medium transition-colors
            ${canUndo 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }
          `}
          aria-label="Undo move"
        >
          ↶ Undo
        </button>
        
        <button
          onClick={redoMove}
          disabled={!canRedo}
          className={`
            px-4 py-2 rounded-md font-medium transition-colors
            ${canRedo 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }
          `}
          aria-label="Redo move"
        >
          Redo ↷
        </button>
        
        <button
          onClick={newGame}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors"
          aria-label="Start new game"
        >
          New Game
        </button>
      </div>
    </div>
  );
}
