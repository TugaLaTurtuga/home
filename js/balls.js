const canvas = document.getElementById('backgroundCanvas');
const page = document.getElementById('page-1');
const topPart = document.querySelector('.top-part');
const ctx = canvas.getContext('2d');
const balls = [];
const lightSize = 350;
const cardLightSize = 500;
let time = 10;
let forceRadius = 0;
let brightnessMultiplier = 1;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.maxDist = Math.max(canvas.width, canvas.height);
let centerX = canvas.width / 2;
let centerY = canvas.height / 2;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.maxDist = Math.max(canvas.width, canvas.height);
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
    createBalls();
});

let mouseX, mouseY = -1000;

topPart.style.opacity = 0;
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY + window.scrollY;
    if (mouseY < 120) {
        topPart.style.opacity = 1;
        topPart.style.transform = 'translate(-50%, 0) scale(1)';
    } else if (topPart.style.opacity == 1) {
        topPart.style.opacity = 0;
        topPart.style.transform = 'translate(-50%, 0) scale(0.8)';
    }
});

document.addEventListener('mouseleave', (e) => {
    mouseX, mouseY = -1000;
});

document.addEventListener('wheel', (e) => {
    mouseY = e.clientY + window.scrollY;
});

const gridSize = 30;
function createBalls() {
    balls.length = 0;
    const cols = Math.floor(canvas.width / gridSize) + gridSize;
    const rows = Math.floor(canvas.height / gridSize) + gridSize;
    for (let y = -gridSize; y < rows; y++) {
        for (let x = -gridSize; x < cols; x++) {
        balls.push({
            x: x * gridSize + gridSize / 2,
            y: y * gridSize + gridSize / 2,
            baseY: y * gridSize + gridSize / 2,
            baseX: x * gridSize + gridSize / 2,
            amplitudeY: 100 + Math.random() * 100,
            speedY: 0.05 + Math.random() * 0.1,
            amplitudeX: Math.random() * 100,
            speedX: 0.05 + Math.random() * 0.1,
            color: 
                [
                    Math.random() * 170 + 125, 
                    Math.random() * 170 + 125, 
                    Math.random() * 170 + 125
                ],
            force: Math.random() * 0.3 + 0.3,
            size: Math.random() + 4,
            oldBrightness: 0,
        });
        }
    }
}
function drawBalls() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Render balls only if canvas is visible
    if (mouseY < canvas.height * 2) {
        balls.forEach(ball => {
            ball.y = ball.baseY + Math.sin(time * ball.speedY) * ball.amplitudeY;
            ball.x = ball.baseX + Math.sin(time * ball.speedX) * ball.amplitudeY;
            const dx = ball.x - mouseX;
            const dy = ball.y - mouseY;
            let distance = Math.sqrt(dx * dx + dy * dy);

            const centerDx = ball.x - centerX;
            const centerDy = (ball.y - centerY) * 1.1;
            let centerDistance = Math.sqrt(centerDx * centerDx + centerDy * centerDy);

            //if (distance > lightSize && centerDistance > cardLightSize) return; // no need to render
            //else if (ball.x < 0 || ball.y < 0 || ball.x > canvas.width || ball.y > canvas.height) return; // no need to render
            
            let brightness = 0;
            let distBright = 0;
            if (distance < lightSize && !isNaN(distance)) {
                distBright = Math.max(0, (1 - distance / lightSize) * 0.6 * ball.force);
                brightness = distBright;
            }
            if (centerDistance < cardLightSize && !isNaN(centerDistance)) {
                brightness += Math.max(0, (1 - centerDistance / cardLightSize) * 0.6 * ball.force);
            }

            ball.oldBrightness *= Math.min(Math.abs(1 - (ball.oldBrightness - 1) * 0.6), 0.98);
            if (brightness > ball.oldBrightness) ball.oldBrightness = brightness; 
            else brightness = ball.oldBrightness;
            if (brightness < 0.1) return; // no need to render
            brightness = (brightness - distBright) + (distBright * brightnessMultiplier);

            // Apply force effect
            const angle = Math.atan2(dy, dx);
            if (distance < 100) {
                ball.x += Math.cos(angle) * (100 - distance) * ball.force;
                ball.y += Math.sin(angle) * (100 - distance) * ball.force;
            }
            if (distance < forceRadius) {
                ball.x += Math.cos(angle) * (forceRadius - distance) * ball.force;
                ball.y += Math.sin(angle) * (forceRadius - distance) * ball.force;
            }
            
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${brightness * ball.color[0]}, ${brightness * ball.color[1]}, ${brightness * ball.color[2]}, ${brightness * 4})`;
            ctx.fill();
        });
        time += 0.05;
        // Gradually reduce force radius and brightness multiplier
        if (forceRadius > 0) {
            forceRadius *= Math.min(Math.abs(1 - (forceRadius - 1) * 0.0003), 0.99);
        } else forceRadius = 0;
        
        if (brightnessMultiplier > 1) {
            brightnessMultiplier *= Math.min(Math.abs(1 - (brightnessMultiplier - 1) * 0.06), 0.99);
        } else brightnessMultiplier = 1;
    }
    requestAnimationFrame(drawBalls);
}
page.addEventListener('click', () => {
    addForceRadius(200, 1.5);
});
function addForceRadius( size = 100, bm = 1.5 ) {
    const startForceRadius = forceRadius; // Start radius
    const targetForceRadius = Math.min(startForceRadius + (((startForceRadius + canvas.maxDist * size) / canvas.maxDist)), canvas.maxDist * 1.75);
    const duration = 200; // Duration in milliseconds
    const startTime = performance.now();
    brightnessMultiplier *= bm;
    brightnessMultiplier = Math.min(brightnessMultiplier, 10);
    const startBrightnessMultiplier = brightnessMultiplier;
    function animate() {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1); // Normalize progress (0 to 1)
        const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
        forceRadius = startForceRadius + (targetForceRadius - startForceRadius) * easedProgress;
        brightnessMultiplier = startBrightnessMultiplier;
        if (progress >= 1 || forceRadius >= targetForceRadius) {
            forceRadius = targetForceRadius;
            brightnessMultiplier = startBrightnessMultiplier;
        } else {
            requestAnimationFrame(animate);
        }
    }
    animate();
}
createBalls();
drawBalls();

const card = document.getElementById('card');
const maxTilt = 10;
const amplifier = 10;

page.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = Math.max( Math.min(((y - centerY) / centerY) * -amplifier, maxTilt), -maxTilt);
    const rotateY = Math.max( Math.min(((x - centerX) / centerX) * amplifier, maxTilt), -maxTilt);
    card.style.transform = `translate(-50%, -50%) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1)`;
    
    card.style.backgroundPosition = `${rotateX * 5 + 50}% ${rotateY * 5 + 50}%`;
});

page.addEventListener('mouseleave', () => {
    card.style.transform = `translate(-50%, -50%) rotateX(0deg) rotateY(0deg)`;
    card.style.backgroundPosition = `50% 50%`;
});

function scrollToPage(pageNumber) {
    const page = document.getElementById(`page-${pageNumber}`);
    page.scrollIntoView({ behavior: 'smooth' });
}

function openLink(url, self = false) {
    if (self) {
        window.open(url, '_self');
    } else {
        window.open(url, '_blank');
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);
});