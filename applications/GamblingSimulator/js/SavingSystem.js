// Save player data to localStorage
function saveGameData() {
    localStorage.setItem('gameData', JSON.stringify(player));
    displayGameData();
}

// Load or reset player data
function loadGameData(loadData = true) {
    let savedData = localStorage.getItem('gameData');
    
    if (!loadData && confirm("Are you sure you want to reset the game? This will delete all your progress.")) {
        localStorage.removeItem('gameData');
        initializeDefaultValues();
        player.balance = 0;
        saveGameData();
        console.log("Game data reset successfully.");
        return;
    }

    // Initialize with default values if no saved data
    if (!savedData) {
        console.log("No saved game data found, starting a new game.");
        initializeDefaultValues();
        player.balance = 0;
        return;
    }

    // Load saved player data
    console.log("Loading saved game data...");
    const gameData = JSON.parse(savedData);
    updatePlayerData(gameData);
    displayGameData();
}

// Update player object with loaded data
function updatePlayerData(gameData) {
    // Copy all properties to player
    Object.assign(player, gameData);

    // Ensure balance is valid
    if (player.balance === 0 || isNaN(player.balance)) {
        player.balance = 0;
    }

    // Restart loan payment system if active
    if (player.remainingLoanTime !== 0 && player.remainingLoanValue !== 0) {
        takeLoan(player.remainingLoanValue / (1 + (player.loanInterest / 100)), player.loanInterest, player.remainingLoanTime, true);
    } else {
        player.loanInterest = 0; 
        player.remainingLoanTime = 0; 
        player.remainingLoanValue = 0;
    }

    // Resume deposit if active
    if (player.remainingDepositValue !== 0 && player.remainingDepositTime !== 0) {
        DepositSaved(player.remainingDepositValue, player.remainingDepositTime);
    } else {
        player.remainingDepositValue = 0; 
        player.remainingDepositTime = 0;
    }
    
    // Check for bankruptcy
    if (isNaN(player.balance)) { 
        PlayerWentbankrupt("You can't escape bankruptcy 😱🥶"); 
    }
    updateBalance();
}

// Display player stats
function displayGameData() {
    const statsDiv = document.getElementById('stats');
    
    if (!statsDiv) {
        console.error("Stats div not found");
        return;
    }

    statsDiv.innerHTML = '';

    const header = document.createElement('h1');
    header.innerText = "Game Stats";
    statsDiv.appendChild(header);

    // Display player properties
    for (const key in player) {
        if (player.hasOwnProperty(key)) {
            let value = player[key];
            const lowerKey = key.toLowerCase();
    
            // Handle special cases
            if (lowerKey === 'totalearned' && !isDigit(value)) {
                value = player.balance;
            } else if (lowerKey === 'balance' && !isDigit(value)) {
                value = player.totalEarned / 10;
            }
    
            // Only display numeric values that aren't zero
            if (isDigit(value) && value !== 0) {
                const statItem = document.createElement('p');
                statItem.innerHTML = `<strong>${capitalizeFirstLetter(key.replace(/([A-Z])/g, ' $1'))}:</strong> ${formatValue(value)}`;
                statsDiv.appendChild(statItem);
            }
        }
    }

    // Add control buttons
    const downloadBtn = document.createElement('button');
    downloadBtn.id = "btn";
    downloadBtn.innerText = 'Download Game Data';
    downloadBtn.onclick = downloadGameData;

    const uploadBtn = document.createElement('button');
    uploadBtn.id = "btn";
    uploadBtn.innerText = 'Upload Game Data';
    uploadBtn.onclick = () => fileInput.click();

    const deleteBtn = document.createElement('button');
    deleteBtn.id = "btn";
    deleteBtn.innerText = 'Delete Game Data';
    deleteBtn.onclick = () => loadGameData(false);

    statsDiv.appendChild(downloadBtn);
    statsDiv.appendChild(uploadBtn);
    statsDiv.appendChild(deleteBtn);
}

// Helper functions
function isDigit(value) {
    return !isNaN(value) && !isNaN(parseFloat(value));
}

function formatValue(value) {
    value = parseFloat(value);
    if (typeof value === 'number') {
        return value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }
    return value;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Download player data as encrypted zip
function downloadGameData() {
    const playerData = JSON.stringify(player);
    
    if (!playerData || playerData === '{}') {
        console.error("No player data found to download.");
        return;
    }

    const byteArray = new TextEncoder().encode(playerData);
    const encoded = encrypt(byteArray);

    const zip = new JSZip();
    zip.file("gameData.txt", encoded);

    zip.generateAsync({ type: "blob" }).then(content => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'Gambling-sim-data.zip';
        link.click();
    }).catch(err => {
        console.error("Error generating zip:", err);
    });
}

// Load player data from uploaded file
function loadGameDataFromFile(file) {
    const reader = new FileReader();

    reader.onload = event => {
        const zipData = event.target.result;

        JSZip.loadAsync(zipData).then(zip => {
            return zip.file("gameData.txt").async("string");
        }).then(base85Encoded => {
            const decodedData = decrypt(base85Encoded);
            let playerDataString = new TextDecoder().decode(decodedData);
            
            // Clean the data string
            playerDataString = playerDataString.trim();
            playerDataString = playerDataString.replace(/\\x[0-9A-Fa-f]{2}/g, '');
            playerDataString = playerDataString.replace(/[\x00-\x1F\x7F]/g, '');

            const invalidChars = playerDataString.match(/[^"\{\}\[\],:0-9a-zA-Z.\-+_ ]/g);
            if (invalidChars) {
                console.error("Invalid characters detected in player data:", invalidChars);
                return;
            }

            try {
                const playerData = JSON.parse(playerDataString);
                updatePlayerData(playerData);
                console.log("Player data loaded successfully.");
            } catch (parseError) {
                console.error("Error parsing player data:", parseError);
            }
        }).catch(err => {
            console.error("Error loading player data:", err);
        });
    };

    reader.readAsArrayBuffer(file);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadGameData();
    saveGameData();

    // Keyboard shortcuts
    document.addEventListener('keydown', event => {
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.code === 'KeyQ') {
            loadGameData(false);
        } else if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.code === 'KeyD') {
            downloadGameData();
        } else if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.code === 'KeyU') {
            fileInput.click();
        }
    });

    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', event => {
        const file = event.target.files[0];
        if (file) {
            loadGameDataFromFile(file);
        }
    });
});
