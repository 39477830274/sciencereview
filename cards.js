let flashcards = [];
let currentCard = 0;
let showingAnswer = false;
let quizMode = false;
let score = 0;
let time = 0;

const card = document.getElementById("card");
const cardText = document.getElementById("card-text");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const quizInput = document.getElementById("quiz-input");
const answerInput = document.getElementById("answerInput");

fetch("questions.json")
  .then(res => res.json())
  .then(data => {
    flashcards = shuffleArray(data);
    showCard();
  });

setInterval(() => {
  time++;
  timeEl.textContent = time;
}, 1000);

card.addEventListener("click", () => {
  if (!quizMode) flipCard();
});

let touchStartX = 0;

card.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].screenX;
});

card.addEventListener("touchend", e => {
  const diff = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(diff) > 50) diff < 0 ? nextCard() : prevCard();
});

function showCard() {
  showingAnswer = false;
  cardText.textContent = flashcards[currentCard].question;
}

function flipCard() {
  cardText.textContent = showingAnswer
    ? flashcards[currentCard].question
    : flashcards[currentCard].answer;
  showingAnswer = !showingAnswer;
}

function nextCard() {
  currentCard = (currentCard + 1) % flashcards.length;
  showCard();
  resetInput();
}

function prevCard() {
  currentCard = (currentCard - 1 + flashcards.length) % flashcards.length;
  showCard();
  resetInput();
}

function toggleMode() {
  quizMode = !quizMode;
  quizInput.classList.toggle("hidden");
  showCard();
}

function submitAnswer() {
  const userAnswer = answerInput.value.trim().toLowerCase();
  const correctAnswer = flashcards[currentCard].answer.toLowerCase();

  if (userAnswer === correctAnswer) {
    score++;
    scoreEl.textContent = score;
    nextCard();
  } else {
    cardText.textContent = "❌ Try again";
  }
  resetInput();
}

function resetInput() {
  answerInput.value = "";
}

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}