import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type { GameState, GameSettings, GameMode, Position, Move } from '../types';
import { createInitialGameState, makeMove, undo, redo } from '../engine/gameLogic';
import { getValidMovesForPiece, getAllValidMoves } from '../engine/moves';
import { getBestMove } from '../engine/ai';

// Action types
type GameAction =
  | { type: 'SELECT_PIECE'; position: Position }
  | { type: 'MAKE_MOVE'; move: Move }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'NEW_GAME' }
  | { type: 'SET_MODE'; mode: GameMode }
  | { type: 'SET_PLAYER_NAMES'; player1: string; player2: string }
  | { type: 'SET_AI_DEPTH'; depth: number }
  | { type: 'LOAD_STATE'; state: GameState };

interface GameContextState {
  gameState: GameState;
  settings: GameSettings;
}

const initialSettings: GameSettings = {
  mode: 'two-player',
  player1Name: 'Player 1',
  player2Name: 'Player 2',
  aiDepth: 4
};

const initialState: GameContextState = {
  gameState: createInitialGameState(),
  settings: initialSettings
};

// Reducer
function gameReducer(state: GameContextState, action: GameAction): GameContextState {
  switch (action.type) {
    case 'SELECT_PIECE': {
      const { position } = action;
      const { gameState } = state;
      
      // If game is over, don't allow selection
      if (gameState.isGameOver) return state;
      
      // If clicking on the same piece, deselect
      if (
        gameState.selectedPiece &&
        gameState.selectedPiece.row === position.row &&
        gameState.selectedPiece.col === position.col
      ) {
        return {
          ...state,
          gameState: {
            ...gameState,
            selectedPiece: null,
            validMoves: getAllValidMoves(gameState.board, gameState.turn)
          }
        };
      }
      
      // Get valid moves for this piece
      const validMoves = getValidMovesForPiece(gameState.board, position, gameState.turn);
      
      // Check if any captures are mandatory
      const allMoves = getAllValidMoves(gameState.board, gameState.turn);
      const hasCaptures = allMoves.some(m => m.captures && m.captures.length > 0);
      
      // If captures are mandatory and this piece has no captures, don't select
      if (hasCaptures && !validMoves.some(m => m.captures && m.captures.length > 0)) {
        return state;
      }
      
      if (validMoves.length > 0) {
        return {
          ...state,
          gameState: {
            ...gameState,
            selectedPiece: position,
            validMoves
          }
        };
      }
      
      return state;
    }
    
    case 'MAKE_MOVE': {
      const newGameState = makeMove(state.gameState, action.move);
      return {
        ...state,
        gameState: newGameState
      };
    }
    
    case 'UNDO': {
      // In vs computer mode, undo twice (player move + AI move)
      let newGameState = undo(state.gameState);
      if (state.settings.mode === 'vs-computer' && newGameState.historyIndex > 0) {
        newGameState = undo(newGameState);
      }
      return {
        ...state,
        gameState: newGameState
      };
    }
    
    case 'REDO': {
      const newGameState = redo(state.gameState);
      return {
        ...state,
        gameState: newGameState
      };
    }
    
    case 'NEW_GAME': {
      return {
        ...state,
        gameState: createInitialGameState()
      };
    }
    
    case 'SET_MODE': {
      return {
        ...state,
        settings: {
          ...state.settings,
          mode: action.mode,
          player2Name: action.mode === 'vs-computer' ? 'Computer' : 'Player 2'
        },
        gameState: createInitialGameState()
      };
    }
    
    case 'SET_PLAYER_NAMES': {
      return {
        ...state,
        settings: {
          ...state.settings,
          player1Name: action.player1,
          player2Name: action.player2
        }
      };
    }
    
    case 'SET_AI_DEPTH': {
      return {
        ...state,
        settings: {
          ...state.settings,
          aiDepth: action.depth
        }
      };
    }
    
    case 'LOAD_STATE': {
      return {
        ...state,
        gameState: action.state
      };
    }
    
    default:
      return state;
  }
}

// Context
interface GameContextValue {
  gameState: GameState;
  settings: GameSettings;
  selectPiece: (position: Position) => void;
  makeGameMove: (move: Move) => void;
  undoMove: () => void;
  redoMove: () => void;
  newGame: () => void;
  setMode: (mode: GameMode) => void;
  setPlayerNames: (player1: string, player2: string) => void;
  setAIDepth: (depth: number) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

// Storage key
const STORAGE_KEY = 'checkers-game-state';

// Provider component
export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState, (initial) => {
    // Try to load from localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          gameState: parsed.gameState || initial.gameState,
          settings: parsed.settings || initial.settings
        };
      }
    } catch (e) {
      console.error('Failed to load game state:', e);
    }
    return initial;
  });
  
  // Save to localStorage on state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        gameState: state.gameState,
        settings: state.settings
      }));
    } catch (e) {
      console.error('Failed to save game state:', e);
    }
  }, [state]);
  
  // AI move effect
  useEffect(() => {
    if (
      state.settings.mode === 'vs-computer' &&
      state.gameState.turn === -1 &&
      !state.gameState.isGameOver
    ) {
      const timeoutId = setTimeout(() => {
        const aiMove = getBestMove(
          state.gameState.board,
          -1,
          state.settings.aiDepth
        );
        if (aiMove) {
          dispatch({ type: 'MAKE_MOVE', move: aiMove });
        }
      }, 300); // Small delay to make it feel more natural
      
      return () => clearTimeout(timeoutId);
    }
  }, [state.gameState.turn, state.gameState.isGameOver, state.settings.mode, state.settings.aiDepth, state.gameState.board]);
  
  const selectPiece = useCallback((position: Position) => {
    dispatch({ type: 'SELECT_PIECE', position });
  }, []);
  
  const makeGameMove = useCallback((move: Move) => {
    dispatch({ type: 'MAKE_MOVE', move });
  }, []);
  
  const undoMove = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);
  
  const redoMove = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);
  
  const newGame = useCallback(() => {
    dispatch({ type: 'NEW_GAME' });
  }, []);
  
  const setMode = useCallback((mode: GameMode) => {
    dispatch({ type: 'SET_MODE', mode });
  }, []);
  
  const setPlayerNames = useCallback((player1: string, player2: string) => {
    dispatch({ type: 'SET_PLAYER_NAMES', player1, player2 });
  }, []);
  
  const setAIDepth = useCallback((depth: number) => {
    dispatch({ type: 'SET_AI_DEPTH', depth });
  }, []);
  
  const value: GameContextValue = {
    gameState: state.gameState,
    settings: state.settings,
    selectPiece,
    makeGameMove,
    undoMove,
    redoMove,
    newGame,
    setMode,
    setPlayerNames,
    setAIDepth
  };
  
  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

// Hook
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
