// Get references to things in your HTML
const flagImage = document.getElementById("flag-image");
const result = document.getElementById("result");
const buttons = [
  document.getElementById("answer1"),
  document.getElementById("answer2"),
  document.getElementById("answer3"),
  document.getElementById("answer4"),
];

// One simple question: the French flag
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

};

function setupQuestion() {
  // Show the flag
  flagImage.src = question.imageUrl;

  // Put answer text on the buttons
  question.answers.forEach((answerText, index) => {
    const btn = buttons[index];
    btn.textContent = answerText;

    // Remove any old click handler first
    btn.onclick = null;

    // Add new click handler
    btn.onclick = () => handleAnswer(index);
  });

  // Clear previous result text
  result.textContent = "";
}

function handleAnswer(selectedIndex) {
  if (selectedIndex === question.correctIndex) {
    result.textContent = "Correct!";
  } else {
    result.textContent = "Wrong. The correct answer is " + question.answers[question.correctIndex] + ".";
  }
}

// Run once when the page loads
setupQuestion();
