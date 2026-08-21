# 🐞 Bug Bounty Arena

A single-player bug-fixing web application: players are given buggy code (Web Dev + basic DSA),
identify and fix the issue inside a built-in code editor within a time limit, and earn a score
based on correctness, speed, hints used and winning streaks.

Built with **React (Vite) + CodeMirror** on the frontend and **Node.js/Express + SQLite** on the
backend. The submission API is server-authoritative: hidden test cases and answer patterns never
reach the browser.

---

## ✨ Features

- **Bug-fixing challenges** with a built-in CodeMirror code editor (HTML + JavaScript)
- **Timer** per challenge — auto-submits your code when it hits 00:00
- **Web Dev + basic DSA bugs**: 9 challenges — 3 Easy, 3 Medium, 3 Hard
- **Server-side validation**: DSA solutions run in a sandboxed Node `vm` against hidden test cases;
  Web Dev fixes are checked with must-include / must-not-include patterns
- **Scoring** based on correctness, time bonus, hint penalty, wrong-attempt penalty and streak bonus
- **Creative features**:
  - 🔥 **Streak multiplier** — consecutive correct answers add up to +25% bonus
  - 💡 **Progressive hints** — two hints per challenge, each costing 10% of base score
- **Leaderboard** — ranks hunters by total score (best solve per challenge counts once)
- **Clean, responsive dark UI** (desktop + mobile)

---

## 🗂 Project Structure