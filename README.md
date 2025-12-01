+# Flagola Flag Guessing Game
+
+A lightweight static front-end for a flag guessing experience. The app was originally structured as a simple HTML page styled with CSS and wired up to a `script.js` entry point for flag selection and scoring logic. It is intended to be easy to serve from any static host or by simply opening `index.html` directly in the browser.
+
+## Project structure
+
+- `index.html` — renders the main flag prompt, multiple-choice answers, and navigation controls.
+- `style.css` — styles the layout with centered content, elevated cards, and responsive spacing.
+- `script.js` — expected client-side logic to load flag data, evaluate answers, and progress through the quiz.
+
+## Getting started
+
+1. Clone this repository.
+2. Restore or create the static assets (for example `index.html`, `style.css`, and `script.js`).
+3. Open `index.html` in your browser, or serve the folder with any static server (e.g., `python -m http.server 8000`).
+
+## Development notes
+
+The UI was designed around a clean card layout for readability. When adding functionality, keep the markup minimal and ensure button states (like the disabled "Next question" button) are toggled by your JavaScript to guide the user through the quiz flow.
 
EOF
)
