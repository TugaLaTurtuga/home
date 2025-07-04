const gameSpeed = 1 / 1; // the divisor is in fast it is, 1/4 makes the game 4x faster (excluding aminations)
const DEBUG_MODE = false; // not-finished

const player = {
    balance: 0,
    amountOfTimesGambled: 0,
    totalMoneyGambled: 0,
    totalMoneyWonOnGambling: 0,
    totalEarned: 0,
    totalLoansValue: 0,
    payingLoan: false,
    loanInterval: 0,
    remainingLoanValue: 0,
    remainingLoanTime: 0,
    loanInterest: 0,
    needsLoan: false,
    remainingDepositValue: 0,
    remainingDepositTime: 0,
    income: {
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
    },
    count: {
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
    },
    performance: { 
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
    },
    jobCosts: {
        autoclicker: 50,
        freelancer: 500,
        assistant: 2_500,
        developer: 7_500,
        consultant: 12_500,
        designer: 25_000,
        analyst: 50_000,
        manager: 100_000,
        company: 500_000,
        realestate: 1_000_000,
        enterprise: 7_500_000,
        factory: 12_500_000
    },
    jobIncome: {
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
    },
    salaries: {
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
    },
    jobSalary: {
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
    }
};

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
            changeOfGettingAddicted: 0.1,
            lossOfGettingAddicted: [5, 15]
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
            chance: 0.4, 
            cooldown: 5,
            playingTime: 0,
            changeOfGettingAddicted: 0.05,
            lossOfGettingAddicted: [2, 8],
            level: 1
        },
        { 
            name: "Pro Slotter", 
            cost: 40, 
            prizeRange: [100, 500], 
            description: "Higher bets yield higher rewards!", 
            chance: 0.2, 
            cooldown: 10,
            playingTime: 0,
            changeOfGettingAddicted: 0.1,
            lossOfGettingAddicted: [5, 10],
            level: 2
        },
        { 
            name: "Gambler Slotter", 
            cost: 60, 
            prizeRange: [200, 800], 
            description: "Spin for the jackpot!", 
            chance: 0.1, 
            cooldown: 15,
            playingTime: 0,
            changeOfGettingAddicted: 0.15,
            lossOfGettingAddicted: [10, 20],
            level: 3
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
            lossOfGettingAddicted: [1, 5],
            level: 1
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
            lossOfGettingAddicted: [3, 8],
            level: 2
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
            lossOfGettingAddicted: [5, 10],
            level: 3
        }
    ],

    Blackjack: [
        { 
            name: "Basic Blackjack", 
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
            name: "Lucky Blackjack", 
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
            name: "Mega Blackjack", 
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

function initializeDefaultValues(IsSellingAllEmployes = false) {
    player.balance = 0;
    if (!IsSellingAllEmployes) {
        player.amountOfTimesGambled = 0;
        player.totalMoneyGambled = 0;
        player.totalMoneyWonOnGambling = 0;
        player.totalEarned = 0;
    }
    player.totalLoansValue = 0;
    player.payingLoan = false;
    player.loanInterval = 0;
    player.remainingLoanValue = 0;
    player.remainingLoanTime = 0;
    player.loanInterest = 0;
    player.needsLoan = false;

    // Reset all job-related data in player object
    for (let job in player.count) {
        player.count[job] = 0;
        player.performance[job] = 1;
        player.jobSalary[job] = 0;
    }

    // Reset job costs to default values
    player.jobCosts = {
        autoclicker: 50,
        freelancer: 500,
        assistant: 2_500,
        developer: 7_500,
        consultant: 12_500,
        designer: 25_000,
        analyst: 50_000,
        manager: 100_000,
        company: 500_000,
        realestate: 1_000_000,
        enterprise: 7_500_000,
        factory: 12_500_000
    };

    // Reset job income to default values
    player.jobIncome = {
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

    updateBalance();
}
