const cards = document.querySelectorAll('.memory-card');
const playAgainButton = document.querySelector('.main-buttons .play-again-button');
const endButton = document.querySelector('.main-buttons .end-button');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
  } else {
    secondCard = this;
    checkForMatch();
    updateMoves();
  }
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
  
    this.classList.add('flip');
    updateMoves();
  
    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;
  
      return;
    }
  
    secondCard = this;
    checkForMatch();
  }

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function updateMoves() {
    moves++;
    const movesCountElement = document.getElementById('moves-count');
    movesCountElement.textContent = `Moves: ${moves}`;
  }

(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 8);
    card.style.order = randomPos;
  });
})();

cards.forEach(card => card.addEventListener('click', flipCard));


playAgainButton.addEventListener('click', () => {
  moves = 0;
  // Reset any other game-related variables or state
  console.log('Game restarted');
});


endButton.addEventListener('click', () => {
  // Do any necessary clean-up or final calculations
  console.log(`Game ended with ${moves} moves`);
});
