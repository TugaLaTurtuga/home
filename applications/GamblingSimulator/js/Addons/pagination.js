// Select all .game-container elements in document order
let gameContainers = Array.from(document.querySelectorAll('.game-container'));

// Function to show the specified page and hide the rest
function showPage(page_num) {
    console.log(gameContainers);
    gameContainers.forEach((container, index) => {
        if (index === page_num - 1) {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
        console.log(`page ${index + 1} is: ${container.style.display}`);
    });
}

// Optional: Show the first page initially
showPage(1);
