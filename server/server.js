const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./db');
const challenges = require('./challenges');
const { validateSubmission, MAX_CODE_LENGTH } = require('./validator');
const { computeScore } = require('./scoring');

const app = express();
app.use(cors());
app.use(express.json({ limit: '200kb' }));

const publicChallenge = ({ validation, ...rest }) => rest; // never leak test cases

function getOrCreatePlayer(name) {
  let player = db.prepare('SELECT * FROM players WHERE name = ?').get(name);
  if (!player) {
    db.prepare('INSERT INTO players (name) VALUES (?)').run(name);
    player = db.prepare('SELECT * FROM players WHERE name = ?').get(name);
  }
  return player;
}

// ── API ────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ ok: true }));

app.get('/api/challenges', (req, res) => {
  res.json(challenges.map(publicChallenge));
});

app.get('/api/challenges/:id', (req, res) => {
  const c = challenges.find((x) => x.id === req.params.id);
  if (!c) return res.status(404).json({ error: 'Challenge not found' });
  res.json(publicChallenge(c));
});

app.post('/api/challenges/:id/submit', (req, res) => {
  const c = challenges.find((x) => x.id === req.params.id);
  if (!c) return res.status(404).json({ error: 'Challenge not found' });

  const { playerName, code, timeTaken, hintsUsed = 0 } = req.body || {};
  const name = String(playerName || '').trim().slice(0, 30);
  if (!name) return res.status(400).json({ error: 'A player name is required.' });
  if (typeof code !== 'string') return res.status(400).json({ error: 'code is required.' });
  if (!Number.isFinite(timeTaken) || timeTaken < 0 || timeTaken > c.timeLimit + 5) {
    return res.status(400).json({ error: 'Invalid timeTaken.' });
  }
  const hints = Math.max(0, Math.min(2, Math.round(hintsUsed)));

  const player = getOrCreatePlayer(name);
  const validation = validateSubmission(c, code);

  const wrongAttempts = db
    .prepare('SELECT COUNT(*) AS n FROM submissions WHERE player_id = ? AND challenge_id = ? AND correct = 0')
    .get(player.id, c.id).n;

  let score = 0;
  let streak = 0;
  if (validation.correct) {
    score = computeScore({
      difficulty: c.difficulty,
      timeLimit: c.timeLimit,
      timeTaken: Math.round(timeTaken),
      hintsUsed: hints,
      wrongAttempts,
      streakBefore: player.current_streak,
    });
    streak = player.current_streak + 1;
    db.prepare('UPDATE players SET current_streak = ?, best_streak = MAX(best_streak, ?) WHERE id = ?')
      .run(streak, streak, player.id);
  } else {
    db.prepare('UPDATE players SET current_streak = 0 WHERE id = ?').run(player.id);
  }

  db.prepare(
    `INSERT INTO submissions (player_id, challenge_id, code, correct, score, time_taken, hints_used)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(player.id, c.id, code.slice(0, MAX_CODE_LENGTH), validation.correct ? 1 : 0, score, Math.round(timeTaken), hints);

  res.json({
    correct: validation.correct,
    score,
    streak,
    feedback: validation.feedback,
    explanation: validation.correct ? c.explanation : null,
  });
});

app.get('/api/leaderboard', (req, res) => {
  const rows = db
    .prepare(
      `SELECT p.name,
              p.best_streak,
              COUNT(b.challenge_id) AS solved,
              SUM(b.best_score)    AS total_score
       FROM players p
       JOIN (SELECT player_id, challenge_id, MAX(score) AS best_score
             FROM submissions WHERE correct = 1
             GROUP BY player_id, challenge_id) b
         ON b.player_id = p.id
       GROUP BY p.id
       ORDER BY total_score DESC, solved DESC
       LIMIT 20`
    )
    .all();
  res.json(rows);
});

// ── serve built frontend (if present) ──────────────────
const dist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Bug Bounty Arena API on http://localhost:${PORT}`));