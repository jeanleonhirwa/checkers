import { Container } from '../ui';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-auto">
      <Container maxWidth="xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Checkers. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-gray-400">
              Red moves first • Captures are mandatory
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
