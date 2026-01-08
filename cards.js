let flashcards = [];
let current = 0;
let score = 0;
let time = 0;
let mode = "flash";
let testMode = false;

const cardText = document.getElementById("card-text");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const mcBox = document.getElementById("mc-choices");
const textMode = document.getElementById("text-mode");
const textInput = document.getElementById("textAnswer");

fetch("questions.json")
  .then(r => r.json())
  .then(data => {
    flashcards = data;
    showCard();
  });

setInterval(() => {
  time++;
  timeEl.textContent = time;
}, 1000);

function setMode(newMode) {
  mode = newMode;
  testMode = false;
  updateUI();
  showCard();
}

function updateUI() {
  mcBox.classList.add("hidden");
  textMode.classList.add("hidden");

  if (mode === "text") textMode.classList.remove("hidden");
  if (mode === "mc") mcBox.classList.remove("hidden");
}

function showCard() {
  cardText.textContent = flashcards[current].question;

  if (mode === "mc") loadMC();
}

function submitText() {
  if (textInput.value.trim().toLowerCase() === flashcards[current].answer.toLowerCase()) {
    score++;
    scoreEl.textContent = score;
    next();
  }
  textInput.value = "";
}

function loadMC() {
  mcBox.innerHTML = "";
  let answers = [flashcards[current].answer];
  while (answers.length < 4) {
    let rand = flashcards[Math.floor(Math.random() * flashcards.length)].answer;
    if (!answers.includes(rand)) answers.push(rand);
  }
  answers.sort(() => Math.random() - 0.5);
  answers.forEach(a => {
    let b = document.createElement("button");
    b.textContent = a;
    b.onclick = () => checkMC(a);
    mcBox.appendChild(b);
  });
}

function checkMC(ans) {
  if (ans === flashcards[current].answer) {
    score++;
    scoreEl.textContent = score;
  }
  next();
}

function next() {
  if (testMode && current === flashcards.length - 1) {
    cardText.textContent = `Test complete! Score: ${score}/${flashcards.length}`;
    updateUI();
    return;
  }
  current = (current + 1) % flashcards.length;
  showCard();
}

function startTest() {
  flashcards.sort(() => Math.random() - 0.5);
  current = 0;
  score = 0;
  scoreEl.textContent = 0;
  testMode = true;
  mode = "mc";
  updateUI();
  showCard();
}