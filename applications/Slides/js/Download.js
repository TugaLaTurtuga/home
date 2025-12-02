const STORAGE_KEY_PREFIX = 'presentationSlides_';

// Save slides to local storage
function saveSlidesToStorage() {
    // Collect all the slides' content
    const slidesData = Array.from(document.querySelectorAll('.slide')).map(slide => slide.innerHTML);
    const presentationName = document.getElementById('presentation-name').value.trim() || 'Untitled';

    if (!presentationName) {
        alert('Please enter a valid presentation name.');
        return;
    }

    const data = {
        slides: slidesData,
        presentationName: presentationName
    };

    const saveKey = `${STORAGE_KEY_PREFIX}${presentationName}`;
    localStorage.setItem(saveKey, JSON.stringify(data));
    console.log(`Presentation "${presentationName}" saved locally.`);
    alert(`Presentation "${presentationName}" saved successfully!`);
    updateDropdownOptions(); // Refresh the dropdown options for saved presentations
}

// Load slides from local storage
function loadSlidesFromStorage(presentationName) {
    const saveKey = `${STORAGE_KEY_PREFIX}${presentationName}`;
    const savedData = JSON.parse(localStorage.getItem(saveKey));

    if (savedData.slides.length === 0) {
        alert(`No slides found for the presentation "${presentationName}". Adding a new slide.`);
        clearSlides();
        addSlide();
        return;
    }

    // Clear existing slides
    clearSlides();
    const slideContainer = document.getElementById('slide-container');

    // Load each slide's content and append it to the slide container
    savedData.slides.forEach((slideContent) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.id = `slide-${slides.length}`;
        slide.contentEditable = true;
        slide.innerHTML = slideContent;
        slideContainer.appendChild(slide);
        slides.push(slide); // Add to the global slides array
    });

    document.getElementById('presentation-name').value = savedData.presentationName;
    document.title = savedData.presentationName;
    console.log(`Loaded presentation "${presentationName}".`);

    // Show the first slide by default
    showSlide(0);
}

// Load the last edited presentation
function loadLastEditedPresentation() {
    updateSlideNavigator();
    const keys = Object.keys(localStorage).reverse();
    const lastEditedKey = keys.find(key => key.startsWith(STORAGE_KEY_PREFIX));

    if (lastEditedKey) {
        const presentationName = lastEditedKey.replace(STORAGE_KEY_PREFIX, '');
        loadSlidesFromStorage(presentationName);
    } else {
        createNewPresentation();
    }
}

// Create a new presentation
function createNewPresentation() {
    const newName = prompt("Enter a name for the new presentation:");
    if (newName) {
        document.getElementById('presentation-name').value = newName;
        document.title = newName;
        clearSlides();
        addSlide(); // Ensure there's at least one slide
        saveSlidesToStorage(); // Save the newly created presentation
    }
}

// Update dropdown options with saved presentations
function updateDropdownOptions() {
    const dropdown = document.getElementById('saved-presentations');
    dropdown.innerHTML = ''; // Clear existing options

    Object.keys(localStorage).forEach(key => {
        if (key.startsWith(STORAGE_KEY_PREFIX)) {
            const presentationName = key.replace(STORAGE_KEY_PREFIX, '');
            const option = document.createElement('option');
            option.value = presentationName;
            option.textContent = presentationName;
            dropdown.appendChild(option);
        }
    });
}

// Load the selected presentation from the dropdown
function loadSelectedPresentation() {
    updateSlideNavigator();
    const selectedPresentation = document.getElementById('saved-presentations').value;
    if (selectedPresentation) {
        loadSlidesFromStorage(selectedPresentation);
    }
}

// Initialize on page load
window.onload = loadLastEditedPresentation;

