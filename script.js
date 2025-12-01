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

questionTotalDisplay.textContent = questions.length.toString();

// STATE
let score = 0;
let order = [];
let currentIndex = 0;
let currentAnswers = []; // shuffled answers for current question

// UTILS
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  }
}

// BUILD SHUFFLED ANSWERS FOR A QUESTION
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
  finalScoreDisplay.textContent = score.toString();
}

// MAIN QUIZ LOGIC
function startQuiz() {
  // init state
  score = 0;
  scoreDisplay.textContent = "0";

  order = Array.from(questions.keys());
  shuffle(order);
  currentIndex = 0;

  showQuizScreen();
  loadCurrentQuestion();
}

function loadCurrentQuestion() {
  const q = getCurrentQuestion();
  currentAnswers = buildShuffledAnswers(q);

  // question number (1-based)
  questionNumberDisplay.textContent = (currentIndex + 1).toString();

  // show flag
  flagImage.src = q.imageUrl;
  result.textContent = "";
  nextBtn.disabled = true;

  // reset buttons
  buttons.forEach((btn, i) => {
    const answerData = currentAnswers[i];
    btn.textContent = answerData.text;
    btn.disabled = false;
    btn.classList.remove("correct", "wrong");

    btn.onclick = () => handleAnswer(i);
  });
}

function handleAnswer(buttonIndex) {
  const answerData = currentAnswers[buttonIndex];
  const isCorrect = answerData.isCorrect;

  // disable all buttons
  buttons.forEach(btn => {
    btn.disabled = true;
  });

  // mark selected button
  const selectedBtn = buttons[buttonIndex];
  if (isCorrect) {
    selectedBtn.classList.add("correct");
    result.textContent = "Correct!";
    score++;
    scoreDisplay.textContent = score.toString();
  } else {
    selectedBtn.classList.add("wrong");
    result.textContent = "Wrong.";
  }

  // highlight the correct one
  currentAnswers.forEach((ans, i) => {
    if (ans.isCorrect) {
      buttons[i].classList.add("correct");
    }
  });

  nextBtn.disabled = false;
}

function goToNextQuestion() {
  currentIndex++;
  if (currentIndex >= order.length) {
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
