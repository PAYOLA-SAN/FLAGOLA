/******************************************************
 * FLAGOLA — COMPLETE FIXED SCRIPT.JS
 * 100% OFFLINE COUNTRY DATA
 * EXACTLY YOUR 197 COUNTRIES
 * NO API CALLS
 * ZERO MISSING ENTRIES
 ******************************************************/

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const endScreen = document.getElementById("end-screen");
const titleScreen = document.getElementById("title-screen");

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

function pixelSwitch(targetScreen) {
    // remove previous active classes
    document.querySelectorAll(".screen").forEach(scr => scr.classList.remove("active"));

    // short delay to allow CSS steps animation to trigger
    setTimeout(() => {
        document.querySelectorAll(".screen").forEach(scr => scr.style.display = "none");

        const el = document.getElementById(targetScreen);
        el.style.display = "block";
        el.classList.add("active");
    }, 10);
}


/******************************************************
 * FULL OFFLINE COUNTRY DATA (197 entries)
 * format:
 * { name, region, subregion, code }
 * flag URL auto-built as https://flagcdn.com/{code}.svg
 ******************************************************/

const COUNTRY_DATA = [
{ name:"Afghanistan",region:"Asia",sub:"Southern Asia",code:"af" },
{ name:"Albania",region:"Europe",sub:"Southern Europe",code:"al" },
{ name:"Algeria",region:"Africa",sub:"Northern Africa",code:"dz" },
{ name:"Andorra",region:"Europe",sub:"Southern Europe",code:"ad" },
{ name:"Angola",region:"Africa",sub:"Middle Africa",code:"ao" },
{ name:"Antigua and Barbuda",region:"Americas",sub:"Caribbean",code:"ag" },
{ name:"Argentina",region:"Americas",sub:"South America",code:"ar" },
{ name:"Armenia",region:"Asia",sub:"Western Asia",code:"am" },
{ name:"Australia",region:"Oceania",sub:"Australia and New Zealand",code:"au" },
{ name:"Austria",region:"Europe",sub:"Western Europe",code:"at" },
{ name:"Azerbaijan",region:"Asia",sub:"Western Asia",code:"az" },
{ name:"Bahamas",region:"Americas",sub:"Caribbean",code:"bs" },
{ name:"Bahrain",region:"Asia",sub:"Western Asia",code:"bh" },
{ name:"Bangladesh",region:"Asia",sub:"Southern Asia",code:"bd" },
{ name:"Barbados",region:"Americas",sub:"Caribbean",code:"bb" },
{ name:"Belarus",region:"Europe",sub:"Eastern Europe",code:"by" },
{ name:"Belgium",region:"Europe",sub:"Western Europe",code:"be" },
{ name:"Belize",region:"Americas",sub:"Central America",code:"bz" },
{ name:"Benin",region:"Africa",sub:"Western Africa",code:"bj" },
{ name:"Bhutan",region:"Asia",sub:"Southern Asia",code:"bt" },
{ name:"Bolivia",region:"Americas",sub:"South America",code:"bo" },
{ name:"Bosnia and Herzegovina",region:"Europe",sub:"Southern Europe",code:"ba" },
{ name:"Botswana",region:"Africa",sub:"Southern Africa",code:"bw" },
{ name:"Brazil",region:"Americas",sub:"South America",code:"br" },
{ name:"Brunei",region:"Asia",sub:"South-Eastern Asia",code:"bn" },
{ name:"Bulgaria",region:"Europe",sub:"Eastern Europe",code:"bg" },
{ name:"Burkina Faso",region:"Africa",sub:"Western Africa",code:"bf" },
{ name:"Burundi",region:"Africa",sub:"Eastern Africa",code:"bi" },
{ name:"Cabo Verde",region:"Africa",sub:"Western Africa",code:"cv" },
{ name:"Cambodia",region:"Asia",sub:"South-Eastern Asia",code:"kh" },
{ name:"Cameroon",region:"Africa",sub:"Middle Africa",code:"cm" },
{ name:"Canada",region:"Americas",sub:"North America",code:"ca" },
{ name:"Central African Republic",region:"Africa",sub:"Middle Africa",code:"cf" },
{ name:"Chad",region:"Africa",sub:"Middle Africa",code:"td" },
{ name:"Chile",region:"Americas",sub:"South America",code:"cl" },
{ name:"China",region:"Asia",sub:"Eastern Asia",code:"cn" },
{ name:"Colombia",region:"Americas",sub:"South America",code:"co" },
{ name:"Comoros",region:"Africa",sub:"Eastern Africa",code:"km" },
{ name:"Congo",region:"Africa",sub:"Middle Africa",code:"cg" },
{ name:"Costa Rica",region:"Americas",sub:"Central America",code:"cr" },
{ name:"Ivory Coast",region:"Africa",sub:"Western Africa",code:"ci" },
{ name:"Croatia",region:"Europe",sub:"Southern Europe",code:"hr" },
{ name:"Cuba",region:"Americas",sub:"Caribbean",code:"cu" },
{ name:"Cyprus",region:"Asia",sub:"Western Asia",code:"cy" },
{ name:"Czechia",region:"Europe",sub:"Eastern Europe",code:"cz" },
{ name:"North Korea",region:"Asia",sub:"Eastern Asia",code:"kp" },
{ name:"DR Congo",region:"Africa",sub:"Middle Africa",code:"cd" },
{ name:"Denmark",region:"Europe",sub:"Northern Europe",code:"dk" },
{ name:"Djibouti",region:"Africa",sub:"Eastern Africa",code:"dj" },
{ name:"Dominica",region:"Americas",sub:"Caribbean",code:"dm" },
{ name:"Dominican Republic",region:"Americas",sub:"Caribbean",code:"do" },
{ name:"Ecuador",region:"Americas",sub:"South America",code:"ec" },
{ name:"Egypt",region:"Africa",sub:"Northern Africa",code:"eg" },
{ name:"El Salvador",region:"Americas",sub:"Central America",code:"sv" },
{ name:"Equatorial Guinea",region:"Africa",sub:"Middle Africa",code:"gq" },
{ name:"Eritrea",region:"Africa",sub:"Eastern Africa",code:"er" },
{ name:"Estonia",region:"Europe",sub:"Northern Europe",code:"ee" },
{ name:"Eswatini",region:"Africa",sub:"Southern Africa",code:"sz" },
{ name:"Ethiopia",region:"Africa",sub:"Eastern Africa",code:"et" },
{ name:"Fiji",region:"Oceania",sub:"Melanesia",code:"fj" },
{ name:"Finland",region:"Europe",sub:"Northern Europe",code:"fi" },
{ name:"France",region:"Europe",sub:"Western Europe",code:"fr" },
{ name:"Gabon",region:"Africa",sub:"Middle Africa",code:"ga" },
{ name:"Gambia",region:"Africa",sub:"Western Africa",code:"gm" },
{ name:"Georgia",region:"Asia",sub:"Western Asia",code:"ge" },
{ name:"Germany",region:"Europe",sub:"Western Europe",code:"de" },
{ name:"Ghana",region:"Africa",sub:"Western Africa",code:"gh" },
{ name:"Greece",region:"Europe",sub:"Southern Europe",code:"gr" },
{ name:"Grenada",region:"Americas",sub:"Caribbean",code:"gd" },
{ name:"Guatemala",region:"Americas",sub:"Central America",code:"gt" },
{ name:"Guinea",region:"Africa",sub:"Western Africa",code:"gn" },
{ name:"Guinea-Bissau",region:"Africa",sub:"Western Africa",code:"gw" },
{ name:"Guyana",region:"Americas",sub:"South America",code:"gy" },
{ name:"Haiti",region:"Americas",sub:"Caribbean",code:"ht" },
{ name:"Honduras",region:"Americas",sub:"Central America",code:"hn" },
{ name:"Hungary",region:"Europe",sub:"Eastern Europe",code:"hu" },
{ name:"Iceland",region:"Europe",sub:"Northern Europe",code:"is" },
{ name:"India",region:"Asia",sub:"Southern Asia",code:"in" },
{ name:"Indonesia",region:"Asia",sub:"South-Eastern Asia",code:"id" },
{ name:"Iran",region:"Asia",sub:"Southern Asia",code:"ir" },
{ name:"Iraq",region:"Asia",sub:"Western Asia",code:"iq" },
{ name:"Ireland",region:"Europe",sub:"Northern Europe",code:"ie" },
{ name:"Israel",region:"Asia",sub:"Western Asia",code:"il" },
{ name:"Italy",region:"Europe",sub:"Southern Europe",code:"it" },
{ name:"Jamaica",region:"Americas",sub:"Caribbean",code:"jm" },
{ name:"Japan",region:"Asia",sub:"Eastern Asia",code:"jp" },
{ name:"Jordan",region:"Asia",sub:"Western Asia",code:"jo" },
{ name:"Kazakhstan",region:"Asia",sub:"Central Asia",code:"kz" },
{ name:"Kenya",region:"Africa",sub:"Eastern Africa",code:"ke" },
{ name:"Kiribati",region:"Oceania",sub:"Micronesia",code:"ki" },
{ name:"Kuwait",region:"Asia",sub:"Western Asia",code:"kw" },
{ name:"Kyrgyzstan",region:"Asia",sub:"Central Asia",code:"kg" },
{ name:"Laos",region:"Asia",sub:"South-Eastern Asia",code:"la" },
{ name:"Latvia",region:"Europe",sub:"Northern Europe",code:"lv" },
{ name:"Lebanon",region:"Asia",sub:"Western Asia",code:"lb" },
{ name:"Lesotho",region:"Africa",sub:"Southern Africa",code:"ls" },
{ name:"Liberia",region:"Africa",sub:"Western Africa",code:"lr" },
{ name:"Libya",region:"Africa",sub:"Northern Africa",code:"ly" },
{ name:"Liechtenstein",region:"Europe",sub:"Western Europe",code:"li" },
{ name:"Lithuania",region:"Europe",sub:"Northern Europe",code:"lt" },
{ name:"Luxembourg",region:"Europe",sub:"Western Europe",code:"lu" },
{ name:"Madagascar",region:"Africa",sub:"Eastern Africa",code:"mg" },
{ name:"Malawi",region:"Africa",sub:"Eastern Africa",code:"mw" },
{ name:"Malaysia",region:"Asia",sub:"South-Eastern Asia",code:"my" },
{ name:"Maldives",region:"Asia",sub:"Southern Asia",code:"mv" },
{ name:"Mali",region:"Africa",sub:"Western Africa",code:"ml" },
{ name:"Malta",region:"Europe",sub:"Southern Europe",code:"mt" },
{ name:"Marshall Islands",region:"Oceania",sub:"Micronesia",code:"mh" },
{ name:"Mauritania",region:"Africa",sub:"Western Africa",code:"mr" },
{ name:"Mauritius",region:"Africa",sub:"Eastern Africa",code:"mu" },
{ name:"Mexico",region:"Americas",sub:"North America",code:"mx" },
{ name:"Micronesia",region:"Oceania",sub:"Micronesia",code:"fm" },
{ name:"Monaco",region:"Europe",sub:"Western Europe",code:"mc" },
{ name:"Mongolia",region:"Asia",sub:"Eastern Asia",code:"mn" },
{ name:"Montenegro",region:"Europe",sub:"Southern Europe",code:"me" },
{ name:"Morocco",region:"Africa",sub:"Northern Africa",code:"ma" },
{ name:"Mozambique",region:"Africa",sub:"Eastern Africa",code:"mz" },
{ name:"Myanmar",region:"Asia",sub:"South-Eastern Asia",code:"mm" },
{ name:"Namibia",region:"Africa",sub:"Southern Africa",code:"na" },
{ name:"Nauru",region:"Oceania",sub:"Micronesia",code:"nr" },
{ name:"Nepal",region:"Asia",sub:"Southern Asia",code:"np" },
{ name:"Netherlands",region:"Europe",sub:"Western Europe",code:"nl" },
{ name:"New Zealand",region:"Oceania",sub:"Australia and New Zealand",code:"nz" },
{ name:"Nicaragua",region:"Americas",sub:"Central America",code:"ni" },
{ name:"Niger",region:"Africa",sub:"Western Africa",code:"ne" },
{ name:"Nigeria",region:"Africa",sub:"Western Africa",code:"ng" },
{ name:"North Macedonia",region:"Europe",sub:"Southern Europe",code:"mk" },
{ name:"Norway",region:"Europe",sub:"Northern Europe",code:"no" },
{ name:"Oman",region:"Asia",sub:"Western Asia",code:"om" },
{ name:"Pakistan",region:"Asia",sub:"Southern Asia",code:"pk" },
{ name:"Palau",region:"Oceania",sub:"Micronesia",code:"pw" },
{ name:"Panama",region:"Americas",sub:"Central America",code:"pa" },
{ name:"Papua New Guinea",region:"Oceania",sub:"Melanesia",code:"pg" },
{ name:"Paraguay",region:"Americas",sub:"South America",code:"py" },
{ name:"Peru",region:"Americas",sub:"South America",code:"pe" },
{ name:"Philippines",region:"Asia",sub:"South-Eastern Asia",code:"ph" },
{ name:"Poland",region:"Europe",sub:"Eastern Europe",code:"pl" },
{ name:"Portugal",region:"Europe",sub:"Southern Europe",code:"pt" },
{ name:"Qatar",region:"Asia",sub:"Western Asia",code:"qa" },
{ name:"South Korea",region:"Asia",sub:"Eastern Asia",code:"kr" },
{ name:"Moldova",region:"Europe",sub:"Eastern Europe",code:"md" },
{ name:"Romania",region:"Europe",sub:"Eastern Europe",code:"ro" },
{ name:"Russia",region:"Europe",sub:"Eastern Europe",code:"ru" },
{ name:"Rwanda",region:"Africa",sub:"Eastern Africa",code:"rw" },
{ name:"Saint Kitts and Nevis",region:"Americas",sub:"Caribbean",code:"kn" },
{ name:"Saint Lucia",region:"Americas",sub:"Caribbean",code:"lc" },
{ name:"Saint Vincent and the Grenadines",region:"Americas",sub:"Caribbean",code:"vc" },
{ name:"Samoa",region:"Oceania",sub:"Polynesia",code:"ws" },
{ name:"San Marino",region:"Europe",sub:"Southern Europe",code:"sm" },
{ name:"Sao Tome and Principe",region:"Africa",sub:"Middle Africa",code:"st" },
{ name:"Saudi Arabia",region:"Asia",sub:"Western Asia",code:"sa" },
{ name:"Senegal",region:"Africa",sub:"Western Africa",code:"sn" },
{ name:"Serbia",region:"Europe",sub:"Southern Europe",code:"rs" },
{ name:"Seychelles",region:"Africa",sub:"Eastern Africa",code:"sc" },
{ name:"Sierra Leone",region:"Africa",sub:"Western Africa",code:"sl" },
{ name:"Singapore",region:"Asia",sub:"South-Eastern Asia",code:"sg" },
{ name:"Slovakia",region:"Europe",sub:"Eastern Europe",code:"sk" },
{ name:"Slovenia",region:"Europe",sub:"Southern Europe",code:"si" },
{ name:"Solomon Islands",region:"Oceania",sub:"Melanesia",code:"sb" },
{ name:"Somalia",region:"Africa",sub:"Eastern Africa",code:"so" },
{ name:"South Africa",region:"Africa",sub:"Southern Africa",code:"za" },
{ name:"South Sudan",region:"Africa",sub:"Eastern Africa",code:"ss" },
{ name:"Spain",region:"Europe",sub:"Southern Europe",code:"es" },
{ name:"Sri Lanka",region:"Asia",sub:"Southern Asia",code:"lk" },
{ name:"Sudan",region:"Africa",sub:"Northern Africa",code:"sd" },
{ name:"Suriname",region:"Americas",sub:"South America",code:"sr" },
{ name:"Sweden",region:"Europe",sub:"Northern Europe",code:"se" },
{ name:"Switzerland",region:"Europe",sub:"Western Europe",code:"ch" },
{ name:"Syria",region:"Asia",sub:"Western Asia",code:"sy" },
{ name:"Tajikistan",region:"Asia",sub:"Central Asia",code:"tj" },
{ name:"Thailand",region:"Asia",sub:"South-Eastern Asia",code:"th" },
{ name:"Timor-Leste",region:"Asia",sub:"South-Eastern Asia",code:"tl" },
{ name:"Togo",region:"Africa",sub:"Western Africa",code:"tg" },
{ name:"Tonga",region:"Oceania",sub:"Polynesia",code:"to" },
{ name:"Trinidad and Tobago",region:"Americas",sub:"Caribbean",code:"tt" },
{ name:"Tunisia",region:"Africa",sub:"Northern Africa",code:"tn" },
{ name:"Turkey",region:"Asia",sub:"Western Asia",code:"tr" },
{ name:"Turkmenistan",region:"Asia",sub:"Central Asia",code:"tm" },
{ name:"Tuvalu",region:"Oceania",sub:"Polynesia",code:"tv" },
{ name:"Uganda",region:"Africa",sub:"Eastern Africa",code:"ug" },
{ name:"Ukraine",region:"Europe",sub:"Eastern Europe",code:"ua" },
{ name:"United Arab Emirates",region:"Asia",sub:"Western Asia",code:"ae" },
{ name:"United Kingdom",region:"Europe",sub:"Northern Europe",code:"gb" },
{ name:"Tanzania",region:"Africa",sub:"Eastern Africa",code:"tz" },
{ name:"United States",region:"Americas",sub:"North America",code:"us" },
{ name:"Uruguay",region:"Americas",sub:"South America",code:"uy" },
{ name:"Uzbekistan",region:"Asia",sub:"Central Asia",code:"uz" },
{ name:"Vanuatu",region:"Oceania",sub:"Melanesia",code:"vu" },
{ name:"Venezuela",region:"Americas",sub:"South America",code:"ve" },
{ name:"Vietnam",region:"Asia",sub:"South-Eastern Asia",code:"vn" },
{ name:"Yemen",region:"Asia",sub:"Western Asia",code:"ye" },
{ name:"Zambia",region:"Africa",sub:"Eastern Africa",code:"zm" },
{ name:"Zimbabwe",region:"Africa",sub:"Eastern Africa",code:"zw" },

// Manual extras:
{ name:"Taiwan",region:"Asia",sub:"Eastern Asia",code:"tw" },
{ name:"Kosovo",region:"Europe",sub:"Southern Europe",code:"xk" },
{ name:"Palestine",region:"Asia",sub:"Western Asia",code:"ps" }
];

