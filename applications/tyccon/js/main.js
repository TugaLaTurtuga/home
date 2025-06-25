
function drawBoard(startX, startY) {
    for (let x = 0; x < gridSize; ++x) {
        for (let y = 0; y < gridSize; ++y) {
            ctx.beginPath();
            ctx.rect(
                startX + x * squareSize,
                startY + y * squareSize,
                squareSize,
                squareSize
            );
            ctx.fillStyle = `#333`;
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#fff';
            ctx.stroke();
        }
    }
}

function drawChar(startX, startY) {
    ctx.beginPath();
    ctx.rect(
        startX + pos[0] * squareSize,
        startY + pos[1] * squareSize,
        squareSize,
        squareSize
    );
    ctx.fillStyle = `#999`;
    ctx.fill();
    ctx.stroke();
    
    itemName.textContent = '';
    itemCarryingName.textContent = '';
    
    foodName.textContent = '';
    foodCarryingName.textContent = '';

    if (carrying) {
        if (DEBUG_MODE) console.log('Carrying:', carrying.name);
        itemCarryingName.textContent = "Carrying: " + carrying.name.charAt(0).toUpperCase() + carrying.name.slice(1);
    }

    for (const [key, utensil] of Object.entries(player.items.utensils)) {
        if (key === "level") continue;

        const uX = utensil.pos[0];
        const uY = utensil.pos[1];
        const uSizeX = utensil.size[0];
        const uSizeY = utensil.size[1];
        if (
            pos[0] >= uX && pos[0] <= uX + uSizeX - 1 &&
            pos[1] >= uY && pos[1] <= uY + uSizeY - 1
        ) {
            itemName.textContent = utensil.name.charAt(0).toUpperCase() + utensil.name.slice(1);
            foodName.textContent = utensil.food && utensil.food[0][0] && utensil.food[0][0][0]
                ? `${utensil.food[0][0][0]['name'].charAt(0).toUpperCase() + utensil.food[0][0][0]['name'].slice(1)} (x${utensil.food[0][0][1]})`
                : '';
            return;
        }
    }
}

function drawUtensils(startX, startY) {
    for (const [key, utensil] of Object.entries(player.items.utensils)) {
        if (key === "level") continue;

        ctx.beginPath();
        const ux = utensil.pos[0];
        const uy = utensil.pos[1];
        const sizeX = utensil.size[0];
        const sizeY = utensil.size[1];
        ctx.rect(
            startX + ux * squareSize,
            startY + uy * squareSize,
            squareSize * sizeX,
            squareSize * sizeY
        );
        ctx.fillStyle = utensil.color;
        ctx.fill();
        ctx.stroke();

        for (let y = 0; y < utensil.size[1]; ++y) {
            for (let x = 0; x < utensil.size[0]; ++x) {
                if (utensil.food[x][y][0] !== null) {
                    // Draw food name
                    ctx.fillStyle = '#fff';
                    ctx.font = '14px Arial';
                    const foodText = `${utensil.food[0][0][0]['name'].charAt(0).toUpperCase() + utensil.food[0][0][0]['name'].slice(1)} (x${utensil.food[0][0][1]})`;
                    ctx.fillText(
                        foodText,
                        startX + ux * squareSize + (squareSize * sizeX - ctx.measureText(foodText).width) / 2,
                        startY + uy * squareSize + squareSize - 10
                    );

                    const centerX = startX + ux * squareSize + (squareSize * sizeX) / 2;
                    const centerY = startY + uy * squareSize + (squareSize * sizeY) / 3;
                    ctx.beginPath();
                    ctx.rect(
                        centerX - foodSize / 2,
                        centerY - foodSize / 2,
                        foodSize,
                        foodSize
                    );
                    ctx.fillStyle = '#fff';
                    ctx.fill();
                    ctx.stroke();
                }
            }
        }
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Calculate total grid dimensions
    const gridWidth = gridSize * squareSize;
    const gridHeight = gridSize * squareSize;

    // Calculate top-left corner to center the grid
    const startX = (canvas.width - gridWidth) / 2;
    const startY = (canvas.height - gridHeight) / 2;

    drawBoard(startX, startY);
    drawUtensils(startX, startY);
    drawChar(startX, startY);
}

window.addEventListener('keyup', (e) => {
    if (e.key === carryingLetter || e.key === carryingDeliveryLetter) {
        // If carrying an item, try to place it down
        if (carrying) {
            for (const [key, utensil] of Object.entries(player.items.utensils)) {
                if (utensil.type === 'trash' && pos[0] === utensil.pos[0] && pos[1] === utensil.pos[1]) {
                    // If the user is in the trash bin, discard the item
                    if (DEBUG_MODE) console.log('Discarding:', carrying.name);
                    carrying = null;
                    render();
                    return;
                }
            }

            const utensil = carrying.data;
            if (utensil?.size) {
                const oldCarrying = carrying;
                if (!placeDownForUtensilPlusSDfjnkdspsdhjklfshdjkfsdlofhseui(utensil)) {
                    carrying = oldCarrying;
                }
            }
        }
    }
});

function placeDownForUtensilPlusSDfjnkdspsdhjklfshdjkfsdlofhseui(utensil) {
    if (!utensil.holdPos) utensil.holdPos = [0, 0];
    utensil = createFoodHolders(utensil);
    const cX = pos[0] - utensil.holdPos[0];
    const cY = pos[1] - utensil.holdPos[1];
    utensil.pos = [cX, cY];
    if (DEBUG_MODE) console.log('Trying to place down:', carrying.name, ' at position:', utensil.pos);
    function getCoveredTiles(pos, size) {
        const startX = pos[0];
        const startY = pos[1];
        const width = size[0];
        const height = size[1];
        const tiles = [];
        for (let dx = 0; dx < width; dx++) {
            for (let dy = 0; dy < height; dy++) {
                const x = startX + dx;
                const y = startY + dy;
                tiles.push([x, y]);
            }
        }
        return tiles;
    }
    
    // Check bounds
    const newTiles = getCoveredTiles(utensil.pos, utensil.size);
    for (const [x, y] of newTiles) {
        if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) {
            return false; // Out of bounds
        }
        for (const [key, otherUtensil] of Object.entries(player.items.utensils)) {
            if (typeof otherUtensil !== "object") continue;
            const otherTiles = getCoveredTiles(otherUtensil.pos, otherUtensil.size);
            for (const [ox, oy] of otherTiles) {
                if (x === ox && y === oy) {
                    return false; // Overlap
                }
            }
        }
    }
    addUtensilToPlayer(utensil.name, utensil, utensil.pos);
    carrying = null;
    render();
    return true;
}

