const board = document.querySelector(".game-board");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const bestScoreDisplay = document.getElementById("best-score");
const restartBtn = document.getElementById("restart");
const levelSelect = document.getElementById("level");
const winMessage = document.getElementById("win-message");
const themeBtn = document.getElementById("toggle-theme");

let emojis = ["🍎","🍌","🍇","🍉","🍓","🍒","🥝","🍍","🥥","🍑","🥕","🌽"];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let timer;
let timeLeft = 60;
let bestScore = 0;

// Generate board
function generateBoard(size) {
  board.innerHTML = "";
  winMessage.style.display = "none";
  score = 0;
  scoreDisplay.textContent = score;
  timeLeft = 60;
  timerDisplay.textContent = timeLeft;

  let gameEmojis = emojis.slice(0, (size*size)/2);
  let cardEmojis = [...gameEmojis, ...gameEmojis].sort(() => 0.5 - Math.random());

  board.style.gridTemplateColumns = `repeat(${size}, 100px)`;

  cardEmojis.forEach(emoji => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.textContent = "?";
    card.dataset.emoji = emoji;
    card.addEventListener("click", flipCard);
    board.appendChild(card);
  });

  clearInterval(timer);
  startTimer();
}

// Flip card
function flipCard() {
  if (lockBoard || this === firstCard) return;

  this.textContent = this.dataset.emoji;
  this.classList.add("flip");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  checkMatch();
}

// Check match
function checkMatch() {
  if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
    firstCard.classList.add("correct");
    secondCard.classList.add("correct");
    setTimeout(() => {
      firstCard.classList.remove("correct");
      secondCard.classList.remove("correct");
    }, 500);
    disableCards();
    score++;
    scoreDisplay.textContent = score;
    if (score === (board.children.length / 2)) winGame();
  } else {
    firstCard.classList.add("wrong");
    secondCard.classList.add("wrong");
    setTimeout(() => {
      firstCard.classList.remove("wrong");
      secondCard.classList.remove("wrong");
      unflipCards();
    }, 600);
  }
}

// Disable matched cards
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  resetBoard();
}

// Unflip if not matched
function unflipCards() {
  setTimeout(() => {
    firstCard.textContent = "?";
    secondCard.textContent = "?";
    resetBoard();
  }, 200);
}

// Reset board
function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

// Timer
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("⏳ Time’s up!");
    }
  }, 1000);
}

// Win game
function winGame() {
  clearInterval(timer);
  winMessage.style.display = "block";
  board.classList.add("win");
  setTimeout(() => board.classList.remove("win"), 1000);
  launchConfetti();

  if (score > bestScore) {
    bestScore = score;
    bestScoreDisplay.textContent = bestScore;
  }
}

// Launch Confetti
function launchConfetti() {
  const colors = ["#f39c12","#e74c3c","#9b59b6","#2ecc71","#3498db","#f1c40f"];
  for (let i = 0; i < 80; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.left = Math.random() * window.innerWidth + "px";
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 8 + 5;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    confetti.style.animationDuration = (Math.random() * 3 + 2) + "s";
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 5000);
  }
}

// Get board size
function getSize() {
  if (levelSelect.value === "easy") return 2;
  if (levelSelect.value === "medium") return 4;
  return 6;
}

// Event listeners
restartBtn.addEventListener("click", () => generateBoard(getSize()));
levelSelect.addEventListener("change", () => generateBoard(getSize()));
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeBtn.textContent = document.body.classList.contains("dark") ? "☀️ Light Mode" : "🌙 Dark Mode";
});

// Start default
levelSelect.value = "easy";
generateBoard(2);
