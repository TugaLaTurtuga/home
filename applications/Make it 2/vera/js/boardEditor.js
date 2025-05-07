
/* ********************** */
/* Board Editor Functions */
/* ---------------------- */

let editingColumnIndex = null;
let isNewColumn = true;
let oldBoardLayout = null;

setupColumnDragAndDrop();

// Open board editor
function openBoardEditor() {
    renderColumnEditor();
    document.getElementById('board-editor-modal').style.display = 'block'
    oldBoardLayout = JSON.parse(JSON.stringify(currentBoard));
}

// Render column editor list
function renderColumnEditor() {
    const boardColumnsList = document.getElementById('board-columns-list');
    boardColumnsList.innerHTML = '';
    
    currentBoard.columns.forEach((column, index) => {
        const columnEditorItem = document.createElement('div');
        columnEditorItem.className = 'column-editor-item';
        columnEditorItem.setAttribute('draggable', 'true');
        columnEditorItem.setAttribute('data-index', index);
        columnEditorItem.style.borderLeftColor = column.color;
        
        // Drag handle
        const dragHandle = document.createElement('div');
        dragHandle.className = 'column-drag-handle';
        dragHandle.innerHTML = '☰';
        
        // Column information
        const columnInfo = document.createElement('div');
        columnInfo.className = 'column-info';
        
        const columnName = document.createElement('div');
        columnName.className = 'column-name';
        columnName.textContent = column.name;
        
        columnInfo.appendChild(columnName);
        
        // Column actions
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'column-editor-actions';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-column-btn';
        editBtn.innerHTML = '✏️';
        editBtn.onclick = (e) => {
            e.stopPropagation();
            openColumnModal(index);
        };
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-column-btn';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            console.log(`Deleting column: ${column.name}`);
            deleteColumn(index);
        };
        
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);
        
        // Assemble column editor item
        columnEditorItem.appendChild(dragHandle);
        columnEditorItem.appendChild(columnInfo);
        columnEditorItem.appendChild(actionsDiv);
        
        // Setup drag events for reordering
        columnEditorItem.addEventListener('dragstart', handleColumnDragStart);
        columnEditorItem.addEventListener('dragover', handleColumnDragOver);
        columnEditorItem.addEventListener('drop', handleColumnDrop);
        columnEditorItem.addEventListener('dragend', handleColumnDragEnd);
        
        boardColumnsList.appendChild(columnEditorItem);
    });
}

// Open add/edit column modal
function openColumnModal(index = null) {
    const columnModal = document.getElementById('column-modal');
    const modalTitle = document.getElementById('column-modal-title');
    const nameInput = document.getElementById('column-name');
    const colorInput = document.getElementById('column-color');
    
    if (index !== null) {
        // Edit existing column
        modalTitle.textContent = 'Edit Column';
        nameInput.value = currentBoard.columns[index].name;
        colorInput.value = currentBoard.columns[index].color;
        editingColumnIndex = index;
        isNewColumn = false;
    } else {
        // Add new column
        modalTitle.textContent = 'Add Column';
        nameInput.value = '';
        colorInput.value = '#3498db';
        editingColumnIndex = null;
        isNewColumn = true;
    }
    
    columnModal.style.display = 'block';
}

// Save column details
function saveColumnDetails(closeEverything = false) {
    const nameInput = document.getElementById('column-name');
    const colorInput = document.getElementById('column-color');
    
    const name = nameInput.value.trim();
    const color = colorInput.value;
    
    if (!name) {
        showNotification('Column name cannot be empty', '#ff0000');
        return;
    } else if (isNewColumn) {
        if (currentBoard.columns.some(col => col.name === name)) {
            showNotification('Column name must be unique', '#ff0000');
            return;
        } else {
            // Add new column
            currentBoard.columns.push({
                name: name,
                color: color
            });
            
            // Initialize tasks array for new column
            if (!tasks[name]) {
                tasks[name] = [];
            }
        }
    } else {
        // Update existing column
        currentBoard.columns[editingColumnIndex].name = name;
        currentBoard.columns[editingColumnIndex].color = color;
    }
    
    
    renderColumnEditor();
    closeModal('column-modal');
    if (closeEverything) {
        closeModal('board-editor-modal');
    }
}

// Delete column
async function deleteColumn(index) {
    console.log(`Deleting column at index: ${index}`, 'currentBoard', tasks[currentBoardId]);
    if (currentBoard.columns.length <= 1) {
        shownotification('Cannot delete the last column');
        return;
    } else {
        const confirmed = await showNotification(`Are you sure you want to delete "${currentBoard.columns[index].name}" column?`, currentBoard.columns[index].color, 3000, true)
        if (confirmed) {
            // Delete column from board configuration
            currentBoard.columns.splice(index, 1);
            
            // Remove tasks associated with this column
            try {
                delete tasks[currentBoardId][currentBoard.columns[index].name];
            } catch (error) {
                console.error('Error deleting tasks for column:', error);
            }
            
            
            saveToLocalStorage();
            renderColumnEditor();
        }
    }
    
    
}

// Save board changes
function saveBoardChanges() {
    saveToLocalStorage();
    initBoard();
    
    closeModal('board-editor-modal');
}

// Column drag and drop functionality
function setupColumnDragAndDrop() {
    const boardColumnsList = document.getElementById('board-columns-list');
    
    // Prevent default behavior to allow drop
    boardColumnsList.addEventListener('dragover', e => {
        e.preventDefault();
    });
}

// Handle column drag start
function handleColumnDragStart(e) {
    this.classList.add('dragging');
    e.dataTransfer.setData('text/plain', this.getAttribute('data-index'));
}

// Handle column drag over
function handleColumnDragOver(e) {
    e.preventDefault();
    
    const draggingElement = document.querySelector('.column-editor-item.dragging');
    if (!draggingElement) return;
    
    const boardColumnsList = document.getElementById('board-columns-list');
    const afterElement = getColumnDragAfterElement(boardColumnsList, e.clientY);
    
    if (afterElement) {
        boardColumnsList.insertBefore(draggingElement, afterElement);
    } else {
        boardColumnsList.appendChild(draggingElement);
    }
}

// Handle column drop
function handleColumnDrop(e) {
    e.preventDefault();
    
    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const items = Array.from(document.querySelectorAll('.column-editor-item'));
    const newIndex = items.indexOf(document.querySelector(`.column-editor-item[data-index="${draggedIndex}"]`));
    
    // Reorder board array
    const [movedColumn] = currentBoard.columns.splice(draggedIndex, 1);
    currentBoard.columns.splice(newIndex, 0, movedColumn);
    
    // Update data-index attributes
    items.forEach((item, index) => {
        item.setAttribute('data-index', index);
    });
}

// Handle column drag end
function handleColumnDragEnd() {
    this.classList.remove('dragging');
}

// Find column position based on cursor
function getColumnDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.column-editor-item:not(.dragging)')];
    
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

function cancelBoardChanges() {
    console.log('Cancelling board changes');
    console.log('oldBoardLayout', oldBoardLayout);
    console.log('currentBoard', currentBoard);
    currentBoard = oldBoardLayout;
    console.log('currentBoard after', currentBoard);
    closeModal('board-editor-modal');
}

// Initialize the board
document.addEventListener('DOMContentLoaded', initBoard);
