let amountOfTimesGambled = 0;
let totalMoneyGambled = 0;
let totalMoneyWonOnGambling = 0;
let playerBalance = 0;
let totalEarned = 0;
let totalLoansValue = 0;
let payingLoan = false;
let loanInterval = 0;
let remainingLoanValue = 0;
let remainingLoanTime = 0;
let loanInterest = 0;
let needsLoan = false;

let remainingDepositValue = 0;
let remainingDepositTime = 0;

const games = {
    poker: [
        { 
            name: "Beginner Poker", 
            cost: 50, 
            prizeRange: [100, 500], 
            description: "Play poker and try your luck!", 
            chance: 0.5, 
            cooldown: 1, 
            playingTime: 0,
            changeOfGettingAddicted: 0.1, // chance of getting addicted
            lossOfGettingAddicted: [5, 15] // times the cost
        },
        { 
            name: "Advanced Poker", 
            cost: 100, 
            prizeRange: [200, 600], 
            description: "Higher stakes for bigger wins!", 
            chance: 0.4, 
            cooldown: 2.5, 
            playingTime: 0,
            changeOfGettingAddicted: 0.15,
            lossOfGettingAddicted: [10, 20]
        },
        { 
            name: "Expert Poker", 
            cost: 150, 
            prizeRange: [300, 700], 
            description: "Go all in for the grand prize!", 
            chance: 0.3, 
            cooldown: 5,
            playingTime: 0,
            changeOfGettingAddicted: 0.2,
            lossOfGettingAddicted: [15, 30]
        }
    ],
    roulette: [
        { 
            name: "Basic Roulette", 
            cost: 100, 
            prizeRange: [200, 800], 
            description: "Spin the roulette wheel!", 
            chance: 0.25, 
            cooldown: 5,
            playingTime: 0,
            changeOfGettingAddicted: 0.1,
            lossOfGettingAddicted: [5, 15]
        },
        { 
            name: "Double Stakes Roulette", 
            cost: 200, 
            prizeRange: [400, 1200], 
            description: "Double your stakes for double the fun!", 
            chance: 0.2, 
            cooldown: 10,
            playingTime: 0,
            changeOfGettingAddicted: 0.15,
            lossOfGettingAddicted: [10, 20]
        },
        { 
            name: "High Roller Roulette", 
            cost: 300, 
            prizeRange: [600, 1600], 
            description: "Bet big to win big!", 
            chance: 0.15, 
            cooldown: 15,
            playingTime: 0,
            changeOfGettingAddicted: 0.2,
            lossOfGettingAddicted: [15, 30]
        }
    ],
    slots: [
        { 
            name: "Starter Slotter", 
            cost: 20, 
            prizeRange: [50, 300], 
            description: "Try your luck at slots!", 
            chance: 0.1, 
            cooldown: 5,
            playingTime: 0,
            changeOfGettingAddicted: 0.05,
            lossOfGettingAddicted: [2, 8]
        },
        { 
            name: "Pro Slotter", 
            cost: 40, 
            prizeRange: [100, 500], 
            description: "Higher bets yield higher rewards!", 
            chance: 0.08, 
            cooldown: 10,
            playingTime: 0,
            changeOfGettingAddicted: 0.1,
            lossOfGettingAddicted: [5, 10]
        },
        { 
            name: "Gambler Slotter", 
            cost: 60, 
            prizeRange: [200, 800], 
            description: "Spin for the jackpot!", 
            chance: 0.05, 
            cooldown: 15,
            playingTime: 0,
            changeOfGettingAddicted: 0.15,
            lossOfGettingAddicted: [10, 20]
        }
    ],
    
    scratchCards: [
        { 
            name: "Basic Scratch Card", 
            cost: 10, 
            prizeRange: [20, 100], 
            description: "Scratch and see if you win!", 
            chance: 0.2, 
            cooldown: 5,
            playingTime: 0,
            changeOfGettingAddicted: 0.05,
            lossOfGettingAddicted: [1, 5]
        },
        { 
            name: "Lucky Scratch Card", 
            cost: 15, 
            prizeRange: [30, 150], 
            description: "Higher chance of winning!", 
            chance: 0.15, 
            cooldown: 10,
            playingTime: 0,
            changeOfGettingAddicted: 0.1,
            lossOfGettingAddicted: [3, 8]
        },
        { 
            name: "Mega Scratch Card", 
            cost: 20, 
            prizeRange: [50, 200], 
            description: "Big wins await you!", 
            chance: 0.1, 
            cooldown: 15,
            playingTime: 0,
            changeOfGettingAddicted: 0.15,
            lossOfGettingAddicted: [5, 10]
        }
    ],
    
    lotteries: [
        { 
            name: "Local Lottery", 
            cost: 5, 
            prizeRange: [20, 100], 
            description: "Win small prizes in your local draw!", 
            chance: 0.2, 
            cooldown: 5,
            playingTime: 0,
            changeOfGettingAddicted: 0.05,
            lossOfGettingAddicted: [1, 3]
        },
        { 
            name: "State Lottery", 
            cost: 10, 
            prizeRange: [40, 150], 
            description: "Try your luck in the state lottery with bigger prizes!", 
            chance: 0.15, 
            cooldown: 10,
            playingTime: 0,
            changeOfGettingAddicted: 0.1,
            lossOfGettingAddicted: [2, 5]
        },
        { 
            name: "National Lottery", 
            cost: 20, 
            prizeRange: [80, 200], 
            description: "Enter the national draw for a chance at life-changing sums!", 
            chance: 0.1, 
            cooldown: 15,
            playingTime: 0,
            changeOfGettingAddicted: 0.15,
            lossOfGettingAddicted: [3, 8]
        },
        { 
            name: "Powerball Lottery", 
            cost: 30, 
            prizeRange: [120, 100], 
            description: "Take a shot at the massive Powerball jackpot!", 
            chance: 0.05, 
            cooldown: 15,
            playingTime: 0,
            changeOfGettingAddicted: 0.2,
            lossOfGettingAddicted: [5, 15]
        },
        { 
            name: "MegaMillions Lottery", 
            cost: 50, 
            prizeRange: [1000001, 10000000], 
            description: "The ultimate lottery for enormous winnings!", 
            chance: 0.00000001, 
            cooldown: 60,
            playingTime: 0,
            changeOfGettingAddicted: 0.01,
            lossOfGettingAddicted: [10, 20]
        },
        { 
            name: "MegaBillions Lottery", 
            cost: 50000, 
            prizeRange: [1000000001, 10000000000], 
            description: "The actual ultimate lottery for enormous winnings.", 
            chance: 0.001, 
            cooldown: 120,
            playingTime: 0,
            changeOfGettingAddicted: 0.001,
            lossOfGettingAddicted: [15, 30]
        }
    ]
};

