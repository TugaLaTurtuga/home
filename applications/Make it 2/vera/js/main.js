// Kanban board configuration
let boards = JSON.parse(localStorage.getItem('kanbanBoards')) || [
    {
        id: generateId(),
        name: 'Default Board',
        columns: [
            {
                name: 'To Do',
                color: '#3498db',
            },
            {
                name: 'Doing',
                color: '#f39c12',
            },
            {
                name: 'Done',
                color: '#2ecc71',
            }
        ]
    },

    {
        id: generateId(),
        name: 'Default Board 2',
        columns: [
            {
                name: 'To Do',
                color: '#3498db',
            },
            {
                name: 'Bugs',
                color: '#ff0000',
            },
            {
                name: 'Doing',
                color: '#f39c12',
            },
            {
                name: 'Done',
                color: '#2ecc71',
            }
        ]
    }
];

let currentBoardId = localStorage.getItem('currentBoardId') || boards[0].id;
let currentBoard = boards.find(b => b.id === currentBoardId) || boards[0];
let historic = [];

try {
    const savedHistoric = JSON.parse(localStorage.getItem('historic'));
    if (Array.isArray(savedHistoric)) {
        historic = savedHistoric;
    }
} catch (e) {
    console.warn('Failed to parse historic from localStorage:', e);
}

// Initialize task state based on board configuration
let tasks = JSON.parse(localStorage.getItem('kanbanTasks')) || {};
let comboTasks = JSON.parse(localStorage.getItem('comboTasks')) || [
    {
        name: [
            'exemple',
            'ex',
            '_'
        ],

        tasks: [
            'task1',
            'task2',
            'task3',
            'task4',
        ]
    }
];

// Initialize tasks structure if not existing
if (!tasks[currentBoardId]) {
    tasks[currentBoardId] = {};
    currentBoard.columns.forEach(column => {
        tasks[currentBoardId][column.name] = [];
    });
}

// Modal state variables
let currentColumn = null;
let currentTaskId = null;
let isEditMode = false;
let isEditingBoard = false;

// Initialize the app
function init() {
    renderBoardSelector();
    initBoard();
}

// Render the board selector dropdown
function renderBoardSelector() {
    // Create board selector dropdown if it doesn't exist
    if (!document.getElementById('board-selector')) {
        const editContainer = document.getElementById('edit-container');
        
        const selector = document.createElement('select');
        selector.id = 'board-selector';
        selector.className = 'board-selector';
        selector.addEventListener('change', function() {
            switchBoard(this.value);
        });
        editContainer.insertBefore(selector, editContainer.firstChild);
    }
    
    // Populate the selector
    const boardSelector = document.getElementById('board-selector');
    boardSelector.innerHTML = '';
    
    boards.forEach(board => {
        const option = document.createElement('option');
        option.value = board.id;
        option.textContent = board.name;
        if (board.id === currentBoardId) option.selected = true;
        boardSelector.appendChild(option);
    });

    const seeHistoric = document.createElement('option');
    seeHistoric.value = '_h_';
    seeHistoric.textContent = 'See Historic';
    boardSelector.appendChild(seeHistoric);

    const addBoard = document.createElement('option');
    addBoard.value = '_+_';
    addBoard.textContent = 'Add Board';
    boardSelector.appendChild(addBoard);
}

// Switch between boards
function switchBoard(boardId) {
    if (boardId === '_+_') {
        addNewBoard();
        return;
    } else if (boardId === '_h_') {
        seeHistoric();
        return;
    } else if (boardId === currentBoardId) return;

    currentBoardId = boardId;
    currentBoard = boards.find(b => b.id === boardId);
    
    // Initialize tasks structure if not existing for this board
    if (!tasks[currentBoardId]) {
        tasks[currentBoardId] = {};
        currentBoard.columns.forEach(column => {
            tasks[currentBoardId][column.name] = [];
        });
    }
    
    localStorage.setItem('currentBoardId', currentBoardId);
    
    // Update UI
    renderBoardSelector();
    initBoard();
}

