import { Piece } from './Piece';

interface SquareProps {
  row: number;
  col: number;
  piece: number;
  isSelected: boolean;
  isValidMove: boolean;
  isCapture: boolean;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function Square({
  row,
  col,
  piece,
  isSelected,
  isValidMove,
  isCapture,
  onClick,
  onKeyDown
}: SquareProps) {
  const isDark = (row + col) % 2 === 1;
  
  return (
    <div
      className={`
        aspect-square flex items-center justify-center
        relative cursor-pointer
        transition-colors duration-150
        ${isDark 
          ? 'bg-emerald-800 hover:bg-emerald-700' 
          : 'bg-amber-100'
        }
        ${isValidMove && !isCapture ? 'ring-2 ring-inset ring-green-400' : ''}
        ${isCapture ? 'ring-2 ring-inset ring-red-400' : ''}
      `}
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={isDark ? 0 : -1}
      role="button"
      aria-label={`Square ${String.fromCharCode(65 + col)}${8 - row}${
        piece !== 0 ? ` with ${piece > 0 ? 'red' : 'white'} ${Math.abs(piece) === 2 ? 'king' : 'piece'}` : ''
      }${isValidMove ? ', valid move' : ''}`}
    >
      {/* Valid move indicator */}
      {isValidMove && piece === 0 && (
        <div 
          className={`
            absolute w-4 h-4 rounded-full
            ${isCapture ? 'bg-red-400/60' : 'bg-green-400/60'}
          `}
          aria-hidden="true"
        />
      )}
      
      {/* Piece */}
      {piece !== 0 && <Piece piece={piece} isSelected={isSelected} />}
    </div>
  );
}
