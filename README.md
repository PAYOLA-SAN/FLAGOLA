# Flagola Flag Guessing Game

An interactive flag guessing game built with static HTML, CSS, and JavaScript. Look at the displayed flag, pick the correct country from four options, and rack up a streak.

## Project structure

- `index.html` — renders the main layout, score display, and controls.
- `style.css` — styles the responsive card layout, buttons, and flag area.
- `script.js` — shuffles questions, handles answer selection, tracks score/streak, and shows results.

## Getting started

1. Clone this repository.
2. Open `index.html` directly in your browser, or serve the folder with any static host (e.g., `python -m http.server 8000`).
3. Click a choice to answer, then advance with **Next question** or **See results**.

## Gameplay notes

- Each correct answer grants 10 points; incorrect answers reset your streak.
- Facts about each flag appear after you answer.
- Use **Restart** anytime for a fresh, shuffled run.
