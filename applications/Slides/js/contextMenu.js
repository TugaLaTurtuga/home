// Function to delete the selected element or slide
function deleteElement() {
    if (selectedElement) {
        // If it's a slide element (inside the slide navigator)
        if (selectedElement.closest('.slide') && selectedElement.id.includes("slide")) {
            const slideIndex = Array.from(document.querySelectorAll('.slide')).indexOf(selectedElement);
            // Remove the corresponding slide container and its navigator div
            selectedElement.remove();

            // Also remove the corresponding div in the slide navigator
            const slideNavigator = document.getElementById('slide-navigator');
            const slideDiv = slideNavigator.querySelector(`div:nth-child(${slideIndex + 2})`); // +2 because +1 is the '+' button
            if (slideDiv) {
                slideDiv.remove();
            }
        }
    }
}

function loadContextOptions() {
    const textOptions = document.getElementById('text-options');
    const shapeOptions = document.getElementById('shape-options');
    const slideOptions = document.getElementById('slide-options');
    const deleteBtn = document.getElementById('deleteElement');
    const boldBtn = document.getElementById('boldBtn');
    const elementOpitons = document.getElementById('element-options');

    // Hide all options initially
    textOptions.style.display = 'none';
    shapeOptions.style.display = 'none';
    slideOptions.style.display = 'none';
    deleteBtn.style.display = 'block';
    boldBtn.style.display = 'none';
    elementOpitons.style.display = 'block';

    // Check for selected element type and show relevant options
    if (selectedElement.id.includes("slide")) {
        // Show slider options
        slideOptions.style.display = 'block';
        
        // Initialize slider style inputs
        slideAnimationInput.value = selectedElement.style.animation || '';
        slideBackgroundInput.value = rgbToHex(window.getComputedStyle(selectedElement).backgroundColor);
        slideColorInput.value = rgbToHex(window.getComputedStyle(selectedElement).color);
        deleteBtn.style.display = 'none';
    } else if (selectedElement.classList.contains('shape')) {
        // Show shape options
        shapeOptions.style.display = 'block';

        // Initialize shape style inputs
        const computedStyles = window.getComputedStyle(selectedElement);
        document.getElementById('shapeColor').value = rgbToHex(computedStyles.backgroundColor);
        document.getElementById('shapeBorderRadius').value = parseInt(computedStyles.borderRadius, 10) || 0;
        document.getElementById('shapeBorderToggle').checked = computedStyles.borderStyle !== 'none';
        document.getElementById('shapeBorderColor').value = rgbToHex(computedStyles.borderColor);
        document.getElementById('shapeBorderWidth').value = parseInt(computedStyles.borderWidth, 10) || 0;

        // If the shape has text inside, show text options
        if (selectedElement.isContentEditable) {
            textOptions.style.display = 'block';
            boldBtn.style.display = 'block';
            updateBoldButtonState();
        }
    } else if (selectedElement.isContentEditable) {
        // Show text options
        textOptions.style.display = 'block';
        boldBtn.style.display = 'block';
        updateBoldButtonState();

        // Initialize the font-size, color, and text alignment based on the selected element
        fontSizeInput.value = parseInt(window.getComputedStyle(selectedElement).fontSize, 10);
        textColorInput.value = rgbToHex(window.getComputedStyle(selectedElement).color);
        textAlignSelect.value = window.getComputedStyle(selectedElement).textAlign || 'left';
    } else {
        deleteBtn.style.display = 'none';
        elementOpitons.style.display = 'none';
    }
}

// Function to move the context menu to the bottom-right
function moveContextMenuToBottomRight() {
    const contextMenu = document.getElementById('context-menu');
    
    // Get the dimensions of the context menu
    const contextMenuWidth = contextMenu.offsetWidth;
    const contextMenuHeight = contextMenu.offsetHeight;
    
    // Get the viewport size
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate the position for bottom-right
    const xPosition = viewportWidth - contextMenuWidth - 10; // 10px padding from the right
    const yPosition = viewportHeight - contextMenuHeight - 10; // 10px padding from the bottom

    // Set the context menu to the bottom-right position
    contextMenu.style.left = `${xPosition}px`;
    contextMenu.style.top = `${yPosition}px`;
}

