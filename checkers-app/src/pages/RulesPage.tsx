import { Link } from 'react-router-dom';
import { Container, Button, Card } from '../components/ui';

export function RulesPage() {
  return (
    <Container maxWidth="md" className="py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Rules</h1>
        <p className="text-gray-600">Learn how to play Checkers</p>
      </div>
      
      <div className="space-y-6">
        {/* Objective */}
        <Card variant="default" padding="lg">
          <h2 className="text-xl font-semibold mb-3">Objective</h2>
          <p className="text-gray-700">
            The goal is to capture all of your opponent's pieces or block them so they cannot make any moves. 
            The player who achieves either of these conditions first wins the game.
          </p>
        </Card>
        
        {/* Setup */}
        <Card variant="default" padding="lg">
          <h2 className="text-xl font-semibold mb-3">Setup</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex gap-3">
              <span className="text-gray-400">•</span>
              <span>Each player starts with 12 pieces placed on the dark squares of the three rows closest to them.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gray-400">•</span>
              <span>Black pieces (Player 1) always move first.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gray-400">•</span>
              <span>Pieces can only move on dark squares.</span>
            </li>
          </ul>
        </Card>
        
        {/* Basic Movement */}
        <Card variant="default" padding="lg">
          <h2 className="text-xl font-semibold mb-3">Basic Movement</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex gap-3">
              <span className="text-gray-400">•</span>
              <span>Regular pieces move diagonally forward one square at a time.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gray-400">•</span>
              <span>Pieces can only move to empty squares.</span>
            </li>
          </ul>
        </Card>
        
        {/* Capturing */}
        <Card variant="default" padding="lg">
          <h2 className="text-xl font-semibold mb-3">Capturing</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex gap-3">
              <span className="text-gray-400">•</span>
              <span>To capture, jump over an opponent's piece diagonally to an empty square beyond it.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gray-400">•</span>
              <span><strong>Captures are mandatory.</strong> If you can capture, you must.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gray-400">•</span>
              <span>Multiple captures can be made in a single turn if possible (chain jumps).</span>
            </li>
          </ul>
        </Card>
        
        {/* Kings */}
        <Card variant="outlined" padding="lg">
          <h2 className="text-xl font-semibold mb-3">Kings</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex gap-3">
              <span className="text-gray-400">•</span>
              <span>When a piece reaches the opposite end of the board, it becomes a King.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gray-400">•</span>
              <span>Kings can move and capture both forward and backward diagonally.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gray-400">•</span>
              <span>Kings are marked with a crown symbol (♔).</span>
            </li>
          </ul>
        </Card>
        
        {/* Winning */}
        <Card variant="default" padding="lg">
          <h2 className="text-xl font-semibold mb-3">Winning the Game</h2>
          <p className="text-gray-700 mb-3">You win by:</p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex gap-3">
              <span className="text-gray-400">1.</span>
              <span>Capturing all of your opponent's pieces, or</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gray-400">2.</span>
              <span>Blocking your opponent so they have no legal moves.</span>
            </li>
          </ul>
        </Card>
      </div>
      
      {/* CTA */}
      <div className="mt-12 text-center">
        <p className="text-gray-500 mb-4">Ready to play?</p>
        <Link to="/">
          <Button variant="primary" size="lg">
            Start a Game
          </Button>
        </Link>
      </div>
    </Container>
  );
}
