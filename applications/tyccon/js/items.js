const items = {
    'food': {
        bread: {
            price: 1.5,
            description: "A loaf of fresh bread.",
            level: 1,
        },
        hamburguer: {
            price: 3,
            description: "A delicious hamburger.",
            level: 1,
        },
        sausage: {
            price: 2,
            description: "A tasty sausage.",
            level: 1,
        },
        cheese: {
            price: 1,
            description: "A slice of cheese.",
            level: 2,
        },
    },
    'utensils': {
        "oven mk-1": {
            price: 150,
            description: "A basic oven for cooking.",
            type: "oven",
            speed: 1,
            color: '#111',
            size: [1, 1],
            level: 1,
        },
        "oven mk-2": {
            price: 500,
            description: "A more advanced oven with better efficiency.",
            type: "oven",
            speed: 1.5,
            size: [1, 1],
            level: 3,
        },
        "cutting table mk-1": {
            price: 100,
            description: "A basic cutting table for preparing food.",
            type: "cutting_table",
            color: '#d88c07',
            speed: 1,
            size: [1, 1],
            level: 2,
        },
        "fridge mk-1": {
            price: 200,
            description: "A basic fridge for storing food.",
            type: "fridge",
            speed: 1,
            size: [1, 1],
            color: '#0ff',
            level: 2,
        },

        "delivery": {
            price: 100_000,
            description: "A delivery system to bring items to the seller.",
            type: "delivery",
            priority: 1,
            speed: 1,
            size: [1, 1],
            color: '#0f0',
            level: 10,
        },

        "seller": {
            price: 100_000,
            description: "A delivery system to bring items to the seller.",
            type: "sellerdad",
            speed: 1,
            size: [1, 1],
            color: '#00f',
            level: 10,
        },

        'trash': {
            price: 50,
            description: "A trash bin to dispose of unwanted items.",
            type: "trash",
            color: '#f00',
            size: [1, 1],
            level: 3,
        },
    },

    'upgrades': {
        'grid': {
            price: [300, 1_000, 50_000, 1_000_000, 1_000_000_000, 1_000_000_000_000],
            description: "Upgrade the grid size to allow more space for items.",
            type: "grid",
            size: [[3, 3], [5, 5], [7, 7], [9, 9], [11, 11], [13, 13], [15, 15]],
            level: 0,
        },
        'seller': {
            price: [500, 2_500, 12_500, 62_500, 312_500],
            description: [
                "Upgrade the seller to not need to click the space bar to sell items.",
                "Increase the size of the selling area.",
                "Increase the speed of selling items.",
                "Increase the number of items sold at once.",
                "Increase the number of items sold per second.",
            ],
            type: "seller",
            size: [[1, 1], [1, 1], [1, 1], [1, 2], [1, 2], [2, 3]],
            level: 2,
        },
        'delivery': {
            price: [500, 2_500, 12_500, 62_500, 312_500],
            description: [
                "Get more items delivered at once.",
                "Increase the speed of delivery.",
                "Increase the size of the delivery area.",
                "Automatically deliver items.",
                "Increase the size of the delivery area.",
            ],
            type: "delivery",
            size: [[1, 1], [1, 1], [1, 1], [1, 2], [1, 2], [1, 3]],
            level: 2,
        },
    },

    'robots': {
        'buyer_robot mk-1': {
            price: 100_000,
            description: "A delivery system to bring items to the seller.",
            type: "delivery",
            speed: 1,
            size: [1, 1],
            color: '#0f0',
            level: 0,
        },

        'seller_robot mk-1': {
            price: 100_000,
            description: "A delivery system to bring items to the seller.",
            type: "seller",
            speed: 1,
            size: [1, 1],
            color: '#0f0',
            level: 0,
        }
    },
};

let player = {
    balance: 100,
    items: {
        'food': {
            level: 1,
        },

        'utensils': {
            level: 1,
        },

        'upgrades': {
            level: 1,
            grid: 0,
            seller: 0,
            delivery: 0,
        },

        'robots': {
            level: 1,
        },
    }
};

// Function to add utensil with generated ID
function addUtensilToPlayer(itemName, itemData, position) {
    const id = generateId();
    const utensilData = {
        name: itemName,
        id: id,
        pos: position,
        holdPos: [0, 0],
        color: itemData.color,
        size: itemData.size,
        type: itemData.type,
        speed: itemData.speed,
        description: itemData.description,
        price: itemData.price,
        level: itemData.level
    };
    
    player.items.utensils[id] = createFoodHolders(utensilData);
    return id;
}

// Initialize default utensils with generated IDs
function initializeDefaultUtensils() {
    // Add default utensils
    addUtensilToPlayer('oven mk-1', items.utensils['oven mk-1'], [1, 0]);
    addUtensilToPlayer('cutting table mk-1', items.utensils['cutting table mk-1'], [0, 0]);
    addUtensilToPlayer('fridge mk-1', items.utensils['fridge mk-1'], [1, gridSize - 1]);
    addUtensilToPlayer('delivery', items.utensils['delivery'], [0, Math.floor(gridSize / 2)]);
    addUtensilToPlayer('seller', items.utensils['seller'], [gridSize - 1, Math.floor(gridSize / 2)]);
    addUtensilToPlayer('trash', items.utensils['trash'], [gridSize - 1, gridSize - 1]);
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function createFoodHolders(utensil) {
    const food = [];
    for (let y = 0; y < utensil.size[1]; ++y) {
        const newRow = [];
        for (let x = 0; x < utensil.size[0]; ++x) {
            newRow.push([null, 0]);
        }
        food.push(newRow);
    }
    utensil.food = food;
    return utensil;
}


function initializeFoodHolders() {
    for (const [categoryKey, categoryItems] of Object.entries(player.items)) {
        for (const [key, item] of Object.entries(categoryItems)) {
            if (key === "level" || typeof item !== "object" || item === null) continue;
            if (!item.id) item.id = generateId();

            if (categoryKey === 'utensil') continue; // for utensils
            player.items[categoryKey][key] = createFoodHolders(item);
            if (DEBUG_MODE) console.log(`Initialized food for ${categoryKey} > ${key}`, item.food);
        }
    }
}

if (DEBUG_MODE) player.balance = 1_000_000_000;
