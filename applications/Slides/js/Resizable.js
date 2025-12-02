// ResizeElement.js
let resizing = false;
let rotating = false;
let dragging = false;
let offsetX = 0, offsetY = 0;
let selectedElement = null;

// Function to handle click events for selecting/deselecting elements
document.addEventListener('click', (e) => {
    if (e.button === 0 && document.getElementById('context-menu').style.display === 'none') {
        const isSlideElement = e.target.closest('.slide');
        if (isSlideElement && e.target !== selectedElement) {
            selectElement(e.target);
        }

        // Deselect if clicked outside any resizable element
        if ((!e.target.closest('.resizable') && selectedElement) || !e.target.closest('.slide')) {
            deselectElement();
        }
    }
});

// Function to select an element
let TheThingie = false;
function selectElement(element) {
    if (selectedElement !== element) {
        if (element.className.includes('resize-handle')) {
            TheThingie = true;
            return;
        } else if (!element.className.includes('slide')) {
            TheThingie = false;
            selectedElement = element;
            selectedElement.style.position = 'absolute';
            selectedElement.classList.add('resizable');
            selectedElement.contentEditable = true;
            addResizeHandles(selectedElement);
            createRotateHandle(selectedElement);
            return;
        }

        // Deselect the previously selected element
        if (selectedElement && !TheThingie) {
            deselectElement();
        }
    }
}

function deselectElement() {
    if (selectedElement) {
        selectedElement.classList.remove('resizable');
        const rotateHandle = selectedElement.querySelector('.rotate-handle');
        if (rotateHandle) rotateHandle.remove();
        const resizeHandles = selectedElement.querySelectorAll('.resize-handle');
        resizeHandles.forEach(handle => handle.remove());
    }
}

// Middle Click (Button 1) for changing element's position
document.addEventListener('mousedown', (e) => {
    if (e.button === 1) { // Middle click
        const isSlideElement = e.target.closest('.slide');
        if (isSlideElement && e.target !== selectedElement) {
            selectElement(e.target);
        }

        if (selectedElement) {
            dragging = true;
            offsetX = e.offsetX;
            offsetY = e.offsetY;
        }
    }
});

// Handle dragging of the element when the middle mouse button is held down
document.addEventListener('mousemove', (e) => {
    if (dragging && selectedElement) {
        const slide = slides[currentSlideIndex];
        const slideRect = slide.getBoundingClientRect();

        let newLeft = e.clientX - offsetX;
        let newTop = e.clientY - offsetY;

        let minusTop = parseInt(window.getComputedStyle(selectedElement).fontSize) * .9;

        // Restrict movement within the bounds of the slider
        newLeft = Math.max(slideRect.left, Math.min(newLeft, slideRect.right - selectedElement.offsetWidth));
        newTop = Math.max(slideRect.top - minusTop, Math.min(newTop, (slideRect.bottom - minusTop) - selectedElement.offsetHeight));

        selectedElement.style.left = `${newLeft - slideRect.left}px`;
        selectedElement.style.top = `${newTop - slideRect.top}px`;
    }
});

// Stop dragging when the middle mouse button is released
document.addEventListener('mouseup', (e) => {
    if (e.button === 1) { // Middle mouse button
        dragging = false;
    }
});

// Utility function to add resize handles to the selected element
function addResizeHandles(element) {
    if (!element.classList.contains('resizable') || element.className.includes('slide')) return;

    // Remove any existing handles to prevent duplication
    const existingHandles = element.querySelectorAll('.resize-handle');
    existingHandles.forEach(handle => handle.remove());

    const handles = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    handles.forEach((handle) => {
        const resizeHandle = document.createElement('div');
        resizeHandle.className = `resize-handle ${handle}`;
        element.appendChild(resizeHandle);

        // Handle resizing
        resizeHandle.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            handleResizing(e, handle);
        });
    });
}

function handleResizing(e, handle) {
    e.stopPropagation(); // Prevent deselecting the element
    const element = e.target.parentElement;
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = element.offsetWidth;
    const startHeight = element.offsetHeight;

    function resizeMouseMove(e) {
        let newWidth = startWidth + (e.clientX - startX);
        let newHeight = startHeight + (e.clientY - startY);

        // Apply proportional resizing for all handles
        if (newWidth > 0 && newHeight > 0) {
            element.style.width = `${newWidth}px`;
            element.style.height = `${newHeight}px`;
        }
    }

    function stopResizing() {
        document.removeEventListener('mousemove', resizeMouseMove);
        document.removeEventListener('mouseup', stopResizing);
    }

    document.addEventListener('mousemove', resizeMouseMove);
    document.addEventListener('mouseup', stopResizing);
}

// Function to spawn a new resizable element
function spawnNewElement(e) {
    const newElement = document.createElement('div');
    newElement.className = 'slide';
    newElement.style.position = 'absolute';
    newElement.style.width = '100px';
    newElement.style.height = '100px';
    newElement.style.backgroundColor = '#ADD8E6';
    newElement.style.left = `${e.clientX}px`;
    newElement.style.top = `${e.clientY}px`;

    document.getElementById('slider').appendChild(newElement);
    selectElement(newElement);
}

// Utility function to create a rotate handle for the selected element
function createRotateHandle(element) {
    const rotateHandle = document.createElement('div');
    rotateHandle.className = 'rotate-handle';
    element.appendChild(rotateHandle);

    rotateHandle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        handleRotation(e);
    });
}

// Utility function to handle rotating elements
function handleRotation(e) {
    e.stopPropagation(); // Prevent deselecting the element
    const element = e.target.parentElement;
    const centerX = element.offsetLeft + element.offsetWidth / 2;
    const centerY = element.offsetTop + element.offsetHeight / 2;

    function rotateMouseMove(e) {
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
        element.style.transform = `rotate(${angle}deg)`;
    }

    function stopRotating() {
        document.removeEventListener('mousemove', rotateMouseMove);
        document.removeEventListener('mouseup', stopRotating);
    }

    document.addEventListener('mousemove', rotateMouseMove);
    document.addEventListener('mouseup', stopRotating);
}
