const DEBUG_MODE = true;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const itemName = document.getElementById('item-name');
const itemCarryingName = document.getElementById('item-carrying-name');
const foodName = document.getElementById('food-name');
const foodCarryingName = document.getElementById('food-carrying-name')

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gridSize = 3;
const squareSize = 1000 / (10 - -gridSize);
const foodSize = squareSize * 0.5; // Size of food items relative to the square size

let pos = [Math.floor(gridSize / 2), Math.floor(gridSize / 2)];
let carrying = null;
let carryingDelivery = null;
const carryingLetter = '-';
const carryingDeliveryLetter = 'Enter';


function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
}
window.addEventListener('resize', resizeCanvas);
