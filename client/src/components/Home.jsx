import { useState } from 'react';

const DIFF_LABELS = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
const CATEGORY_LABELS = { webdev: 'Web Dev', dsa: 'DSA' };

export default function Home({ challenges, loading, error, playerName, onNameChange, onStart }) {
  const [name, setName] = useState(playerName);

  const save = (e) => {
    e.preventDefault();
    if (name.trim()) onNameChange(name.trim());
  };

  const count = (d) => challenges.filter((c) => c.difficulty === d).length;

  return (
    <div className="home">
      <section className="hero">
        <h1>
          Hunt the bug. Beat the clock. <span className="accent">Claim the bounty.</span>
        </h1>
        <p>
          Every challenge contains a buggy snippet. Find the flaw, fix it in the built-in editor,
          and submit before the timer runs out. Faster fixes, fewer hints and winning streaks
          earn bigger bounties.
        </p>
        <form className="name-form" onSubmit={save}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your hunter name…"
            maxLength={30}
            required
          />
          <button type="submit" className="btn btn-primary">
            {playerName ? 'Update name' : 'Save name'}
          </button>
        </form>
        {!playerName && <p className="muted note">Save a name to start hunting.</p>}
      </section>

      <section className="challenges">
        <div className="section-head">
          <h2>Challenges</h2>
          <span className="count">
            {challenges.length} available · {count('easy')} easy · {count('medium')} medium ·{' '}
            {count('hard')} hard
          </span>
        </div>

        {loading ? (
          <p className="muted">Loading challenges…</p>
        ) : error ? (
          <p className="error-banner">⚠ {error}</p>
        ) : (
          <div className="card-grid">
            {challenges.map((c) => (
              <article className="card" key={c.id}>
                <div className="card-tags">
                  <span className={`tag diff-${c.difficulty}`}>{DIFF_LABELS[c.difficulty]}</span>
                  <span className="tag cat">{CATEGORY_LABELS[c.category]}</span>
                </div>
                <h3>{c.title}</h3>
                <p>{c.description}</p>
                <div className="card-meta">
                  <span>💎 {c.points} pts</span>
                  <span>⏱ {Math.round(c.timeLimit / 60)} min</span>
                </div>
                <button
                  className="btn btn-primary btn-block"
                  disabled={!playerName}
                  onClick={() => onStart(c)}
                >
                  {playerName ? 'Start hunt' : 'Enter a name to start'}
                </button>
              </article>
            ))}
          </div>
        )}

        <div className="scoring-note">
          <strong>How scoring works:</strong> base points (100 / 200 / 300 by difficulty)
          + up to <code>+50%</code> time bonus − <code>10%</code> per hint used −{' '}
          <code>10%</code> per previous wrong attempt on that challenge + <code>5%</code> per
          consecutive correct answer (max <code>+25%</code>). The leaderboard ranks your{' '}
          <em>best</em> solve of each challenge.
        </div>
      </section>
    </div>
  );
}