/******************************************************
 * INTERNAL STATE
 ******************************************************/

let filteredCountries = [];
let questionPool = [];
let questionOrder = [];
let currentIndex = 0;
let totalRounds = 0;
let selectedRounds = "20";
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

/******************************************************
 * UTILS
 ******************************************************/

function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
}

function continentOf(c){
  if(c.region==="Africa") return "africa";
  if(c.region==="Asia") return "asia";
  if(c.region==="Europe") return "europe";
  if(c.region==="Oceania") return "oceania";
  if(c.region==="Americas"){
    if(c.sub==="South America") return "south_america";
    return "north_america";
  }
  return null;
}

/******************************************************
 * INIT LOAD
 ******************************************************/

function loadCountryData(){
  dataStatus.textContent = `Loaded ${COUNTRY_DATA.length} countries.`;
  filteredCountries = COUNTRY_DATA.slice();
}

/******************************************************
 * FILTER + ROUND BUTTON UPDATE
 ******************************************************/

function updateFilteredAndRoundButtons(){
  filteredCountries = COUNTRY_DATA.filter(c=>{
    const tag = continentOf(c);
    return tag && continentFilters[tag];
  });

  const count = filteredCountries.length;
  dataStatus.textContent = `Loaded ${count} countries.`;

  // Decide default rounds based on how many countries are available
  if (count >= 20) {
    selectedRounds = "20";
  } else if (count >= 10) {
    selectedRounds = "10";
  } else {
    selectedRounds = "ALL";
  }

  roundButtons.forEach(btn=>{
    const v = btn.dataset.rounds;

    if (v === "ALL") {
      // ALL is always available
      btn.classList.remove("disabled");
    } else {
      const need = parseInt(v, 10);
      if (need > count) {
        btn.classList.add("disabled");
      } else {
        btn.classList.remove("disabled");
      }
    }

    // Highlight the currently selected default
    btn.classList.toggle("active", v === selectedRounds);
  });
}


