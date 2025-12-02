// Get slider elements
const gridSizeSlider = document.getElementById('gridSizeSlider');
const jumpForceSlider = document.getElementById('jumpForceSlider');
const volumeSlider = document.getElementById('volumeSlider');
const volumeImg = document.getElementById('volumeImg');

// Function to update the slider gradient and volume image
function updateSliderBackground(slider) {
    const percentage = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.setProperty('--slider-value', `${percentage}%`);

    if (slider === volumeSlider) { // Update the volume icon based on volume value
        const value = parseFloat(volumeSlider.value);
        if (value > 0.7) {
            volumeImg.src = 'Images/Volume/full_volume.png';
        } else if (value > 0.3) {
            volumeImg.src = 'Images/Volume/medium_volume.png';
        } else if (value !== 0) {
            volumeImg.src = 'Images/Volume/low_volume.png';
        } else {
            volumeImg.src = 'Images/Volume/no_volume.png';
        }
    }
}

// Function to set the slider color dynamically
function setSliderColor(slider, color) {
    slider.style.setProperty('--slider-color', color);
}
function setSliderBackGroundColor(slider, color) {
    slider.style.setProperty('--slider-background-color', color);
}

// Function to handle scroll events on the slider
function handleSliderScroll(event, slider) {
    event.preventDefault(); // Prevent the page from scrolling
    const scrollSpeed = 0.25;
    const step = (slider.min - slider.max) / 100 * event.deltaY * scrollSpeed; // Get slider's step value or default to 1

    // Update the slider's value based on scroll direction
    if (event.deltaY < 0) {
        // Scrolling up
        slider.value = Math.min(parseFloat(slider.value) + step, parseFloat(slider.max));
    } else {
        // Scrolling down
        slider.value = Math.max(parseFloat(slider.value) + step, parseFloat(slider.min));
    }

    // Trigger the input event programmatically
    const inputEvent = new Event('input', { bubbles: true });
    slider.dispatchEvent(inputEvent); // Dispatch input event to trigger any associated listeners
}

// Initialize sliders
function initializeSliders() {
    updateSliderBackground(gridSizeSlider);
    updateSliderBackground(jumpForceSlider);
    updateSliderBackground(volumeSlider);
}

// Attach event listeners for slider inputs
gridSizeSlider.addEventListener('input', function() {
    updateSliderBackground(gridSizeSlider);
});

jumpForceSlider.addEventListener('input', function() {
    updateSliderBackground(jumpForceSlider);
});

volumeSlider.addEventListener('input', function() {
    updateSliderBackground(volumeSlider);
});

// Attach scroll event listeners for each slider
gridSizeSlider.addEventListener('wheel', function(event) {
    handleSliderScroll(event, gridSizeSlider);
});
jumpForceSlider.addEventListener('wheel', function(event) {
    handleSliderScroll(event, jumpForceSlider);
});
volumeSlider.addEventListener('wheel', function(event) {
    handleSliderScroll(event, volumeSlider);
});

// Set slider colors
setSliderColor(gridSizeSlider, 'blue');
setSliderColor(jumpForceSlider, 'green');
setSliderColor(volumeSlider, 'rgb(245, 100, 100)');

// Initialize sliders on page load
initializeSliders();
