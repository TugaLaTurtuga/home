// Update the displayed balance in both sections
function updateBalance() {
    document.getElementById('money-count').innerText = `Money: $${parseFloat(playerBalance).toFixed(2)}`;
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