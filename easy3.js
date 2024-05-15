const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;
let firstCardValue;

//Items array
const items = [
  { name: "lion", image: "D:/Game 3.0/1.png" },
  { name: "tiger", image: "D:/Game 3.0/2.png" },
  { name: "cheetah", image: "D:/Game 3.0/3.png" },
  { name: "giraffe", image: "D:/Game 3.0/4.png" },
  { name: "dog", image: "D:/Game 3.0/5.png" },
  { name: "cat", image: "D:/Game 3.0/6.png" },
  { name: "fish", image: "D:/Game 3.0/7.png" },
  { name: "elephant", image: "D:/Game 3.0/8.png" },
];

// Initial Time
let seconds = 0,
  minutes = 0;
// Initial moves and win count
let movesCount = 0,
  winCount = 0;

// For timer
const timeGenerator = () => {
  seconds += 1;
  // minutes logic
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  // format time before displaying
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

// For calculating moves
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

// Pick random objects from the items array
const generateRandom = (size = 4) => {
  // temporary array
  let tempArray = [...items];
  // initializes cardValues array
  let cardValues = [];
  // Random object selection
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    // once selected remove the object from temp array
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, rows = 2, cols = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  // Simple shuffle
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < rows * cols; i++) {
    /*
        Create Cards
        before => front side (contains question mark)
        after => back side (contains actual image);
        data-card-values is a custom attribute which stores the names of the cards to match later
      */
    const card = document.createElement("div");
    card.classList.add("card-container");
    card.setAttribute("data-card-value", cardValues[i].name);
    card.innerHTML = `
      <div class="card-before">?</div>
      <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/>
      </div>
    `;
    gameContainer.appendChild(card);
  }
  // Grid
  gameContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  gameContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  // Get all cards
  cards = document.querySelectorAll(".card-container");
  // Set up click event listeners for cards
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      // If selected card is not matched yet
      if (!card.classList.contains("matched")) {
        // Flip the clicked card
        card.classList.add("flipped");
        // If it is the first card
        if (!firstCard) {
          // Set current card as firstCard
          firstCard = card;
          // Set current card's value as firstCardValue
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          // Increment moves since user selected second card
          movesCounter();
          // Set secondCard and its value
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            // If both cards match, add matched class
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            // Reset firstCard since the next card would be first now
            firstCard = false;
            // Increment winCount as user found a correct match
            winCount += 1;
            // Check if winCount equals half of cardValues
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2>You Won</h2>
            <h4>Moves: ${movesCount}</h4>`;
              stopGame();
            }
          } else {
            // If the cards don't match, flip them back to normal
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

// Start game
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  // Controls and buttons visibility
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  // Start timer
  interval = setInterval(timeGenerator, 1000);
  // Initial moves
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializer();
});

// Stop game
stopButton.addEventListener("click", () => {
  controls.classList.remove("hide");
  stopButton.classList.add("hide");
  startButton.classList.remove("hide");
  clearInterval(interval);
});

// Initialize values and function calls
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  matrixGenerator(cardValues, 2, 4);
};

// Function to stop the game
const stopGame = () => {
  clearInterval(interval);
};

// Initialize the game on page load
initializer();