window.addEventListener('keydown', (e) => {
    if (e.key === carryingLetter && !carrying) {
        // Try to pick up utensil at current position
        for (const [key, utensil] of Object.entries(player.items.utensils)) {
            if (key === "level") continue;

            const uX = utensil.pos[0];
            const uY = utensil.pos[1] ;
            const uSizeX = utensil.size[0];
            const uSizeY = utensil.size[1];
            if ( pos[0] >= uX && pos[0] <= uX + uSizeX - 1 &&
              pos[1] >= uY && pos[1] <= uY + uSizeY - 1 ) {
                if (!utensil.holdPos) utensil.holdPos = [0, 0];
                for (let dx = 0; dx < uSizeX; dx++) {
                    const x = uX + dx;
                    if (pos[0] === x) {
                        utensil.holdPos[0] = dx;
                        break;
                    }
                }
                for (let dy = 0; dy < uSizeY; dy++) {
                    const y = uY + dy;
                    if (pos[1] === y) {
                        utensil.holdPos[1] = dy;
                        break;
                    }
                }

                carrying = {
                    name: utensil.name,
                    id: key,
                    data: utensil
                };
                delete player.items.utensils[key];
                break;
            }
        }
    } else if (e.key === carryingDeliveryLetter && !carrying) {
        // Try to pick up utensil or food at current position
        for (const [categoryKey, categoryItems] of Object.entries(player.items)) {
            for (const [key, item] of Object.entries(categoryItems)) {
                if (key === "level" || typeof item !== "object" || item === null) continue;

                const uX = item.pos[0];
                const uY = item.pos[1];
                const uSizeX = item.size[0];
                const uSizeY = item.size[1];

                if (
                    pos[0] >= uX && pos[0] <= uX + uSizeX - 1 &&
                    pos[1] >= uY && pos[1] <= uY + uSizeY - 1
                ) {
                    if (!item.holdPos) item.holdPos = [0, 0];

                    for (let dx = 0; dx < uSizeX; dx++) {
                        const x = uX + dx;
                        if (pos[0] === x) {
                            item.holdPos[0] = dx;
                            break;
                        }
                    }
                    for (let dy = 0; dy < uSizeY; dy++) {
                        const y = uY + dy;
                        if (pos[1] === y) {
                            item.holdPos[1] = dy;
                            break;
                        }
                    }

                    const [hx, hy] = item.holdPos;
                    const slot = item.food?.[hx]?.[hy];

                    if (slot && slot[0] && slot[1] > 0) {
                        // Carry food item
                        carrying = {
                            name: slot[0]['name'],
                            data: slot[0]['data']
                        };

                        const newAmount = --slot[1];
                        if (newAmount === 0) item.food[hx][hy] = [null, 0];
                        else item.food[hx][hy][1] = newAmount;

                        if (DEBUG_MODE) console.log(item.food[hx][hy]);
                    } else {
                        // Fall back to carrying the whole utensil
                        carrying = {
                            name: item.name,
                            id: key,
                            data: item
                        };
                        delete player.items[categoryKey][key];
                    }

                    break;
                }
            }
        }
    }

    switch (e.key) {
        case 'w':
            if (pos[1] > 0) pos[1]--;
            break;
        case 's':
            if (pos[1] < gridSize - 1) pos[1]++;
            break;
        case 'a':
            if (pos[0] > 0) pos[0]--;
            break;
        case 'd':
            if (pos[0] < gridSize - 1) pos[0]++;
            break;
    }

    render();
});

async function init() {
    await initializeFoodHolders();
    await initializeDefaultUtensils();
    render();
}
init();
