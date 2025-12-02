// lossOfGettingAddicted makes it lose x * bet

const casinoItems = [
  {
    id: 0,
    name: "Coin",
    minBet: 50,
    description: "A simple coin with heads and tails.",
    difficulty: [
      {
        chanceOfWinning: 0.5,
        multiplier: 1.2,
        chanceOfGettingAddicted: 0.05,
        lossOfGettingAddicted: [2, 4],
      },
      {
        chanceOfWinning: 0.2,
        multiplier: 1.5,
        chanceOfGettingAddicted: 0.1,
        lossOfGettingAddicted: [3, 5],
      },
      {
        chanceOfWinning: 0.1,
        multiplier: 2,
        chanceOfGettingAddicted: 0.2,
        lossOfGettingAddicted: [4, 6],
      },
    ],
  },
  {
    id: 1,
    name: "Dice",
    minBet: 50,
    description: "A six-sided die with numbers 1 to 6.",
    difficulty: [
      {
        chanceOfWinning: 0.5,
        multiplier: 1.2,
        chanceOfGettingAddicted: 0.05,
        lossOfGettingAddicted: [2, 4],
      },
      {
        chanceOfWinning: 0.2,
        multiplier: 1.5,
        chanceOfGettingAddicted: 0.1,
        lossOfGettingAddicted: [3, 5],
      },
      {
        chanceOfWinning: 0.1,
        multiplier: 2,
        chanceOfGettingAddicted: 0.2,
        lossOfGettingAddicted: [4, 6],
      },
    ],
  },
  {
    id: 2,
    name: "Card",
    minBet: 50,
    description: "A standard playing card with a rank and suit.",
    difficulty: [
      {
        chanceOfWinning: 0.5,
        multiplier: 1.2,
        chanceOfGettingAddicted: 0.05,
        lossOfGettingAddicted: [2, 4],
      },
      {
        chanceOfWinning: 0.2,
        multiplier: 1.5,
        chanceOfGettingAddicted: 0.1,
        lossOfGettingAddicted: [3, 5],
      },
      {
        chanceOfWinning: 0.1,
        multiplier: 2,
        chanceOfGettingAddicted: 0.2,
        lossOfGettingAddicted: [4, 6],
      },
    ],
  },
];

function createCasinoItems() {
  const casinoContainer = document.getElementById("casino-container");
  casinoContainer.innerHTML = "";
  for (let i = 0; i < casinoItems.length; i++) {
    let item = casinoItems[i];

    const itemElement = document.createElement("div");
    itemElement.classList.add("casino-item");

    const initialDifficulty = Math.floor(
      Math.random() * (item.difficulty.length - 0.1),
    );
    const initialBet = Math.random().toFixed(3);
    const minBet = item.minBet || 50;
    itemElement.innerHTML = `
      <p class="casino-header">${item.name}</p>

      <p class="casino-input-text" id="difficulty-text">Difficulty:</p>
      <input
        class="casino-difficulty-input"
        type="range"
        step="1"
        min="0"
        max="${item.difficulty.length - 1}"
        value="${initialDifficulty}"
      />

      <p class="casino-description">${item.description}</p>

      <p class="casino-input-text" id="bet-text">Bet: ${formatCost(Math.max(initialBet * player.balance, minBet))}</p>
      <input
        class="casino-bet-input"
        type="range"
        step=".001"
        min="0"
        max="1"
        value="${initialBet}"
        bet="${Math.max(initialBet * player.balance, minBet)}"
      />

      <button class="casino-btn">Play</button>
    `;

    const betTextElement = itemElement.querySelector("#bet-text");

    const difficultyInputElement = itemElement.querySelector(
      ".casino-difficulty-input",
    );

    const betInputElement = itemElement.querySelector(".casino-bet-input");

    difficultyInputElement.addEventListener("input", () => {
      console.log("Difficulty changed", difficultyInputElement.value);
    });

    betInputElement.addEventListener("input", () => {
      console.log("Bet amount changed", betInputElement.value * player.balance);
      betInputElement.setAttribute(
        "bet",
        Math.max(initialBet * player.balance, minBet),
      );
      betTextElement.textContent = `Bet: ${formatCost(Math.max(betInputElement.value * player.balance, minBet))}`;
    });

    const playButton = itemElement.querySelector(".casino-btn");
    playButton.addEventListener("click", () => {
      notify(
        `Play button clicked, paying amount: ${parseFloat(betInputElement.getAttribute("bet"))}`,
        {
          title: "IMPORTANT",
          type: "info",
        },
      );
    });

    casinoContainer.appendChild(itemElement);
  }

  updateSliders();
}