// Initialize the board
function initBoard() {
    initTasksObject();
    generateColumns();
    renderTasks();
    setupDragAndDrop();
    updateTaskCounters();
}

// Initialize tasks object based on board configuration
function initTasksObject() {
    if (currentBoardId === '_h_') {
        renderHistoric();
        return;
    } else document.getElementById('header').style.display = 'none';

    if (!tasks[currentBoardId] || typeof tasks[currentBoardId] !== 'object') {
        tasks[currentBoardId] = {};
    }
    
    // Create empty arrays for any new columns
    currentBoard.columns.forEach(column => {
        if (!tasks[currentBoardId][column.name] || typeof tasks[currentBoardId][column.name] !== 'object') tasks[currentBoardId][column.name] = [];
    });
    
    // Remove any columns that no longer exist
    Object.keys(tasks[currentBoardId]).forEach(columnId => {
        if (!currentBoard.columns.find(column => column.name === columnId)) {
            delete tasks[currentBoardId][columnId];
        }
    });
    
    saveToLocalStorage();
}

async function renderHistoric() {
    const historicContainer = document.getElementById('kanban-board');
    document.getElementById('header').style.display = 'block';
    historicContainer.innerHTML = '';
    console.log('Historic:', historic);

    historic.forEach((board, index) => {
        const boardElement = document.createElement('div');
        boardElement.className = 'historic-board';

        const boardHeader = document.createElement('div');
        boardHeader.className = 'historic-board-header';
        boardHeader.textContent = board.name;

        boardElement.appendChild(boardHeader);
        historicContainer.appendChild(boardElement);

        // 🖱 Middle click deletes the board from historic
        boardElement.addEventListener('mousedown', async (event) => {
            if (event.button === 1) { // middle mouse button
                event.preventDefault(); // prevent default scroll behavior

                const confirmed = await showNotification(
                    `Delete historic board "${board.name}"?`, 
                    '#333333', 
                    5000, 
                    true // assuming this triggers confirmation buttons
                );

                if (confirmed) {
                    historic.splice(index, 1);
                    localStorage.setItem('historic', JSON.stringify(historic));
                    renderHistoric(); // refresh UI
                }
            }
        });
    });
}