// Listen for the keydown event (Ctrl + M)
document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'm') {
        // Prevent default behavior (like opening the browser menu)
        event.preventDefault();
        
        // Move the context menu to the bottom-right
        moveContextMenuToBottomRight();
    }
});

// Function to open the context menu (you may already have this)
function openContextMenu(event) {
    event.preventDefault();
    selectedElement = event.target;

    // Load the appropriate options for the selected element
    setTimeout(() => {
        loadContextOptions();
    }, 1);
    

    const contextMenu = document.getElementById('context-menu');
    
    // Show the context menu at the position where the right-click happened
    contextMenu.style.top = `${event.clientY}px`;
    contextMenu.style.left = `${event.clientX}px`;
    contextMenu.style.opacity = "1";
    contextMenu.style.display = 'block';
}

// Event listeners for right-click (context menu)
document.addEventListener('contextmenu', openContextMenu);

// Function to toggle the Transparent button state
const transparentBtn = document.getElementById('transparent-shape')
transparentBtn.addEventListener('click', () => {
    const isActive = transparentBtn.classList.contains('active');

    // Toggle the active state of the button
    if (isActive) {
        // Make it inactive
        transparentBtn.classList.remove('active');
        transparentBtn.style.backgroundColor = ''; // Remove transparent background
        transparentBtn.style.fontWeight = 'normal'; // Set text to normal weight
        // Set the shape background to its original color (or your default choice)
        if (selectedElement) {
            selectedElement.style.backgroundColor = '#3498db'; // Reset to default or original background color
        }
    } else {
        // Make it active
        transparentBtn.classList.add('active');
        transparentBtn.style.backgroundColor = 'transparent'; // Set button background to transparent
        transparentBtn.style.fontWeight = 'bold'; // Set text to bold
        // Set the shape background to transparent
        if (selectedElement) {
            selectedElement.style.backgroundColor = 'transparent'; // Change the shape's background to transparent
        }
    }
});


// Handle Shape Color change
document.getElementById('shapeColor').addEventListener('input', (event) => {
    if (selectedElement && selectedElement.classList.contains('shape')) {
        selectedElement.style.backgroundColor = event.target.value;
    }
});

// Handle Border Radius change
document.getElementById('shapeBorderRadius').addEventListener('input', (event) => {
    if (selectedElement && selectedElement.classList.contains('shape')) {
        const shapeHeight = parseFloat(window.getComputedStyle(selectedElement).height);
        const shapeWidth = parseFloat(window.getComputedStyle(selectedElement).width);
        const maxRadius = Math.min(shapeHeight, shapeWidth) / 2;

        const inputPercentage = event.target.value;
        const calculatedRadius = maxRadius * inputPercentage;
        selectedElement.style.borderRadius = `${calculatedRadius}px`;
    }
});

// Handle Border Toggle
document.getElementById('shapeBorderToggle').addEventListener('change', (event) => {
    if (selectedElement && selectedElement.classList.contains('shape')) {
        selectedElement.style.borderStyle = event.target.checked ? 'solid' : 'none';
    }
});

// Handle Border Color change
document.getElementById('shapeBorderColor').addEventListener('input', (event) => {
    if (selectedElement && selectedElement.classList.contains('shape')) {
        selectedElement.style.borderColor = event.target.value;
    }
});

// Handle Border Width change
document.getElementById('shapeBorderWidth').addEventListener('input', (event) => {
    if (selectedElement && selectedElement.classList.contains('shape')) {
        selectedElement.style.borderWidth = `${event.target.value}px`;
    }
});

