import { Board, Player, GameState, Move } from '../types';
import { createInitialBoard, countPieces, copyBoard } from './board';
import { getAllValidMoves, applyMove } from './moves';

// Create initial game state
export function createInitialGameState(): GameState {
  const board = createInitialBoard();
  return {
    board,
    turn: 1, // Player 1 starts
    history: [copyBoard(board)],
    historyIndex: 0,
    isGameOver: false,
    winner: null,
    selectedPiece: null,
    validMoves: getAllValidMoves(board, 1),
    mustCapture: false
  };
}

// Check if the game is over
export function checkGameOver(board: Board, currentPlayer: Player): { isOver: boolean; winner: Player | null } {
  const pieces = countPieces(board);
  
  // Check if a player has no pieces
  if (pieces.player1 === 0) {
    return { isOver: true, winner: -1 };
  }
  if (pieces.player2 === 0) {
    return { isOver: true, winner: 1 };
  }
  
  // Check if current player has no valid moves
  const validMoves = getAllValidMoves(board, currentPlayer);
  if (validMoves.length === 0) {
    return { isOver: true, winner: currentPlayer === 1 ? -1 : 1 };
  }
  
  return { isOver: false, winner: null };
}

// Make a move and return the new game state
export function makeMove(state: GameState, move: Move): GameState {
  const newBoard = applyMove(state.board, move);
  const nextPlayer: Player = state.turn === 1 ? -1 : 1;
  
  // Check game over
  const gameOverResult = checkGameOver(newBoard, nextPlayer);
  
  // Update history (truncate if we're in the middle of history)
  const newHistory = [...state.history.slice(0, state.historyIndex + 1), copyBoard(newBoard)];
  
  return {
    board: newBoard,
    turn: nextPlayer,
    history: newHistory,
    historyIndex: newHistory.length - 1,
    isGameOver: gameOverResult.isOver,
    winner: gameOverResult.winner,
    selectedPiece: null,
    validMoves: gameOverResult.isOver ? [] : getAllValidMoves(newBoard, nextPlayer),
    mustCapture: false
  };
}

// Undo a move
export function undo(state: GameState): GameState {
  if (state.historyIndex <= 0) {
    return state;
  }
  
  const newIndex = state.historyIndex - 1;
  const board = copyBoard(state.history[newIndex]);
  const turn: Player = newIndex % 2 === 0 ? 1 : -1;
  
  return {
    ...state,
    board,
    turn,
    historyIndex: newIndex,
    isGameOver: false,
    winner: null,
    selectedPiece: null,
    validMoves: getAllValidMoves(board, turn),
    mustCapture: false
  };
}

// Redo a move
export function redo(state: GameState): GameState {
  if (state.historyIndex >= state.history.length - 1) {
    return state;
  }
  
  const newIndex = state.historyIndex + 1;
  const board = copyBoard(state.history[newIndex]);
  const turn: Player = newIndex % 2 === 0 ? 1 : -1;
  
  // Check if this is the last state and game was over
  const gameOverResult = newIndex === state.history.length - 1 
    ? checkGameOver(board, turn)
    : { isOver: false, winner: null };
  
  return {
    ...state,
    board,
    turn,
    historyIndex: newIndex,
    isGameOver: gameOverResult.isOver,
    winner: gameOverResult.winner,
    selectedPiece: null,
    validMoves: getAllValidMoves(board, turn),
    mustCapture: false
  };
}
