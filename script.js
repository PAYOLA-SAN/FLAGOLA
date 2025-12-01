// ELEMENT REFERENCES
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const endScreen = document.getElementById("end-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const tryAgainBtn = document.getElementById("try-again-btn");
const mainMenuBtn = document.getElementById("main-menu-btn");

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
const dataStatus = document.getElementById("data-status");

const roundButtons = Array.from(document.querySelectorAll(".round-btn"));
const continentButtons = Array.from(document.querySelectorAll(".continent-btn"));

// DATA FROM API
let allCountries = []; // { name, imageUrl, region, subregion }
let dataReady = false;

// SETTINGS STATE
let selectedRounds = "ALL";
let continentFilters = {
  africa: true,
  asia: true,
  europe: true,
  north_america: true,
  south_america: true,
  oceania: true
};

// GAME STATE
let score = 0;
let questionPool = [];   // built from filtered countries
let questionOrder = [];  // shuffled indices into questionPool
let currentIndex = 0;    // index in questionOrder
let totalRounds = 0;
let currentAnswers = []; // shuffled answers for current question
let wrongQuestions = []; // for review

// UTILITIES
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  }
}

function continentTag(country) {
  // country.region: Africa, Americas, Asia, Europe, Oceania, Antarctic
  // country.subregion: e.g. "South America", "North America", "Caribbean"
  switch (country.region) {
    case "Africa":
      return "africa";
    case "Asia":
      return "asia";
    case "Europe":
      return "europe";
    case "Oceania":
      return "oceania";
    case "Americas":
      if (country.subregion === "South America") return "south_america";
      // treat all other Americas as North America for this quiz
      return "north_america";
    default:
      return null;
  }
}

// FETCH COUNTRY DATA
async function loadCountryData() {
  try {
    dataStatus.textContent = "Loading country data…";

    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,region,subregion,flags"
    );
    const data = await response.json();

    allCountries = data
      .filter(c => c.flags && (c.flags.png || c.flags.svg))
      .map(c => ({
        name: c.name.common,
        region: c.region || "",
        subregion: c.subregion || "",
        imageUrl: c.flags.png || c.flags.svg
      }));

    dataReady = true;
    dataStatus.textContent = `Loaded ${allCountries.length} countries.`;
    startBtn.disabled = false;
  } catch (err) {
    console.error(err);
    dataStatus.textContent = "Error loading data. Refresh the page to try again.";
    startBtn.disabled = true;
  }
}

// QUESTION BUILDING

function buildQuestionPool(filteredCountries) {
  const pool = [];

  filteredCountries.forEach(country => {
    // build 3 wrong options
    const wrongNames = [];
    while (wrongNames.length < 3 && wrongNames.length < filteredCountries.length - 1) {
      const other = filteredCountries[Math.floor(Math.random() * filteredCountries.length)];
      if (other.name === country.name) continue;
      if (!wrongNames.includes(other.name)) wrongNames.push(other.name);
    }

    const answers = [...wrongNames, country.name];
    shuffle(answers);
    const correctIndex = answers.indexOf(country.name);

    pool.push({
      name: country.name,
      imageUrl: country.imageUrl,
      answers,
      correctIndex,
      regionTag: continentTag(country)
    });
  });

  return pool;
}

function buildFilteredCountries() {
  const activeContinents = Object.entries(continentFilters)
    .filter(([, isOn]) => isOn)
    .map(([key]) => key);

  let candidates;

  if (activeContinents.length === 0) {
    // fall back to all
    candidates = allCountries.slice();
  } else {
    candidates = allCountries.filter(c => {
      const tag = continentTag(c);
      if (!tag) return false;
      return continentFilters[tag];
    });
  }

  return candidates;
}

