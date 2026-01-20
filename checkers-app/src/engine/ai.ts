import type { Board, Player, Move } from '../types';
import { countPieces } from './board';
import { getAllValidMoves, applyMove } from './moves';

// Evaluation function for the board position
function evaluateBoard(board: Board, player: Player): number {
  const pieces = countPieces(board);
  
  // Material value
  const pieceValue = 100;
  const kingBonus = 50; // Kings are worth 1.5x regular pieces
  
  let player1Score = pieces.player1 * pieceValue + pieces.player1Kings * kingBonus;
  let player2Score = pieces.player2 * pieceValue + pieces.player2Kings * kingBonus;
  
  // Positional bonuses
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      
      if (piece !== 0) {
        // Center control bonus
        const centerBonus = (col >= 2 && col <= 5) ? 5 : 0;
        
        // Advancement bonus (pieces closer to promotion)
        let advanceBonus = 0;
        if (piece === 1) {
          advanceBonus = (7 - row) * 2; // Player 1 advances toward row 0
        } else if (piece === -1) {
          advanceBonus = row * 2; // Player 2 advances toward row 7
        }
        
        // Back row protection bonus (for non-kings)
        let backRowBonus = 0;
        if (piece === 1 && row === 7) backRowBonus = 10;
        if (piece === -1 && row === 0) backRowBonus = 10;
        
        // Edge protection (harder to capture)
        const edgeBonus = (col === 0 || col === 7) ? 3 : 0;
        
        const posBonus = centerBonus + advanceBonus + backRowBonus + edgeBonus;
        
        if (piece > 0) {
          player1Score += posBonus;
        } else {
          player2Score += posBonus;
        }
      }
    }
  }
  
  // Mobility bonus
  const player1Moves = getAllValidMoves(board, 1).length;
  const player2Moves = getAllValidMoves(board, -1).length;
  
  player1Score += player1Moves * 2;
  player2Score += player2Moves * 2;
  
  // Return score from the perspective of the given player
  return player === 1 ? player1Score - player2Score : player2Score - player1Score;
}

// Minimax with alpha-beta pruning
function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean,
  currentPlayer: Player,
  originalPlayer: Player
): { score: number; move?: Move } {
  const moves = getAllValidMoves(board, currentPlayer);
  
  // Terminal conditions
  if (depth === 0 || moves.length === 0) {
    const score = evaluateBoard(board, originalPlayer);
    // If no moves, it's a loss for the current player
    if (moves.length === 0) {
      return { score: maximizingPlayer ? -10000 : 10000 };
    }
    return { score };
  }
  
  const nextPlayer: Player = currentPlayer === 1 ? -1 : 1;
  
  if (maximizingPlayer) {
    let maxEval = -Infinity;
    let bestMove: Move | undefined;
    
    for (const move of moves) {
      const newBoard = applyMove(board, move);
      const result = minimax(newBoard, depth - 1, alpha, beta, false, nextPlayer, originalPlayer);
      
      if (result.score > maxEval) {
        maxEval = result.score;
        bestMove = move;
      }
      
      alpha = Math.max(alpha, result.score);
      if (beta <= alpha) {
        break; // Beta cutoff
      }
    }
    
    return { score: maxEval, move: bestMove };
  } else {
    let minEval = Infinity;
    let bestMove: Move | undefined;
    
    for (const move of moves) {
      const newBoard = applyMove(board, move);
      const result = minimax(newBoard, depth - 1, alpha, beta, true, nextPlayer, originalPlayer);
      
      if (result.score < minEval) {
        minEval = result.score;
        bestMove = move;
      }
      
      beta = Math.min(beta, result.score);
      if (beta <= alpha) {
        break; // Alpha cutoff
      }
    }
    
    return { score: minEval, move: bestMove };
  }
}

// Get the best move for the AI
export function getBestMove(board: Board, player: Player, depth: number = 4): Move | null {
  const moves = getAllValidMoves(board, player);
  
  if (moves.length === 0) {
    return null;
  }
  
  // If only one move available, return it immediately
  if (moves.length === 1) {
    return moves[0];
  }
  
  const result = minimax(board, depth, -Infinity, Infinity, true, player, player);
  
  return result.move || moves[0];
}

// Simpler AI for easy difficulty (random moves with slight preference for captures)
export function getRandomMove(board: Board, player: Player): Move | null {
  const moves = getAllValidMoves(board, player);
  
  if (moves.length === 0) {
    return null;
  }
  
  // Prefer capture moves 70% of the time if available
  const captureMoves = moves.filter(m => m.captures && m.captures.length > 0);
  
  if (captureMoves.length > 0 && Math.random() < 0.7) {
    return captureMoves[Math.floor(Math.random() * captureMoves.length)];
  }
  
  return moves[Math.floor(Math.random() * moves.length)];
}
