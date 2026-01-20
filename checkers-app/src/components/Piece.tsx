
interface PieceProps {
  piece: number;
  isSelected?: boolean;
}

export function Piece({ piece, isSelected }: PieceProps) {
  if (piece === 0) return null;
  
  const isPlayer1 = piece > 0;
  const isKing = Math.abs(piece) === 2;
  
  return (
    <div
      className={`
        w-[80%] h-[80%] rounded-full
        flex items-center justify-center
        transition-all duration-200
        ${isPlayer1 
          ? 'bg-gradient-to-br from-red-400 to-red-600 shadow-red-900/50' 
          : 'bg-gradient-to-br from-gray-200 to-gray-400 shadow-gray-900/50'
        }
        shadow-lg
        ${isSelected ? 'ring-4 ring-yellow-400 ring-opacity-75 scale-105' : ''}
        ${isKing ? 'border-2 border-yellow-400' : ''}
      `}
      role="img"
      aria-label={`${isPlayer1 ? 'Red' : 'White'} ${isKing ? 'king' : 'piece'}`}
    >
      {isKing && (
        <span className="text-yellow-400 text-lg font-bold select-none" aria-hidden="true">
          ♔
        </span>
      )}
    </div>
  );
}
