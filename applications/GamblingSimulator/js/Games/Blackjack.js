// Blackjack Game Code
let deck, playerHand, dealerHand, playerScore, dealerScore;

function BlackjackinitGame(resolve) {
    deck = BlackjackcreateDeck();
    playerHand = [BlackjackdrawCard(), BlackjackdrawCard()];
    dealerHand = [BlackjackdrawCard(), BlackjackdrawCard()];
    BlackjackupdateScores();
    BlackjackrenderHands();
    document.getElementById('status').textContent = 'Game started. Good luck!';
    
    // Pass resolve to handle end of game
    window.gameResolve = resolve;
}

function BlackjackcreateDeck() {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
    let deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ value, suit });
        }
    }
    return deck.sort(() => Math.random() - 0.5);
}

function BlackjackdrawCard() {
    return deck.pop();
}

function BlackjackcalculateScore(hand) {
    let score = 0, aces = 0;
    hand.forEach(card => {
        if (card.value === 'ace') {
            aces += 1;
            score += 11;
        } else if (['king', 'queen', 'jack'].includes(card.value)) {
            score += 10;
        } else {
            score += parseInt(card.value);
        }
    });
    while (score > 21 && aces) {
        score -= 10;
        aces -= 1;
    }
    return score;
}

function BlackjackupdateScores() {
    playerScore = BlackjackcalculateScore(playerHand);
    dealerScore = BlackjackcalculateScore(dealerHand);
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('dealerScore').textContent = dealerScore;
}

function BlackjackrenderHands() {
    const playerHandDisplay = document.getElementById('playerHand');
    const dealerHandDisplay = document.getElementById('dealerHand');
    playerHandDisplay.innerHTML = '';
    dealerHandDisplay.innerHTML = '';

    playerHand.forEach(card => {
        const img = createCardImage(card);
        playerHandDisplay.appendChild(img);
    });
    dealerHand.forEach(card => {
        const img = createCardImage(card);
        dealerHandDisplay.appendChild(img);
    });
}

function createCardImage(card) {
    const img = document.createElement('img');
    img.src = `Images/cards/${card.value}_of_${card.suit}.png`;
    img.alt = `${card.value} of ${card.suit}`;
    img.className = 'card';
    return img;
}

function BlackjackendGame(wonOrLost, IsBlackjack=false) {
    let winnings = Math.floor(Math.random() * (GameSettings.prizeRange[1] - GameSettings.prizeRange[0] + 1)) + GameSettings.prizeRange[0];
    if (IsBlackjack) {
        winnings = winnings * 1.5;
    }

    displayResult(wonOrLost, winnings);
    setTimeout(() => {
        SeeGame();
        if (wonOrLost) {addMoney(winnings);}
        window.gameResolve(true);
        PlaceholderElement.style.backgroundColor = '';
        PlaceholderElement.style.border = '';
        PlaceholderElement.style.boxShadow = '';
    }, 1000);
}

function Blackjackhit() {
    playerHand.push(BlackjackdrawCard());
    BlackjackupdateScores();
    BlackjackrenderHands();
    const status = document.getElementById('status');
    if (playerScore > 21) {
        status.textContent = 'You busted! Dealer wins!';
        BlackjackendGame(false);
    } else if (playerScore === 21) {
        status.textContent = 'Blackjack! You win!';
        BlackjackendGame(true, true);
    }
}

function Blackjackstand() {
    function dealerDraw() {
        if (dealerScore < 17) {
            // Draw a card for the dealer and update the scores and display
            dealerHand.push(BlackjackdrawCard());
            BlackjackupdateScores();
            BlackjackrenderHands();

            // Delay the next draw by 500ms if dealer still needs to draw
            setTimeout(dealerDraw, 500);
        } else {
            // Check game outcome once dealer's score is 17 or higher
            const status = document.getElementById('status');
            if (dealerScore > 21) {
                status.textContent = 'Dealer busted! You win!';
                BlackjackendGame(true);
            } else if (dealerScore >= playerScore) {
                status.textContent = 'Dealer wins!';
                BlackjackendGame(false);
            } else {
                status.textContent = 'You win!';
                BlackjackendGame(true);
            }
        }
    }

    // Start the dealer drawing process
    dealerDraw();
}
