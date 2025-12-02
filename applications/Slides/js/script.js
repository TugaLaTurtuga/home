// Main.js
let slides = [];
let currentSlideIndex = 0;
let defaultTextColor = '#000';

// Add a new slide
function addSlide() {
    const slideContainer = document.getElementById('slide-container');
    const slide = document.createElement('div');
    slide.id = `slide-${slides.length}`;
    slide.className = 'slide';
    slide.contentEditable = true;
    slide.innerHTML = `<h2 style="font-size: 24px">New Slide</h2><p style="font-size: 20px">Edit me!</p>`;
    slideContainer.appendChild(slide);
    slides.push(slide);
    showSlide(slides.length - 1);
    updateSlideNavigator();
}

// Show the current slide based on index
function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.display = i === index ? 'block' : 'none';
    });
    currentSlideIndex = index;
    updateSlideNavigator();
}

// Clear all slides
function clearSlides() {
    const slideContainer = document.getElementById('slide-container');
    slideContainer.innerHTML = '';
    slides = [];
}

// Update the slide navigator
function updateSlideNavigator() {
    const navigator = document.getElementById('slide-navigator');
    navigator.innerHTML = `
        <input type="text" id="presentation-name" value="My Presentation">
        
        <button onclick="addSlide()">+</button>
        <button onclick="togglePreview()">Preview</button>
        <button onclick="savePresentation()">Save as HTML</button>

        <button id="save-btn">Save</button>
        <button id="new-save-btn">New Presentation</button>
        <select class="button" style="max-width: 70%" id="saved-presentations"></select>
        <button style="max-width: 45%" id="load-btn">Load</button> 
    `;
    updateDropdownOptions();

    slides.forEach((_, index) => {
        const navButton = document.createElement('div');
        navButton.textContent = `Slide ${index + 1}`;
        navButton.className = "button";
        navButton.onclick = () => showSlide(index);
        if (index === currentSlideIndex) navButton.classList.add('active');
        navigator.appendChild(navButton);
    });

    
    updatePresentationName();
    document.getElementById('save-btn').addEventListener('click', saveSlidesToStorage);
    document.getElementById('new-save-btn').addEventListener('click', createNewPresentation);
    document.getElementById('load-btn').addEventListener('click', loadSelectedPresentation);
}

// Update Presentation Name
function updatePresentationName() {
    const name = document.getElementById('presentation-name').value;
    document.title = name;
}

// Function to toggle between Dark and Light Mode
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

// Function to add text to the current slide
function addText() {
    const textBox = document.createElement('div');
    textBox.className = 'text-box';
    textBox.contentEditable = true;
    textBox.style.position = 'absolute';
    textBox.style.left = '20px';
    textBox.style.top = '20px';
    textBox.textContent = 'Enter text here';
    slides[currentSlideIndex].appendChild(textBox);
    selectElement(textBox);

    textBox.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent the default newline
            const newTextBox = document.createElement('div');
            newTextBox.className = 'text-box';
            newTextBox.contentEditable = true;
            newTextBox.style.position = 'absolute';
            newTextBox.style.left = `${parseInt(textBox.style.left) + 10}px`;
            newTextBox.style.top = `${parseInt(textBox.style.top) + 40}px`;
            newTextBox.textContent = 'New text here';
            slides[currentSlideIndex].appendChild(newTextBox);
            selectElement(newTextBox);
        }
    });
}

document.getElementById('addFormBtn').addEventListener('click', () => {
    const selectedShape = document.getElementById('Forms').value;

    // Check the selected shape and call the corresponding function
    if (selectedShape === 'rectangle') {
        addRectangle();
    } else if (selectedShape === 'circle') {
        addCircle();
    }
    // Reset the dropdown after adding a shape
    document.getElementById('Forms').value = '';
});

// Function to add a rectangle to the current slide
function addRectangle() {
    const rectangle = document.createElement('div');
    rectangle.className = 'shape rectangle';
    rectangle.style.position = 'absolute';
    rectangle.style.left = '50px';
    rectangle.style.top = '50px';
    rectangle.style.width = '100px';
    rectangle.style.height = '50px';
    rectangle.style.backgroundColor = '#3498db';
    slides[currentSlideIndex].appendChild(rectangle);
    selectElement(rectangle);
}

// Function to add a circle to the current slide
function addCircle() {
    const circle = document.createElement('div');
    circle.className = 'shape circle';
    circle.style.position = 'absolute';
    circle.style.left = '150px';
    circle.style.top = '50px';
    circle.style.width = '60px';
    circle.style.height = '60px';
    circle.style.borderRadius = '50%';
    circle.style.backgroundColor = '#e74c3c';
    slides[currentSlideIndex].appendChild(circle);
    selectElement(circle);
}

// Function to add a transition effect to the slide
function addTransition() {
    const slideContainer = document.getElementById('slide-container');
    const slides = slideContainer.querySelectorAll('.slide');
    slides.forEach((slide) => {
        slide.style.transition = 'all 0.5s ease';
    });
    alert('Transition added to all slides!');
}

document.addEventListener('DOMContentLoaded', () => {
    // Toggle slide navigator visibility with Ctrl + S
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            switch (event.key) {
                case 's':
                    if (!event.shiftKey) {
                        // Toggle slide navigator visibility
                        const navigator = document.getElementById('slide-navigator');
                        navigator.classList.toggle('hidden');
                    }
                  break;
                case 't':
                    toggleTheme();
                  break;
                case 'Backspace':
                    // Delete the selected element and close the context menu
                    if (selectedElement) {
                        deleteElement();
                        closeContextMenu();
                    }
                  break;
                case 'r':
                    // Reload the page
                    window.location.reload();
                  break;
                default:
                  break;
            }
        } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
            nextSlide();
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
            prevSlide();
        }
    });
});

// Adjust slide navigator position based on aspect ratio
function adjustSlideNavigator() {
    const navigator = document.getElementById('slide-navigator');
    const aspectRatio = window.innerWidth / window.innerHeight;
    if (aspectRatio > 1) {
        navigator.classList.add('vertical');
        navigator.classList.remove('horizontal');
    } else {
        navigator.classList.add('horizontal');
        navigator.classList.remove('vertical');
    }
}


// Navigate to the next slide
function nextSlide() {
    if (currentSlideIndex < slides.length - 1) {
        showSlide(currentSlideIndex + 1);
    }
}

// Navigate to the previous slide
function prevSlide() {
    if (currentSlideIndex > 0) {
        showSlide(currentSlideIndex - 1);
    }
}

// Insert an image into the current slide
function insertImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.width = '50%';
            img.style.height = '50%';
            img.oncontextmenu = (ev) => openContextMenu(ev, 'image');
            slides[currentSlideIndex].appendChild(img);
        };
        reader.readAsDataURL(file);
    }
}
