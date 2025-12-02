const modals = document.querySelectorAll('.modal');


document.addEventListener('wheel', (e) => {
    for (const modal of modals) {
        if (modal.style.display === 'block') {
            return; // Ignore scroll events when any modal is open
        }
    }
    if (historicContainer.style.display === 'block') {
        return; // Ignore scroll events when historic board is showed
    }
    e.preventDefault();
    document.scrollingElement.scrollLeft += e.deltaY + e.deltaX;
}, { passive: false });