// Generate columns based on board configuration
function generateColumns() {
    const kanbanBoard = document.getElementById('kanban-board');
    kanbanBoard.innerHTML = '';
    
    currentBoard.columns.forEach(column => {
        // Create column element
        const columnElement = document.createElement('div');
        columnElement.className = `column ${column.name}-column`;
        columnElement.setAttribute('data-column', column.name);
        
        // Create column header
        const headerElement = document.createElement('div');
        headerElement.className = 'column-header';
        headerElement.style.color = column.color;
        headerElement.style.borderColor = column.color;
        
        const titleElement = document.createElement('span');
        titleElement.textContent = column.name;
        
        const counterElement = document.createElement('span');
        counterElement.className = 'task-counter';
        counterElement.id = `${column.name}-counter`;
        counterElement.textContent = '0';
        
        headerElement.appendChild(titleElement);
        headerElement.appendChild(counterElement);
        
        // Create task list
        const taskListElement = document.createElement('div');
        taskListElement.className = 'task-list';
        taskListElement.id = `${column.name}-list`;
        
        // Create column footer
        const footerElement = document.createElement('div');
        footerElement.className = 'column-footer';
        
        const addButtonElement = document.createElement('button');
        addButtonElement.className = 'add-task-btn';
        addButtonElement.textContent = '+ Add Task';
        addButtonElement.style.backgroundColor = column.color;
        addButtonElement.setAttribute('onclick', `openAddTaskModal('${column.name}')`);
        
        footerElement.appendChild(addButtonElement);
        
        // Append all elements to column
        columnElement.appendChild(headerElement);
        columnElement.appendChild(taskListElement);
        columnElement.appendChild(footerElement);
        
        // Append column to board
        kanbanBoard.appendChild(columnElement);
    });
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Render tasks from state
function renderTasks() {
    let deleteColumns = [];
    const boardTasks = tasks[currentBoardId] || {};
    
    for (const column in boardTasks) {
        const columnElement = document.getElementById(`${column}-list`);
        try {
            columnElement.innerHTML = '';
        } catch (error) {
            console.error(`Error rendering tasks for column ${column}:`, error);
            deleteColumns.push(column);
            continue; // Skip this column if it doesn't exist
        }
        
        boardTasks[column].forEach(task => {
            const taskElement = createTaskElement(task, column);
            columnElement.appendChild(taskElement);
        });
    }

    // Remove columns that no longer exist
    deleteColumns.forEach(column => {
        delete boardTasks[column];
    });

    saveToLocalStorage();
}

// Create task DOM element
function createTaskElement(task, column) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task';
    taskElement.setAttribute('draggable', 'true');
    taskElement.setAttribute('data-id', task.id);
    
    const taskContent = document.createElement('p');
    taskContent.textContent = task.content;
    
    const taskButtons = document.createElement('div');
    taskButtons.className = 'task-buttons';
    
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.innerHTML = '✏️';
    editBtn.onclick = (e) => {
        e.stopPropagation();
        openEditTaskModal(task.id, column);
    };
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        deleteTask(task.id, column);
    };
    
    taskButtons.appendChild(editBtn);
    taskButtons.appendChild(deleteBtn);
    
    taskElement.appendChild(taskContent);
    taskElement.appendChild(taskButtons);
    
    // Setup drag events
    taskElement.addEventListener('dragstart', () => {
        taskElement.classList.add('dragging');
        setTimeout(() => {
            taskElement.style.display = 'none';
        }, 0 * gameSpeed);
    });
    
    taskElement.addEventListener('dragend', () => {
        taskElement.classList.remove('dragging');
        taskElement.style.removeProperty('display');
    });
    
    return taskElement;
}

// Move task between columns
function moveTask(taskId, fromColumn, toColumn) {
    const boardTasks = tasks[currentBoardId];
    const taskIndex = boardTasks[fromColumn].findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        const task = boardTasks[fromColumn][taskIndex];
        boardTasks[fromColumn].splice(taskIndex, 1);
        boardTasks[toColumn].push(task);
        
        saveToLocalStorage();
        renderTasks();
        updateTaskCounters();
    }
}

// Save current task order based on DOM
function saveTaskOrder() {
    const boardTasks = tasks[currentBoardId];
    const columnIds = currentBoard.columns.map(column => column.name);
    
    columnIds.forEach(columnId => {
        const listElement = document.getElementById(`${columnId}-list`);
        if (!listElement) return;
        
        const taskElements = listElement.querySelectorAll('.task');
        
        const newOrder = [];
        taskElements.forEach(element => {
            const taskId = element.getAttribute('data-id');
            
            // Create a flattened array of all tasks
            const allTasks = Object.values(boardTasks).flat();
            const task = allTasks.find(t => t.id === taskId);
            
            if (task) {
                newOrder.push(task);
            }
        });
        
        boardTasks[columnId] = newOrder;
    });
    
    saveToLocalStorage();
    updateTaskCounters();
}

// Add new task
async function addTask(content, column) {
    if (!tasks[currentBoardId]) tasks[currentBoardId] = {};
    
    const boardTasks = tasks[currentBoardId];
    console.log('Adding task:', content, 'to column:', column);
    if (boardTasks[column].some(task => task.content === content)) {
        showNotification('Task name must be unique', '#ff0000');
        return;
    }
    
    const newTask = {
        id: generateId(),
        content: content,
        created: new Date().toISOString()
    };
    
    boardTasks[column].push(newTask);
    console.log(boardTasks[column], tasks[currentBoardId]);
    saveToLocalStorage();
    
    const taskElement = createTaskElement(newTask, column);
    document.getElementById(`${column}-list`).appendChild(taskElement);
    updateTaskCounters();
}

