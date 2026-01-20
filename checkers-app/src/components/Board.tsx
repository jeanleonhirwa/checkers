import React, { useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { Square } from './Square';
import { belongsToPlayer } from '../engine/board';

export function Board() {
  const { gameState, settings, selectPiece, makeGameMove } = useGame();
  const { board, turn, selectedPiece, validMoves, isGameOver } = gameState;
  
  // Check if it's the computer's turn
  const isComputerTurn = settings.mode === 'vs-computer' && turn === -1;
  
  const handleSquareClick = useCallback((row: number, col: number) => {
    // Don't allow moves if game is over or it's computer's turn
    if (isGameOver || isComputerTurn) return;
    
    const piece = board[row][col];
    
    // If a piece is selected and this is a valid move destination
    if (selectedPiece) {
      const move = validMoves.find(
        m => m.to.row === row && m.to.col === col
      );
      
      if (move) {
        makeGameMove(move);
        return;
      }
    }
    
    // If clicking on own piece, select it
    if (piece !== 0 && belongsToPlayer(piece, turn)) {
      selectPiece({ row, col });
    }
  }, [board, turn, selectedPiece, validMoves, isGameOver, isComputerTurn, selectPiece, makeGameMove]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent, row: number, col: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSquareClick(row, col);
    }
  }, [handleSquareClick]);
  
  return (
    <div 
      className="grid grid-cols-8 w-full max-w-[min(90vw,90vh,500px)] aspect-square border-4 border-amber-900 rounded-lg overflow-hidden shadow-2xl"
      role="grid"
      aria-label="Checkers board"
    >
      {board.map((rowData, row) => (
        rowData.map((piece, col) => {
          const isSelected = selectedPiece?.row === row && selectedPiece?.col === col;
          const validMove = validMoves.find(m => m.to.row === row && m.to.col === col);
          const isValidMoveSquare = !!validMove && selectedPiece !== null;
          const isCapture = validMove?.captures && validMove.captures.length > 0;
          
          return (
            <Square
              key={`${row}-${col}`}
              row={row}
              col={col}
              piece={piece}
              isSelected={isSelected}
              isValidMove={isValidMoveSquare}
              isCapture={!!isCapture}
              onClick={() => handleSquareClick(row, col)}
              onKeyDown={(e) => handleKeyDown(e, row, col)}
            />
          );
        })
      ))}
    </div>
  );
}
