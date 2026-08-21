const BASE_POINTS = { easy: 100, medium: 200, hard: 300 };
const TIME_BONUS_MAX_PCT = 50;   // up to +50% for finishing instantly
const HINT_PENALTY_PCT = 10;     // -10% per hint used
const WRONG_PENALTY_PCT = 10;    // -10% per previous wrong attempt on this challenge
const STREAK_BONUS_PCT = 5;      // +5% per consecutive correct answer
const STREAK_CAP = 5;            // streak bonus capped at +25%

function computeScore({ difficulty, timeLimit, timeTaken, hintsUsed, wrongAttempts, streakBefore }) {
  const base = BASE_POINTS[difficulty] || 100;
  const timeRatio = Math.max(0, Math.min(1, timeTaken / timeLimit));
  const timeBonus = Math.round(base * (TIME_BONUS_MAX_PCT / 100) * (1 - timeRatio));
  const hintPenalty = Math.round(base * (HINT_PENALTY_PCT / 100) * hintsUsed);
  const wrongPenalty = Math.round(base * (WRONG_PENALTY_PCT / 100) * wrongAttempts);
  const streakBonus = Math.round(base * (STREAK_BONUS_PCT / 100) * Math.min(streakBefore, STREAK_CAP));
  return Math.max(0, base + timeBonus - hintPenalty - wrongPenalty + streakBonus);
}

module.exports = { computeScore };