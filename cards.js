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

fetch("questions.json")
  .then(r => r.json())
  .then(data => {
    flashcards = shuffle(data);
    showCard();
  });

setInterval(() => {
  time++;
  timeEl.textContent = time;
}, 1000);

function showCard() {
  mcBox.classList.add("hidden");
  cardText.textContent = flashcards[current].question;

  if (mode === "mc") {
    showMC();
  }
}

function toggleFlash() {
  mode = "flash";
  testMode = false;
  showCard();
}

function toggleMC() {
  mode = "mc";
  testMode = false;
  showCard();
}

function startTest() {
  mode = "mc";
  testMode = true;
  score = 0;
  current = 0;
  scoreEl.textContent = 0;
  flashcards = shuffle(flashcards);
  showCard();
}

function showMC() {
  mcBox.innerHTML = "";
  mcBox.classList.remove("hidden");

  let answers = [flashcards[current].answer];
  while (answers.length < 4) {
    let rand = flashcards[Math.floor(Math.random() * flashcards.length)].answer;
    if (!answers.includes(rand)) answers.push(rand);
  }

  shuffle(answers).forEach(ans => {
    const btn = document.createElement("button");
    btn.textContent = ans;
    btn.onclick = () => checkAnswer(ans);
    mcBox.appendChild(btn);
  });
}

function checkAnswer(ans) {
  if (ans === flashcards[current].answer) {
    score++;
    scoreEl.textContent = score;
  }

  if (testMode && current === flashcards.length - 1) {
    cardText.textContent = `Test complete! Score: ${score}/${flashcards.length}`;
    mcBox.classList.add("hidden");
    return;
  }

  current = (current + 1) % flashcards.length;
  showCard();
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}