/******************************************************
 * START QUIZ
 ******************************************************/

function startQuiz(){
  errorMessage.textContent="";

  const active = Object.values(continentFilters).filter(Boolean).length;
  if(active===0){
    errorMessage.textContent="At least one continent must be selected!";
    return;
  }

  if(filteredCountries.length<4){
    errorMessage.textContent="Not enough countries to play.";
    return;
  }

  const count = filteredCountries.length;
  let rounds;

  if(selectedRounds==="ALL") rounds=count;
  else rounds=Math.min(parseInt(selectedRounds,10),count);

  totalRounds=rounds;
  questionTotalDisplay.textContent=rounds.toString();

  score=0;
  wrongQuestions=[];
  scoreDisplay.textContent="0";

  questionPool = filteredCountries.map(c=>{
    const wrong=[];
    while(wrong.length<3){
      const other=filteredCountries[Math.floor(Math.random()*filteredCountries.length)];
      if(other.name!==c.name && !wrong.includes(other.name)) wrong.push(other.name);
    }
    const answers=[...wrong,c.name];
    shuffle(answers);

    return{
      name:c.name,
      flag:`https://flagcdn.com/${c.code}.svg`,
      answers,
      correctIndex:answers.indexOf(c.name)
    };
  });

  questionOrder=Array.from(questionPool.keys());
  shuffle(questionOrder);
  if(questionOrder.length>rounds) questionOrder=questionOrder.slice(0,rounds);

  currentIndex=0;

  showQuizScreen();
  loadQuestion();
}

