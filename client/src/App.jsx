import { useEffect, useState } from 'react';
import Home from './components/Home';
import Arena from './components/Arena';
import Leaderboard from './components/Leaderboard';
import { fetchChallenges } from './api';

const VIEWS = { home: 'home', arena: 'arena', leaderboard: 'leaderboard' };

export default function App() {
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('bba_name') || '');
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState(VIEWS.home);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchChallenges()
      .then(setChallenges)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const saveName = (name) => {
    localStorage.setItem('bba_name', name);
    setPlayerName(name);
  };

  const startChallenge = (challenge) => {
    setSelected(challenge);
    setView(VIEWS.arena);
  };

  const exitArena = () => {
    setSelected(null);
    setView(VIEWS.home);
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="logo" onClick={() => setView(VIEWS.home)}>
          <span className="logo-icon">🐞</span> Bug Bounty Arena
        </div>
        <nav>
          <button
            className={view === VIEWS.home ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setView(VIEWS.home)}
          >
            Challenges
          </button>
          <button
            className={view === VIEWS.leaderboard ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setView(VIEWS.leaderboard)}
          >
            Leaderboard
          </button>
        </nav>
        {playerName && <div className="player-badge">👤 {playerName}</div>}
      </header>

      <main className="main">
        {view === VIEWS.home && (
          <Home
            challenges={challenges}
            loading={loading}
            error={error}
            playerName={playerName}
            onNameChange={saveName}
            onStart={startChallenge}
          />
        )}
        {view === VIEWS.arena && selected && (
          <Arena key={selected.id} challenge={selected} playerName={playerName} onExit={exitArena} />
        )}
        {view === VIEWS.leaderboard && <Leaderboard />}
      </main>
    </div>
  );
}