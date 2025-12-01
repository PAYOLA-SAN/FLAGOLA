// Get references to elements in index.html
const flagImage = document.getElementById("flag-image");
const result = document.getElementById("result");
const buttons = [
  document.getElementById("answer1"),
  document.getElementById("answer2"),
  document.getElementById("answer3"),
  document.getElementById("answer4"),
];

// List of quiz questions
const questions = [
  {
    imageUrl: "bhutan.svg",
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

let currentIndex = 0;

function setupQuestion() {
  const q = questions[currentIndex];

  // Show the flag image
  flagImage.src = q.imageUrl;

  // Set button text and click handlers
  q.answers.forEach((answerText, index) => {
    const btn = buttons[index];
    btn.textContent = answerText;

    // Remove old handler and set new one
    btn.onclick = () => handleAnswer(index);
  });

  // Clear previous result
  result.textContent = "";
}

function handleAnswer(selectedIndex) {
  const q = questions[currentIndex];

  if (selectedIndex === q.correctIndex) {
    result.textContent = "Correct!";
  } else {
    result.textContent = "Wrong. Correct answer: " + q.answers[q.correctIndex];
  }

  // Move to the next question after 1.2 seconds
  setTimeout(() => {
    currentIndex++;
    if (currentIndex >= questions.length) {
      currentIndex = 0; // restart from first question
    }
    setupQuestion();
  }, 1200);
}

// Start the quiz
setupQuestion();
