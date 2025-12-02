const DEBUG_MODE = true;
const savingSpot = "_GamblingSimulator2";

let player = {
  balance: 0,
  totalMoneyEarned: 0,
};

function is_touch_enabled() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

let isOnTouchScreen = is_touch_enabled();

// Reads CSS variable from stylesheet, not inline
function cssVar(el, name) {
  return getComputedStyle(el).getPropertyValue(name).trim();
}

// Disable console.log if DEBUG_MODE is false
if (!DEBUG_MODE) {
  console.log = function () {};
  console.warn = function () {};
  console.error = function () {};
}

console.log("DEBUG MODE IS ACTIVATED");
console.log("isOnTouchScreen:", isOnTouchScreen);

// Save player data to local storage
function savePlayerData() {
  localStorage.setItem(savingSpot, JSON.stringify(player));
}

// Load player data from local storage
function loadPlayerData() {
  const savedData = localStorage.getItem(savingSpot);
  if (savedData) {
    player = JSON.parse(savedData);
  }
}

// Call savePlayerData function before exiting the game
window.addEventListener("beforeunload", savePlayerData);

// Call loadPlayerData function when the game starts
window.addEventListener("load", () => {
  loadPlayerData();
  if (DEBUG_MODE) {
    player.balance = 1e300;
  }
  updateBalance();
  createCasinoItems();
});
