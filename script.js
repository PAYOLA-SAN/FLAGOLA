const flags = [
  {
    name: "France",
    emoji: "🇫🇷",
    hint: "A tricolour first flown in 1794.",
    fact: "Blue and red represent Paris, while white honors the monarchy.",
  },
  {
    name: "Brazil",
    emoji: "🇧🇷",
    hint: "A green field with a yellow diamond.",
    fact: "The flag's 27 stars mirror the night sky over Rio de Janeiro.",
  },
  {
    name: "Japan",
    emoji: "🇯🇵",
    hint: "A crimson sun on a white background.",
    fact: "The circle represents the rising sun, central to Japanese identity.",
  },
  {
    name: "Kenya",
    emoji: "🇰🇪",
    hint: "Features a Maasai shield and crossed spears.",
    fact: "Black, red, and green symbolize the people, struggle, and land respectively.",
  },
  {
    name: "Sweden",
    emoji: "🇸🇪",
    hint: "A Nordic cross inspired by the sky over Scandinavia.",
    fact: "The gold cross offset to the left is typical of Scandinavian designs.",
  },
  {
    name: "Canada",
    emoji: "🇨🇦",
    hint: "Centred maple leaf between red bands.",
    fact: "Adopted in 1965, the maple leaf uses an 11-point stylized shape.",
  },
  {
    name: "India",
    emoji: "🇮🇳",
    hint: "Saffron, white, and green with a navy wheel.",
    fact: "The Ashoka Chakra at the center has 24 spokes signifying Dharma.",
  },
  {
    name: "Greece",
    emoji: "🇬🇷",
    hint: "Blue and white stripes with a corner cross.",
    fact: "Nine stripes are said to match syllables of the phrase 'Freedom or Death'.",
  },
  {
    name: "Mexico",
    emoji: "🇲🇽",
    hint: "Tricolour with an eagle devouring a snake.",
    fact: "The central emblem reflects an Aztec legend about the founding of Tenochtitlan.",
  },
  {
    name: "Australia",
    emoji: "🇦🇺",
    hint: "Blue field featuring the Southern Cross.",
    fact: "Includes the Commonwealth Star with seven points for each state and territory.",
  },
];

const flagDisplay = document.getElementById("flagDisplay");
const hintEl = document.getElementById("hint");
const choicesEl = document.getElementById("choices");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const feedbackEl = document.getElementById("feedback");
const progressEl = document.getElementById("progress");
const scoreValue = document.getElementById("scoreValue");
const streakValue = document.getElementById("streakValue");
const choiceTemplate = document.getElementById("choiceTemplate");

let deck = [];
let currentIndex = 0;
let answered = false;
let score = 0;
let streak = 0;

function shuffle(list) {
  const array = [...list];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function buildChoices(answerName) {
  const pool = shuffle(flags.filter((f) => f.name !== answerName));
  const options = pool.slice(0, 3).map((f) => f.name);
  options.push(answerName);
  return shuffle(options);
}

function renderQuestion() {
  const flag = deck[currentIndex];
  if (!flag) return;

  answered = false;
  feedbackEl.textContent = "";
  nextBtn.disabled = true;

  flagDisplay.innerHTML = `<span class="flag-emoji" aria-hidden="true">${flag.emoji}</span>`;
  flagDisplay.setAttribute("aria-label", `${flag.name} flag`);
  hintEl.textContent = flag.hint;
  progressEl.textContent = `Question ${currentIndex + 1} of ${deck.length}`;

  choicesEl.innerHTML = "";
  const options = buildChoices(flag.name);

  options.forEach((option) => {
    const choiceNode = choiceTemplate.content.firstElementChild.cloneNode(true);
    choiceNode.textContent = option;
    choiceNode.addEventListener("click", () => handleChoice(option, choiceNode));
    choicesEl.appendChild(choiceNode);
  });
}

function handleChoice(option, button) {
  if (answered) return;
  answered = true;

  const flag = deck[currentIndex];
  const correct = option === flag.name;

  document.querySelectorAll(".choice").forEach((choice) => {
    choice.disabled = true;
    if (choice.textContent === flag.name) {
      choice.classList.add("is-correct");
    }
  });

  if (correct) {
    button.classList.add("is-correct");
    feedbackEl.textContent = `Correct! ${flag.fact}`;
    score += 10;
    streak += 1;
  } else {
    button.classList.add("is-wrong");
    feedbackEl.textContent = `Not quite. ${flag.fact}`;
    streak = 0;
  }

  scoreValue.textContent = score;
  streakValue.textContent = streak;

  const isLast = currentIndex === deck.length - 1;
  nextBtn.textContent = isLast ? "See results" : "Next question";
  nextBtn.disabled = false;
}

function goToNext() {
  if (currentIndex < deck.length - 1) {
    currentIndex += 1;
    renderQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  flagDisplay.innerHTML = "<span class=\"flag-emoji\">🎉</span>";
  flagDisplay.setAttribute("aria-label", "Results");
  hintEl.textContent = "Game complete";
  choicesEl.innerHTML = "";
  feedbackEl.textContent = `You scored ${score} points with a longest streak of ${streak}.`;
  progressEl.textContent = "Play again to improve your score!";
  nextBtn.disabled = true;
}

function restart() {
  deck = shuffle(flags);
  currentIndex = 0;
  score = 0;
  streak = 0;
  scoreValue.textContent = score;
  streakValue.textContent = streak;
  renderQuestion();
}

nextBtn.addEventListener("click", goToNext);
restartBtn.addEventListener("click", restart);

restart();
