function populateDiceFaces() {
    const diceElements = document.querySelectorAll('.dice');
    const diceHTML = `
        <div class="face face1"><div class="dot center"></div></div>
        <div class="face face2">
            <div class="dot top-left"></div>
            <div class="dot bottom-right"></div>
        </div>
        <div class="face face3">
            <div class="dot top-left"></div>
            <div class="dot center"></div>
            <div class="dot bottom-right"></div>
        </div>
        <div class="face face4">
            <div class="dot top-left"></div>
            <div class="dot top-right"></div>
            <div class="dot bottom-left"></div>
            <div class="dot bottom-right"></div>
        </div>
        <div class="face face5">
            <div class="dot top-left"></div>
            <div class="dot top-right"></div>
            <div class="dot center"></div>
            <div class="dot bottom-left"></div>
            <div class="dot bottom-right"></div>
        </div>
        <div class="face face6">
            <div class="dot top-left"></div>
            <div class="dot top-right"></div>
            <div class="dot middle-left"></div>
            <div class="dot middle-right"></div>
            <div class="dot bottom-left"></div>
            <div class="dot bottom-right"></div>
        </div>
    `;

    diceElements.forEach(dice => {
        dice.innerHTML = diceHTML;
    });
}
document.addEventListener('DOMContentLoaded', populateDiceFaces);

function rollDice(dices) {
    const aminationTime = 600
    let results = [];
    let addedResults = 0;
    function rand(num) {
        return Math.random() * num;
    }
    function randSign() {
        return Math.random() < 0.5 ? -1 : 1;
    }
    dices.forEach(dice => {
        // Dice face result (1 to 6)
        let result = Math.floor(rand(6)) + 1;
        if (result === dice.getAttribute("dicePos")) {
            console.log(result)
            result = Math.floor(rand(6)) + 1;
            console.log(result)
        } 
        // Predefined rotations to show each face up
        const faceRotation = {
            1: { x: 0,   y: 0   },   // Face 1 front
            2: { x: 0,   y: 90  },   // Face 2 right
            3: { x: 0,   y: 180 },   // Face 3 back
            4: { x: 0,   y: -90 },   // Face 4 left
            5: { x: -90, y: 0   },   // Face 5 top
            6: { x: 90,  y: 0   },   // Face 6 bottom
        };
        const baseX = faceRotation[result].x;
        const baseY = faceRotation[result].y;
        // Add large spins to simulate realistic roll
        const spins = 3;
        const x = baseX + 360 * spins;
        const y = baseY + 360 * spins;
        const dx = rand(300) * randSign();
        const dy = rand(400) * randSign();
        const dz = rand(200) * randSign();
        // First animation
        dice.style.transform = `
            rotateX(${x / 2}deg) 
            rotateY(${y / 2}deg) 
            translate3d(${dx}px, ${dy}px, ${dz}px) 
        `;
        // Final roll to center
        setTimeout(() => {
            dice.style.transform = `
                rotateX(${x}deg) 
                rotateY(${y}deg) 
                translate3d(0px, 0px, 0px) 
            `;
        }, aminationTime / 2);

        setTimeout(() => {
            dice.setAttribute("dicePos", result);
        }, aminationTime);
        
        results.push(result);
        addedResults += result
    });

    setTimeout(() => {
        console.log("Dice rolled:", [addedResults, results]);
        return [addedResults, results];
    }, aminationTime);
}
