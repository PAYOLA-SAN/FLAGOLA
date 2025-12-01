// Get references to elements in index.html
const flagImage = document.getElementById("flag-image");
const result = document.getElementById("result");
const buttons = [
  document.getElementById("answer1"),
  document.getElementById("answer2"),
  document.getElementById("answer3"),
  document.getElementById("answer4"),
];

// SCORE
let score = 0;
const scoreDisplay = document.getElementById("score");

// List of quiz questions
const questions = [
  {
    imageUrl: "Bhutan.svg",
    answers: ["Bhutan", "Nepal", "Sri Lanka", "India"],
    correctIndex: 0
  },
  {
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg",
    answers: ["France", "Germany", "Italy", "Spain"],
    correctIndex: 0
  },
  {
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/b/ba/Flag_of_Germany.svg",
    answers: ["France", "Germany", "Italy", "Spain"],
    correctIndex: 1
  }
];

// Shuffle helper for random order of questions
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

// order = [0,1,2] but shuffled, e.g. [2,0,1]
let order = Array.from(questions.keys());
shuffle(order);

let currentIndex = 0;

function getCurrentQuestion() {
  const questionIndex = order[currentIndex];
  return questions[questionIndex];
}

function setupQuestion() {
  const q = getCurrentQuestion();

  // Show the flag image
  flagImage.src = q.imageUrl;

  // Set button text and click handlers
  q.answers.forEach((answerText, index) => {
    const btn = buttons[index];
    btn.textContent = answerText;
    btn.onclick = () => handleAnswer(index);
  });

  // Clear previous result
  result.textContent = "";
}

function handleAnswer(selectedIndex) {
  const q = getCurrentQuestion();

  if (selectedIndex === q.correctIndex) {
    result.textContent = "Correct!";
    score++;                          // add 1 point
    scoreDisplay.textContent = score; // update score on page
  } else {
    result.textContent = "Wrong. Correct answer: " + q.answers[q.correctIndex];
  }

  // move to next question after short delay
  setTimeout(() => {
    currentIndex++;

    // If we reached the end, reshuffle and start again
    if (currentIndex >= order.length) {
      shuffle(order);
      currentIndex = 0;
    }

    setupQuestion();
  }, 1200);
}

// Start the quiz
setupQuestion();
