import { useEffect, useRef, useState } from 'react';
import CodeEditor from './CodeEditor';
import ResultModal from './ResultModal';
import { submitSolution } from '../api';

const HINT_PENALTY_PCT = 10; // must match server scoring.js
const DIFF_LABELS = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };

export default function Arena({ challenge, playerName, onExit }) {
  const [code, setCode] = useState(challenge.buggyCode);
  const [timeLeft, setTimeLeft] = useState(challenge.timeLimit);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submit = async (finalTimeLeft = timeLeft) => {
    if (submitting || (result && result.correct)) return;
    setSubmitting(true);
    setError('');
    try {
      const data = await submitSolution({
        challengeId: challenge.id,
        playerName,
        code,
        timeTaken: challenge.timeLimit - finalTimeLeft,
        hintsUsed,
      });
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  // keep the countdown callback fresh without restarting the interval
  const submitRef = useRef(submit);
  useEffect(() => {
    submitRef.current = submit;
  });

  // countdown → auto-submit at 0; paused while the verdict modal is open
  useEffect(() => {
    if (result) return;
    if (timeLeft <= 0) {
      submitRef.current(0);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, result]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const timedOut = timeLeft <= 0;

  return (
    <div className="arena">
      <div className="arena-head">
        <button className="btn btn-ghost" onClick={onExit}>
          ← All challenges
        </button>
        <div className="arena-meta">
          <span className={`tag diff-${challenge.difficulty}`}>{DIFF_LABELS[challenge.difficulty]}</span>
          <h2>{challenge.title}</h2>
        </div>
        <div className={`timer${timeLeft < 30 ? ' danger' : ''}`}>{formatTime(timeLeft)}</div>
      </div>

      <div className="arena-body">
        <aside className="panel desc-panel">
          <h3>Mission briefing</h3>
          <p>{challenge.description}</p>
          <div className="meta-row">
            <span>💎 {challenge.points} pts</span>
            <span>⏱ {Math.round(challenge.timeLimit / 60)} min</span>
            <span>🧩 {challenge.category === 'dsa' ? 'DSA' : 'Web Dev'}</span>
          </div>

          <h3>
            Hints <span className="hint-note">(−{HINT_PENALTY_PCT}% base score each)</span>
          </h3>
          <div className="hints">
            {hintsUsed >= 1 && <p className="hint-text">💡 {challenge.hints[0]}</p>}
            {hintsUsed >= 2 && <p className="hint-text">💡 {challenge.hints[1]}</p>}
            <button
              className="btn btn-ghost btn-sm"
              disabled={hintsUsed >= challenge.hints.length || (result && result.correct)}
              onClick={() => setHintsUsed((h) => h + 1)}
            >
              {hintsUsed === 0 ? 'Reveal hint 1' : hintsUsed === 1 ? 'Reveal hint 2' : 'All hints revealed'}
            </button>
          </div>
        </aside>

        <div className="panel editor-panel">
          <div className="editor-bar">
            <span className="filename">
              {challenge.language === 'html' ? 'index.html' : 'solution.js'}
            </span>
            <button className="btn btn-ghost btn-sm" onClick={() => setCode(challenge.buggyCode)}>
              Reset code
            </button>
          </div>

          <CodeEditor value={code} onChange={setCode} language={challenge.language} />

          <div className="editor-actions">
            <span className="muted">
              {submitting ? '⏳ Judging your fix…' : 'Your fix is judged by hidden test cases.'}
            </span>
            <button
              className="btn btn-primary"
              onClick={() => submit()}
              disabled={submitting || (result && result.correct)}
            >
              Submit fix
            </button>
          </div>
          {error && <p className="error-banner">⚠ {error}</p>}
        </div>
      </div>

      {result && (
        <ResultModal result={result} timedOut={timedOut} onClose={() => setResult(null)} onExit={onExit} />
      )}
    </div>
  );
}