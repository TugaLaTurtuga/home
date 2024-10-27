let rows = 7;
let cols = 5;
let margin = 10;
let padding = 5;
let cellSize;
let virtualBoard = [];
let buttonRects = [];
let currentNumber = 0;
let finished = false;
let time = 0;
let startTime = null;
let extraMarginTop;
let colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#A633FF", "#33FFF6", "#F6FF33", "#FF8A33", "#8AFF33", "#33FF99"];
let leaderboard = [];
let playerName = 'anonymous';
let TimeSrting = '';
let leaderboardIsOpen = false;
let gameStarted = false;
let drawnedStartGameCanvas = false;
let canClick = true;
let globalOrLocal = true;
let highlightLastPressed = true;
let Clicks = 0;
let TimerColor = 0 // 0 = auto, 1 = purple, 2 = green, 3 = yellow, 4 = red
let SavingUrl = new URL('https://66b4edb79f9169621ea4e564.mockapi.io/api/leaderboars/leaderboards')

        function start() {
            gameStarted = true;
            document.getElementById("time-container").style.color = 'auto'
            rows = parseInt(document.getElementById('rows').value);
            cols = parseInt(document.getElementById('cols').value);

            if (rows < 3) {rows = 3}
            else if (rows > 10) {rows = 10}
            else if (isNaN(rows)) {rows = 7}

            if (cols < 3) {cols = 3}
            else if (cols > 10) {cols = 10}
            else if (isNaN(cols)) {cols = 5}

            document.getElementById('rows').value = rows;
            document.getElementById('cols').value = cols;
            Clicks = 0;

            document.getElementById("time-container").style.display = 'block';
            document.getElementById("stop-container").style.display = 'block';
            virtualBoard = [];
            currentNumber = 0;
            finished = false;
            startTime = null;
            TimerColor = 0;
            setup();
        }

        function setup() {
            cellSize = 75 - ((cols / 4) + (rows / 2)) * 5;
            extraMarginTop = cellSize;
            let canvasWidth = cellSize * (cols + 1) + padding * (cols - 4) - margin;
            let canvasHeight = cellSize * (rows + 1) + extraMarginTop / 2 + 2 + margin;
            createCanvas(canvasWidth, canvasHeight);
            frameRate(244);
            initializeBoard();
            textFont('Radio Canada');
            loop();
        }

        function draw() {
            if (!gameStarted) {
                if (!drawnedStartGameCanvas) {
                    background(255);
                    createCanvas(100, 100)
                    textSize(16);
                    textAlign(CENTER, CENTER);
                    fill(0);
                    text('Start Game', width / 2, height / 2);
                    drawnedStartGameCanvas = true
                }
                return;
            }
            drawTimer();
            background(255);
            drawGrid();
            drawBalls();
            drawSelectedBall();
            if (finished) {
                drawRestartButton();
                endGame();
            }
        }

        function initializeBoard() {
            let totalCells = rows * cols;
            let maxNumber = cols - 1; // This determines the highest number to be used
            let maxOccurrences = rows;

            let numbers = [];
            for (let num = 1; num <= maxNumber; num++) {
                numbers.push(...Array(maxOccurrences).fill(num));
            }

            numbers = shuffle(numbers);

            for (let col = 0; col < cols; col++) {
                let newRow = [];
                for (let row = 0; row < rows; row++) {
                    if (col === cols - 1) {
                        newRow.push(0); // Last column should be all zeros
                    } else {
                        newRow.push(numbers.pop());
                    }
                }
                virtualBoard.push(newRow);
            }
        }

        function drawGrid() {
            strokeWeight(5);
            stroke(0);
            for (let col = 0; col <= cols; col++) {
                let startY = height - margin;
                let x = margin + col * (cellSize + padding);
                line(x, startY, x, startY - cellSize * rows);
            }
        }

        function drawBalls() {
            buttonRects = [];
            let xStart = margin + cellSize / 2 + 2.5;
            let yStart = margin + extraMarginTop / 1.2 + cellSize;

            // Iterate over columns and rows to draw ellipses
            for (let col = 0; col < cols; col++) {
                let x = xStart + col * (cellSize + padding);
               for (let row = 0; row < rows; row++) {
                   let y = yStart + row * (cellSize);
                   let number = virtualBoard[col][rows - 1 - row];

                   if (number !== 0) {
                      if (colors[number] === undefined) {
                            colors[number] = color(random(255), random(255), random(255));
                        }
                        fill(colors[number]);
                        ellipse(x, y, cellSize - padding, cellSize - padding);
                    }
                }

                // Calculate the rectangle corresponding to this column
                let rectX = margin + col * (cellSize + padding);
                let rectY = margin + extraMarginTop * 1.5;
                let rectW = cellSize;
                let rectH = height - margin * 2 - extraMarginTop * 1.5;

                buttonRects.push(new Rect(rectX, rectY, rectW, rectH));
            }
        }

        function drawSelectedBall() {
            if (currentNumber !== 0) {
                let y = margin + padding + cellSize / 2;
                let x = mouseX;
                fill(colors[currentNumber]);
                ellipse(x, y, cellSize - padding / 2, cellSize - padding / 2);
            }
        }

        function drawTimer() {
            if (startTime !== null) {
                time = (millis() - startTime) / 1000;
            } else {
                time = 0;
            }

            // Define the text to be displayed
            TimeSrting = nf(time, 0, 2);

            let timercontainer = document.getElementById("time-container");
            timercontainer.innerHTML = `<h3>[Time: ${TimeSrting}]</h3>`;

            // Draws the number of clicks
            let clickscontainer = document.getElementById("stop-container");
            clickscontainer.innerHTML = `<h3>Clicks: ${Clicks}</h3>`;
        }

        function drawRestartButton() {
            let buttonWidth = 200;
            let buttonHeight = 50;
            let buttonX = (width - buttonWidth) / 2;
            let buttonY = (height - buttonHeight) / 2;
            let borderRadius = 20;

            // Draw shadow
            let shadowOffsetX = 0;
            let shadowOffsetY = 4;
            let shadowBlur = 8;
            fill(0, 0, 0, 51); // RGBA: 0, 0, 0, 0.2 -> 51 is 20% of 255
            noStroke();
            rect(buttonX + shadowOffsetX, buttonY + shadowOffsetY, buttonWidth, buttonHeight, borderRadius);

            // Draw rounded rectangle button
            let buttonColor = color(255); // Button background color
            fill(buttonColor);
            stroke(buttonColor);
            strokeWeight(0); // Button border width
            rect(buttonX, buttonY, buttonWidth, buttonHeight, borderRadius);

            // Draw button text
            textSize(32);
            textAlign(CENTER, CENTER);
            textStyle(BOLD)
            fill(0); // Text color
            text('Try again', buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
        }

        function mousePressed() {
            if (!canClick) {
                return;
            }
            else if (!gameStarted) {
                let buttonWidth = width;
                let buttonHeight = height;
                let buttonX = (width - buttonWidth) / 2;
                let buttonY = (height - buttonHeight) / 2;
                if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth && mouseY >= buttonY && mouseY <= buttonY + buttonHeight) {
                    start();
                }
                return;
            }
            else if (finished) {
                let buttonWidth = 200;
                let buttonHeight = 50;
                let buttonX = (width - buttonWidth) / 2;
                let buttonY = (height - buttonHeight) / 2;
                if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth && mouseY >= buttonY && mouseY <= buttonY + buttonHeight) {
                    start();
                }
                return;
            }
            for (let col = 0; col < buttonRects.length; col++) {
                let rect = buttonRects[col];
                if (rect.contains(mouseX, mouseY)) {
                    if (currentNumber === 0) {
                        for (let row = rows - 1; row >= 0; row--) {
                            let number = virtualBoard[col][row];
                            if (number !== 0) {
                                virtualBoard[col][row] = 0;
                                currentNumber = number;
                                
                                if (startTime === null) {
                                    startTime = millis();
                                }
                                Clicks++;
                                break;
                            }
                        }
                    } else {
                        for (let row = 0; row < rows; row++) {
                            let number = virtualBoard[col][row];
                            if (number === 0) {
                                virtualBoard[col][row] = currentNumber;
                                currentNumber = 0;
                                checkWinCondition();
                                Clicks++;
                                break;
                            }
                        }
                    }
                    break;
                }
            }
        }

        function checkWinCondition() {
            let won = true;
            for (let col = 0; col < cols; col++) {
                let number = virtualBoard[col][rows - 1];
                for (let row = 0; row < rows; row++) {
                    if (virtualBoard[col][row] !== number) {
                        won = false;
                        break;
                    }
                }
            }
            if (won) {
                finished = true;
                noLoop();
            }
        }

        function endGame() {
            if (finished) {
                TimerColor = 0;
                let leaderboardKey = `leaderboard_${rows}_${cols}`;
                let playerName = document.getElementById('player-name').value.trim() || 'anonymous';
                let score = parseFloat(TimeSrting);
        
                // Manage local leaderboard
                let localLeaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || [];
                localLeaderboard.push({ name: playerName, score: score });
                localLeaderboard.sort((a, b) => a.score - b.score);
                localLeaderboard = localLeaderboard.slice(0, 9);
                localStorage.setItem(leaderboardKey, JSON.stringify(localLeaderboard));

                if (localLeaderboard[0].score == score) {
                    TimerColor = 2;
                }
                else if (localLeaderboard[localLeaderboard.length - 1].score < score) {
                    TimerColor = 4;
                }
                else {
                    TimerColor = 3;
                }
        
                // Prepare new entry for global leaderboard
                let RowsAndsCols = [rows, cols] 
                let newEntry = {
                    RowsAndsCols: RowsAndsCols,
                    name: playerName,
                    score: score,
                };

                // Fetch existing global leaderboard
                fetch(SavingUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch global leaderboard: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(globalData => {
                    // Remove old entry for the player if it exists
                    globalData = globalData.filter(entry =>
                        !(entry.RowsAndsCols === RowsAndsCols));
                    
                    globalData.push(newEntry) // Put new entry in the global data
                    globalData.sort((a, b) => a.score - b.score); // Sort by score
                    globalData.slice(0, 9)

                    if (globalData[0].score == newEntry.score) {
                        TimerColor = 1; // World record
                    }

                    // Check if the new entry is in the top 10
                    const isInTop10 = globalData.some(entry => entry.name === newEntry.name && entry.score === newEntry.score);
                    if (isInTop10) {
                        // Update the global leaderboard
                        fetch(SavingUrl, {
                            method: 'POST',
                            headers: {'content-type':'application/json'},
                            body: JSON.stringify(newEntry)
                        })
                        .then(res => {
                            if (res.ok) {
                                return res.json();
                            }
                        // handle error
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                }
                })
            }
            let timercontainer = document.getElementById("time-container");
            switch(TimerColor) {
                case 0:
                    timercontainer.style.color = 'auto';
                    break;
                case 1:
                    timercontainer.style.color = 'purple';
                    break;
                case 2:
                    timercontainer.style.color = 'green';
                    break;
                case 3:
                    timercontainer.style.color = 'yellow';
                    break;
                case 4:
                    timercontainer.style.color = 'red';
                    break;
            }
        }
     
        function openOrCloseLeaderboard(){
            if (leaderboardIsOpen) {
                hideLeaderboard()
            }
            else {
                showLeaderboard()
            }
        }

        function showLeaderboard() {
            leaderboardIsOpen = true;
            canClick = false;
            let leaderboardKey = `leaderboard_${rows}_${cols}`;
            
            // Fetch local leaderboard
            let localLeaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || [];
       
            // Variable to hold the global leaderboard
            let GlobalLeaderboard = [];
       
            // Display the leaderboard container
            document.getElementById('leaderboard').style.display = 'block';
        
            // Fetch global leaderboard from mock API
            let RowsAndsCols = [rows, cols]
            fetch(SavingUrl)
                .then(response => response.json())
                .then(globalData => {
                    globalData.forEach((entry) => {
                        // Check if the contents of the array match
                        if (entry.RowsAndsCols[0] === RowsAndsCols[0] && entry.RowsAndsCols[1] === RowsAndsCols[1]) {
                            GlobalLeaderboard.push(entry);
                        }
                    })
                   
                    // Initially highlight the global leaderboard and set it as the default view
                    const buttons = document.querySelectorAll('.Globalbutton');
                    buttons.forEach(button => button.classList.remove('highlight'));
                    buttons[0].classList.add('highlight');  // Highlight the first button (global leaderboard)
                    globalOrLocal = true;
       
                    // Update the leaderboard display based on the initial selection (global leaderboard)
                    GlobalLeaderboard.sort((a, b) => a.score - b.score);
                    GlobalLeaderboard.slice(0, 9)
                    leaderboard = GlobalLeaderboard;
                    updateLeaderboardDisplay();
        
                    // Add event listeners to the buttons after the data is fetched
                    buttons.forEach(button => {
                        button.addEventListener('click', handleButtonClick);
                    });
                })
                .catch(error => console.error('Error:', error));
        
            function handleButtonClick(event) {
                const buttons = document.querySelectorAll('.Globalbutton');
                buttons.forEach(button => button.classList.remove('highlight'));
        
                if (highlightLastPressed) {
                    event.target.classList.add('highlight');
                    globalOrLocal = event.target.id === 'btn1';  // Global button is clicked
                } else {
                    buttons[0].classList.add('highlight');
                    globalOrLocal = true;  // Default to global
                }
        
                // Update leaderboard display based on the selected option
                leaderboard = globalOrLocal ? GlobalLeaderboard : localLeaderboard;
                updateLeaderboardDisplay();
            }
        }
        
        
       

        function hideLeaderboard() {
            document.getElementById('leaderboard').style.display = 'none';
            leaderboardIsOpen = false;

            // Set canClick to true after 10ms
            setTimeout(() => {
                canClick = true;
            }, 10);
        }

        function updateLeaderboardDisplay() {
            let Chossenleaderboard = document.getElementById('chossen-leaderboard');
            Chossenleaderboard.innerHTML = `
                <h3>[Rows: ${rows}, Cols: ${cols}]</h3> 
            `;
            let leaderboardList = document.getElementById('leaderboard-list');
            leaderboardList.innerHTML = '';

            if (leaderboard.length === 0) {
                leaderboard = [{name: 'No time has been set', score: ''}];
            }

            let numberOfEntrys = 1;
            leaderboard.forEach(entry => {
                if (numberOfEntrys <= 10) {
                    let entryDiv = document.createElement('div');
                    if (entry.score != '') {
                        entryDiv.textContent = `${numberOfEntrys}º - ${entry.name}: ${entry.score}`;
                    }
                    else {
                        entryDiv.textContent = `${entry.name}`; 
                    }
                        leaderboardList.appendChild(entryDiv);
                        numberOfEntrys += 1;
                }
                else {
                    return;
                }
            });
        }

        class Rect {
            constructor(x, y, w, h) {
                this.x = x;
                this.y = y;
                this.w = w;
                this.h = h;
            }
            
            contains(px, py) {
                return px >= this.x && px <= this.x + this.w && py >= this.y && py <= this.y + this.h;
            }
        }

        // Load leaderboard from local storage on page load
        window.onload = function() {
            // No need to initialize leaderboard here
        };