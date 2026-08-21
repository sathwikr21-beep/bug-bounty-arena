import { useEffect, useState } from 'react';
import { fetchLeaderboard } from '../api';

export default function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard()
      .then(setRows)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="leaderboard">
      <h2>🏆 Leaderboard</h2>
      <p className="muted">
        Ranked by total score — each player's best solve per challenge counts once.
      </p>
      {loading ? (
        <p className="muted">Loading…</p>
      ) : error ? (
        <p className="error-banner">⚠ {error}</p>
      ) : rows.length === 0 ? (
        <p className="muted">No scores yet — be the first hunter!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Hunter</th>
              <th>Solved</th>
              <th>Best streak</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.name}>
                <td className={`rank${i === 0 ? ' rank-1' : ''}`}>{i + 1}</td>
                <td>{r.name}</td>
                <td>{r.solved}</td>
                <td>{r.best_streak}</td>
                <td className="score">{r.total_score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}