function getCurrentQuestion() {
  const poolIndex = questionOrder[currentIndex];
  return questionPool[poolIndex];
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

  reviewContainer.innerHTML = "";
  if (wrongQuestions.length === 0) {
    reviewContainer.textContent = "Perfect — you answered every question correctly.";
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

// GAME LOGIC

function startQuiz() {
  if (!dataReady) {
    alert("Still loading country data. Please wait a moment and try again.");
    return;
  }

  // build filtered set
  const filteredCountries = buildFilteredCountries();
  if (filteredCountries.length < 4) {
    alert("Not enough countries with the current filters. Turn on more continents.");
    return;
  }

  // rounds
  let maxRounds = filteredCountries.length;
  let requested;

  if (selectedRounds === "ALL") {
    requested = maxRounds;
  } else {
    requested = parseInt(selectedRounds, 10);
    if (!Number.isFinite(requested) || requested < 1) requested = maxRounds;
    requested = Math.min(requested, maxRounds);
  }

  totalRounds = requested;
  questionTotalDisplay.textContent = totalRounds.toString();

  // build question pool and order
  questionPool = buildQuestionPool(filteredCountries);
  questionOrder = Array.from(questionPool.keys());
  shuffle(questionOrder);

  // trim to desired rounds
  if (questionOrder.length > totalRounds) {
    questionOrder = questionOrder.slice(0, totalRounds);
  }

  // reset state
  score = 0;
  scoreDisplay.textContent = "0";
  wrongQuestions = [];
  currentIndex = 0;

  showQuizScreen();
  loadCurrentQuestion();
}

function loadCurrentQuestion() {
  const q = getCurrentQuestion();

  questionNumberDisplay.textContent = (currentIndex + 1).toString();
  flagImage.src = q.imageUrl;
  result.textContent = "";
  nextBtn.disabled = true;

  currentAnswers = q.answers.map(text => ({
    text,
    isCorrect: text === q.answers[q.correctIndex]
  }));

  buttons.forEach((btn, i) => {
    const data = currentAnswers[i];
    btn.textContent = data.text;
    btn.disabled = false;
    btn.classList.remove("correct", "wrong");
    btn.onclick = () => handleAnswer(i);
  });
}

function handleAnswer(buttonIndex) {
  const q = getCurrentQuestion();
  const answerData = currentAnswers[buttonIndex];
  const isCorrect = answerData.isCorrect;

  buttons.forEach(btn => (btn.disabled = true));

  const selectedBtn = buttons[buttonIndex];
  if (isCorrect) {
    selectedBtn.classList.add("correct");
    result.textContent = "Correct!";
    score++;
    scoreDisplay.textContent = score.toString();
  } else {
    selectedBtn.classList.add("wrong");
    result.textContent = "Wrong.";

    wrongQuestions.push({
      correct: q.answers[q.correctIndex],
      chosen: answerData.text
    });
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
  if (currentIndex >= questionOrder.length) {
    showEndScreen();
  } else {
    loadCurrentQuestion();
  }
}

// SETTINGS HANDLERS

function selectRounds(value) {
  selectedRounds = value;
  roundButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.rounds === value);
  });
}

function toggleContinent(key) {
  const current = continentFilters[key];
  const activeCount = Object.values(continentFilters).filter(Boolean).length;

  // prevent turning off the last active continent
  if (current && activeCount === 1) {
    return;
  }

  continentFilters[key] = !current;

  continentButtons.forEach(btn => {
    const c = btn.dataset.continent;
    btn.classList.toggle("active", continentFilters[c]);
  });
}

// EVENT WIRING

roundButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    selectRounds(btn.dataset.rounds);
  });
});
// default initial selection: ALL
selectRounds("ALL");

continentButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    toggleContinent(btn.dataset.continent);
  });
});

startBtn.addEventListener("click", startQuiz);
tryAgainBtn.addEventListener("click", startQuiz);
mainMenuBtn.addEventListener("click", showStartScreen);
nextBtn.addEventListener("click", goToNextQuestion);

// INITIAL
showStartScreen();
loadCountryData();
