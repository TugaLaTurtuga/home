// Floating animation for mainTitle
const mainTitle = document.querySelector('.mainTitle');
let angle = 0;

function animateTitle() {
    const amplitude = 10;
    const yOffset = Math.sin(angle) * amplitude;
    mainTitle.style.transform = `translateY(${yOffset}px)`;
    angle += 0.01;
    requestAnimationFrame(animateTitle);
}
animateTitle(); // Start the title floating animation

// JavaScript to create and illuminate grid cells based on cursor position
document.addEventListener('DOMContentLoaded', () => {
    const firstDiv = document.querySelector('.firstDiv');
    const illuminated = document.querySelector('.illuminated');

    firstDiv.addEventListener('mousemove', (e) => {
        // Only illuminate when the cursor is over firstDiv
        illuminated.style.left = `${e.pageX}px`;
        illuminated.style.top = `${e.pageY}px`;
        illuminated.style.opacity = '1';
    });

    firstDiv.addEventListener('mouseout', () => {
        illuminated.style.opacity = '0';  // Smoothly fades out when the cursor leaves
    });
});
