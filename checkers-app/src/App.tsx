import React from 'react';
import { GameProvider } from './context/GameContext';
import { Board, TurnIndicator, Controls, GameInfo } from './components';

function App() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-4 gap-6">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            ♟️ Checkers
          </h1>
          <p className="text-gray-400 text-sm">
            Classic board game • Drag or click to move
          </p>
        </header>
        
        {/* Turn Indicator */}
        <TurnIndicator />
        
        {/* Game Board */}
        <main>
          <Board />
        </main>
        
        {/* Game Info */}
        <GameInfo />
        
        {/* Controls */}
        <Controls />
        
        {/* Footer */}
        <footer className="text-center text-gray-500 text-xs mt-4">
          <p>Use arrow keys and Enter for keyboard navigation</p>
          <p className="mt-1">Red moves first • Captures are mandatory</p>
        </footer>
      </div>
    </GameProvider>
  );
}

export default App;