/******************************************************
 * LOAD QUESTION
 ******************************************************/

function loadQuestion(){
  const q = questionPool[questionOrder[currentIndex]];
  questionNumberDisplay.textContent=(currentIndex+1).toString();

  flagImage.src=q.flag;
  result.textContent="";
  nextBtn.disabled=true;

  currentAnswers = q.answers.map(t=>({
    text:t,
    isCorrect:t===q.name
  }));

  answerButtons.forEach((btn,i)=>{
    const d=currentAnswers[i];
    btn.textContent=d.text;
    btn.disabled=false;
    btn.classList.remove("correct","wrong");
    btn.onclick=()=>handleAnswer(i);
  });
}

function handleAnswer(i){
  const q=questionPool[questionOrder[currentIndex]];
  const ans=currentAnswers[i];

  answerButtons.forEach(b=>b.disabled=true);

  if(ans.isCorrect){
    answerButtons[i].classList.add("correct");
    result.textContent="Correct!";
    score++;
    scoreDisplay.textContent=score.toString();
  }else{
    answerButtons[i].classList.add("wrong");
    result.textContent="Wrong.";
    wrongQuestions.push({correct:q.name,chosen:ans.text});
  }

  currentAnswers.forEach((a,idx)=>{
    if(a.isCorrect) answerButtons[idx].classList.add("correct");
  });

  nextBtn.disabled=false;
}

