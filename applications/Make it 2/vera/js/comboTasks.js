// Variables for combo task editing
let editingComboIndex = -1;
let isNewCombo = false;

// Open combo tasks editor
function openComboTasksEditor() {
    generateComboTasksEditor();
    document.getElementById('combo-tasks-modal').style.display = 'block';
}

// Generate combo tasks editor content
function generateComboTasksEditor() {
    const comboTasksList = document.getElementById('combo-tasks-list');
    comboTasksList.innerHTML = '';
    
    comboTasks.forEach((combo, index) => {
        const comboItem = document.createElement('div');
        comboItem.className = 'combo-task-item';
        
        const comboHeader = document.createElement('div');
        comboHeader.className = 'combo-header';
        
        const comboName = document.createElement('div');
        comboName.className = 'combo-name';
        comboName.textContent = combo.name.join(', ');
        
        const comboTaskCount = document.createElement('div');
        comboTaskCount.className = 'combo-task-count';
        comboTaskCount.textContent = `${combo.tasks.length} tasks`;
        
        const comboButtons = document.createElement('div');
        comboButtons.className = 'combo-buttons';
        
        const editButton = document.createElement('button');
        editButton.className = 'edit-column-btn';
        editButton.innerHTML = '✏️';
        editButton.onclick = () => editComboTask(index);
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-column-btn';
        deleteButton.innerHTML = '🗑️';
        deleteButton.onclick = () => deleteComboTask(index);
        
        comboButtons.appendChild(editButton);
        comboButtons.appendChild(deleteButton);
        
        comboHeader.appendChild(comboName);
        comboHeader.appendChild(comboTaskCount);
        comboHeader.appendChild(comboButtons);
        
        const tasksList = document.createElement('div');
        tasksList.className = 'combo-tasks-list';
        
        combo.tasks.forEach((task, taskIndex) => {
            const taskItem = document.createElement('div');
            taskItem.className = 'combo-task-list-item';
            taskItem.textContent = task;
            tasksList.appendChild(taskItem);
        });
        
        comboItem.appendChild(comboHeader);
        comboItem.appendChild(tasksList);
        
        comboTasksList.appendChild(comboItem);
    });
}

// Add new combo task
function addNewComboTask() {
    editingComboIndex = -1;
    isNewCombo = true;
    openComboTaskEditor();
}

// Edit existing combo task
function editComboTask(index) {
    editingComboIndex = index;
    isNewCombo = false;
    openComboTaskEditor();
}

// Open combo task editor modal
function openComboTaskEditor() {
    // Create modal if it doesn't exist
    if (!document.getElementById('combo-task-editor-modal')) {
        createComboTaskEditorModal();
    }
    
    // Set title
    document.getElementById('combo-editor-title').textContent = 
        isNewCombo ? 'Add Combo Task' : 'Edit Combo Task';
    
    // Populate fields if editing
    if (!isNewCombo) {
        const combo = comboTasks[editingComboIndex];
        document.getElementById('combo-names').value = combo.name.join(', ');
        document.getElementById('combo-tasks-textarea').value = combo.tasks.join('\n');
    } else {
        document.getElementById('combo-names').value = '';
        document.getElementById('combo-tasks-textarea').value = '';
    }
    
    // Display modal
    document.getElementById('combo-task-editor-modal').style.display = 'block';
}

// Create combo task editor modal
function createComboTaskEditorModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'combo-task-editor-modal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const title = document.createElement('h2');
    title.id = 'combo-editor-title';
    title.textContent = 'Edit Combo Task';
    
    // Names input
    const namesGroup = document.createElement('div');
    namesGroup.className = 'form-group';
    
    const namesLabel = document.createElement('label');
    namesLabel.htmlFor = 'combo-names';
    namesLabel.textContent = 'Combo Names (comma separated)';
    
    const namesInput = document.createElement('input');
    namesInput.type = 'text';
    namesInput.id = 'combo-names';
    namesInput.placeholder = 'e.g. daily, morning, routine';
    
    namesGroup.appendChild(namesLabel);
    namesGroup.appendChild(namesInput);
    
    // Tasks textarea
    const tasksGroup = document.createElement('div');
    tasksGroup.className = 'form-group';
    
    const tasksLabel = document.createElement('label');
    tasksLabel.htmlFor = 'combo-tasks-textarea';
    tasksLabel.textContent = 'Tasks (one per line)';
    
    const tasksTextarea = document.createElement('textarea');
    tasksTextarea.id = 'combo-tasks-textarea';
    tasksTextarea.placeholder = 'Enter tasks, one per line';
    tasksTextarea.rows = 5;
    
    tasksGroup.appendChild(tasksLabel);
    tasksGroup.appendChild(tasksTextarea);
    
    // Buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'modal-buttons';
    
    const cancelButton = document.createElement('button');
    cancelButton.className = 'cancel-btn';
    cancelButton.textContent = 'Cancel';
    cancelButton.onclick = () => closeModal('combo-task-editor-modal');
    
    const saveButton = document.createElement('button');
    saveButton.className = 'save-btn';
    saveButton.textContent = 'Save';
    saveButton.onclick = saveComboTaskDetails;
    
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(saveButton);
    
    // Assemble modal
    modalContent.appendChild(title);
    modalContent.appendChild(namesGroup);
    modalContent.appendChild(tasksGroup);
    modalContent.appendChild(buttonContainer);
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

// Save combo task details
function saveComboTaskDetails() {
    const namesInput = document.getElementById('combo-names').value.trim();
    const tasksInput = document.getElementById('combo-tasks-textarea').value.trim();
    
    if (!namesInput || !tasksInput) {
        showNotification('Names and tasks cannot be empty!', '#ff0000');
        return;
    }
    
    // Parse names and tasks
    const names = namesInput.split(',').map(name => name.trim()).filter(name => name.length > 0);
    const tasksList = tasksInput.split('\n').map(task => task.trim()).filter(task => task.length > 0);
    
    if (names.length === 0) {
        showNotification('Must provide at least one name!', '#ff0000');
        return;
    }
    
    if (tasksList.length === 0) {
        showNotification('Must provide at least one task!', '#ff0000');
        return;
    }
    
    // Create or update combo task
    const comboTask = {
        name: names,
        tasks: tasksList
    };
    
    if (isNewCombo) {
        comboTasks.push(comboTask);
    } else {
        comboTasks[editingComboIndex] = comboTask;
    }
    
    // Save changes
    saveToLocalStorage();
    closeModal('combo-task-editor-modal');
    generateComboTasksEditor();
}

// Delete combo task
async function deleteComboTask(index) {
    const confirmed = await showNotification('Are you sure you want to delete this combo task?', '#333', 5000, true);
    
    if (confirmed) {
        comboTasks.splice(index, 1);
        saveToLocalStorage();
        generateComboTasksEditor();
    }
}

// Save combo tasks changes
function saveComboTasksChanges() {
    saveToLocalStorage();
    closeModal('combo-tasks-modal');
}