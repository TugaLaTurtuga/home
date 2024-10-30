// Get slider elements
let autoClickerSlider = null;
let assistantSlider = null;
let companySlider = null;
let enterpriseSlider = null;
let factorySlider = null;
let realEstateSlider = null;

// Function to update the slider gradient
function updateSliderBackground(slider) {
    const percentage = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.setProperty('--slider-value', `${percentage}%`); // Set slider value dynamically
}

// Function to handle scroll events on the slider
function handleSliderScroll(event, slider) {
    event.preventDefault(); // Prevent the page from scrolling
    const scrollSpeed = 0.25;
    const step = (slider.max - slider.min) / 100 * event.deltaY * scrollSpeed;

    // Update the slider's value based on scroll direction
    slider.value = Math.max(slider.min, Math.min(slider.max, parseFloat(slider.value) - step));

    // Trigger the input event programmatically
    const inputEvent = new Event('input', { bubbles: true });
    slider.dispatchEvent(inputEvent); // Dispatch input event to trigger any associated listeners
}

// Function to add listeners to sliders
function addSliderListeners(slider) {
    // Add 'input' event listener to update the slider background
    slider.addEventListener('input', () => updateSliderBackground(slider));

    // Add 'wheel' event listener for scroll functionality
    slider.addEventListener('wheel', (event) => handleSliderScroll(event, slider));
}