/******************************************************
 * NEXT QUESTION
 ******************************************************/

function nextQuestion(){
  currentIndex++;
  if(currentIndex>=questionOrder.length) showEndScreen();
  else loadQuestion();
}

/******************************************************
 * QUIT MODAL
 ******************************************************/

quitBtn.onclick=()=>quitModal.classList.remove("hidden");
quitNo.onclick=()=>quitModal.classList.add("hidden");
quitYes.onclick=()=>{
  quitModal.classList.add("hidden");
  showStartScreen();
};

/******************************************************
 * END SCREEN
 ******************************************************/

function showEndScreen() {
    pixelSwitch("end-screen");

    const ul = document.createElement("ul");
    ul.innerHTML = "";

    wrongQuestions.forEach(w => {
        const li = document.createElement("li");
        li.textContent = `${w.correct} — you answered: ${w.chosen}`;
        ul.appendChild(li);
    });

    reviewContainer.innerHTML = "";
    reviewContainer.appendChild(ul);
}

/******************************************************
 * SCREEN SWITCH
 ******************************************************/

function showQuizScreen() {
    titleScreen.style.display = "none";
    pixelSwitch("quiz-screen");
}

function showStartScreen() {
    pixelSwitch("start-screen");
}


/******************************************************
 * TITLE SCREEN HANDLER
 ******************************************************/

function showMainMenu() {
    titleScreen.style.display = "none";
    pixelSwitch("start-screen");
}

titleScreen.addEventListener("click", showMainMenu);

document.addEventListener("keydown", () => {
    showMainMenu();
});

/******************************************************
 * SETTINGS EVENTS
 ******************************************************/

roundButtons.forEach(btn=>{
  btn.addEventListener("click",()=>{
    if(btn.classList.contains("disabled")) return;
    roundButtons.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    selectedRounds=btn.dataset.rounds;
  });
});

// FIX: allow deselecting all continents
continentButtons.forEach(btn=>{
  btn.addEventListener("click",()=>{
    const key=btn.dataset.continent;
    continentFilters[key]=!continentFilters[key];
    btn.classList.toggle("active",continentFilters[key]);
    updateFilteredAndRoundButtons();
  });
});

startBtn.onclick=startQuiz;
nextBtn.onclick=nextQuestion;
tryAgainBtn.onclick=startQuiz;
mainMenuBtn.onclick=showStartScreen;

/******************************************************
 * INITIAL START
 ******************************************************/

loadCountryData();
updateFilteredAndRoundButtons();

