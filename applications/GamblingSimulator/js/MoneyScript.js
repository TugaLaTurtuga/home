function formatCost(cost) {
    if (cost >= 1_000_000_000_000_000) {
        return (cost / 1_000_000_000_000_000).toFixed(2) + 'q';
    } else if (cost >= 1_000_000_000_000) {
        return (cost / 1_000_000_000_000).toFixed(2) + 't';
    } else if (cost >= 1_000_000_000) {
        return (cost / 1_000_000_000).toFixed(2) + 'b';
    } else if (cost >= 1_000_000) {
        return (cost / 1_000_000).toFixed(2) + 'm';
    } else if (cost >= 10_000) {
        return (cost / 1_000).toFixed(1) + 'k';
    } else {
        return cost.toFixed(2); // Return the original cost if less than 10,000
    }
}

// Update the displayed balance in both sections
function updateBalance() {
    document.getElementById('money-count').innerText = `Money: $${formatCost(parseFloat(playerBalance))}`;
}

// Add money and save the updated balance
function addMoney(amount) {
    
    if (!isNaN(amount) && !isNaN(playerBalance) && amount !== 'undefined') {
        amount = parseFloat(amount);
        playerBalance += amount;
        totalEarned += amount;
        updateBalance();
        saveGameData();  // Save every time the balance changes
    }
}

// Deduct money and save the updated balance
function deductMoney(amount, IsSalary = false) {
    if (!isNaN(playerBalance)) {
        if (!IsSalary) {
            if (playerBalance >= amount) {
                playerBalance -= amount;
                updateBalance();
                saveGameData();  // Save every time the balance changes
                return true;
            } else {
                return false;
            }
        } else {
            playerBalance -= amount;
            updateBalance();
            saveGameData();  // Save every time the balance changes
            if (playerBalance >= 0)
            {
                return true;
            } else {
                return false;
            }
            // return playerBalance >= 0;
        }
    }
}