import type { Board, Square, Position, Player } from '../types';

// Create initial board setup
export function createInitialBoard(): Board {
  const board: Board = [];
  
  for (let row = 0; row < 8; row++) {
    board[row] = [];
    for (let col = 0; col < 8; col++) {
      // Only dark squares (where row + col is odd) can have pieces
      if ((row + col) % 2 === 1) {
        if (row < 3) {
          // Player 2 pieces (top of board)
          board[row][col] = -1;
        } else if (row > 4) {
          // Player 1 pieces (bottom of board)
          board[row][col] = 1;
        } else {
          board[row][col] = 0;
        }
      } else {
        board[row][col] = 0;
      }
    }
  }
  
  return board;
}

// Deep copy a board
export function copyBoard(board: Board): Board {
  return board.map(row => [...row]);
}

// Check if a position is within the board
export function isValidPosition(pos: Position): boolean {
  return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8;
}

// Check if a square is a dark square (playable)
export function isDarkSquare(row: number, col: number): boolean {
  return (row + col) % 2 === 1;
}

// Get the piece at a position
export function getPiece(board: Board, pos: Position): Square {
  return board[pos.row][pos.col];
}

// Check if a piece belongs to a player
export function belongsToPlayer(piece: Square, player: Player): boolean {
  if (player === 1) {
    return piece === 1 || piece === 2;
  } else {
    return piece === -1 || piece === -2;
  }
}

// Check if a piece is a king
export function isKing(piece: Square): boolean {
  return piece === 2 || piece === -2;
}

// Check if a piece should be promoted to king
export function shouldPromote(piece: Square, row: number): boolean {
  // Player 1 promotes at row 0, Player 2 promotes at row 7
  if (piece === 1 && row === 0) return true;
  if (piece === -1 && row === 7) return true;
  return false;
}

// Promote a piece to king
export function promotePiece(piece: Square): Square {
  if (piece === 1) return 2;
  if (piece === -1) return -2;
  return piece;
}

// Get all pieces for a player
export function getPlayerPieces(board: Board, player: Player): Position[] {
  const pieces: Position[] = [];
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (belongsToPlayer(piece, player)) {
        pieces.push({ row, col });
      }
    }
  }
  
  return pieces;
}

// Count pieces for each player
export function countPieces(board: Board): { player1: number; player2: number; player1Kings: number; player2Kings: number } {
  let player1 = 0;
  let player2 = 0;
  let player1Kings = 0;
  let player2Kings = 0;
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece === 1) player1++;
      else if (piece === 2) { player1++; player1Kings++; }
      else if (piece === -1) player2++;
      else if (piece === -2) { player2++; player2Kings++; }
    }
  }
  
  return { player1, player2, player1Kings, player2Kings };
}