// Update existing task
function updateTask(taskId, content, column) {
    const boardTasks = tasks[currentBoardId];
    const taskIndex = boardTasks[column].findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        boardTasks[column][taskIndex].content = content;
        saveToLocalStorage();
        renderTasks();
    }
}

// Delete task
async function deleteTask(taskId, column) {
    const confirmed = await showNotification('Are you sure you want to delete this task?', '#333333', 5000, true);
    if (confirmed) {
        console.log(`Deleting task with ID: ${taskId} from column: ${column}`);
        const boardTasks = tasks[currentBoardId];
        const taskIndex = boardTasks[column].findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            boardTasks[column].splice(taskIndex, 1);
            saveToLocalStorage();
            renderTasks();
            updateTaskCounters();
        }
    }
}

// Open add task modal
function openAddTaskModal(column) {
    currentColumn = column;
    currentTaskId = null;
    isEditMode = false;
    isEditingBoard = false;
    
    const columnConfig = currentBoard.columns.find(col => col.name === column);
    document.getElementById('modal-title').textContent = `Add Task to ${columnConfig.name}`;
    document.getElementById('task-content').value = '';
    document.getElementById('task-content').placeholder = 'Enter task name...';
    document.getElementById('task-modal').style.display = 'block';
}

// Open edit task modal
function openEditTaskModal(taskId, column) {
    currentColumn = column;
    currentTaskId = taskId;
    isEditMode = true;
    
    const boardTasks = tasks[currentBoardId];
    const task = boardTasks[column].find(task => task.id === taskId);
    
    if (task) {
        document.getElementById('modal-title').textContent = 'Edit Task';
        document.getElementById('task-content').value = task.content;
        document.getElementById('task-modal').style.display = 'block';
    }
}

// Close modal
function closeModal(modalId, dontDeleteBoard = false) {
    if (isEditingBoard && !dontDeleteBoard) {
        isEditingBoard = false;
        if (boards.length > 0) {
            console.log('Deleting last board:', boards[boards.length - 1]);
            boards.splice(boards.length - 1, 1); // remove last board
            delete tasks[currentBoardId];
    
            switchBoard(boards[0].id);
            saveToLocalStorage();
        }
    }
    

    document.getElementById(modalId).style.display = 'none';
}

// Save task from modal
async function saveTask() {
    const content = document.getElementById('task-content').value.trim();

    if (content) {
        if (isEditingBoard) {
            isEditingBoard = false;
            currentBoard.name = content;
            saveToLocalStorage();
            renderBoardSelector();
        } else if (isEditMode && currentTaskId) {
            updateTask(currentTaskId, content, currentColumn);
        } else {
            const c = content.toLowerCase();
            if (c.startsWith('task:') || c.startsWith('ct:') || c.startsWith('combo:') || c.startsWith('tc:')) {
                const comboName = content.split(':')[1].toLowerCase().trim();
                if (comboName.length > 0) {
                    const tasksToAdd = await checkComboTask(comboName);
                    for (let i = 0; i < tasksToAdd.length; i++) {
                        addTask(tasksToAdd[i], currentColumn);
                    }
                }
            } else {
                addTask(content, currentColumn);
            }
        }

        closeModal('task-modal');
    } else {
        if (isEditingBoard) showNotification('Board name cannot be empty!', '#ff0000');
        else showNotification('Task content cannot be empty!', '#ff0000');
    }
}

async function checkComboTask(name) {
    for (let i = 0; i < comboTasks.length; i++) {
        if (comboTasks[i].name.some(n => typeof n === 'string' && n.toLowerCase() === name.toLowerCase())) {
            return comboTasks[i].tasks;
        }
    }

    const confirmed = await showNotification("Task combo doesn't exist!", '#333333', 3000, true);
    return confirmed ? [name] : [];
}

