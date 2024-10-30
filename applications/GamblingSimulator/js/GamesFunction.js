const PlayGames = true; // will go to settings in the future or not
const PlaceholderElement = document.querySelector('#GamePlaceholder');
let GameSettings = { 
    name: "", 
    cost: 0, 
    prizeRange: [0, 0], 
    description: "", 
    chance: 0, 
    cooldown: 0,
    playingTime: 0,
    changeOfGettingAddicted: 0,
    lossOfGettingAddicted: [0, 0]
};

// All of the fuctions for each game
function PokerGame(wonOrLost, winnings) {
    return new Promise(resolve => {
        console.log("Playing Poker...");

        if (PlayGames) {
            SeeGame(false);
            setTimeout(() => {
                SeeGame(false);
                addMoney(winnings);
                displayResult(wonOrLost, winnings);
                resolve(true);
            }, 1000); // Duration of the game
        } else {
            addMoney(winnings);
            displayResult(wonOrLost, winnings);
            resolve(true);
        }
    });
}

function RouletteGame(wonOrLost, winnings) {
    return new Promise(resolve => {
        console.log("Playing Roulette...");
        
        if (PlayGames) {
            SeeGame();
            setTimeout(() => {
                SeeGame();
                displayResult(wonOrLost, winnings);
                resolve(true);
            }, 1000); // Duration of the game
        } else {
            addMoney(winnings);
            displayResult(wonOrLost, winnings);
            resolve(true);
        }
    });
}

function SlotsGame(wonOrLost, winnings) {
    return new Promise(resolve => {
        console.log("Playing Slots...");
        
        if (PlayGames) {
            SeeGame(false);
            setTimeout(() => {
                SeeGame(false);
                addMoney(winnings);
                displayResult(wonOrLost, winnings);
                resolve(true);
            }, 1000); // Duration of the game
        } else {
            addMoney(winnings);
            displayResult(wonOrLost, winnings);
            resolve(true);
        }
    });
}

function ScratchCardsGame(wonOrLost, winnings) {
    return new Promise(resolve => {
        console.log("Playing Scratchcards...");
       
        if (PlayGames) {
            SeeGame(false);
            setTimeout(() => {
                SeeGame(false);
                addMoney(winnings);
                displayResult(wonOrLost, winnings);
                resolve(true);
            }, 1000); // Duration of the game
        } else {
            addMoney(winnings);
            displayResult(wonOrLost, winnings);
            resolve(true);
        }
    });
}

function BlackjackGame(wonOrLost, winnings, level) {
    GameSettings = level;
    return new Promise(resolve => {
        console.log("Playing Blackjack...");
        
        if (PlayGames) {
            SeeGame();
            PlaceholderElement.style.backgroundColor = "#2e8b57";
            PlaceholderElement.style.border = "solid 2px #ccc";
            PlaceholderElement.style.boxShadow = "0 10px 12px rgba(0, 0, 0, .4)";
            PlaceholderElement.innerHTML = '';

            const gameDiv = document.createElement('div');
            gameDiv.id = 'BlackjackGame';
            PlaceholderElement.appendChild(gameDiv);

            // Set up Blackjack game HTML
            gameDiv.innerHTML = `
                <h1>Blackjack</h1>
                <div id="status" class="score"></div>
                <div class="score">Player: <span id="playerScore">0</span></div>
                <div class="hand" id="playerHand"></div>
                <div class="score">Dealer: <span id="dealerScore">0</span></div>
                <div class="hand" id="dealerHand"></div>
                <div class="BlackJackbuttons">
                    <button onclick="Blackjackhit()">Hit</button>
                    <button onclick="Blackjackstand()">Stand</button>
                </div>
            `;

            BlackjackinitGame(resolve);
        }
    });
}

function LotteriesGame(wonOrLost, winnings) {
    return new Promise(resolve => {
        console.log("Playing Lotteries...");

        if (PlayGames) {
            SeeGame(false);
            setTimeout(() => {
                addMoney(winnings);
                SeeGame(false);
                displayResult(wonOrLost, winnings);
                resolve(true);
            }, 1000); // Duration of the game
        } else {
            addMoney(winnings);
            displayResult(wonOrLost, winnings);
            resolve(true);
        }
    });
}

function SeeGame(hasGame=true) {
    if (hasGame) {
        if (PlaceholderElement.classList.contains('show')) {
            PlaceholderElement.classList.remove('show');
        } else {
            PlaceholderElement.classList.add('show');
        }
    }
}