// Initialize sliders
function initializeSliders() {
    const sliders = [
        autoClickerSlider, assistantSlider, companySlider, 
        enterpriseSlider, factorySlider, realEstateSlider,
        freelancerSlider, DeveloperSlider, ConsultantSlider, 
        DesignerSlider, AnalystSlider, ManagerSlider
    ];
    const roles = [
        "AutoClicker", "Assistant", "Company", "Enterprise", "Factory", "RealEstate",
        "Developer", "Consultant", "Designer", "Analyst", "Manager"
    ];

    sliders.forEach((slider, index) => {
        if (slider) { // Ensure slider exists before trying to update
            updateSliderBackground(slider); // Update background on initialization
            addSliderListeners(slider, roles[index]); // Pass the role to the listeners
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const roles = [
        { name: "autoclicker", label: "Auto clicker" },
        { name: "freelancer", label: "Freelancer" },
        { name: "assistant", label: "Assistant" },
        { name: "developer", label: "Developer" },
        { name: "consultant", label: "Consultant" },
        { name: "designer", label: "Designer" },
        { name: "analyst", label: "Analyst" },
        { name: "manager", label: "Manager" },
        { name: "company", label: "Company" },
        { name: "enterprise", label: "Enterprise" },
        { name: "realestate", label: "Real estate" },
        { name: "factory", label: "Factory" }
    ];

    const workerGrid = document.getElementById('workers-grid');

    roles.forEach((role) => {
        const workerCard = document.createElement('div');
        workerCard.className = 'worker-card';

        const roleTitle = document.createElement('h2');
        roleTitle.innerText = `${role.label}:`;

        const roleCount = document.createElement('h3');
        roleCount.id = `Amount of workers in ${role.name}`;
        roleCount.innerText = `Workers: ${Count[role.name]}`;

        const currentSalary = jobSalary[role.name].toFixed(2);
        const currentPerformance = Math.round(performance[role.name] * 100);

        const currentSalaryText = document.createElement('h3');
        currentSalaryText.innerText = `Current salary: $${(currentSalary * Count[role.name]).toFixed(2)}`;

        const currentPerformanceText = document.createElement('h3');
        currentPerformanceText.innerText = `Current performance: ${currentPerformance}%`;

        const salarySlider = document.createElement('input');
        salarySlider.type = "range";
        salarySlider.id = `${role.label}Slider`;
        salarySlider.min = "0.3";
        salarySlider.max = "1.5";
        salarySlider.step = "0.01";
        salarySlider.value = performance[role.name];
        salarySlider.className = "slider";

        const newSalaryDisplay = document.createElement('h3');
        newSalaryDisplay.innerText = `New salary: $${currentSalary * Count[role.name]}`;

        const newPerformanceDisplay = document.createElement('h3');
        newPerformanceDisplay.innerText = `New performance: ${currentPerformance}%`;

        salarySlider.oninput = function () {
            const sliderValue = parseFloat(salarySlider.value);
            const perfectSalary = salaries[role.name].perfectSalary;
            const worstSalary = salaries[role.name].worstSalary;

            const newSalary = worstSalary + (perfectSalary - worstSalary) * sliderValue;
            const newPerformance = Math.max(0.2, sliderValue);

            newSalaryDisplay.innerText = `New salary: $${(newSalary * Count[role.name]).toFixed(2)}`;
            newPerformanceDisplay.innerText = `New performance: ${(newPerformance * 100).toFixed(0)}%`;
        };

        const sliderValue = parseFloat(salarySlider.value);
        const perfectSalary = salaries[role.name].perfectSalary;
        const worstSalary = salaries[role.name].worstSalary;
        jobSalary[role.name] = worstSalary + (perfectSalary - worstSalary) * sliderValue;
        performance[role.name] = Math.max(0.2, sliderValue);
        currentSalaryText.innerText = `Current salary: $${(jobSalary[role.name] * Count[role.name]).toFixed(2)}`;
        currentPerformanceText.innerText = `Current performance: ${(performance[role.name] * 100).toFixed(0)}%`;
        updateIncome();

        const saveButton = document.createElement('button');
        saveButton.innerText = "Save changes";

        saveButton.onclick = () => {
            const sliderValue = parseFloat(salarySlider.value);
            const perfectSalary = salaries[role.name].perfectSalary;
            const worstSalary = salaries[role.name].worstSalary;

            jobSalary[role.name] = worstSalary + (perfectSalary - worstSalary) * sliderValue;
            performance[role.name] = sliderValue;

            currentSalaryText.innerText = `Current salary: $${(jobSalary[role.name] * Count[role.name]).toFixed(2)}`;
            currentPerformanceText.innerText = `Current performance: ${(performance[role.name] * 100).toFixed(0)}%`;

            calculateTotalSalary();
            updateIncome();
            saveGameData();
        };

        const mpsText = document.createElement('h3');
        mpsText.id = `mps in ${role.name}`;
        mpsText.innerText = `mps: $500.00`;

        workerCard.appendChild(mpsText);
        mpsText.className = "hhhh3"
        workerCard.appendChild(roleTitle);
        workerCard.appendChild(roleCount);
        roleCount.className = "hhh3"
        workerCard.appendChild(currentSalaryText);
        workerCard.appendChild(currentPerformanceText);
        workerCard.appendChild(salarySlider);
        workerCard.appendChild(newSalaryDisplay);
        newPerformanceDisplay.className = "hh3"
        workerCard.appendChild(newPerformanceDisplay);
        workerCard.appendChild(saveButton);
        workerGrid.appendChild(workerCard);
    });

    autoClickerSlider = document.getElementById('Auto clickerSlider');
    assistantSlider = document.getElementById('AssistantSlider');
    companySlider = document.getElementById('CompanySlider');
    enterpriseSlider = document.getElementById('EnterpriseSlider');
    factorySlider = document.getElementById('FactorySlider');
    realEstateSlider = document.getElementById('Real estateSlider');
    autoClickerSlider = document.getElementById('Auto clickerSlider');
    freelancerSlider = document.getElementById('FreelancerSlider');
    DeveloperSlider = document.getElementById('DeveloperSlider');
    ConsultantSlider = document.getElementById('ConsultantSlider');
    DesignerSlider = document.getElementById('DesignerSlider');
    AnalystSlider = document.getElementById('AnalystSlider');
    ManagerSlider = document.getElementById('ManagerSlider');
    initializeSliders();

    document.addEventListener('keydown', function(event) {
        if ((event.ctrlKey || event.metaKey) && event.code === 'KeyB' || event.code === 'KeyL') {
            SeeBank();
        }
    });
    initializeLoanGrid();
    initializeDepositGrid();
    updateBank();
});

// LOANS //

// Function to get a random integer within a range
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to update loan options based on player balance
function updateLoanOptions() {
    loanOptions.forEach(option => {
        const minAmount = getRandomInt(1000, 2500)
        const randomAmount = getRandomInt(playerBalance * 0.1, playerBalance * 0.6);
        // Use the same function to format the amount
        if (minAmount > randomAmount) {
            option.amount = formatLoanAmount(minAmount); 
        } else {
            option.amount = formatLoanAmount(randomAmount); 
        }
        option.interest = getRandomInt(2, 6);  // Random interest between 2% and 6%
        option.time = getRandomInt(1, 5) * 4;  // Random time
    });
}

function formatLoanAmount(amount) {
    const amountStr = amount.toFixed(0);  // Convert to string with no decimal places
    if (amountStr.length > 3) {
        return amountStr.slice(0, 3) + '0'.repeat(amountStr.length - 3);  // Replace digits after the first 3 with zeros
    }
    return amountStr;  // If less than or equal to 3 digits, return as is
}

// Function to initialize the loans grid
function initializeLoanGrid() {
    const loansGrid = document.getElementById('LoansGrid');
    updateLoanOptions();
    loansGrid.innerHTML = '';  // Clear previous cards

    loanOptions.forEach((option, index) => {
        const loanCard = createLoanCard(option, index);
        loansGrid.appendChild(loanCard);
    });

    // Initialize sliders functionality
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => {
        addSliderListeners(slider);
        updateSliderBackground(slider);
    });
}

// Data for loan options (Initial setup)
const loanOptions = [
    { amount: 1000, interest: 4, time: 12 },
    { amount: 2000, interest: 5, time: 12 },
    { amount: 3000, interest: 6, time: 12 },
    { amount: 4000, interest: 7, time: 12 }
];

// Function to create loan card
function createLoanCard(option, index) {
    const loanCard = document.createElement('div');
    loanCard.className = 'opts-card';
    loanCard.id = `opts-loan-${index + 1}`;

    const h3Title = document.createElement('h3');
    h3Title.innerText = `Opt ${index + 1}`;
    
    const h4Amount = document.createElement('h4');
    h4Amount.innerText = `Amount: $${option.amount}`;

    const h4Interest = document.createElement('h4');
    h4Interest.innerText = `Interest: ${option.interest}%`;

    const h4Time = document.createElement('h4');
    h4Time.id = `loan-time-${index + 1}`;  // Add an ID for dynamic updating
    h4Time.innerText = `Time: ${option.time} months`;

    const rangeSlider = document.createElement('input');
    rangeSlider.type = 'range';
    rangeSlider.id = `opts-loan-slider-${index + 1}`;
    rangeSlider.min = option.time / 2;
    rangeSlider.max = option.time;
    rangeSlider.value = option.time;
    rangeSlider.step = 1;
    rangeSlider.className = 'slider';

    // Add event listener to dynamically update the time
    rangeSlider.addEventListener('input', (event) => {
        const newTime = event.target.value;
        h4Time.innerText = `Time: ${newTime} months`;
    });

    const loanButton = document.createElement('button');
    loanButton.id = `btn-${index + 1}`;
    loanButton.innerText = 'Take loan';
    loanButton.onclick = () => takeLoan(option.amount, option.interest, rangeSlider.value, false);

    loanCard.appendChild(h3Title);
    loanCard.appendChild(h4Amount);
    loanCard.appendChild(h4Interest);
    loanCard.appendChild(h4Time);
    loanCard.appendChild(rangeSlider);
    loanCard.appendChild(loanButton);
    
    return loanCard;
}

// DEPOSITS //

// Function to initialize the deposits grid
function initializeDepositGrid() {
    const depositsGrid = document.getElementById('DepositsGrid');
    updateDepositOptions(); // Update the deposit options before rendering the grid
    depositsGrid.innerHTML = '';  // Clear previous cards

    depositOptions.forEach((option, index) => {
        const depositCard = createDepositCard(option, index);
        depositsGrid.appendChild(depositCard);
    });

    // Initialize sliders functionality
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => {
        addSliderListeners(slider);
        updateSliderBackground(slider);
    });
}