// Save presentation as HTML
function savePresentation() {
    const htmlContent = slides.map(slide => `<div class='slide'>${slide.innerHTML}</div>`).join('');
    const presentationName = document.getElementById('presentation-name').value || 'MyPresentation';
    const htmlTemplate = `
        <html>
        <head>
            <title>${presentationName}</title>
            <style>
                body {
                    background-color: black;
                    margin: 0;
                    overflow: hidden;
                    color: white;
                    font-family: Arial, sans-serif;
                }
                .slide {
                    max-width: 100%;
                    max-height: 100%;
                    aspect-ratio: 16/9;
                    display: flex;
                    justify-content: left;
                    align-items: left;
                    flex-direction: column;
                    font-size: 16px;
                    transition: opacity 0.5s;
                    overflow: hidden;
                    border: solid 3px #ccc;
                    border-radius: 10px;
                    box-sizing: border-box;
                }
                .slide.hidden {
                    display: none;
                }
                .active {
                    display: flex !important;
                }
            </style>
        </head>
        <body>
            ${htmlContent}
            <script>
                let currentSlideIndex = 0;
                const slides = document.querySelectorAll('.slide');
                
                function showSlide(index) {
                    slides.forEach((slide, i) => {
                        slide.classList.toggle('hidden', i !== index);
                    });
                }
                
                document.addEventListener('keydown', function(event) {
                    switch (event.key) {
                        case 'ArrowRight':
                        case 'ArrowDown':
                        case ' ':
                            nextSlide();
                            break;
                        case 'ArrowLeft':
                        case 'ArrowUp':
                            prevSlide();
                            break;
                    }
                });

                document.addEventListener('contextmenu', event.preventDefault());
                
                document.addEventListener('click', function(event) {
                    if (event.button === 0) { // Left click
                        prevSlide();
                    } else if (event.button === 2) { // Right click
                        nextSlide();
                    }
                });

                function nextSlide() {
                    if (currentSlideIndex < slides.length - 1) {
                        currentSlideIndex++;
                        showSlide(currentSlideIndex);
                    }
                }

                function prevSlide() {
                    if (currentSlideIndex > 0) {
                        currentSlideIndex--;
                        showSlide(currentSlideIndex);
                    }
                }

                showSlide(0);
            </script>
        </body>
        </html>`;
    const blob = new Blob([htmlTemplate], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${presentationName}/index.html`;
    link.click();
}

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', function(event) {
        if ((event.ctrlKey || event.metaKey)) {
            if (event.key === 'p') {
                togglePreview();
            } else if (event.key === 's' && event.shiftKey) {
                saveSlidesToStorage();
            } 
        }
    });

    // Ensure that the close button event listener is only added after DOM is fully loaded
    const closePreviewButton = document.getElementById('close-preview');
    if (closePreviewButton) {
        closePreviewButton.addEventListener('click', () => {
            const previewModal = document.getElementById('preview-modal');
            previewModal.style.display = 'none';
            document.body.classList.remove('preview-mode');
            document.removeEventListener('keydown', handleArrowNavigation);  // Remove keydown listener
        });
    }
});

function togglePreview() {
    const previewModal = document.getElementById('preview-modal');
    const slides = document.querySelectorAll('.slide');
    const previewContainer = document.getElementById('presentation-preview');
    
    // Check if we are opening or closing preview mode
    if (previewModal.style.display === 'block') {
        previewModal.style.display = 'none'; // Close preview mode
        document.body.classList.remove('preview-mode');
    } else {
        previewModal.style.display = 'block'; // Open preview mode
        document.body.classList.add('preview-mode');
        
        // Clear the preview container and add slides to preview
        previewContainer.innerHTML = ''; // Clear previous content
        slidesInPreview = [];  // Reset preview slides
        slides.forEach(slide => {
            const previewSlide = document.createElement('div');
            previewSlide.className = 'preview-slide';
            previewSlide.innerHTML = slide.innerHTML;
            previewContainer.appendChild(previewSlide);
            slidesInPreview.push(previewSlide);
        });

        // Show the first slide initially
        currentSlideIndex = 0;
        showPreviewSlide(currentSlideIndex);

        // Add keydown event listener for left and right arrows
        document.addEventListener('keydown', handleArrowNavigation);
    }
}

// Show the current slide and apply the animation
function showPreviewSlide(index) {
    const previewContainer = document.getElementById('presentation-preview');
    const slides = previewContainer.querySelectorAll('.preview-slide');
    
    // Hide all slides
    slides.forEach(slide => slide.style.display = 'none');
    
    // Show the current slide
    const currentSlide = slides[index];
    currentSlide.style.display = 'block';
    
    // Apply slide animation (using animation type)
    const animationType = document.getElementById('sliderAnimationInput').value;
    currentSlide.style.animation = `${animationType} 1s`;

    // Adjust slide visibility to make it look like a slideshow
    currentSlide.classList.add('active');
}

// Handle navigation when pressing arrow keys
function handleArrowNavigation(event) {
    if (event.key === 'ArrowRight') {
        // Move to the next slide
        currentSlideIndex = (currentSlideIndex + 1) % slidesInPreview.length;
        showPreviewSlide(currentSlideIndex);
    } else if (event.key === 'ArrowLeft') {
        // Move to the previous slide
        currentSlideIndex = (currentSlideIndex - 1 + slidesInPreview.length) % slidesInPreview.length;
        showPreviewSlide(currentSlideIndex);
    }
}
