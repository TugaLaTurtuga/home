// Setup drag and drop functionality
function setupDragAndDrop() {
    const taskLists = document.querySelectorAll('.task-list');
    
    taskLists.forEach(list => {
        list.addEventListener('dragover', e => {
            e.preventDefault();
            list.classList.add('active');
            
            const afterElement = getDragAfterElement(list, e.clientY);
            const draggingElement = document.querySelector('.dragging');
            
            if (draggingElement) {
                if (afterElement == null) {
                    list.appendChild(draggingElement);
                } else {
                    list.insertBefore(draggingElement, afterElement);
                }
            }
        });
        
        list.addEventListener('dragleave', () => {
            list.classList.remove('active');
        });
        
        list.addEventListener('drop', e => {
            e.preventDefault();
            list.classList.remove('active');
            
            const taskId = document.querySelector('.dragging').getAttribute('data-id');
            const fromColumn = findTaskColumn(taskId);
            const toColumn = list.id.split('-')[0];
            
            if (fromColumn && fromColumn !== toColumn) {
                moveTask(taskId, fromColumn, toColumn);
            }
            
            saveTaskOrder();
        });
    });
}

// Find task position based on cursor
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Find which column a task is in
function findTaskColumn(taskId) {
    const boardTasks = tasks[currentBoardId];
    
    for (const column in boardTasks) {
        const taskIndex = boardTasks[column].findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            return column;
        }
    }
    return null;
}
