// ELEMENT REFERENCES
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const endScreen = document.getElementById("end-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

const flagImage = document.getElementById("flag-image");
const result = document.getElementById("result");
const buttons = [
  document.getElementById("answer1"),
  document.getElementById("answer2"),
  document.getElementById("answer3"),
  document.getElementById("answer4"),
];

const scoreDisplay = document.getElementById("score");
const questionNumberDisplay = document.getElementById("question-number");
const questionTotalDisplay = document.getElementById("question-total");
const finalScoreDisplay = document.getElementById("final-score");
const reviewContainer = document.getElementById("review");
const roundsInput = document.getElementById("rounds-input");

// DATA
// Assumes Bhutan.svg is in the same folder as index.html
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
  },
  {
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg",
    answers: ["Ireland", "Italy", "India", "Niger"],
    correctIndex: 2
  }
];

// Set initial max and default for rounds input (based on data length)
roundsInput.max = questions.length.toString();
roundsInput.value = questions.length.toString();
questionTotalDisplay.textContent = questions.length.toString();

// STATE
let score = 0;
let order = [];
let currentIndex = 0;   // index into "order"
let totalRounds = questions.length;
let currentRound = 0;   // how many questions have been played so far
let currentAnswers = []; // shuffled answers for current question
let wrongQuestions = []; // list of wrong answers for review

// UTILS
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  }
}

function buildShuffledAnswers(question) {
  const arr = question.answers.map((text, idx) => ({
    text,
    isCorrect: idx === question.correctIndex
  }));
  shuffle(arr);
  return arr;
}

function getCurrentQuestion() {
  const qIndex = order[currentIndex];
  return questions[qIndex];
}

// UI FLOW
function showStartScreen() {
  startScreen.classList.remove("hidden");
  quizScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
}

function showQuizScreen() {
  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  endScreen.classList.add("hidden");
}

function showEndScreen() {
  startScreen.classList.add("hidden");
  quizScreen.classList.add("hidden");
  endScreen.classList.remove("hidden");

  finalScoreDisplay.textContent = `${score} / ${totalRounds}`;

  // Build review of wrong answers
  reviewContainer.innerHTML = "";
  if (wrongQuestions.length === 0) {
    reviewContainer.textContent = "You answered all questions correctly.";
  } else {
    const intro = document.createElement("p");
    intro.textContent = "You missed these:";
    reviewContainer.appendChild(intro);

    const list = document.createElement("ul");
    list.classList.add("review-list");

    wrongQuestions.forEach(item => {
      const li = document.createElement("li");

      const nameSpan = document.createElement("span");
      nameSpan.classList.add("review-flag-name");
      nameSpan.textContent = item.correct;

      const text = document.createElement("span");
      text.textContent = ` — you answered: ${item.chosen}`;

      li.appendChild(nameSpan);
      li.appendChild(text);
      list.appendChild(li);
    });

    reviewContainer.appendChild(list);
  }
}

// MAIN QUIZ LOGIC
function startQuiz() {
  // Score and state
  score = 0;
  scoreDisplay.textContent = "0";
  wrongQuestions = [];

  // Determine number of rounds from settings
  const requested = parseInt(roundsInput.value, 10);
  if (!Number.isFinite(requested) || requested < 1) {
    totalRounds = questions.length;
  } else {
    totalRounds = Math.min(requested, questions.length);
  }
  questionTotalDisplay.textContent = totalRounds.toString();

  // Order of questions
  order = Array.from(questions.keys());
  shuffle(order);
  currentIndex = 0;
  currentRound = 0;

  showQuizScreen();
  loadCurrentQuestion();
}

function loadCurrentQuestion() {
  // If we've already played enough rounds, end
  if (currentRound >= totalRounds || currentIndex >= order.length) {
    showEndScreen();
    return;
  }

  const q = getCurrentQuestion();
  currentAnswers = buildShuffledAnswers(q);

  // Question number is 1-based
  questionNumberDisplay.textContent = (currentRound + 1).toString();

  // Show flag
  flagImage.src = q.imageUrl;
  result.textContent = "";
  nextBtn.disabled = true;

  // Reset and wire buttons
  buttons.forEach((btn, i) => {
    const answerData = currentAnswers[i];
    btn.textContent = answerData.text;
    btn.disabled = false;
    btn.classList.remove("correct", "wrong");

    btn.onclick = () => handleAnswer(i);
  });
}

function handleAnswer(buttonIndex) {
  const q = getCurrentQuestion();
  const answerData = currentAnswers[buttonIndex];
  const isCorrect = answerData.isCorrect;

  // Disable all buttons
  buttons.forEach(btn => {
    btn.disabled = true;
  });

  // Mark selected button
  const selectedBtn = buttons[buttonIndex];
  if (isCorrect) {
    selectedBtn.classList.add("correct");
    result.textContent = "Correct!";
    score++;
    scoreDisplay.textContent = score.toString();
  } else {
    selectedBtn.classList.add("wrong");
    result.textContent = "Wrong.";

    // Record wrong answer for review
    wrongQuestions.push({
      correct: q.answers[q.correctIndex],
      chosen: answerData.text,
      imageUrl: q.imageUrl
    });
  }

  // Highlight the correct one
  currentAnswers.forEach((ans, i) => {
    if (ans.isCorrect) {
      buttons[i].classList.add("correct");
    }
  });

  nextBtn.disabled = false;
}

function goToNextQuestion() {
  currentRound++;
  currentIndex++;

  if (currentRound >= totalRounds || currentIndex >= order.length) {
    showEndScreen();
  } else {
    loadCurrentQuestion();
  }
}

// EVENT WIRING
startBtn.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", goToNextQuestion);

// INITIAL
showStartScreen();
