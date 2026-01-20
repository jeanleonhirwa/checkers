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
          ? 'bg-black border-2 border-gray-600' 
          : 'bg-white border-2 border-gray-300'
        }
        shadow-md
        ${isSelected ? 'ring-4 ring-gray-400 ring-opacity-75 scale-105' : ''}
      `}
      role="img"
      aria-label={`${isPlayer1 ? 'Black' : 'White'} ${isKing ? 'king' : 'piece'}`}
    >
      {isKing && (
        <span 
          className={`text-lg font-bold select-none ${isPlayer1 ? 'text-white' : 'text-black'}`} 
          aria-hidden="true"
        >
          ♔
        </span>
      )}
    </div>
  );
}
