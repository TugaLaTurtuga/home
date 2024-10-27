let incomePerSecond = 0;
let clickPower = 1;
let IsPayingsalaries = false;

performance

// Updates money and job shop section
window.onload = () => {
    createJobShop();
    createGamesSection();
    startPassiveIncome();
    calculateTotalSalary();
    calculatejobHeight();
    UpdateWorkersNumber();
};

function SeeSettings() {
    const settingsElement = document.querySelector('.settings');

    if (settingsElement.classList.contains('show')) {
        settingsElement.classList.remove('show');
    
        // Delay changing visibility until after the opacity transition
        setTimeout(() => {
            settingsElement.classList.add('hide');
        }, 300); // 300ms matches the CSS transition duration for opacity
    } else {
        settingsElement.classList.remove('hide');
        settingsElement.classList.add('show');
    }
}

// Clicking to earn money
function earnMoney() {
    addMoney(clickPower);
}

// Job shop creation
function createJobShop() {
    const shopSection = document.getElementById('job-shop-section');

    // Create job buttons dynamically
    for (let job in jobCosts) {
        const jobButton = document.createElement('button');
        jobButton.innerText = `Buy ${capitalizeFirstLetter(job)} (Cost: $${jobCosts[job]})`;
        jobButton.onclick = () => buyJob(job);
        shopSection.appendChild(jobButton);
    }
}

// Buying a job upgrade
function buyJob(job) {
    if (deductMoney(jobCosts[job])) {
        Count[job]++;
        updateIncome();
        jobCosts[job] = Math.max(Math.floor(jobCosts[job] * 1.2), 1);  // Increment cost dynamically, but never allow it to be 0 or negative
        seeWorkersBtn();
        updateJobShop();
    } else {
        // Feedback for insufficient funds
        const buttons = document.querySelectorAll('#job-shop-section button');
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].innerText.includes(capitalizeFirstLetter(job))) {
                buttons[i].innerText = "Not enough money"; // Change button text
                setTimeout(() => {
                    buttons[i].innerText = `Buy ${capitalizeFirstLetter(job)} (Cost: $${jobCosts[job]})`;
                }, 1000); 
                break;
            }
        }
    }
    IsPayingsalaries = true;
    saveGameData();
    calculateTotalSalary(); // update the salary per s
    calculatejobHeight();
    UpdateWorkersNumber();
}

// Function to update the income per second based on performance
function updateIncome() {
    incomePerSecond = 0;
    for (let job in Count) {
        mpsInJob = Count[job] * jobIncome[job] * performance[job];
        incomePerSecond += mpsInJob;
        const mpsInJobText = document.getElementById(`mps in ${job}`);
        if (mpsInJobText) {
            mpsInJobText.innerText = `mps: $${mpsInJob.toFixed(2)}`;
        }
    }
    if (incomePerSecond != 0) {
        document.getElementById('total-mps').innerText = `mps: $${incomePerSecond.toFixed(2)}`;
        IsPayingsalaries = true;
    }
}

// Calculate performance based on salary
let firstTime = true;
function UpdateWorkersNumber() {
    for (let job in jobSalary) {
        const roleCount = document.getElementById(`Amount of workers in ${job}`);
        if (roleCount) {
            roleCount.innerText = `Workers: ${Count[job]}`;
        } if (Count[job] > 0 && firstTime) {
            seeWorkersBtn();
            seeWorkersBtn();
            firstTime = false;
        }
    }
}

const sw = document.getElementById("seeWorkers");
const gameContainer = document.getElementById("clicker-section");
function calculatejobHeight() {
    if (!IsSeingWorkers) {
        let js = document.getElementById("job-shop-section");

        // Use offsetHeight to get the rendered height of the element
        let jsHeight = js.offsetHeight || 200;
        let swHeight = 100;
        let totalHeight = 0;

        // Use getComputedStyle to check the applied flex-direction
        let computedStyle = window.getComputedStyle(js);
        let flexDirection = computedStyle.flexDirection;

        if (flexDirection === "column") {
            totalHeight = swHeight + jsHeight + 520;
        } else {
            totalHeight = swHeight + jsHeight + 300;
        }

        // Set the gameContainer height
        gameContainer.style.height = `${totalHeight}px`;
    }
}

window.addEventListener('resize', () => {
    calculatejobHeight();
});

let IsSeingWorkers = false;
function seeWorkersBtn() {
    sw.style.display = 'block'
    document.getElementById("seeWorkers").onclick = () => { 
        window.scrollTo(0, 50);
        if (IsSeingWorkers) {
            document.getElementById("clicker-section").style.display = "block";
            document.getElementById("Workers-section").style.display = "none";
            sw.innerText = 'See Workers';
            IsSeingWorkers = false;
            calculatejobHeight();
        } else {
            document.getElementById("clicker-section").style.display = "none";
            document.getElementById("Workers-section").style.display = "block";
            sw.innerText = 'See Jobs';
            gameContainer.style.height = "auto";
            IsSeingWorkers = true;
        }
    };
}

// Updates the job shop with new costs
function updateJobShop() {
    const buttons = document.querySelectorAll('#job-shop-section button');
    let i = 0;
    for (let job in jobCosts) {
        buttons[i].innerText = `Buy ${capitalizeFirstLetter(job)} (Cost: $${jobCosts[job]})`;
        ++i;
    }
}

// Salary to be paid per job type based on the income they generate
function calculateTotalSalary() {
    let totalSalary = 0;
    for (let job in Count) {
        totalSalary += Count[job] * jobSalary[job];
    } if (totalSalary !== 0) {
        document.getElementById("salariesPer").innerText = `Salaries: -$${totalSalary.toFixed(2)} per ${TimeToPaySalaries}s`;
    }
    return totalSalary;
}

const TimeToPaySalaries = 100;
let TimeUntilPayingSalaries = 0;
const salaryDiv = document.getElementById("salaryDiv");
function startPassiveIncome() {
    setInterval(() => {
        if (!isNaN(playerBalance) && !needsLoan) {
            addMoney(incomePerSecond); // Increment player's balance by income

            if (TimeUntilPayingSalaries >= TimeToPaySalaries) {
                const totalSalary = calculateTotalSalary();
                
                if (!deductMoney(totalSalary, true)) {
                    console.log('Not enough money for salaries, taking loan');
                    needsLoan = true;
                    SeeBank();
                    ChangeBankView(true);
                } else {
                    console.log(`Paid salaries: $${totalSalary}`);
                }
                TimeUntilPayingSalaries = 0;

                salaryDiv.innerText = `Salaries: -$${totalSalary.toFixed(2)}`;
                salaryDiv.classList.add('show');
                setTimeout(() => {
                    salaryDiv.classList.remove('show');
                }, 1500);
            }

            if (IsPayingsalaries) {
                TimeUntilPayingSalaries++;
            }
            clickPower = 1 + incomePerSecond * 0.01;
        } else {

        }
    }, 1000); // Every second
}

// Utility function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}