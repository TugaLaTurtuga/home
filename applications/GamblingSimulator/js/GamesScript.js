// Function to play the selected game
function playGame(game, level, gameButton) {
    const cost = level.cost; // Keep the cost reference, no need to deduct money here
    
    const randomChance = Math.random();
    let winnings = 0;
    let wonOrLost = null;
    let PrizeMoney = 0;

    // Determine winnings based on chance
    if (randomChance < level.chance) {
        winnings = Math.floor(Math.random() * (level.prizeRange[1] - level.prizeRange[0] + 1)) + level.prizeRange[0];
        addMoney(winnings);
        PrizeMoney = winnings;
        wonOrLost = true;
       
    } else {
        wonOrLost = false;
    }

    // Handle addiction mechanics
    const addictionChance = Math.random();
    if (addictionChance < level.changeOfGettingAddicted && wonOrLost) {
        const lossMultiplier = Math.floor(Math.random() * (level.lossOfGettingAddicted[1] - level.lossOfGettingAddicted[0] + 1)) + level.lossOfGettingAddicted[0];
        const lossAmount = level.cost * lossMultiplier; // Calculate the loss based on the cost and multiplier
        deductMoney(lossAmount, true); // Deduct the loss amount from the player's total money
        PrizeMoney -= lossAmount
        wonOrLost = null;
    }
    displayResult(wonOrLost, PrizeMoney);

    gameButton.innerText = `Play for $${cost}`; // Reset button text
}

// Initialize games section
function createGamesSection() {
    const gamesSection = document.getElementById('games-section');

    // Create game cards dynamically for each game and level
    for (let game in games) {
        const gameGrid = document.getElementById(game.charAt(0).toUpperCase() + game.slice(1));

        games[game].forEach((level) => {
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';
            
            const gameTitle = document.createElement('h2');
            gameTitle.innerText = `${level.name}`;

            const gameDescription = document.createElement('p');
            gameDescription.innerText = level.description;

            const gameButton = document.createElement('button');
            gameButton.innerText = `Play for $${level.cost}`; // Initial button text
            gameButton.disabled = false; // Initially enabled

            // Store the last play time for the current game
            gameButton.lastPlayTime = 0;

            gameButton.onclick = () => {
                const currentTime = Date.now();
                const cooldownTime = level.cooldown * 1000; // Convert cooldown to milliseconds

                // Check if enough money is available to play the game
                if (!deductMoney(level.cost)) {
                    gameButton.innerText = "Not enough money";
                    setTimeout(() => {
                        gameButton.innerText = `Play for $${level.cost}`; // Reset button text after delay
                    }, 1000);
                    return; // Exit the function early if not enough money
                }
                totalMoneyGambled += level.cost;
                ++amountOfTimesGambled;

                // Check if enough time has passed since last play
                if (currentTime - gameButton.lastPlayTime >= cooldownTime) {
                    // Update last play time
                    gameButton.lastPlayTime = currentTime;

                    // Change button text to "Playing..." when clicked
                    gameButton.innerText = `Playing...`;
                    gameButton.disabled = true; // Disable button during play
                    playGame(game, level, gameButton);

                    // Start cooldown countdown
                    let remainingTime = cooldownTime / 1000; // Convert to seconds
                    const countdownInterval = setInterval(() => {
                        if (remainingTime > 0) {
                            gameButton.innerText = `Cooldown: ${remainingTime.toFixed(1)}s`; // Show one decimal place
                            remainingTime -= 0.1; // Decrease remaining time by 0.1 seconds
                        } else {
                            clearInterval(countdownInterval); // Clear interval when done
                            gameButton.disabled = false; // Re-enable the button
                            gameButton.innerText = `Play for $${level.cost}`; // Reset button text
                        }
                    }, 100); // Update every 100 milliseconds
                } else {
                    // Calculate remaining time
                    const elapsedTime = currentTime - gameButton.lastPlayTime; // Time since last play
                    const remainingTime = Math.ceil((cooldownTime - elapsedTime) / 1000); // Calculate remaining time in seconds
                    alert(`You must wait ${remainingTime} seconds before playing again.`);
                }
            };

            gameCard.appendChild(gameTitle);
            gameCard.appendChild(gameDescription);
            gameCard.appendChild(gameButton);
           
            gameGrid.appendChild(gameCard);
        });
    }
}

// Load the lottery and games section when the page is loaded
window.onload = () => {
    createGamesSection();
};

// Display result function
let result = "RESULT";

function displayResult(win, winnings) {
    // Get the first element with the class 'game-result'
    const resultElement = document.getElementsByClassName('game-result')[0];

    if (win !== null) {
        result = win ? `You won $${winnings}!` : "You lost!";         
    } else {
        const addictionMessages = [
            `You won! but got addicted $${winnings}. Guess the real prize is your dignity, huh?`,
            `You won! but your money just became a donation to the Gambling Center© - $${winnings} gone!`,
            `Congratulations! You won! Just remember, every victory has a price: $${winnings} to addiction. Good luck with that!`,
            `Nice win! But don’t get too comfy; addiction just took $${winnings} and left you a sad little trophy.`,
            `You hit the jackpot! Oh wait, the house just lifted $${winnings} from your pocket while you weren’t looking.`,
            `Look at you, big winner! But guess what? Your cash just joined the “lost to addiction” club - $${winnings}.`,
            `You won! But hey, why keep it? The addiction monster needs $${winnings} for its buffet!`,
            `Bravo! You scored a win! But addiction just made off with your money like a thief in the night. Bye-bye $${winnings}.`,
            `You won! But your wallet's on a diet now, thanks to addiction draining it of $${winnings}.`,
            `Congratulations! You won! Too bad addiction just called dibs on your $${winnings}. Enjoy the regret!`,
            `You hit the jackpot! But don't celebrate too hard; the addiction tax is $${winnings}. Welcome to the club!`,
            `You scored a win! But addiction just RSVP’d to your wallet’s funeral with a $${winnings} bill.`,
            `You won! But your money just took a one-way trip to the land of lost bets - $${winnings} included.`,
            `Wow, you won! But hold the applause; addiction just pocketed $${winnings} for itself. Nice going!`,
            `You won! But your cash is now the newest resident of the "lost to addiction" neighborhood, $${winnings} rent paid!`,
            `Congrats on the win! But guess who just snatched $${winnings}? That’s right, addiction!`,
            `Wow, you won! But won remembered that "99% of gamblers quit before hitting big" 💯 $${winnings}`,
            `Did you just said that you "like Eduardo"??? 🚨🚨 $${winnings}`
        ];        
       
        // Randomly select a message from the array
        const randomIndex = Math.floor(Math.random() * addictionMessages.length);
        result = addictionMessages[randomIndex];

        if (playerBalance < 0) {
            takeLoan(playerBalance * -1.2, 12, 4);
        }
    }
    totalMoneyWonOnGambling += winnings;
    saveGameData();

    const waitTime = result.length * 60; // Adjust wait time based on result length

    // Set the result text inside the <p> tag
    resultElement.innerText = result;

    try {
        resultElement.classList.remove('show');
    } catch (error) {
        console.error("Error removing 'show' class bc it doesn't exist"); // Log error if any
    }

    // Add the 'show' class to display the result
    resultElement.classList.add('show');
    setTimeout(() => {
        resultElement.classList.remove('show');
    }, waitTime);
}
