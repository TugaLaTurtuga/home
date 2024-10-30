// Blackjack Game Code
let deck, playerHand, dealerHand, playerScore, dealerScore;

function BlackjackinitGame(resolve) {
    deck = BlackjackcreateDeck();
    playerHand = [BlackjackdrawCard(), BlackjackdrawCard()];
    dealerHand = [BlackjackdrawCard(), BlackjackdrawCard()];
    BlackjackupdateAndRender();
    document.getElementById('status').textContent = 'Game started. Good luck!';
    
    // Store resolve to handle end of game
    window.gameResolve = resolve;
}

function BlackjackcreateDeck() {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
    return suits.flatMap(suit => values.map(value => ({ value, suit }))).sort(() => Math.random() - 0.5);
}

function BlackjackdrawCard() {
    return deck.pop();
}

function BlackjackcalculateScore(hand) {
    let score = hand.reduce((total, card) => {
        if (card.value === 'ace') return total + 11;
        return total + (['jack', 'queen', 'king'].includes(card.value) ? 10 : parseInt(card.value));
    }, 0);

    // Adjust for aces if score is over 21
    let aceCount = hand.filter(card => card.value === 'ace').length;
    while (score > 21 && aceCount > 0) {
        score -= 10;
        aceCount -= 1;
    }
    return score;
}

function BlackjackupdateAndRender() {
    playerScore = BlackjackcalculateScore(playerHand);
    dealerScore = BlackjackcalculateScore(dealerHand);

    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('dealerScore').textContent = dealerScore;

    BlackjackrenderHands();
}

function BlackjackrenderHands() {
    const renderHand = (hand, elementId) => {
        const handDisplay = document.getElementById(elementId);
        handDisplay.innerHTML = hand.map(card => {
            return `<img src="Images/cards/${card.value}_of_${card.suit}.png" alt="${card.value} of ${card.suit}" class="card">`;
        }).join('');
    };
    renderHand(playerHand, 'playerHand');
    renderHand(dealerHand, 'dealerHand');
}

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
