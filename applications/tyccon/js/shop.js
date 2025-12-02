

const shop = document.getElementById("shop");
const shopItemsDiv = document.createElement("div");
shopItemsDiv.id = "shop-items";
function createShop() {
    const shopH2 = document.createElement("h2");
    shopH2.textContent = "Shop";

    const buttonsDiv = document.createElement("div");
    buttonsDiv.id = "shop-buttons";

    Object.keys(items).forEach(category => {
        const button = document.createElement("button");
        button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        buttonsDiv.appendChild(button);
    });

    shop.appendChild(shopH2);
    shop.appendChild(buttonsDiv);
    shop.appendChild(shopItemsDiv);
}

function createShopItemElement(name, data, id) {
    const div = document.createElement("div");
    div.className = "shop-item";
    div.dataset.itemId = id;
    const projectedName = document.createElement("p");
    projectedName.textContent = name;

    const price = document.createElement("p");
    price.textContent = `$${formatCost(data.price)}`;

    const button = document.createElement("button");
    button.className = "buy-button";
    button.textContent = "buy";
    button.addEventListener("click", () => {
        buyFood(name, data, id);
    });

    div.appendChild(projectedName);
    div.appendChild(price);
    div.appendChild(button);
    return div;
}

function renderShop(category) {
    const playerLevel = player.items[category]?.level ?? 0;
    shopItemsDiv.innerHTML = `
        <h3>Purchase level: ${playerLevel}</h3>
        <p>${category.charAt(0).toUpperCase() + category.slice(1)}</p>
    `; // Clear old items
    

    if (category === "upgrades") {
        for (const [key, upgrade] of Object.entries(items.upgrades)) {
            const playerUpgradeLevel = player.items.upgrades[key] ?? 0;
            if (playerLevel <= upgrade.level) continue;

            if (Array.isArray(upgrade.price)) {
                for (let i = 0; i < upgrade.price.length; i++) {
                    if (i === playerUpgradeLevel) {
                        const desc = Array.isArray(upgrade.description)
                            ? upgrade.description[i] || upgrade.description[0]
                            : upgrade.description;
                        const name = `upgrade ${key} lv: ${i + 1}`;
                        const data = {
                            price: upgrade.price[i],
                            description: desc
                        };
                        const item = createShopItemElement(name, data, `${key}-lv${i + 1}`);
                        shopItemsDiv.appendChild(item);
                        break;
                    }
                }
            }
        }
    } else {
        for (const [name, data] of Object.entries(items[category])) {
            console.log(name, data, playerLevel);
            if ((data.level ?? 0) <= playerLevel) {
                const item = createShopItemElement(name, data, generateId());
                shopItemsDiv.appendChild(item);
            }
        }
    }
}

function buyFood(name, data, id) {
    for (let y = 0; y < player.items.utensils['delivery'].food.length; ++y) {
        for (let x = 0; x < player.items.utensils['delivery'].food[y].length; ++x) {
            if ( player.items.utensils['delivery'].food[x][y][0] === null ||
            ( player.items.utensils['delivery'].food[x][y][0] === name && player.items.utensils['delivery'].food[x][y][1] < 10 )
            ) {

                if (deductMoney(data.price)) {
                    data.id = id;
                    player.items.utensils['delivery'].food[x][y][0] = { name, data };
                    ++player.items.utensils['delivery'].food[x][y][1];
                    console.log(`Food bought: ${name} for ${data.price}, ${player.items.utensils['delivery']}`);
                    console.log(player.items.utensils['delivery'].food[x][y][0]);
                    
                    saveGameData();
                    render();
                } else {
                    foodName.textContent = "Way to poor";
                }
                return;
            }
        }
    }
}


// Initial render
createShop();
renderShop("food");

// Button switching
document.querySelectorAll("#shop-buttons button").forEach(button => {
    button.addEventListener("click", () => {
        const category = button.textContent.trim().toLowerCase();
        renderShop(category);
    });
});
