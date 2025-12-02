const columnNameTextarea = document.querySelector('.column-name-textarea');
const taskContentTextarea = document.querySelector('.task-content-textarea');

taskContentTextarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevent default Enter behavior
        saveTask(); // Call the saveTask function
    }
});

columnNameTextarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevent default Enter behavior
        document.getElementById('column-color').focus(); // Move focus to the next input
    }
});

// fuck