// Handle Image Upload for Shape
function insertShapeImage(event) {
    const file = event.target.files[0];
    if (file && selectedElement && selectedElement.classList.contains('shape')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            selectedElement.style.backgroundImage = `url(${e.target.result})`;
            selectedElement.style.backgroundSize = 'cover';
            selectedElement.style.backgroundPosition = 'center';
        };
        reader.readAsDataURL(file);
    }
}

// Handle Adding Text to Shape
document.getElementById('addTextToShapeBtn').addEventListener('click', () => {
    if (selectedElement && selectedElement.classList.contains('shape')) {
        selectedElement.contentEditable = true;
        selectedElement.innerText = "Edit text here";
        selectElement.style.fontSize = "16px";
        loadContextOptions(); // Reload options to show text formatting
    }
}); 

// Handle Font Size change for Text elements
document.getElementById('fontSizeInput').addEventListener('input', (event) => {
    if (selectedElement && selectedElement.isContentEditable) {
        selectedElement.style.fontSize = `${event.target.value}px`;
    }
});

// Handle Text Color change for Text elements (Instant change)
document.getElementById('textColorInput').addEventListener('input', (event) => {
    if (selectedElement && selectedElement.isContentEditable) {
        selectedElement.style.color = event.target.value;
    }
});

// Handle Bold toggle for Text elements
document.getElementById('boldBtn').addEventListener('click', () => {
    if (selectedElement && selectedElement.isContentEditable) {
        // Toggle boldness
        if (selectedElement.style.fontWeight === 'bold' || selectedElement.style.fontWeight === '700') {
            selectedElement.style.fontWeight = 'normal';  // Remove bold
        } else {
            selectedElement.style.fontWeight = 'bold';   // Apply bold
        }
        
        // Update the bold button state
        updateBoldButtonState();
    }
});

// Function to update the bold button state based on the selected element's current font weight
function updateBoldButtonState() {
    const boldBtn = document.getElementById('boldBtn');
    if (selectedElement.style.fontWeight === 'bold' || selectedElement.style.fontWeight === '700') {
        boldBtn.classList.add('active'); // Add class to indicate bold is applied
    } else {
        boldBtn.classList.remove('active'); // Remove class to indicate bold is not applied
    }
}

// Handle the toggle for Advanced Options
const adOptBtn = document.querySelectorAll('#advanced-options-btn');
adOptBtn.forEach((button) => {
    button.addEventListener('click', () => {
        const advancedOptionDivs = document.querySelectorAll('#advanced-options');
        advancedOptionDivs.forEach((div) => {
            div.style.display = (div.style.display === 'none' || div.style.display === '') ? 'block' : 'none';
        });
    });
});

// Handle changes for text background color
document.getElementById('textBackgroundInput').addEventListener('input', (event) => {
    if (selectedElement && selectedElement.isContentEditable) {
        selectedElement.style.backgroundColor = event.target.value;
    }
});

// Handle changes for letter spacing
document.getElementById('letterSpacingInput').addEventListener('input', (event) => {
    if (selectedElement && selectedElement.isContentEditable) {
        selectedElement.style.letterSpacing = `${event.target.value}px`;
    }
});

// Handle changes for line height
document.getElementById('lineHeightInput').addEventListener('input', (event) => {
    if (selectedElement && selectedElement.isContentEditable) {
        selectedElement.style.lineHeight = event.target.value;
    }
});

// Handle italic toggle
document.getElementById('italicToggle').addEventListener('change', (event) => {
    if (selectedElement && selectedElement.isContentEditable) {
        selectedElement.style.fontStyle = event.target.checked ? 'italic' : 'normal';
    }
});

// Handle underline toggle
document.getElementById('underlineToggle').addEventListener('change', (event) => {
    if (selectedElement && selectedElement.isContentEditable) {
        selectedElement.style.textDecoration = event.target.checked ? 'underline' : 'none';
    }
});

