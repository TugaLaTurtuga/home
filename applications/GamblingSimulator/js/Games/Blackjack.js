// Blackjack Game Code
let deck, playerHand, dealerHand, playerScore, dealerScore;

// Initialize the game with a shuffled deck and initial hands
function BlackjackinitGame(resolve) {
    deck = BlackjackcreateDeck();
    playerHand = [BlackjackdrawCard(), BlackjackdrawCard()];
    dealerHand = [BlackjackdrawCard(), BlackjackdrawCard()];
    BlackjackupdateAndRender();
    document.getElementById('status').textContent = 'Game started. Good luck!';
    
    // Store resolve to handle end of game
    window.gameResolve = resolve;
}

// Create a shuffled deck of cards
function BlackjackcreateDeck() {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
    return suits.flatMap(suit => values.map(value => ({ value, suit }))).sort(() => Math.random() - 0.5);
}

// Draw the top card from the deck
function BlackjackdrawCard() {
    return deck.pop();
}

// Calculate the score of a hand, adjusting for aces if needed
function BlackjackcalculateScore(hand) {
    let score = 0;
    let aceCount = 0;

    // Initial score calculation, with each ace counted as 11
    hand.forEach(card => {
        if (card.value === 'ace') {
            aceCount += 1;
            score += 11;
        } else if (['jack', 'queen', 'king'].includes(card.value)) {
            score += 10;
        } else {
            score += parseInt(card.value);
        }
    });

    // Adjust score if over 21 and there are aces
    while (score > 21 && aceCount > 0) {
        score -= 10;
        aceCount -= 1;
    }

    return score;
}

// Update scores and render both hands
function BlackjackupdateAndRender() {
    playerScore = BlackjackcalculateScore(playerHand);
    dealerScore = BlackjackcalculateScore(dealerHand);

    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('dealerScore').textContent = dealerScore;

    BlackjackrenderHands();
}

// Render hands with card images
function BlackjackrenderHands() {
    const renderHand = (hand, elementId) => {
        const handDisplay = document.getElementById(elementId);
        handDisplay.innerHTML = ''; // Clear previous cards
        hand.forEach(card => {
            const img = document.createElement('img');
            img.src = `Images/cards/${card.value}_of_${card.suit}.png`;
            img.alt = `${card.value} of ${card.suit}`;
            img.className = 'card';
            handDisplay.appendChild(img);
        });
    };
    renderHand(playerHand, 'playerHand');
    renderHand(dealerHand, 'dealerHand');
}

// End the game, show result, and reset styles
function BlackjackendGame(wonOrLost, IsBlackjack=false) {
    const winnings = wonOrLost ? Math.floor(Math.random() * 301) + 100 : 0;
    displayResult(wonOrLost, IsBlackjack ? winnings * 1.5 : winnings);

    setTimeout(() => {
        SeeGame();
        if (wonOrLost) addMoney(winnings);
        PlaceholderElement.style.backgroundColor = '';
        PlaceholderElement.style.border = '';
        PlaceholderElement.style.boxShadow = '';
        window.gameResolve(true);
    }, 1000);
}

// Player hits to draw another card
function Blackjackhit() {
    playerHand.push(BlackjackdrawCard());
    BlackjackupdateAndRender();

    const status = document.getElementById('status');
    if (playerScore > 21) {
        status.textContent = 'You busted! Dealer wins!';
        BlackjackendGame(false);
    } else if (playerScore === 21) {
        status.textContent = 'Blackjack! You win!';
        BlackjackendGame(true, true);
    }
}

// Player stands; dealer draws until score is 17 or more
function Blackjackstand() {
    function dealerDraw() {
        if (dealerScore < 17) {
            dealerHand.push(BlackjackdrawCard());
            BlackjackupdateAndRender();

            // Continue drawing if dealer score is less than 17
            setTimeout(dealerDraw, 500);
        } else {
            // Determine the winner after dealer finishes drawing
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

    dealerDraw();
}
