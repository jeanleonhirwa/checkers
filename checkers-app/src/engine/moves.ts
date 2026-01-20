import { Board, Position, Move, Player } from '../types';
import { 
  isValidPosition, 
  getPiece, 
  belongsToPlayer, 
  isKing, 
  copyBoard,
  shouldPromote,
  promotePiece
} from './board';

// Get move directions for a piece
function getMoveDirections(piece: number): { row: number; col: number }[] {
  const directions: { row: number; col: number }[] = [];
  
  // Player 1 (positive) moves up (negative row direction)
  // Player 2 (negative) moves down (positive row direction)
  // Kings can move in all diagonal directions
  
  if (piece === 1 || piece === 2 || piece === -2) {
    directions.push({ row: -1, col: -1 }, { row: -1, col: 1 });
  }
  if (piece === -1 || piece === 2 || piece === -2) {
    directions.push({ row: 1, col: -1 }, { row: 1, col: 1 });
  }
  
  return directions;
}

// Get simple moves (non-capturing) for a piece
function getSimpleMoves(board: Board, pos: Position): Move[] {
  const piece = getPiece(board, pos);
  const directions = getMoveDirections(piece);
  const moves: Move[] = [];
  
  for (const dir of directions) {
    const newPos: Position = {
      row: pos.row + dir.row,
      col: pos.col + dir.col
    };
    
    if (isValidPosition(newPos) && getPiece(board, newPos) === 0) {
      moves.push({ from: pos, to: newPos });
    }
  }
  
  return moves;
}

// Get capture moves for a piece (including multi-jumps)
function getCaptureMoves(
  board: Board, 
  pos: Position, 
  player: Player,
  captures: Position[] = [],
  originalPos?: Position
): Move[] {
  const piece = getPiece(board, pos);
  const directions = getMoveDirections(piece);
  const moves: Move[] = [];
  const opponent: Player = player === 1 ? -1 : 1;
  
  for (const dir of directions) {
    const jumpOver: Position = {
      row: pos.row + dir.row,
      col: pos.col + dir.col
    };
    const landPos: Position = {
      row: pos.row + dir.row * 2,
      col: pos.col + dir.col * 2
    };
    
    if (
      isValidPosition(jumpOver) &&
      isValidPosition(landPos) &&
      belongsToPlayer(getPiece(board, jumpOver), opponent) &&
      getPiece(board, landPos) === 0 &&
      !captures.some(c => c.row === jumpOver.row && c.col === jumpOver.col)
    ) {
      const newCaptures = [...captures, jumpOver];
      
      // Create a temporary board to check for multi-jumps
      const tempBoard = copyBoard(board);
      tempBoard[pos.row][pos.col] = 0;
      tempBoard[jumpOver.row][jumpOver.col] = 0;
      tempBoard[landPos.row][landPos.col] = piece;
      
      // Check if the piece should be promoted
      let promotedPiece = piece;
      if (shouldPromote(piece, landPos.row)) {
        promotedPiece = promotePiece(piece);
        tempBoard[landPos.row][landPos.col] = promotedPiece;
      }
      
      // Look for additional jumps
      const additionalCaptures = getCaptureMoves(
        tempBoard, 
        landPos, 
        player, 
        newCaptures,
        originalPos || pos
      );
      
      if (additionalCaptures.length > 0) {
        // Multi-jump available
        moves.push(...additionalCaptures);
      } else {
        // Single capture (or end of multi-jump)
        moves.push({
          from: originalPos || pos,
          to: landPos,
          captures: newCaptures
        });
      }
    }
  }
  
  return moves;
}

// Get all valid moves for a piece
export function getValidMovesForPiece(board: Board, pos: Position, player: Player): Move[] {
  const piece = getPiece(board, pos);
  
  if (!belongsToPlayer(piece, player)) {
    return [];
  }
  
  const captureMoves = getCaptureMoves(board, pos, player);
  
  // In checkers, if captures are available, they must be taken
  if (captureMoves.length > 0) {
    return captureMoves;
  }
  
  return getSimpleMoves(board, pos);
}

// Get all valid moves for a player
export function getAllValidMoves(board: Board, player: Player): Move[] {
  const allMoves: Move[] = [];
  const captureMoves: Move[] = [];
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (belongsToPlayer(piece, player)) {
        const pos = { row, col };
        const captures = getCaptureMoves(board, pos, player);
        const simple = getSimpleMoves(board, pos);
        
        captureMoves.push(...captures);
        allMoves.push(...simple);
      }
    }
  }
  
  // If any captures are available, only capture moves are valid
  if (captureMoves.length > 0) {
    return captureMoves;
  }
  
  return allMoves;
}

// Check if any captures are available for a player
export function hasCaptures(board: Board, player: Player): boolean {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (belongsToPlayer(piece, player)) {
        const captures = getCaptureMoves(board, { row, col }, player);
        if (captures.length > 0) return true;
      }
    }
  }
  return false;
}

// Apply a move to the board and return the new board state
export function applyMove(board: Board, move: Move): Board {
  const newBoard = copyBoard(board);
  const piece = newBoard[move.from.row][move.from.col];
  
  // Move the piece
  newBoard[move.from.row][move.from.col] = 0;
  
  // Remove captured pieces
  if (move.captures) {
    for (const capture of move.captures) {
      newBoard[capture.row][capture.col] = 0;
    }
  }
  
  // Place the piece (possibly promoted)
  let finalPiece = piece;
  if (shouldPromote(piece, move.to.row)) {
    finalPiece = promotePiece(piece);
  }
  newBoard[move.to.row][move.to.col] = finalPiece;
  
  return newBoard;
}

// Check if a move is valid
export function isMoveValid(board: Board, move: Move, player: Player): boolean {
  const validMoves = getAllValidMoves(board, player);
  return validMoves.some(
    m => 
      m.from.row === move.from.row &&
      m.from.col === move.from.col &&
      m.to.row === move.to.row &&
      m.to.col === move.to.col
  );
}
