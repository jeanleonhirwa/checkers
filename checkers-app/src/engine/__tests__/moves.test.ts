import { describe, it, expect } from 'vitest';
import {
  getValidMovesForPiece,
  getAllValidMoves,
  applyMove,
  hasCaptures,
  isMoveValid
} from '../moves';
import { createInitialBoard } from '../board';
import type { Board, Move } from '../../types';

describe('Moves', () => {
  describe('getValidMovesForPiece', () => {
    it('should return valid moves for a piece on initial board', () => {
      const board = createInitialBoard();
      // Player 1 piece at row 5, col 0
      const moves = getValidMovesForPiece(board, { row: 5, col: 0 }, 1);
      expect(moves.length).toBe(1); // Can only move diagonally forward-right
      expect(moves[0].to).toEqual({ row: 4, col: 1 });
    });

    it('should return no moves for opponent pieces', () => {
      const board = createInitialBoard();
      const moves = getValidMovesForPiece(board, { row: 5, col: 0 }, -1);
      expect(moves.length).toBe(0);
    });

    it('should return capture moves when available', () => {
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(0));
      board[4][3] = 1; // Player 1 piece
      board[3][4] = -1; // Player 2 piece to capture
      
      const moves = getValidMovesForPiece(board, { row: 4, col: 3 }, 1);
      expect(moves.length).toBe(1);
      expect(moves[0].captures).toBeDefined();
      expect(moves[0].captures?.length).toBe(1);
      expect(moves[0].to).toEqual({ row: 2, col: 5 });
    });
  });

  describe('getAllValidMoves', () => {
    it('should return all valid moves for a player', () => {
      const board = createInitialBoard();
      const moves = getAllValidMoves(board, 1);
      // Player 1 has 7 possible opening moves
      expect(moves.length).toBe(7);
    });

    it('should force captures when available', () => {
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(0));
      board[4][3] = 1; // Player 1 piece with capture available
      board[3][4] = -1; // Player 2 piece to capture
      board[6][1] = 1; // Another player 1 piece with no capture
      
      const moves = getAllValidMoves(board, 1);
      // Only capture moves should be returned
      expect(moves.every(m => m.captures && m.captures.length > 0)).toBe(true);
    });
  });

  describe('hasCaptures', () => {
    it('should return false when no captures available', () => {
      const board = createInitialBoard();
      expect(hasCaptures(board, 1)).toBe(false);
      expect(hasCaptures(board, -1)).toBe(false);
    });

    it('should return true when captures are available', () => {
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(0));
      board[4][3] = 1;
      board[3][4] = -1;
      
      expect(hasCaptures(board, 1)).toBe(true);
      // Player 2 can also capture player 1's piece
      expect(hasCaptures(board, -1)).toBe(true);
    });
  });

  describe('applyMove', () => {
    it('should move a piece correctly', () => {
      const board = createInitialBoard();
      const move: Move = {
        from: { row: 5, col: 0 },
        to: { row: 4, col: 1 }
      };
      
      const newBoard = applyMove(board, move);
      expect(newBoard[5][0]).toBe(0);
      expect(newBoard[4][1]).toBe(1);
    });

    it('should remove captured pieces', () => {
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(0));
      board[4][3] = 1;
      board[3][4] = -1;
      
      const move: Move = {
        from: { row: 4, col: 3 },
        to: { row: 2, col: 5 },
        captures: [{ row: 3, col: 4 }]
      };
      
      const newBoard = applyMove(board, move);
      expect(newBoard[4][3]).toBe(0); // Original position empty
      expect(newBoard[3][4]).toBe(0); // Captured piece removed
      expect(newBoard[2][5]).toBe(1); // Piece at new position
    });

    it('should promote pieces to kings', () => {
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(0));
      board[1][0] = 1; // Player 1 piece about to be promoted
      
      const move: Move = {
        from: { row: 1, col: 0 },
        to: { row: 0, col: 1 }
      };
      
      const newBoard = applyMove(board, move);
      expect(newBoard[0][1]).toBe(2); // Should be a king
    });

    it('should not modify the original board', () => {
      const board = createInitialBoard();
      const originalValue = board[5][0];
      const move: Move = {
        from: { row: 5, col: 0 },
        to: { row: 4, col: 1 }
      };
      
      applyMove(board, move);
      expect(board[5][0]).toBe(originalValue);
    });
  });

  describe('isMoveValid', () => {
    it('should validate legal moves', () => {
      const board = createInitialBoard();
      const move: Move = {
        from: { row: 5, col: 0 },
        to: { row: 4, col: 1 }
      };
      expect(isMoveValid(board, move, 1)).toBe(true);
    });

    it('should reject illegal moves', () => {
      const board = createInitialBoard();
      const move: Move = {
        from: { row: 5, col: 0 },
        to: { row: 3, col: 2 } // Can't move two squares without capture
      };
      expect(isMoveValid(board, move, 1)).toBe(false);
    });
  });

  describe('King movement', () => {
    it('should allow kings to move backwards', () => {
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(0));
      board[3][3] = 2; // Player 1 king
      
      const moves = getValidMovesForPiece(board, { row: 3, col: 3 }, 1);
      // King should be able to move in all 4 diagonal directions
      expect(moves.length).toBe(4);
      
      const destinations = moves.map(m => m.to);
      expect(destinations).toContainEqual({ row: 2, col: 2 });
      expect(destinations).toContainEqual({ row: 2, col: 4 });
      expect(destinations).toContainEqual({ row: 4, col: 2 });
      expect(destinations).toContainEqual({ row: 4, col: 4 });
    });
  });

  describe('Multi-jump captures', () => {
    it('should detect multi-jump opportunities', () => {
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(0));
      board[5][0] = 1; // Player 1 piece
      board[4][1] = -1; // First capture
      board[2][3] = -1; // Second capture
      
      const moves = getValidMovesForPiece(board, { row: 5, col: 0 }, 1);
      // Should find the double jump
      const doubleJump = moves.find(m => m.captures && m.captures.length === 2);
      expect(doubleJump).toBeDefined();
      expect(doubleJump?.to).toEqual({ row: 1, col: 4 });
    });
  });
});
