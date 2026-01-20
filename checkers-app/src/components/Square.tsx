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
        flex items-center justify-center
        relative cursor-pointer
        transition-colors duration-150
        ${isDark 
          ? 'bg-gray-800 hover:bg-gray-700' 
          : 'bg-gray-100'
        }
        ${isValidMove && !isCapture ? 'ring-2 ring-inset ring-gray-400' : ''}
        ${isCapture ? 'ring-2 ring-inset ring-black' : ''}
      `}
      style={{ aspectRatio: '1 / 1' }}
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={isDark ? 0 : -1}
      role="button"
      aria-label={`Square ${String.fromCharCode(65 + col)}${8 - row}${
        piece !== 0 ? ` with ${piece > 0 ? 'black' : 'white'} ${Math.abs(piece) === 2 ? 'king' : 'piece'}` : ''
      }${isValidMove ? ', valid move' : ''}`}
    >
      {/* Valid move indicator */}
      {isValidMove && piece === 0 && (
        <div 
          className={`
            absolute w-3 h-3 rounded-full
            ${isCapture ? 'bg-black' : 'bg-gray-400'}
          `}
          aria-hidden="true"
        />
      )}
      
      {/* Piece */}
      {piece !== 0 && <Piece piece={piece} isSelected={isSelected} />}
    </div>
  );
}
