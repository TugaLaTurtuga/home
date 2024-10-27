const Time = 25; // Time in seconds between payments

const loansDiv = document.getElementById("loanDiv");
function takeLoan(amount, interest, time, IsSavingSystem=false) {
    amount = parseFloat(amount)
    if (payingLoan || isNaN(playerBalance)) {
        console.log('Player bankrupt');
        playerBalance = NaN;
        updateBalance();
        saveGameData();
        return;
    } payingLoan = true;

    const interestRate = interest / 100;

    const totalLoanValue = amount + (amount * interestRate);
    console.log(totalLoanValue);
    const monthlyPayment = totalLoanValue / time; // Monthly payment to pay off over the specified period
    remainingLoanTime = time; // Save the time remaining for the loan

    document.getElementById("loansPer").innerText = `Loans: -$${monthlyPayment.toFixed(2)} per ${Time}s`;
    loanInterest = interest;
    remainingLoanValue = totalLoanValue;
    saveGameData();

    if (!IsSavingSystem) {
        addMoney(amount); // Adds loan amount to player's balance

        const resultElement = document.getElementsByClassName('game-result')[0];
        result = `Taking loan of: $${amount.toFixed(2)} for ${time} months`
        resultElement.innerText = result;
        const oldColor = resultElement.style.color
        resultElement.style.color = 'red';

        try {
            resultElement.classList.remove('show');
        } catch (error) {
            console.error("Error removing 'show' class bc it doesn't exist"); // Log error if any
        }
        // Add the 'show' class to display the result
        resultElement.classList.add('show');
        setTimeout(() => {
            resultElement.classList.remove('show');
            
        }, 3000);
        setTimeout(() => {resultElement.style.color = oldColor}, 3400) // change the color back to normal
    }
    needsLoan = false;
  
    loanInterval = setInterval(() => {
        if (!deductMoney(monthlyPayment, true)) {
            console.log('Player bankrupt');
            playerBalance = NaN;
            clearInterval(loanInterval); // Stop further payments
            saveGameData();  // Save the final game state
            return;
        } else {
            console.log(`Paid loan: $${monthlyPayment.toFixed(2)}`);
            remainingLoanValue -= monthlyPayment;
            remainingLoanTime--;
            saveGameData();

            loansDiv.innerText = `Loans: -$${monthlyPayment.toFixed(2)}`;
            loansDiv.classList.add('show');
            setTimeout(() => {
                loansDiv.classList.remove('show');
            }, 1500);

            if (remainingLoanTime <= 0) {
                payingLoan = false;
                remainingLoanValue = 0;
                clearInterval(loanInterval); // Stop loan payments once the loan is fully paid
                document.getElementById("loansPer").innerText = `Loans: -$___ per __s`;
                loanInterest = 0;
                console.log('Loan fully repaid');
            }
        }
    }, 1000 * Time); // Check every second, but payments happen every Time seconds
}

