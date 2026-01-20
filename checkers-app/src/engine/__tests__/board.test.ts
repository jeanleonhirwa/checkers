import { describe, it, expect } from 'vitest';
import {
  createInitialBoard,
  copyBoard,
  isValidPosition,
  isDarkSquare,
  belongsToPlayer,
  isKing,
  shouldPromote,
  promotePiece,
  getPlayerPieces,
  countPieces
} from '../board';

describe('Board', () => {
  describe('createInitialBoard', () => {
    it('should create an 8x8 board', () => {
      const board = createInitialBoard();
      expect(board.length).toBe(8);
      board.forEach(row => expect(row.length).toBe(8));
    });

    it('should place 12 pieces for each player', () => {
      const board = createInitialBoard();
      const pieces = countPieces(board);
      expect(pieces.player1).toBe(12);
      expect(pieces.player2).toBe(12);
    });

    it('should place pieces only on dark squares', () => {
      const board = createInitialBoard();
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (!isDarkSquare(row, col)) {
            expect(board[row][col]).toBe(0);
          }
        }
      }
    });

    it('should place player 2 pieces in rows 0-2', () => {
      const board = createInitialBoard();
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 8; col++) {
          if (isDarkSquare(row, col)) {
            expect(board[row][col]).toBe(-1);
          }
        }
      }
    });

    it('should place player 1 pieces in rows 5-7', () => {
      const board = createInitialBoard();
      for (let row = 5; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (isDarkSquare(row, col)) {
            expect(board[row][col]).toBe(1);
          }
        }
      }
    });

    it('should have empty middle rows', () => {
      const board = createInitialBoard();
      for (let row = 3; row < 5; row++) {
        for (let col = 0; col < 8; col++) {
          expect(board[row][col]).toBe(0);
        }
      }
    });
  });

  describe('copyBoard', () => {
    it('should create a deep copy of the board', () => {
      const board = createInitialBoard();
      const copy = copyBoard(board);
      
      // Should have same values
      expect(copy).toEqual(board);
      
      // Should be different references
      expect(copy).not.toBe(board);
      copy[0][1] = 99;
      expect(board[0][1]).not.toBe(99);
    });
  });

  describe('isValidPosition', () => {
    it('should return true for valid positions', () => {
      expect(isValidPosition({ row: 0, col: 0 })).toBe(true);
      expect(isValidPosition({ row: 7, col: 7 })).toBe(true);
      expect(isValidPosition({ row: 3, col: 4 })).toBe(true);
    });

    it('should return false for invalid positions', () => {
      expect(isValidPosition({ row: -1, col: 0 })).toBe(false);
      expect(isValidPosition({ row: 0, col: -1 })).toBe(false);
      expect(isValidPosition({ row: 8, col: 0 })).toBe(false);
      expect(isValidPosition({ row: 0, col: 8 })).toBe(false);
    });
  });

  describe('isDarkSquare', () => {
    it('should identify dark squares correctly', () => {
      expect(isDarkSquare(0, 1)).toBe(true);
      expect(isDarkSquare(1, 0)).toBe(true);
      expect(isDarkSquare(0, 0)).toBe(false);
      expect(isDarkSquare(1, 1)).toBe(false);
    });
  });

  describe('belongsToPlayer', () => {
    it('should correctly identify player 1 pieces', () => {
      expect(belongsToPlayer(1, 1)).toBe(true);
      expect(belongsToPlayer(2, 1)).toBe(true);
      expect(belongsToPlayer(-1, 1)).toBe(false);
      expect(belongsToPlayer(-2, 1)).toBe(false);
    });

    it('should correctly identify player 2 pieces', () => {
      expect(belongsToPlayer(-1, -1)).toBe(true);
      expect(belongsToPlayer(-2, -1)).toBe(true);
      expect(belongsToPlayer(1, -1)).toBe(false);
      expect(belongsToPlayer(2, -1)).toBe(false);
    });
  });

  describe('isKing', () => {
    it('should identify kings', () => {
      expect(isKing(2)).toBe(true);
      expect(isKing(-2)).toBe(true);
      expect(isKing(1)).toBe(false);
      expect(isKing(-1)).toBe(false);
      expect(isKing(0)).toBe(false);
    });
  });

  describe('shouldPromote', () => {
    it('should promote player 1 at row 0', () => {
      expect(shouldPromote(1, 0)).toBe(true);
      expect(shouldPromote(1, 1)).toBe(false);
    });

    it('should promote player 2 at row 7', () => {
      expect(shouldPromote(-1, 7)).toBe(true);
      expect(shouldPromote(-1, 6)).toBe(false);
    });

    it('should not promote kings', () => {
      expect(shouldPromote(2, 0)).toBe(false);
      expect(shouldPromote(-2, 7)).toBe(false);
    });
  });

  describe('promotePiece', () => {
    it('should promote regular pieces to kings', () => {
      expect(promotePiece(1)).toBe(2);
      expect(promotePiece(-1)).toBe(-2);
    });

    it('should not change kings', () => {
      expect(promotePiece(2)).toBe(2);
      expect(promotePiece(-2)).toBe(-2);
    });
  });

  describe('getPlayerPieces', () => {
    it('should return all pieces for player 1', () => {
      const board = createInitialBoard();
      const pieces = getPlayerPieces(board, 1);
      expect(pieces.length).toBe(12);
      pieces.forEach(pos => {
        expect(board[pos.row][pos.col]).toBeGreaterThan(0);
      });
    });

    it('should return all pieces for player 2', () => {
      const board = createInitialBoard();
      const pieces = getPlayerPieces(board, -1);
      expect(pieces.length).toBe(12);
      pieces.forEach(pos => {
        expect(board[pos.row][pos.col]).toBeLessThan(0);
      });
    });
  });

  describe('countPieces', () => {
    it('should count pieces correctly on initial board', () => {
      const board = createInitialBoard();
      const count = countPieces(board);
      expect(count.player1).toBe(12);
      expect(count.player2).toBe(12);
      expect(count.player1Kings).toBe(0);
      expect(count.player2Kings).toBe(0);
    });

    it('should count kings correctly', () => {
      const board = createInitialBoard();
      board[0][1] = 2; // Player 1 king
      board[7][0] = -2; // Player 2 king
      const count = countPieces(board);
      expect(count.player1Kings).toBe(1);
      expect(count.player2Kings).toBe(1);
    });
  });
});