// Handle font family change
document.getElementById('fontFamilySelect').addEventListener('change', (event) => {
    if (selectedElement && selectedElement.isContentEditable) {
        selectedElement.style.fontFamily = event.target.value;
    }
});

// Handle text shadow toggle
document.getElementById('shadowToggle').addEventListener('change', (event) => {
    if (selectedElement) {
        selectedElement.style.textShadow = event.target.checked ? '2px 2px 5px rgba(0, 0, 0, 0.5)' : 'none';
    }
});

// Handle animation selection
document.getElementById('animationSelect').addEventListener('change', (event) => {
    if (selectedElement) {
        selectedElement.style.animation = event.target.value !== 'none' ? `${event.target.value} 2s` : '';
    }
});

// Handle animation duration
document.getElementById('animationDuration').addEventListener('input', (event) => {
    if (selectedElement && selectedElement.style.animation) {
        selectedElement.style.animationDuration = `${event.target.value}s`;
    }
});

// Handle Text Alignment change (from dropdown)
document.getElementById('textAlignSelect').addEventListener('change', (event) => {
    if (selectedElement && selectedElement.isContentEditable) {
        selectedElement.style.textAlign = event.target.value;
    }
});

// Function to update slider styles based on selected options
function updateSlideStyles() {
    if (selectedElement && selectedElement.id === 'slide') {
        const sliderAnimationInput = document.getElementById('slideAnimationInput');
        const sliderBackgroundInput = document.getElementById('slideBackgroundInput');
        const sliderColorInput = document.getElementById('slideColorInput');

        // Update the slider's animation style (if any)
        if (sliderAnimationInput) {
            selectedElement.style.animation = sliderAnimationInput.value ? sliderAnimationInput.value : '';
        }

        // Update the slider's background color
        if (sliderBackgroundInput) {
            selectedElement.style.backgroundColor = sliderBackgroundInput.value ? sliderBackgroundInput.value : '';
        }

        // Update the slider's color (text or other elements inside the slider)
        if (sliderColorInput) {
            selectedElement.style.color = sliderColorInput.value ? sliderColorInput.value : '';
        }
    }
}

// Handle Slide Style Changes
document.getElementById('slideAnimationInput').addEventListener('change', () => {
    updateSlideStyles();
});

document.getElementById('slideBackgroundInput').addEventListener('input', () => {
    updateSlideStyles();
});

document.getElementById('slideColorInput').addEventListener('input', () => {
    updateSlideStyles();
});

// Close context menu when clicking outside
document.addEventListener('click', (event) => {
    const contextMenu = document.getElementById('context-menu');
    
    // Close the context menu if the click is outside the context menu
    if (!contextMenu.contains(event.target) && event.target !== contextMenu) {
        closeContextMenu();
    }
});

// Prevent closing the context menu if a button inside the menu is clicked
document.getElementById('context-menu').addEventListener('click', (event) => {
    event.stopPropagation();
});

// Close the context menu
function closeContextMenu() {
    const contextMenu = document.getElementById('context-menu');
    contextMenu.style.opacity = "0";
    contextMenu.style.display = 'none';
}

// Handle Z-Index change
document.getElementById('zIndexInput').addEventListener('input', (event) => {
    if (selectedElement) {
        selectedElement.style.zIndex = event.target.value;
        console.log(`Z-Index set to: ${event.target.value}`);
    }
});

// Handle Opacity change
document.getElementById('opacityInput').addEventListener('input', (event) => {
    if (selectedElement) {
        selectedElement.style.opacity = event.target.value;
        console.log(`Opacity set to: ${event.target.value}`);
    }
});

// Delete element functionality (already handled above)
document.getElementById('deleteElement').addEventListener('click', () => {
    deleteElement();
    closeContextMenu();  // Close the context menu after deleting an element
});

function rgbToHex(rgb) {
    const result = rgb.match(/\d+/g);
    if (!result) return '#000000'; // Default to black if the input is invalid
    const [r, g, b] = result.map(Number);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}
