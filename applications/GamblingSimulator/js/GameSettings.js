// Save game data to localStorage
function saveGameData() {
    const gameData = {
        Money: playerBalance,
        totalEarned : totalEarned,
        remainingLoanValue: remainingLoanValue,
        remainingLoanTime: remainingLoanTime,
        loanInterest: loanInterest,
        DepositMonthlyValue: remainingDepositValue,
        remainingDepositTime: remainingDepositTime,
        Count: Count,
        Income: Income,
        performance: performance,
        jobCosts: jobCosts,
        jobSalary: jobSalary,
        amountOfTimesGambled: amountOfTimesGambled,
        totalMoneyGambled: totalMoneyGambled,
        totalMoneyWonOnGambling: totalMoneyWonOnGambling
    };
    localStorage.setItem('gameData', JSON.stringify(gameData));
    displayGameData(gameData); // Call displayGameData with gameData after saving
}

// Load saved game data from localStorage
let firstTimeDeleted = true;
function loadGameData(loadData = true) {
    let savedData = localStorage.getItem('gameData');
    
    if (!loadData && confirm("Are you sure you want to reset the game? This will delete all your progress.")) {
        savedData = null;
        localStorage.removeItem('gameData'); // Clear local storage
        saveGameData();
        initializeDefaultValues(); // Reset in-memory game state variables
      
        console.log("Game data reset successfully.");
        setTimeout(function() {
            playerBalance = 0;
            saveGameData();
            window.location.reload();
        }, 1000);
        return;
    }

    // If there's no savedData, initialize with default values
    if (!savedData) {
        console.log("No saved game data found, starting a new game.");
        initializeDefaultValues();
        playerBalance = 0;
        return;
    }

    // Parse and load the game data if savedData exists
    console.log("Loading saved game data...");
    const gameData = JSON.parse(savedData);
    updateGameData(gameData);

    // Call displayGameData after successfully loading game data
    displayGameData(gameData);
}

// Initialize game with default values
function initializeDefaultValues() {
    playerBalance = 0;
    totalEarned = 0;
    remainingLoan = 0;
    remainingTime = 0;
    loanInterest = 0;

    Count = {
        autoclicker: 0,
        freelancer: 0,
        assistant: 0,
        developer: 0,
        consultant: 0,
        designer: 0,
        analyst: 0,
        manager: 0,
        company: 0,
        realestate: 0,
        enterprise: 0,
        factory: 0
    };

    jobCosts = {
        autoclicker: 50,
        freelancer: 200,
        assistant: 1000,
        developer: 5000,
        consultant: 100000,
        designer: 15000,
        analyst: 25000,
        manager: 50000,
        company: 100000,
        realestate: 500000,
        enterprise: 1000000,
        factory: 15237358
    };

    amountOfTimesGambled = 0;
    totalMoneyGambled = 0;
    totalMoneyWonOnGambling = 0;

    updateBalance();
    saveGameData(); // Save default values as a fresh start
}

// Update game state with loaded data
function updateGameData(gameData) {
    playerBalance = gameData.Money || NaN;
    if (!isNaN(playerBalance))
    {
        totalEarned = gameData.totalEarned || 0;
        remainingLoanValue = gameData.remainingLoanValue || 0;
        remainingLoanTime = gameData.remainingLoanTime || 0;
        loanInterest = gameData.loanInterest || 0;
        
        remainingDepositValue = gameData.DepositMonthlyValue || 0;
        remainingDepositTime = gameData.remainingDepositTime || 0;

        // Load all job-related data
        Count = gameData.Count || {};

        Income = gameData.Income || 0;
        performance = gameData.performance || 0;
        jobCosts = gameData.jobCosts || {
            autoclicker: 50,
            freelancer: 500,
            assistant: 2500,
            developer: 7500,
            consultant: 12500,
            designer: 25000,
            analyst: 50000,
            manager: 100000,
            company: 500000,
            realestate: 1000000,
            enterprise: 7500000,
            factory: 1250000
        };

        jobSalary = gameData.jobSalary || 0;

        amountOfTimesGambled = gameData.amountOfTimesGambled || 0;
        totalMoneyGambled = gameData.totalMoneyGambled || 0;
        totalMoneyWonOnGambling = gameData.totalMoneyWonOnGambling || 0;

        // Restart loan payment system if a loan is active
        if (remainingLoanTime !== 0 && remainingLoanValue !== 0) {
            takeLoan(remainingLoanValue / (1 + (loanInterest / 100)), loanInterest, remainingLoanTime, true); // Use saved loan values
        } else {loanInterest = 0; remainingLoanTime = 0; remainingLoanValue = 0;}

        if (remainingDepositValue !== 0 && remainingDepositTime !== 0) {
            DepositSaved(remainingDepositValue, remainingDepositTime)
        } else {remainingDepositValue = 0; remainingDepositTime = 0;}
    } else { // the player is bankrupt, delete the data
        playerBalance = 0;
    }
    updateBalance();
}