// Update task counters
function updateTaskCounters() {
    const boardTasks = tasks[currentBoardId];
    
    for (const columnId in boardTasks) {
        const counterElement = document.getElementById(`${columnId}-counter`);
        if (counterElement) {
            counterElement.textContent = boardTasks[columnId].length;
        }
    }
}

// Clean current board tasks
async function cleanKanbanTasks() {
    const confirmed = await showNotification('Are you sure you want to clean all tasks from this board?', '#333333', 5000, true);
    if (confirmed) {
        tasks[currentBoardId] = {};
        initTasksObject();
        renderTasks();
        updateTaskCounters();
        saveToLocalStorage();
    }
}

function saveToLocalStorage() {
    localStorage.setItem('kanbanBoards', JSON.stringify(boards));
    localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
    localStorage.setItem('comboTasks', JSON.stringify(comboTasks));
    // _h_ is to see historic and _+_ is to add a new board
    if (currentBoardId !== '_h_' && currentBoardId !== '_+_') localStorage.setItem('currentBoardId', currentBoardId);
}


// Add new board
async function addNewBoard() {
    const newBoard = {
        id: generateId(),
        name: 'New Board',
        columns: [
            {
                name: 'To Do',
                color: '#3498db',
            },
            {
                name: 'Doing',
                color: '#f39c12',
            },
            {
                name: 'Done',
                color: '#2ecc71',
            }
        ]
    };
    
    boards.push(newBoard);
    tasks[newBoard.id] = {};
    newBoard.columns.forEach(column => {
        tasks[newBoard.id][column.name] = [];
    });
    
    openAddBoardModal(newBoard);
    saveToLocalStorage();
    switchBoard(newBoard.id);
}

// Open add task modal
function openAddBoardModal() {
    isEditMode = false;
    isEditingBoard = true;

    document.getElementById('modal-title').textContent = `Put board name:`;
    document.getElementById('task-content').value = '';
    document.getElementById('task-content').placeholder = 'Enter board name...';
    document.getElementById('task-modal').style.display = 'block';
}

// Delete current board
async function deleteCurrentBoard() {
    if (boards.length <= 1) {
        showNotification('Cannot delete the only board!', '#ff0000');
        return;
    }
    
    const confirmed = await showNotification('Are you sure you want to delete this board?', '#333333', 5000, true);
    if (confirmed) {
        const boardIndex = boards.findIndex(b => b.id === currentBoardId);
        if (boardIndex !== -1) {
            boards.splice(boardIndex, 1);
            delete tasks[currentBoardId];
            
            // Switch to first board
            switchBoard(boards[0].id);
            saveToLocalStorage();
        }
    }
}

function seeHistoric() {
    currentBoardId = '_h_';
    initTasksObject();
}

async function sendToHistoric(id) {
    if (boards.length <= 1) {
        showNotification("Cannot send to historic, it's the only board!", '#ff0000');
        return;
    }
    const board = boards.find(b => b.id === id);
    const comfirmed = await showNotification(`Are you sure you want to send "${board.name}" to historic?`, '#333333', 5000, true);
    if (board && comfirmed) {
        historic.push(board);

        const boardIndex = boards.findIndex(b => b.id === currentBoardId);
        if (boardIndex !== -1) {
            boards.splice(boardIndex, 1);
            delete tasks[currentBoardId];
            
            // Switch to first board
            switchBoard(boards[0].id);
            saveToLocalStorage();
        }

        localStorage.setItem('historic', JSON.stringify(historic));
        showNotification(`Board "${board.name}" was sent to historic without problems!`, '#2ecc71', 3000);
    }
}

// Initialize app on load
window.addEventListener('DOMContentLoaded', init);
