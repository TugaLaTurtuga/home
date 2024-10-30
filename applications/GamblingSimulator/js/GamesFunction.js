const PlayGames = true; // will go to settings in the future or not

// All of the fuctions for each game
function PokerGame(wonOrLost, winnings) {
    return new Promise(resolve => {
        console.log("Playing Poker...");

        if (PlayGames) {
            SeeGame()
            setTimeout(() => {
                displayResult(wonOrLost, winnings);
                SeeGame()
                resolve(true);
            }, 1000); // Duration of the game
        } else {
            displayResult(wonOrLost, winnings);
            resolve(true);
        }
    });
}

function RouletteGame(wonOrLost, winnings) {
    return new Promise(resolve => {
        console.log("Playing Roulette...");
        
        if (PlayGames) {
            SeeGame()
            setTimeout(() => {
                SeeGame()
                displayResult(wonOrLost, winnings);
                resolve(true);
            }, 1000); // Duration of the game
        } else {
            displayResult(wonOrLost, winnings);
            resolve(true);
        }
    });
}

function SlotsGame(wonOrLost, winnings) {
    return new Promise(resolve => {
        console.log("Playing Slots...");
        
        if (PlayGames) {
            SeeGame()
            setTimeout(() => {
                SeeGame()
                displayResult(wonOrLost, winnings);
                resolve(true);
            }, 1000); // Duration of the game
        } else {
            displayResult(wonOrLost, winnings);
            resolve(true);
        }
    });
}

function ScratchCardsGame(wonOrLost, winnings) {
    return new Promise(resolve => {
        console.log("Playing Scratchcards...");
        
        if (PlayGames) {
            SeeGame()
            setTimeout(() => {
                SeeGame()
                displayResult(wonOrLost, winnings);
                resolve(true);
            }, 1000); // Duration of the game
        } else {
            displayResult(wonOrLost, winnings);
            resolve(true);
        }
    });
}

function LotteriesGame(wonOrLost, winnings) {
    return new Promise(resolve => {
        console.log("Playing Lotteries...");

        if (PlayGames) {
            SeeGame()
            setTimeout(() => {
                SeeGame()
                displayResult(wonOrLost, winnings);
                resolve(true);
            }, 1000); // Duration of the game
        } else {
            displayResult(wonOrLost, winnings);
            resolve(true);
        }
    });
}

function SeeGame() {
    /*
    const settingsElement = document.querySelector('#GamePlaceholder');
    if (settingsElement.classList.contains('show')) {
        settingsElement.classList.remove('show');
    } else {
        settingsElement.classList.add('show');
    }
    */
}