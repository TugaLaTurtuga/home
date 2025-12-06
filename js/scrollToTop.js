const scrollToTop = document.querySelector(".scrollToTop");
const scrollToTopText = document.getElementById("scrollToTopText");
document.addEventListener("wheel", () => {
    updateScrollToTop();
});

document.addEventListener("scroll", () => {
    updateScrollToTop();
});

scrollToTop.addEventListener("click", () => {
    document.body.scrollIntoView({ behavior: 'smooth' });
});

let cooldownRing = null;
let totalCircumference = 0;

function setupScrollToTopRing() {
    // Get container size
    const size = scrollToTop.offsetHeight; // or getBoundingClientRect().height
    const strokeWidth = parseFloat(
        getComputedStyle(scrollToTop).getPropertyValue("--circle-border")
    ) ?? 6;

    const radius = size / 2 - strokeWidth / 2;

    // Create SVG elements dynamically
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.classList.add("cooldownRing");

    progressCircle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
    );
    progressCircle.classList.add("ring-progress");
    progressCircle.setAttribute("cx", size / 2);
    progressCircle.setAttribute("cy", size / 2);
    progressCircle.setAttribute("r", radius);
    progressCircle.setAttribute("stroke-width", strokeWidth);

    cooldownRing = progressCircle;
    svg.append(progressCircle);
    scrollToTop.appendChild(svg);

    // Compute circumference dynamically
    totalCircumference = 2 * Math.PI * (radius * 1.05);
    progressCircle.style.strokeDasharray = totalCircumference;
    progressCircle.style.strokeDashoffset = totalCircumference;
    scrollToTop.style.opacity = "0";
}

function updateScrollToTop() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(1, window.scrollY / maxScroll);
    const offset = totalCircumference * (1 - progress) + 15;

    if (offset < totalCircumference) {
        const rot = progress * 360 * parseInt(document.documentElement.scrollHeight / 700);
        scrollToTopText.style.transform = `rotate(${rot}deg)`;
        scrollToTop.style.opacity = "1";
        scrollToTop.style.pointerEvents = "all";
        
        cooldownRing.style.strokeDashoffset = offset;
    } else {
        scrollToTop.style.opacity = "0";
        scrollToTop.style.pointerEvents = "none";
    }
}

function startScrollToTop() {
  if (scrollToTop) {
    setupScrollToTopRing();
  }
}

startScrollToTop();