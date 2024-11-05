const WorkBtn = document.querySelector('.earnMoney');
let angle = 0;
let isSquished = false;

function animateTitle() {
    const amplitude = 10;
    const yOffset = Math.sin(angle) * amplitude;
    const scale = isSquished ? 0.95 : 1; // Apply squish if clicked
    
    // Combine floating and squish effects
    WorkBtn.style.transform = `translateY(${yOffset}px) scale(${scale})`;
    
    angle += 0.02;
    requestAnimationFrame(animateTitle);
}

WorkBtn.addEventListener('mousedown', () => {
    isSquished = true; // Activate squish on mousedown
});

WorkBtn.addEventListener('mouseup', () => {
    isSquished = false; // Deactivate squish on mouseup
});

// Start the floating animation
animateTitle();
