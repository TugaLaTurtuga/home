const WorkBtn = document.querySelector('.earnMoney');
const ACTE = document.getElementById('AminateClickToEarn_settings');
let angle = 0;
let isSquished = false;
let animationFrameId = null; // Store the animation frame ID

function animateTitle() {
    if (SettingsVariables.AminateClickToEarn) {
        const amplitude = 10;
        const yOffset = Math.sin(angle) * amplitude;
        const scale = isSquished ? 0.9 : 1;

        // Combine floating and squish effects
        WorkBtn.style.transform = `translateY(${yOffset}px) scale(${scale})`;

        angle += 0.015;

        // Request the next frame of animation
        animationFrameId = requestAnimationFrame(animateTitle);
    } else {
        // Cancel any ongoing animation
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }
}

// Add squish effect on mouse down and release
WorkBtn.addEventListener('mousedown', () => {
    isSquished = true;
    if (!SettingsVariables.AminateClickToEarn) WorkBtn.style.transform = `scale(${0.95})`;
});

WorkBtn.addEventListener('mouseup', () => {
    isSquished = false;
    if (!SettingsVariables.AminateClickToEarn) WorkBtn.style.transform = `scale(${1})`;
});

// Toggle animation based on settings button
ACTE.addEventListener('click', () => {
    setTimeout(() => {
        if (ACTE.className.includes('toggle-btn on')) {
            angle = 0;
            animateTitle(); // Start animation if enabled
        }
    }, 250);
});

// Initial call to start the animation if enabled
animateTitle();