let Count = {
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

let Income = {
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

let performance = { 
    autoclicker: 1,
    freelancer: 1,
    assistant: 1,
    developer: 1,
    consultant: 1,
    designer: 1,
    analyst: 1,
    manager: 1,
    company: 1,
    realestate: 1,
    enterprise: 1,
    factory: 1
}; // Performance starts at 100%

let jobCosts = {
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

let jobIncome = {
    autoclicker: .5,
    freelancer: 1,
    assistant: 2.5,
    developer: 5,
    consultant: 10,
    designer: 25,
    analyst: 50,
    manager: 100,
    company: 150,
    realestate: 200,
    enterprise: 350,
    factory: 500
};

const salaries = {
    autoclicker: { perfectSalary: 10, worstSalary: 5 },
    assistant: { perfectSalary: 50, worstSalary: 20 },
    company: { perfectSalary: 200, worstSalary: 50 },
    enterprise: { perfectSalary: 500, worstSalary: 100 },
    realestate: { perfectSalary: 1000, worstSalary: 400 },
    factory: { perfectSalary: 5000, worstSalary: 1000 },
    freelancer: { perfectSalary: 30, worstSalary: 15 },
    developer: { perfectSalary: 100, worstSalary: 50 },
    manager: { perfectSalary: 250, worstSalary: 100 },
    designer: { perfectSalary: 120, worstSalary: 60 },
    analyst: { perfectSalary: 150, worstSalary: 75 },
    consultant: { perfectSalary: 500, worstSalary: 200 }
};

let jobSalary = {
    autoclicker: 0,
    assistant: 0,
    company: 0,
    enterprise: 0,
    realestate: 0,
    factory: 0,
    freelancer: 0,
    developer: 0,
    manager: 0,
    designer: 0,
    analyst: 0,
    consultant: 0
};
