/**************************
 * Blackjack Game Code *
 **************************/
let deck, playerHand, dealerHand, playerScore, dealerScore;

// Initialize the game with a shuffled deck and initial hands
function BlackjackinitGame(resolve) {
    deck = BlackjackcreateDeck();
    do {
        playerHand = [BlackjackdrawCard(), BlackjackdrawCard()];
        dealerHand = [BlackjackdrawCard(), BlackjackdrawCard()];
        playerScore = BlackjackcalculateScore(playerHand);
        dealerScore = BlackjackcalculateScore(dealerHand);
    } while (playerScore > 19 || dealerScore > 18); // Ensure player max 19, dealer max 18

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
    const BJBtn = document.querySelectorAll('.BlackJackbuttons button');
    BJBtn.forEach(button => {
        button.disabled = true;
    });

    const winnings = wonOrLost ? Math.floor(Math.random() * (GameSettings.prizeRange[1] - GameSettings.prizeRange[0] + 1)) + GameSettings.prizeRange[0] : 0;
    displayResult(wonOrLost, IsBlackjack ? winnings * 1.5 : winnings);

    setTimeout(() => {
        SeeGame(false);
        PlaceholderElement.style.backgroundColor = '';
        PlaceholderElement.style.border = '';
        PlaceholderElement.style.boxShadow = '';
        window.gameResolve(true);
    }, 1000 * gameSpeed);
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
            setTimeout(dealerDraw, 500 * gameSpeed);
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

/**************************
 * Slot Machine Game Code *
 **************************/

const symbols = ["🍒", "🍋", "🍊", "🍉", "🍇", "⭐"];
let numSlots = 3, leverMoving = false;
const spinDuration = 1000;
const totalSymbols = 300;
let level = 0;

function startSlots(resolve, level) {
    window.gameResolve = resolve;
    leverMoving = false;
    const slotMachine = document.createElement('div');
    slotMachine.id = 'slotMachine';
    PlaceholderElement.appendChild(slotMachine);

    switch (level.level) {
        case 1:
            return initializeSlots(3);
        case 2:
            return initializeSlots(5);
        case 3:
            return initializeSlots(6);
    }
}

function initializeSlots(numSlots) {
    const slotMachine = document.getElementById('slotMachine');
    level = numSlots;
    slotMachine.innerHTML = ""; // Clear existing slots

    willWin = Math.random() < GameSettings.chance;

    for (let i = 0; i < numSlots; i++) {
        const slotDiv = document.createElement("div");
        slotDiv.classList.add("slot");
        
        const symbolsContainer = document.createElement("div");
        symbolsContainer.classList.add("symbols");
        slotDiv.appendChild(symbolsContainer); 
        slotMachine.appendChild(slotDiv);

        setTimeout(() => {
            const computedWidth = window.getComputedStyle(symbolsContainer).width;
            symbolsContainer.style.fontSize = computedWidth;
            console.log(symbolsContainer.style.fontSize, computedWidth);
        }, 100 * gameSpeed)
        
    }    

    const message = document.createElement('div');
    message.id = 'message';

    const leverContainer = document.createElement('div');
    leverContainer.className = 'lever-container';
    const lever = document.createElement('div');
    lever.className = 'lever';
    const leverBall = document.createElement('div');
    leverBall.className = 'lever-ball';
    leverBall.id = 'leverBall';
    lever.appendChild(leverBall);
    leverContainer.appendChild(lever);
    PlaceholderElement.appendChild(leverContainer);
    PlaceholderElement.appendChild(message);
    makeLever();
}

function Slotspin() {
    const slots = document.querySelectorAll(".slot .symbols");
    const message = document.getElementById("message");
    message.textContent = "Spinning...";

    // Set the winning symbol if applicable
    const winningSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    slots.forEach((symbolsContainer, index) => {
        symbolsContainer.innerHTML = ""; // Clear previous symbols

        
        for (let i = 0; i < (totalSymbols * (index + 1)); i++) {
            if (willWin && i === 0) {
                symbolsContainer.innerHTML = `<div>${winningSymbol}</div>`;
            } else {
                const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                const symbolElement = document.createElement("div");
                symbolElement.textContent = randomSymbol;
                symbolsContainer.appendChild(symbolElement);
            }
        }

        // Apply CSS animation with consistent timing
        symbolsContainer.style.animation = `spin ${spinDuration * (1 + (index + 1))}ms linear forwards`;

        // Reset animation after it ends
        symbolsContainer.addEventListener("animationend", () => {
            symbolsContainer.style.animation = "none";
            symbolsContainer.style.top = "10px"; // Reset the position for visual consistency
        });
    });

    // Display result based on the pre-determined win/loss outcome
    setTimeout(() => {
        if (willWin) {
            const winnings = Math.floor(Math.random() * (GameSettings.prizeRange[1] - GameSettings.prizeRange[0] + 1)) + GameSettings.prizeRange[0];
            displayResult(willWin, winnings);
            addMoney(winnings);
            message.textContent = "🎉 Jackpot! You Win! 🎉";
        } else {
            displayResult(false, 0)
            message.textContent = "Try Again!";
        }

        // Reset the lever ball position
        leverBall.style.top = "0"; // Move the lever ball back to the top
        leverMoving = null; // Allow moving again
        
        setTimeout(() => {
            SeeGame(false);
        }, 1000 * gameSpeed)

        setTimeout(() => {
            PlaceholderElement.innerHTML = ''
            window.gameResolve(true);
        }, 1300 * gameSpeed)
        
    }, spinDuration * (level + 1) * gameSpeed);
}

function makeLever() {
    const leverBall = document.getElementById("leverBall");
    
    // Event handler to start the lever movement
    function startMove(event) {
        if (leverMoving) return; // Prevent moving while already moving
        if (leverMoving !== null) leverMoving = true;

        // Determine the starting Y position, whether from a mouse or touch event
        const startY = event.type === 'mousedown' ? event.clientY : event.touches[0].clientY;
        const initialLeverTop = parseInt(window.getComputedStyle(leverBall).top); // Initial lever position

        // Movement handler for both mouse and touch
        function onMove(moveEvent) {
            const currentY = moveEvent.type === 'mousemove' ? moveEvent.clientY : moveEvent.touches[0].clientY;
            const deltaY = currentY - startY; // Calculate distance moved
            const newTop = Math.min(Math.max(initialLeverTop + deltaY, 0), 60); // Limit lever movement between 0 and 60px
            leverBall.style.top = `${newTop}px`; // Move lever ball
        }

        // End move and handle lever release
        function endMove() {
            if (parseInt(leverBall.style.top) >= 60) {
                Slotspin(); // Start spinning if lever is fully pulled down
                leverBall.style.top = "60px"; // Keep it down after pulling
            } else {
                leverBall.style.top = "0px"; // Reset if not fully pulled
            }
            leverMoving = false; // Allow moving again

            // Remove both mouse and touch listeners for cleanup
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", endMove);
            document.removeEventListener("touchmove", onMove);
            document.removeEventListener("touchend", endMove);
        }

        // Add both mouse and touch listeners for movement and end of interaction
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", endMove);
        document.addEventListener("touchmove", onMove);
        document.addEventListener("touchend", endMove);
    }

    // Add both mouse and touch listeners for the start of interaction
    leverBall.addEventListener("mousedown", startMove);
    leverBall.addEventListener("touchstart", startMove);
}

/**************************
 * Scratch Cards Code *
**************************/

let revealedSymbols = [];
let attempts = 0;
let totalCells;

const symbolSet = [
    '💎', '💰', '🍀', 
    '⭐', '🥶', '🍒', 
    '💯', '💀', '👀',
];
const colorSet = [
    'rgb(50, 100, 50)', 'rgb(10, 100, 100)', 'rgb(150, 50, 50)', 
    'rgb(100, 100, 100)', 'rgb(100, 100, 150)', 'rgb(100, 100, 50)', 
    'rgb(150, 150, 150)', 'rgb(150, 50, 150)', 'rgb(150, 250, 150)',
]

let UsergridSize = 0;

function generateGrid(gridSize, level, resolve, wonOrLost, winnings) {
    window.gameResolve = resolve;
    totalCells = gridSize * gridSize;
    UsergridSize = gridSize
    revealedSymbols = [];
    attempts = 0;

    PlaceholderElement.innerHTML = '';
    PlaceholderElement.style.maxWidth = '450px';
    PlaceholderElement.style.maxHeight = '450px';

    const scContainer = document.createElement('div');
    scContainer.className = 'sc_container';
    PlaceholderElement.appendChild(scContainer);

    const canvas = document.createElement('canvas');
    canvas.className = 'sc_canvas';
    canvas.getContext('2d', { willReadFrequently: true });
    scContainer.appendChild(canvas);

    const form = document.createElement('div');
    form.className = 'sc_form';
    scContainer.appendChild(form);

    form.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    form.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

    // Create unique amounts
    const uniqueAmounts = Array.from({ length: parseInt(totalCells / 1.2) }, () =>
        `$${(Math.random() * (GameSettings.prizeRange[1] - GameSettings.prizeRange[0]) + GameSettings.prizeRange[0]).toFixed(2)}`);
    const amounts = Array.from({ length: totalCells }, (_, index) => uniqueAmounts[index % uniqueAmounts.length]);

    // Determine if a duplicated line should be created
    const hasDuplicateLine = Math.random() < GameSettings.chance;

    if (hasDuplicateLine) {
        const duplicateAmount = uniqueAmounts[Math.floor(Math.random() * uniqueAmounts.length)];

        // Determine whether to create a row, column, or diagonal with the same prize
        const lineType = ['row', 'column', 'diagonal'][Math.floor(Math.random() * 3)];

        if (lineType === 'row') {
            const rowIndex = Math.floor(Math.random() * gridSize);
            for (let col = 0; col < gridSize; col++) {
                amounts[rowIndex * gridSize + col] = duplicateAmount;
            }
        } else if (lineType === 'column') {
            const colIndex = Math.floor(Math.random() * gridSize);
            for (let row = 0; row < gridSize; row++) {
                amounts[row * gridSize + colIndex] = duplicateAmount;
            }
        } else if (lineType === 'diagonal') {
            if (Math.random() < 0.5) {
                for (let i = 0; i < gridSize; i++) {
                    amounts[i * gridSize + i] = duplicateAmount;
                }
            } else {
                for (let i = 0; i < gridSize; i++) {
                    amounts[i * gridSize + (gridSize - 1 - i)] = duplicateAmount;
                }
            }
        }
    } else {
        // Check and adjust if there’s an unintended win
        const changedMoney = `$${(Math.random() * 100).toFixed(2)}`;
        while (isWinningConfiguration(amounts, gridSize)) {
            const randomIndex = Math.floor(Math.random() * totalCells);
            amounts[randomIndex] = changedMoney;
            if (uniqueAmounts.indexOf(changedMoney) !== 1) { uniqueAmounts.appendChild(changedMoney) }
        }
    }

    // Populate the grid with cells
    amounts.forEach((amount, index) => {
        const cell = document.createElement('div');
        cell.className = 'prize';

        // Find the index of the amount in uniqueAmounts to get the symbol
        const symbolIndex = uniqueAmounts.indexOf(amount);
        const symbol = symbolIndex !== -1 ? symbolSet[symbolIndex % symbolSet.length] : '❓'; // Default symbol if not found

        const color = symbolIndex !== -1 ? colorSet[symbolIndex % colorSet.length] : 'rgb(150, 150, 150)'; // Default symbol if not found

        // Set cell content
        cell.innerHTML = `<div id="prizeInfo" style="background-color: ${color};"><p>${symbol}</p><p>${amount}</p></div>`;
        cell.dataset.amount = amount;

        form.appendChild(cell);

        setTimeout(() => {
            const cellWidth = parseFloat(getComputedStyle(cell).width); // Get the computed width
            cell.style.fontSize = `${cellWidth / 5}px`; // Set font size relative to width
        }, 0); // Use a timeout to ensure the width is computed after rendering
    });

    setupScratchEffect(canvas, scContainer);
}

// Helper function to check if there's a winning line
function isWinningConfiguration(amounts, gridSize) {
    // Check rows
    for (let row = 0; row < gridSize; row++) {
        const start = row * gridSize;
        if (amounts.slice(start, start + gridSize).every(val => val === amounts[start])) {
            return true;
        }
    }
    // Check columns
    for (let col = 0; col < gridSize; col++) {
        if (Array.from({ length: gridSize }, (_, row) => amounts[row * gridSize + col])
            .every(val => val === amounts[col])) {
            return true;
        }
    }
    // Check diagonals
    if (Array.from({ length: gridSize }, (_, i) => amounts[i * gridSize + i])
        .every(val => val === amounts[0])) {
        return true;
    }
    if (Array.from({ length: gridSize }, (_, i) => amounts[i * gridSize + (gridSize - 1 - i)])
        .every(val => val === amounts[gridSize - 1])) {
        return true;
    }
    return false;
}

function checkWin() {
    const gridSize = UsergridSize;
    const cells = Array.from(document.querySelectorAll('.sc_form .prize'));

    // Helper function to get symbol and amount from a cell
    const getSymbol = (cell) => cell.querySelector('p').textContent;
    const getAmount = (cell) => cell.querySelector('#prizeInfo p:last-child').textContent;

    // Check rows for win
    for (let row = 0; row < gridSize; row++) {
        const rowStartIndex = row * gridSize;
        const rowCells = cells.slice(rowStartIndex, rowStartIndex + gridSize);
        const rowSymbols = rowCells.map(getSymbol);

        if (rowSymbols.every(symbol => symbol === rowSymbols[0])) {
            const winningAmount = getAmount(rowCells[0]);
            return winningAmount;
        }
    }

    // Check columns for win
    for (let col = 0; col < gridSize; col++) {
        const colCells = [];
        for (let row = 0; row < gridSize; row++) {
            colCells.push(cells[row * gridSize + col]);
        }
        const colSymbols = colCells.map(getSymbol);

        if (colSymbols.every(symbol => symbol === colSymbols[0])) {
            const winningAmount = getAmount(colCells[0]);
            return winningAmount;
        }
    }

    // Check top-left to bottom-right diagonal for win
    const diagonal1Cells = [];
    for (let i = 0; i < gridSize; i++) {
        diagonal1Cells.push(cells[i * gridSize + i]);
    }
    const diagonal1Symbols = diagonal1Cells.map(getSymbol);

    if (diagonal1Symbols.every(symbol => symbol === diagonal1Symbols[0])) {
        const winningAmount = getAmount(diagonal1Cells[0]);
        return winningAmount;
    }

    // Check top-right to bottom-left diagonal for win
    const diagonal2Cells = [];
    for (let i = 0; i < gridSize; i++) {
        diagonal2Cells.push(cells[i * gridSize + (gridSize - 1 - i)]);
    }
    const diagonal2Symbols = diagonal2Cells.map(getSymbol);

    if (diagonal2Symbols.every(symbol => symbol === diagonal2Symbols[0])) {
        const winningAmount = getAmount(diagonal2Cells[0]);
        return winningAmount;
    }

    // If no win condition is met
    return null;
}


function setupScratchEffect(canvas, scContainer) {
    const ctx = canvas.getContext('2d');

    const image = new Image();
    const brush = new Image();

    canvas.width = scContainer.clientWidth;
    canvas.height = scContainer.clientHeight;

    image.src = 'Images/sc/sc.png';
    image.onload = function() {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };

    brush.src = 'Images/sc/brush.png';
    brush.onload = function() {
        canvas.addEventListener('mousedown', handleMouseDown, false);
        canvas.addEventListener('mousemove', handleMouseMove, false);
        canvas.addEventListener('mouseup', handleMouseUp, false);
        canvas.addEventListener('touchstart', handleMouseDown, false);
        canvas.addEventListener('touchmove', handleMouseMove, false);
        canvas.addEventListener('touchend', handleMouseUp, false);
    };

    function startErasing() {
        ctx.globalCompositeOperation = 'destination-out';
    }

    function stopErasing() {
        ctx.globalCompositeOperation = 'source-over';
    }

    let isDrawing, lastPoint;

    function handleMouseDown(event) {
        isDrawing = true;
        lastPoint = getMousePosition(event);
        startErasing();
    }

    function handleMouseMove(event) {
        if (!isDrawing) return;

        event.preventDefault();
        const currentPoint = getMousePosition(event);
        const dist = Math.sqrt(Math.pow(currentPoint.x - lastPoint.x, 2) + Math.pow(currentPoint.y - lastPoint.y, 2));
        const angle = Math.atan2(currentPoint.x - lastPoint.x, currentPoint.y - lastPoint.y);

        for (let i = 0; i < dist; i++) {
            const x = lastPoint.x + (Math.sin(angle) * i) - brush.width / 2;
            const y = lastPoint.y + (Math.cos(angle) * i) - brush.height / 2;
            ctx.drawImage(brush, x, y);
        }

        lastPoint = currentPoint;
        checkScratchProgress();
    }

    function handleMouseUp(event) {
        isDrawing = false;
        stopErasing();
    }

    function getMousePosition(event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (event.clientX || event.touches[0].clientX) - rect.left,
            y: (event.clientY || event.touches[0].clientY) - rect.top
        };
    }

    function checkScratchProgress() {
        const scratched = ctx.getImageData(0, 0, canvas.width, canvas.height).data.filter((_, i) => i % 4 === 3 && _ === 0).length;
        const scratchedPercent = (scratched / (canvas.width * canvas.height));

        if (scratchedPercent >= .6) {
            canvas.style.display = 'none';
            const winnings = checkWin();
            console.log(winnings)
            if ( winnings !== null) { displayResult(true, winnings) } else {displayResult(false, 0)}

            setTimeout (() => {
                SeeGame(false);
            }, 1000 * gameSpeed);

            setTimeout (() => { // Return to old settings
                PlaceholderElement.style.maxWidth = '';
                PlaceholderElement.style.maxHeight = '';
                PlaceholderElement.innerHTML = '';
                window.gameResolve(true);
            }, 1300 * gameSpeed);
        }
    }
}