let IsTakingLTD = false;
function TakeLongTermDeposits(amount, interest, IsSimpleInterest, time, IsSavingSystem = false) {
    amount = parseFloat(amount);
    if (!IsSavingSystem) {
        if (IsTakingLTD) {
            console.log('Already has a ltd');
            return;
        }
        if (!deductMoney(amount)) {
            console.log('Not enough money to make a deposit.');
            return;
        }
    } IsTakingLTD = true;

    const originalAmount = parseFloat(amount);
    const interestRate = interest / 100;
    const totalMonths = time;  // Total time in months
    let monthlyAmount = 0;

    // Calculate the total amount at the end of the period
    let totalAmount;
    if (IsSimpleInterest) {
        // Simple Interest: P + (P * R * T)
        totalAmount = originalAmount + (originalAmount * interestRate * (totalMonths / 12));
    } else {
        // Compound Interest: P * (1 + R/n)^(n*t), with monthly compounding
        totalAmount = originalAmount * Math.pow((1 + interestRate / 12), totalMonths);
    }

    // Divide the total amount by the number of months to get equal monthly payouts
    monthlyAmount = totalAmount / totalMonths;
    
    if (!IsSavingSystem) {
        const resultElement = document.getElementsByClassName('game-result')[0];
        const result = `Deposited: $${originalAmount.toFixed(2)} at ${interest}% interest`;
        resultElement.innerText = result;
        const oldColor = resultElement.style.color;
        resultElement.style.color = 'green';

        try {
            resultElement.classList.remove('show');
        } catch (error) {
            console.error("Error removing 'show' class because it doesn't exist");
        }
        resultElement.classList.add('show');
        setTimeout(() => {
            resultElement.classList.remove('show');
        }, 3000);
        setTimeout(() => {
            resultElement.style.color = oldColor;
        }, 3400);
    }

    let remainingTime = totalMonths;
    remainingDepositValue = monthlyAmount;
    remainingDepositTime = remainingTime;
    const depositInterval = setInterval(() => {
        if (remainingTime <= 0) {
            clearInterval(depositInterval);
            remainingDepositTime = 0;
            remainingDepositValue = 0;
            console.log("Deposit term ended.");
            return;
            IsTakingLTD = false;
        }

        remainingTime--;
        remainingDepositTime--;

        // Add monthly interest to balance
        addMoney(monthlyAmount);

        console.log(`Monthly payout: $${monthlyAmount.toFixed(2)} added to balance.`);

        // Update depositsDiv with monthly payout
        const depositsDiv = document.getElementById('depositsDiv');
        depositsDiv.innerText = `Deposits: $${monthlyAmount.toFixed(2)}`;
        depositsDiv.classList.add('show');
        setTimeout(() => {
            depositsDiv.classList.remove('show');
        }, 1500);

        saveGameData();  // Save progress each month
    }, 1000 * Time);  // Run every Time interval
}

function DepositSaved(monthlyAmount, remainingTime) {
    IsTakingLTD = true;
    const depositInterval = setInterval(() => {
        if (remainingTime <= 0) {
            clearInterval(depositInterval);
            remainingDepositTime = 0;
            remainingDepositValue = 0;
            console.log("Deposit term ended.");
            IsTakingLTD = false;
            return;
        }

        remainingTime--;
        remainingDepositTime--;

        // Add monthly interest to balance
        addMoney(monthlyAmount);

        console.log(`Monthly payout: $${monthlyAmount.toFixed(2)} added to balance.`);

        // Update depositsDiv with monthly payout
        const depositsDiv = document.getElementById('depositsDiv');
        depositsDiv.innerText = `Deposits: $${monthlyAmount.toFixed(2)}`;
        depositsDiv.classList.add('show');
        setTimeout(() => {
            depositsDiv.classList.remove('show');
        }, 1500);

        saveGameData();  // Save progress each month
    }, 1000 * Time);  // Run every Time interval
}

function ChangeBankView(View=null) {
    const buttons = document.querySelectorAll('.Globalbutton');
    let HightlightedBtn = null

    if (View) { // loan
        buttons.forEach(button => button.classList.remove('highlight')); 
        buttons[0].classList.add('highlight');
        HightlightedBtn = true;
    } else if (!View) { // deposit
        buttons.forEach(button => button.classList.remove('highlight')); 
        buttons[1].classList.add('highlight');
        HightlightedBtn = false;
    } else {
        if (buttons[0].classList.contains('highlight')) {
            buttons.forEach(button => button.classList.remove('highlight')); 
            buttons[1].classList.add('highlight');
            HightlightedBtn = false;
        } else {
            buttons.forEach(button => button.classList.remove('highlight')); 
            buttons[0].classList.add('highlight');
            HightlightedBtn = true;
        }
    }

    if (HightlightedBtn) {
        document.getElementById('BankLoansDiv').style.display = 'block';
        document.getElementById('BankDepositsDiv').style.display = 'none';
    } else {
        document.getElementById('BankLoansDiv').style.display = 'none';
        document.getElementById('BankDepositsDiv').style.display = 'block';
    }
}
