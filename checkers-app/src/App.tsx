import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { Layout } from './components/layout';
import { HomePage, GamePage, RulesPage, SettingsPage } from './pages';

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="play" element={<GamePage />} />
            <Route path="rules" element={<RulesPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;
