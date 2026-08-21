const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'arena.db'));
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS players (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT UNIQUE NOT NULL,
  current_streak INTEGER NOT NULL DEFAULT 0,
  best_streak   INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS submissions (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id    INTEGER NOT NULL REFERENCES players(id),
  challenge_id TEXT NOT NULL,
  code         TEXT NOT NULL,
  correct      INTEGER NOT NULL,
  score        INTEGER NOT NULL DEFAULT 0,
  time_taken   INTEGER NOT NULL,
  hints_used   INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_submissions_player ON submissions(player_id, challenge_id);
`);

module.exports = db;