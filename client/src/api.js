const API = 'http://bug-bounty-arena007.onrender.com/api';

export async function fetchChallenges() {
  const res = await fetch(`${API}/challenges`);
  if (!res.ok) throw new Error('Failed to load challenges');
  return res.json();
}

export async function fetchLeaderboard() {
  const res = await fetch(`${API}/leaderboard`);
  if (!res.ok) throw new Error('Failed to load leaderboard');
  return res.json();
}

export async function submitSolution({ challengeId, playerName, code, timeTaken, hintsUsed }) {
  const res = await fetch(`${API}/challenges/${challengeId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerName, code, timeTaken, hintsUsed }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Submission failed');
  return data;
}