// Function to dynamically display game data
function displayGameData(gameData) {
    const statsDiv = document.getElementById('stats');
    
    // Ensure statsDiv exists before proceeding
    if (!statsDiv) {
        console.error("Stats div not found");
        return;
    }

    // Clear previous stats
    statsDiv.innerHTML = '';

    // Create the main stats header
    const header = document.createElement('h1');
    header.innerText = "Game Stats";
    statsDiv.appendChild(header);

    for (const key in gameData) {
        if (gameData.hasOwnProperty(key)) {
            let value = gameData[key];  // Access the value by key
            const lowerKey = key.toLowerCase();  // Convert key to lowercase for case-insensitive check
    
            // Check the key name, not the value
            if (lowerKey === 'totalearned' && !isDigit(value)) {
                value = playerBalance;
            } else if (lowerKey === 'money' && !isDigit(value)) {
                value = totalEarned / 10;
            }
    
            // Display the item if:
            // 1. It is a digit and not zero
            // 2. The key does NOT contain 'deposit' or 'loan' OR it contains them and meets criteria
            if (isDigit(value) && value !== 0) {
                
                const statItem = document.createElement('p');
                statItem.innerHTML = `<strong>${capitalizeFirstLetter(key.replace(/([A-Z])/g, ' $1'))}:</strong> ${formatValue(value)}`;
                statsDiv.appendChild(statItem);
            }
        }
    }
    // Button to download game data
    const downloadGameDataBtn = document.createElement('button');
    downloadGameDataBtn.id = "btn"
    downloadGameDataBtn.innerText = 'Download Game Data';
    downloadGameDataBtn.onclick = () => downloadGameData(); // Set click event to trigger the download

    // Button to trigger file input for uploading game data
    const fileInputBtn = document.createElement('button');
    fileInputBtn.id = "btn"
    fileInputBtn.innerText = 'Upload Game Data';
    fileInputBtn.onclick = () => fileInput.click(); // Set click event to trigger file input

    // Button to delete game data
    const deleteGameDataBtn = document.createElement('button');
    deleteGameDataBtn.id = "btn"
    deleteGameDataBtn.innerText = 'Delete Game Data';
    deleteGameDataBtn.onclick = () => loadGameData(false); // Set click event to delete game data

    statsDiv.appendChild(downloadGameDataBtn);
    statsDiv.appendChild(fileInputBtn);
    statsDiv.appendChild(deleteGameDataBtn);
}

function isDigit(value) {
    return !isNaN(value) && !isNaN(parseFloat(value));
}

// Helper function to format values for display
function formatValue(value) {
    value = parseFloat(value);
    if (typeof value === 'number') {
        return value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }
    return value; // Return as is for non-number types
}

// Download game data (Base85 encoding before zipping)
function downloadGameData() {
    const gameData = localStorage.getItem('gameData');
    if (!gameData) {
        console.error("No game data found to download.");
        return;
    }

    // Convert gameData (string) to a encoded (Uint8Array)
    const byteArray = new TextEncoder().encode(gameData);
    const Encoded = encrypt(byteArray);

    // Create a ZIP file and add the encoded data
    const zip = new JSZip();
    zip.file("gameData.txt", Encoded); // Store the encoded game data as a text file

    // Generate the ZIP file for download
    zip.generateAsync({ type: "blob" }).then(function (content) {
        // Trigger download of the ZIP file
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'Gambling-sim-data.zip'; // Name the file
        link.click();
    }).catch(function (err) {
        console.error("Error generating zip:", err);
    });
}

// Load game data from uploaded zip file
function loadGameDataFromFile(file) {
    const reader = new FileReader();

    reader.onload = function (event) {
        // Read the file content as a binary string
        const zipData = event.target.result;

        // Load the ZIP file
        JSZip.loadAsync(zipData).then(function (zip) {
            // Read the Base85-encoded game data file
            return zip.file("gameData.txt").async("string");
        }).then(function (base85Encoded) {
            // Decode the Base85-encoded string back to Uint8Array
            const decodedData = decrypt(base85Encoded);

            // Convert the Uint8Array back to a string
            let gameDataString = new TextDecoder().decode(decodedData);

            // Clean the string by trimming
            gameDataString = gameDataString.trim();

            // Remove unwanted escape sequences including specific control characters
            gameDataString = gameDataString.replace(/\\x[0-9A-Fa-f]{2}/g, ''); // Remove \xYY sequences
            gameDataString = gameDataString.replace(/[\x00-\x1F\x7F]/g, ''); // Remove control characters

            // Optional: Check for other invalid characters and log their positions
            const invalidChars = gameDataString.match(/[^"\{\}\[\],:0-9a-zA-Z.\-+_ ]/g);
            if (invalidChars) {
                console.error("Invalid characters detected in the game data string:", invalidChars);
                return; // Exit early if invalid characters are found
            }

            // Parse the string back to a JSON object
            try {
                const gameData = JSON.parse(gameDataString);
                // Update game state with the loaded data
                updateGameData(gameData);
                console.log("Game data loaded successfully.");
            } catch (parseError) {
                console.error("Error parsing game data:", parseError);
            }
        }).catch(function (err) {
            console.error("Error loading game data:", err);
        });
    };

    reader.readAsArrayBuffer(file); // Read the file as binary data

    setTimeout(function() {
        window.location.reload();
    }, 500);
}

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

document.addEventListener('DOMContentLoaded', () => {
    // Load saved game data after DOM is fully loaded
    loadGameData();
    saveGameData();
    displayGameData();

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.code === 'KeyQ') {
            loadGameData(false); // Delete data
        } else if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.code === 'KeyD') {
            downloadGameData(); // Call the download function
        } else if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.code === 'KeyU') {
            fileInput.click();
        }
    });

    // Handle file input for uploading game data
    const fileInput = document.getElementById('fileInput');
    
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            loadGameDataFromFile(file); // Load game data from the selected file
        }
    });
});
