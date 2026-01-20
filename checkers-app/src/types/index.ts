// 0 = empty, 1 = player-1 man, 2 = player-1 king,
// -1 = player-2 man, -2 = player-2 king
export type Square = number;
export type Board = Square[][];

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  captures?: Position[];
}

export type Player = 1 | -1;

export interface GameState {
  board: Board;
  turn: Player;
  history: Board[];
  historyIndex: number;
  isGameOver: boolean;
  winner: Player | null;
  selectedPiece: Position | null;
  validMoves: Move[];
  mustCapture: boolean;
}

export type GameMode = 'two-player' | 'vs-computer';

export interface GameSettings {
  mode: GameMode;
  player1Name: string;
  player2Name: string;
  aiDepth: number;
}
