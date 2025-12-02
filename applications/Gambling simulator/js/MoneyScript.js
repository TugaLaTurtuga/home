function formatCost(cost) {
    cost = parseFloat(cost);
    let magnitude;
    let suffix;

    switch (true) {
        case cost >= 1e36:  // 10^36 (Undecillion)
            magnitude = 1e36;
            suffix = 'ud';
            break;
        case cost >= 1e33:  // 10^33 (Decillion)
            magnitude = 1e33;
            suffix = 'd';
            break;
        case cost >= 1e30:  // 10^30 (Nonillion)
            magnitude = 1e30;
            suffix = 'n';
            break;
        case cost >= 1e27:  // 10^27 (Octillion)
            magnitude = 1e27;
            suffix = 'o';
            break;
        case cost >= 1e24:  // 10^24 (Septillion)
            magnitude = 1e24;
            suffix = 'sp';
            break;
        case cost >= 1e21:  // 10^21 (Sextillion)
            magnitude = 1e21;
            suffix = 'sx';
            break;
        case cost >= 1e18:  // 10^18 (Quintillion)
            magnitude = 1e18;
            suffix = 'q';
            break;
        case cost >= 1e15:  // 10^15 (Quadrillion)
            magnitude = 1e15;
            suffix = 'q';
            break;
        case cost >= 1e12:  // 10^12 (Trillion)
            magnitude = 1e12;
            suffix = 't';
            break;
        case cost >= 1e9:   // 10^9 (Billion)
            magnitude = 1e9;
            suffix = 'b';
            break;
        case cost >= 1e6:   // 10^6 (Million)
            magnitude = 1e6;
            suffix = 'm';
            break;
        case cost >= 1e4:   // 10^4 (Thousand)
            magnitude = 1e3;
            suffix = 'k';
            break;
        default:
            return cost % 1 === 0 ? cost.toFixed(0) : cost.toFixed(2);  // Return original cost if less than 1,000
    }
    return (cost / magnitude) % 1 === 0 ? (cost / magnitude).toFixed(0) + suffix : (cost / magnitude).toFixed(2) + suffix;
}

// Update the displayed balance in both sections
function updateBalance() {
    document.getElementById('money-count').innerText = `Money: $${formatCost(parseFloat(player.balance))}`;
}

function PlayerWentbankrupt(reason = 'You are so bad at this game') {
    console.log('Player bankrupt');
    loansDiv.innerHTML = `
    <div class="stats" style="background-color: #01222b9c;">
        <h1 style="font-size: 24px;">You went bankrupt!</h1>
        <h3 style="margin-top: 10px; font-size: 18px;">Reason: ${reason}</h3>
        <div>
            <button id="btn" onclick="loadGameData(false); loansDiv.classList.remove('show');">Start over</button>
            <button id="btn" onclick="sellAllEmployes(); loansDiv.classList.remove('show');">Sell all employees</button>
        </div>
    </div>`;

    loansDiv.classList.add('show');
    player.balance = NaN;
    updateBalance();
    saveGameData();
}

// Add money and save the updated balance
function addMoney(amount) {
    
    if (!isNaN(amount) && !isNaN(player.balance) && amount !== 'undefined') {
        amount = parseFloat(amount);
        player.balance += amount;
        player.totalEarned += amount;
        updateBalance();
        saveGameData();  // Save every time the balance changes
    }
}

// Deduct money and save the updated balance
function deductMoney(amount, IsSalary = false) {
    if (!isNaN(player.balance)) {
        if (!IsSalary) {
            if (player.balance >= amount) {
                player.balance -= amount;
                updateBalance();
                saveGameData();  // Save every time the balance changes
                return true;
            } else {
                return false;
            }
        } else {
            player.balance -= amount;
            updateBalance();
            saveGameData();  // Save every time the balance changes
            if (player.balance >= 0)
            {
                return true;
            } else {
                return false;
            }
            // return player.balance >= 0;
        }
    }
}