// Function to update deposit options based on player balance
function updateDepositOptions() {
    depositOptions.forEach(option => {
        const minAmount = getRandomInt(1000, 2500)
        const randomAmount = getRandomInt(playerBalance * 0.1, playerBalance * 0.6);
        // Use the same function to format the amount
        if (minAmount > randomAmount) {
            option.amount = formatLoanAmount(minAmount); 
        } else {
            option.amount = formatLoanAmount(randomAmount); 
        }
        option.interest = getRandomInt(2, 10);  // Random interest between 2% and 10%
        option.time = getRandomInt(1, 5) * 4;  // Random time
        option.type = getRandomType();  // Random deposit type
    });
}

// Function to get random deposit type
function getRandomType() {
    const types = [true, false];
    return types[Math.floor(Math.random() * types.length)];
}

// Data for deposit options (Initial setup)
const depositOptions = [
    { amount: 1000, interest: 4, type: 'compost', time: 12 },
    { amount: 2000, interest: 5, type: 'compost', time: 24 },
    { amount: 3000, interest: 6, type: 'compost', time: 36 },
    { amount: 4000, interest: 7, type: 'compost', time: 48 }
];

// Function to create deposit card
function createDepositCard(option, index) {
    const depositCard = document.createElement('div');
    depositCard.className = 'opts-card';
    depositCard.id = `opts-depo-${index + 1}`;

    const h3Title = document.createElement('h3');
    h3Title.innerText = `Opt ${index + 1}`;

    const h4Amount = document.createElement('h4');
    h4Amount.innerText = `Amount: $${option.amount}`;

    const h4Interest = document.createElement('h4');
    h4Interest.innerText = `Interest: ${option.interest}%`;

    const h5Type = document.createElement('h5');
    let h5TypeText = `Type: Compost`;
    if (option.type) {
        h5TypeText = `Type: Simple`;
    }
    h5Type.innerText = h5TypeText;

    const h4Time = document.createElement('h4');
    h4Time.id = `deposit-time-${index + 1}`;  // Add an ID for dynamic updating
    h4Time.innerText = `Time: ${option.time} months`;

    const rangeSlider = document.createElement('input');
    rangeSlider.type = 'range';
    rangeSlider.id = `opts-depo-slider-${index + 1}`;
    rangeSlider.min = option.time / 2;
    rangeSlider.max = option.time;
    rangeSlider.value = option.time;
    rangeSlider.step = 1;
    rangeSlider.className = 'slider';

    // Add event listener to dynamically update the time
    rangeSlider.addEventListener('input', (event) => {
        const newTime = event.target.value;
        h4Time.innerText = `Time: ${newTime} months`;
    });

    const depositButton = document.createElement('button');
    depositButton.id = `btn-depo-${index + 1}`;
    depositButton.innerText = 'Take deposit';
    depositButton.onclick = () => TakeLongTermDeposits(parseFloat(option.amount), option.interest, false, rangeSlider.value);

    depositCard.appendChild(h3Title);
    depositCard.appendChild(h4Amount);
    depositCard.appendChild(h4Interest);
    depositCard.appendChild(h5Type);
    depositCard.appendChild(h4Time);
    depositCard.appendChild(rangeSlider);
    depositCard.appendChild(depositButton);

    return depositCard;
}

// UPDATE BANK //
function updateBank() {
    setInterval(function() {
        const bankElement = document.getElementById('bank');
        const bankLoansDiv = document.getElementById('BankLoansDiv');
        const bankDepositsDiv = document.getElementById('BankDepositsDiv');

        // Check if the bank element is visible
        if (getComputedStyle(bankElement).opacity === '0') {
            initializeDepositGrid();
            initializeLoanGrid();
        } else if (getComputedStyle(bankLoansDiv).display === 'block') {
            initializeDepositGrid(); // Only show deposits
        } else if (getComputedStyle(bankDepositsDiv).display === 'block') {
            initializeLoanGrid(); // Only show loans
        }
    }, 100000);  // Runs every 100000 milliseconds (100 seconds)
}
