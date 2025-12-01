/******************************************************
 * FLAGOLA — COMPLETE SCRIPT.JS (FIXED VERSION)
 ******************************************************/

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const endScreen = document.getElementById("end-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const tryAgainBtn = document.getElementById("try-again-btn");
const mainMenuBtn = document.getElementById("main-menu-btn");

const flagImage = document.getElementById("flag-image");
const result = document.getElementById("result");
const scoreDisplay = document.getElementById("score");
const questionNumberDisplay = document.getElementById("question-number");
const questionTotalDisplay = document.getElementById("question-total");
const finalScoreDisplay = document.getElementById("final-score");
const reviewContainer = document.getElementById("review");

const quitBtn = document.getElementById("quit-btn");
const quitModal = document.getElementById("quit-modal");
const quitYes = document.getElementById("quit-yes");
const quitNo = document.getElementById("quit-no");

const errorMessage = document.getElementById("error-message");
const dataStatus = document.getElementById("data-status");

const roundButtons = Array.from(document.querySelectorAll(".round-btn"));
const continentButtons = Array.from(document.querySelectorAll(".continent-btn"));

const answerButtons = [
  document.getElementById("answer1"),
  document.getElementById("answer2"),
  document.getElementById("answer3"),
  document.getElementById("answer4")
];

const COUNTRY_LIST = [
"Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina",
"Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados",
"Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina",
"Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia",
"Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros",
"Congo","Costa Rica","Ivory Coast","Croatia","Cuba","Cyprus","Czechia",
"North Korea","DR Congo","Denmark","Djibouti","Dominica","Dominican Republic",
"Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini",
"Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana",
"Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras",
"Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy",
"Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan",
"Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania",
"Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta",
"Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Monaco","Mongolia",
"Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands",
"New Zealand","Nicaragua","Niger","Nigeria","North Macedonia","Norway","Oman",
"Pakistan","Palau","Panama","Papua New Guinea","Paraguay","Peru","Philippines",
"Poland","Portugal","Qatar","South Korea","Moldova","Romania","Russia","Rwanda",
"Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa",
"San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles",
"Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia",
"South Africa","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden",
"Switzerland","Syria","Tajikistan","Thailand","Timor-Leste","Togo","Tonga",
"Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine",
"United Arab Emirates","United Kingdom","Tanzania","United States","Uruguay",
"Uzbekistan","Vanuatu","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe",
"Taiwan","Kosovo","Palestine"
];

let allCountries = [];
let filteredCountries = [];
let questionPool = [];
let questionOrder = [];
let currentIndex = 0;
let totalRounds = 0;
let selectedRounds = "ALL";
let score = 0;
let wrongQuestions = [];
let currentAnswers = [];

let continentFilters = {
  africa: true,
  asia: true,
  europe: true,
  north_america: true,
  south_america: true,
  oceania: true
};

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function continentOf(country) {
  switch (country.region) {
    case "Africa": return "africa";
    case "Asia": return "asia";
    case "Europe": return "europe";
    case "Oceania": return "oceania";
    case "Americas":
      return country.subregion === "South America" ? "south_america" : "north_america";
    default: return null;
  }
}

async function loadCountryData() {
  dataStatus.textContent = "Loading country data…";

  const response = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,region,subregion,flags"
  );
  const data = await response.json();

  const lookup = {};
  for (const c of data) {
    const nm = c.name.common;
    lookup[nm.toLowerCase()] = {
      name: nm,
      region: c.region || "",
      subregion: c.subregion || "",
      flag: c.flags.png || c.flags.svg
    };
  }

  allCountries = [];

  for (const name of COUNTRY_LIST) {
    const key = name.toLowerCase();
    if (lookup[key]) {
      allCountries.push({
        name: lookup[key].name,
        region: lookup[key].region,
        subregion: lookup[key].subregion,
        flag: lookup[key].flag
      });
    } else {
      if (name === "Kosovo") {
        allCountries.push({
          name: "Kosovo",
          region: "Europe",
          subregion: "Southern Europe",
          flag: "https://flagcdn.com/xk.svg"
        });
      }
      if (name === "Palestine") {
        allCountries.push({
          name: "Palestine",
          region: "Asia",
          subregion: "Western Asia",
          flag: "https://flagcdn.com/ps.svg"
        });
      }
    }
  }

  dataStatus.textContent = `Loaded ${allCountries.length} countries.`;
  updateFilteredAndRoundButtons();
}

function updateFilteredAndRoundButtons() {
  filteredCountries = allCountries.filter(c => {
    const tag = continentOf(c);
    return tag && continentFilters[tag];
  });

  const count = filteredCountries.length;
  dataStatus.textContent = `Loaded ${count} countries.`;

  roundButtons.forEach(btn => {
    const val = btn.dataset.rounds;
    if (val === "ALL") {
      btn.classList.remove("disabled");
      btn.classList.add("active");
      selectedRounds = "ALL";
    } else {
      const needed = parseInt(val, 10);
      if (needed > count) {
        btn.classList.add("disabled");
        btn.classList.remove("active");
      } else {
        btn.classList.remove("disabled");
      }
    }
  });
}

