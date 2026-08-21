export default function ResultModal({ result, timedOut, onClose, onExit }) {
  const failed = !result.correct;
  const title = failed ? (timedOut ? "Time's up!" : 'Bug still alive…') : 'Bug squashed! 🎉';

  return (
    <div className="modal-backdrop" onClick={onExit}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className={`modal-icon ${result.correct ? 'ok' : 'fail'}`}>
          {result.correct ? '✓' : '✗'}
        </div>
        <h2>{title}</h2>

        {result.correct ? (
          <div className="score-line">
            <span className="big-score">+{result.score} pts</span>
            <span className="streak">🔥 Streak ×{result.streak}</span>
          </div>
        ) : (
          <p className="feedback">{result.feedback}</p>
        )}

        {result.explanation && (
          <div className="explanation">
            <strong>What the bug was</strong>
            <p>{result.explanation}</p>
          </div>
        )}

        <div className="modal-actions">
          {result.correct || timedOut ? (
            <button className="btn btn-primary" onClick={onExit}>
              Back to challenges
            </button>
          ) : (
            <>
              <button className="btn btn-primary" onClick={onClose}>
                Try again
              </button>
              <button className="btn btn-ghost" onClick={onExit}>
                Give up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}