function startQuiz() {
  errorMessage.textContent = "";

  const active = Object.values(continentFilters).filter(Boolean).length;
  if (active === 0) {
    errorMessage.textContent = "At least one continent must be selected!";
    return;
  }

  if (filteredCountries.length < 4) {
    errorMessage.textContent = "Not enough countries to play.";
    return;
  }

  const count = filteredCountries.length;
  let rounds;

  if (selectedRounds === "ALL") rounds = count;
  else {
    const req = parseInt(selectedRounds, 10);
    rounds = Math.min(req, count);
  }

  totalRounds = rounds;
  questionTotalDisplay.textContent = rounds.toString();

  score = 0;
  scoreDisplay.textContent = "0";
  wrongQuestions = [];

  questionPool = filteredCountries.map(c => {
    const wrong = [];
    while (wrong.length < 3) {
      const other = filteredCountries[Math.floor(Math.random() * filteredCountries.length)];
      if (other.name !== c.name && !wrong.includes(other.name)) {
        wrong.push(other.name);
      }
    }
    const answers = [...wrong, c.name];
    shuffle(answers);
    return {
      name: c.name,
      flag: c.flag,
      answers,
      correctIndex: answers.indexOf(c.name)
    };
  });

  questionOrder = Array.from(questionPool.keys());
  shuffle(questionOrder);

  if (questionOrder.length > rounds) {
    questionOrder = questionOrder.slice(0, rounds);
  }

  currentIndex = 0;

  showQuizScreen();
  loadQuestion();
}

function loadQuestion() {
  const q = questionPool[questionOrder[currentIndex]];
  questionNumberDisplay.textContent = (currentIndex + 1).toString();

  flagImage.src = q.flag;
  result.textContent = "";
  nextBtn.disabled = true;

  currentAnswers = q.answers.map(text => ({
    text,
    isCorrect: text === q.name
  }));

  answerButtons.forEach((btn, i) => {
    const data = currentAnswers[i];
    btn.textContent = data.text;
    btn.disabled = false;
    btn.classList.remove("correct", "wrong");
    btn.onclick = () => handleAnswer(i);
  });
}

function handleAnswer(i) {
  const q = questionPool[questionOrder[currentIndex]];
  const ans = currentAnswers[i];

  answerButtons.forEach(btn => btn.disabled = true);

  if (ans.isCorrect) {
    answerButtons[i].classList.add("correct");
    result.textContent = "Correct!";
    score++;
    scoreDisplay.textContent = score.toString();
  } else {
    answerButtons[i].classList.add("wrong");
    result.textContent = "Wrong.";
    wrongQuestions.push({
      correct: q.name,
      chosen: ans.text
    });
  }

  currentAnswers.forEach((a, idx) => {
    if (a.isCorrect) answerButtons[idx].classList.add("correct");
  });

  nextBtn.disabled = false;
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex >= questionOrder.length) showEndScreen();
  else loadQuestion();
}

quitBtn.onclick = () => quitModal.classList.remove("hidden");
quitNo.onclick = () => quitModal.classList.add("hidden");
quitYes.onclick = () => {
  quitModal.classList.add("hidden");
  showStartScreen();
};

function showEndScreen() {
  startScreen.classList.add("hidden");
  quizScreen.classList.add("hidden");
  endScreen.classList.remove("hidden");

  finalScoreDisplay.textContent = `${score} / ${totalRounds}`;

  reviewContainer.innerHTML = "";
  if (wrongQuestions.length === 0) {
    reviewContainer.textContent = "Perfect — all correct.";
    return;
  }

  const ul = document.createElement("ul");
  wrongQuestions.forEach(w => {
    const li = document.createElement("li");
    li.textContent = `${w.correct} — you answered: ${w.chosen}`;
    ul.appendChild(li);
  });

  reviewContainer.appendChild(ul);
}

function showQuizScreen() {
  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  endScreen.classList.add("hidden");
}

function showStartScreen() {
  startScreen.classList.remove("hidden");
  quizScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  errorMessage.textContent = "";
}

roundButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.classList.contains("disabled")) return;
    roundButtons.forEach(x => x.classList.remove("active"));
    btn.classList.add("active");
    selectedRounds = btn.dataset.rounds;
  });
});

/* FIX: allow selecting zero continents */
continentButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.continent;
    continentFilters[key] = !continentFilters[key];
    btn.classList.toggle("active", continentFilters[key]);
    updateFilteredAndRoundButtons();
  });
});

startBtn.onclick = startQuiz;
nextBtn.onclick = nextQuestion;
tryAgainBtn.onclick = startQuiz;
mainMenuBtn.onclick = showStartScreen;

updateFilteredAndRoundButtons();
loadCountryData();
showStartScreen();
