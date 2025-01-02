const addTaskBtn = document.getElementById('add-task-btn');

// make subtask container visible/hidden
function toggleSubtaskContainer(container, show) {
    if (show) {
        container.classList.add('visible');
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
        container.classList.remove('visible');
    }
}

function renderHistoricTasks() {
    const historicTasks = JSON.parse(localStorage.getItem('historicTasks') || '[]');

    taskContainer.innerHTML = ''; // Clear container

    // Sort tasks based on the current sort type
    let sortedTasks = [...historicTasks];
    if (currentSortType === 'urgency') sortedTasks = sortTasksByUrgency(sortedTasks);
    else if (currentSortType === 'creationTime') sortedTasks = sortTasksByCreationTime(sortedTasks);
    else if (currentSortType === 'title') sortedTasks = sortTasksByTitle(sortedTasks);

    sortedTasks.forEach((task, taskIndex) => {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task');

        // Task Header
        const header = document.createElement('div');
        header.classList.add('task-header');
        header.style.margin = '10px';
        header.style.border = '2px solid var(--accent-color)';
        header.style.borderRadius = '10px';
        header.style.padding = '10px';
        header.style.backgroundColor = 'var(--bg-color)';

        const title = document.createElement('span');
        title.textContent = `${task.title}`;
        title.style.cursor = 'pointer';

        const creationTime = document.createElement('span');
        creationTime.textContent = 'Creation Time:';
        creationTime.setAttribute('data-translate', 'creationTime');
        creationTime.classList.add('timer');

        const creationTimeSpan = document.createElement('span');
        creationTimeSpan.classList.add('timer');

        // Format the creation time
        const rawCreationTime = task.creationTime; // Example: '2024-12-30T12:28:49.809Z'
        const date = new Date(rawCreationTime);

        // Format the date
        const formattedDate = `${String(date.getDate()).padStart(2, '0')}/` +
                `${String(date.getMonth() + 1).padStart(2, '0')}/` +
                `${String(date.getFullYear()).slice(-2)} ` +
                `${date.getHours() % 12 || 12}:${String(date.getMinutes()).padStart(2, '0')}` +
                `${date.getHours() >= 12 ? 'pm' : 'am'}`;
        creationTimeSpan.textContent = ` ${formattedDate}`;

        const type = document.createElement('span');
        type.setAttribute('data-translate', 'type');
        type.classList.add('timer');

        const typeSpan = document.createElement('span');
        typeSpan.textContent = ` ${task.type}`;
        typeSpan.classList.add('timer');

        const profile = document.createElement('span');
        profile.setAttribute('data-translate', 'profile:');
        profile.classList.add('timer');

        const profileSpan = document.createElement('span');
        profileSpan.textContent = ` ${task.profile}`;
        profileSpan.classList.add('timer');

        const dependencies = document.createElement('span');
        dependencies.setAttribute('data-translate', 'dependencies:');
        dependencies.classList.add('timer');
        dependencies.style.marginTop = '100px';

        const DependenciesSpan = document.createElement('span');
        Object.entries(task.dependencies).forEach(([key, values]) => {
            const paragraph = document.createElement('p');
            paragraph.textContent = `${key}: ${values.join(', ')}`; // Join array values into a string
            paragraph.style.margin = '0px';
            paragraph.style.marginLeft = '5px'
            DependenciesSpan.appendChild(paragraph);

            // Add a line break after each paragraph
            const lineBreak = document.createElement('br');
            DependenciesSpan.appendChild(lineBreak);
        });
        DependenciesSpan.classList.add('timer');
       
        header.appendChild(title);

        header.appendChild(document.createElement('br'));
        header.appendChild(creationTime);
        header.appendChild(creationTimeSpan);
        
        header.appendChild(document.createElement('br'));
        header.appendChild(type);
        header.appendChild(typeSpan);

        header.appendChild(document.createElement('br'));
        header.appendChild(profile);
        header.appendChild(profileSpan);

        header.appendChild(document.createElement('br'));
        header.appendChild(dependencies);
        header.appendChild(DependenciesSpan);

        taskContainer.appendChild(header);
        applyLanguage(); // Apply language to the new elements
    });
}

const historyBtn = document.getElementById('history-btn');
let historicOpened = false;
function openHistoric() {
    if (!historicOpened) {
        historicOpened = true;
        historyBtn.setAttribute('data-translate', 'seeTasks');
        renderHistoricTasks();
    } else {
        historicOpened = false;
        historyBtn.setAttribute('data-translate', 'seeHistoric');
        renderTasks();
    }
    applyLanguage(); // Apply language to the button text
}

historyBtn.addEventListener('click', openHistoric);

document.addEventListener('keydown', (e) => {
    if (e.key === 'h') openHistoric();
});

// Buttons for sorting
const sortByUrgencyBtn = document.getElementById('s-btn-urgency');
const sortByCreationTimeBtn = document.getElementById('s-btn-CT');
const sortByTitleBtn = document.getElementById('s-btn-a-z');

let currentSortType = 'urgency'; // Default sort type

// Sorting functions
function sortTasksByUrgency(tasks) {
    return tasks.sort((a, b) => {
        const urgencyOrder = { '!!!': 1, '!!': 2, '!': 3, '.': 4 };
        const urgencyDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
        if (urgencyDiff !== 0) return urgencyDiff;
        return new Date(a.creationTime) - new Date(b.creationTime);
    });
}

function sortTasksByCreationTime(tasks) {
    return tasks.sort((a, b) => new Date(a.creationTime) - new Date(b.creationTime));
}

function sortTasksByTitle(tasks) {
    return tasks.sort((a, b) => a.title.localeCompare(b.title));
}

// Add click event listeners to sort buttons
function highlightActiveButton(activeButton) {
    [sortByUrgencyBtn, sortByCreationTimeBtn, sortByTitleBtn].forEach(btn => 
        btn.classList.remove('active-sort-btn')
    );
    activeButton.classList.add('active-sort-btn');
}

sortByUrgencyBtn.addEventListener('click', () => {
    currentSortType = 'urgency';
    highlightActiveButton(sortByUrgencyBtn);
    renderTasks();
});

sortByCreationTimeBtn.addEventListener('click', () => {
    currentSortType = 'creationTime';
    highlightActiveButton(sortByCreationTimeBtn);
    renderTasks();
});

sortByTitleBtn.addEventListener('click', () => {
    currentSortType = 'title';
    highlightActiveButton(sortByTitleBtn);
    renderTasks();
});

// Initial render
highlightActiveButton(sortByUrgencyBtn); // Highlight the default sorting button

const taskContainer = document.getElementById('tasks-container');
function renderTasks() {
    taskContainer.innerHTML = ''; // Clear container

    // Sort tasks based on the current sort type
    let sortedTasks = [...tasks];
    if (currentSortType === 'urgency') sortedTasks = sortTasksByUrgency(sortedTasks);
    else if (currentSortType === 'creationTime') sortedTasks = sortTasksByCreationTime(sortedTasks);
    else if (currentSortType === 'title') sortedTasks = sortTasksByTitle(sortedTasks);

    sortedTasks.forEach((task, taskIndex) => {
        if (task.profile === currentProfileType) {
            const taskDiv = document.createElement('div');
            taskDiv.classList.add('task');

            // Task Header
            const header = document.createElement('div');
            header.classList.add('task-header');

            const title = document.createElement('span');
            title.textContent = `${task.title}`;
            title.style.cursor = 'pointer';

            const urgency = document.createElement('span');
            urgency.style.color = task.urgency === '!!!' ? '#c40909' : 
                task.urgency === '!!' ? '#c4a209' : 
                task.urgency === '!' ? '#0cc409' : 
                task.urgency === '.' ? '#09bec4' : 
                '#ccc';
            urgency.style.cursor = 'progress';
            urgency.textContent = `  [ ${task.urgency} ]  `;

            const urgencyName = document.createElement('span');
            urgencyName.classList.add('timer');
            urgencyName.setAttribute('data-translate', 
                task.urgency === '!!!' ? 'highPriority' :
                task.urgency === '!!' ? 'mediumPriority' : 
                task.urgency === '!' ? 'lowPriority' : 
                task.urgency === '.' ? 'noPriority' : 'unknownPriority'
            );
            urgencyName.style.opacity = '0';

            // Show the urgency name on hover or touch start
            urgency.addEventListener('mouseover', () => {
                urgencyName.style.opacity = '1';
            });
            urgency.addEventListener('touchstart', () => {
                urgencyName.style.opacity = '1';
            });

            // Hide the urgency name when hover ends or touch ends
            urgency.addEventListener('mouseout', () => {
                urgencyName.style.opacity = '0';
            });
            urgency.addEventListener('touchend', () => {
                urgencyName.style.opacity = '0';
            });

            // change the task urgency on click
            urgency.addEventListener('click', () => {
                task.urgency === '!!!' ? task.urgency = '.' :
                task.urgency === '!!' ?  task.urgency = '!!!' :
                task.urgency === '!' ?  task.urgency = '!!' :
                task.urgency === '.' ?  task.urgency = '!' : task.urgency = '.'
                renderTasks();
            });
        

            const creationTime = document.createElement('span');
            creationTime.textContent = 'Creation Time:';
            creationTime.setAttribute('data-translate', 'creationTime');
            creationTime.classList.add('timer');

            const creationTimeSpan = document.createElement('span');
            creationTimeSpan.classList.add('timer');

            // Format the creation time
            const rawCreationTime = task.creationTime; // Example: '2024-12-30T12:28:49.809Z'
            const date = new Date(rawCreationTime);

            // Format the date
            const formattedDate = `${String(date.getDate()).padStart(2, '0')}/` +
                    `${String(date.getMonth() + 1).padStart(2, '0')}/` +
                    `${String(date.getFullYear()).slice(-2)} ` +
                    `${date.getHours() % 12 || 12}:${String(date.getMinutes()).padStart(2, '0')}` +
                    `${date.getHours() >= 12 ? 'pm' : 'am'}`;
            creationTimeSpan.textContent = ` ${formattedDate}`;

            const type = document.createElement('span');
            type.setAttribute('data-translate', 'type');
            type.classList.add('timer');

            const typeSpan = document.createElement('span');
            typeSpan.textContent = ` ${task.type}`;
            typeSpan.classList.add('timer');

            const toggleSubtasksBtn = document.createElement('button');
            toggleSubtasksBtn.textContent = '▼';
            toggleSubtasksBtn.style.marginLeft = '10px';
            toggleSubtasksBtn.classList.add('subtask-btn');
            toggleSubtasksBtn.addEventListener('click', () => {
                const isVisible = subtaskContainer.classList.contains('visible');
                toggleSubtaskContainer(subtaskContainer, !isVisible);
                toggleSubtasksBtn.textContent = subtaskContainer.classList.contains('hidden') ? '▼' : '▲';
            });
            
            header.appendChild(title);
            header.appendChild(urgency);
            header.appendChild(urgencyName);
            header.appendChild(document.createElement('br')); // Add a line break
            header.appendChild(creationTime);
            header.appendChild(creationTimeSpan);
            header.appendChild(document.createElement('br')); // Add a line break
            header.appendChild(type);
            header.appendChild(typeSpan);
            header.appendChild(document.createElement('br')); // Add a line break
            header.appendChild(toggleSubtasksBtn);
      

            // Subtask Container
            const subtaskContainer = document.createElement('div');
            subtaskContainer.classList.add('subtask-container', 'hidden');
            renderSubtasks(subtaskContainer, task, taskIndex);

            taskDiv.appendChild(header);
            taskDiv.appendChild(subtaskContainer);
            taskContainer.appendChild(taskDiv);

            applyLanguage(); // Apply language to the new elements
        }
    });
}

function renderSubtasks(container = false, task, taskIndex) {
    if (!container) {
        const subtaskSection = document.querySelector(`.create-subtask-section-${taskIndex}`);
        if (subtaskSection) {
            container = subtaskSection.parentElement;
        } else {
            return; // no container exists
        }
    }
    console.log(container);

    if (!document.querySelector(`.create-subtask-section-${taskIndex}`)) {
        container.innerHTML = '';

        const createSubtaskDiv = document.createElement('div');
        createSubtaskDiv.classList.add('subtask-section', `create-subtask-section-${taskIndex}`);
        createSubtaskDiv.innerHTML = `
            <h4 data-translate="CreateSubtask"> Create Subtask</h4>
            <input type="text" id="subtask-name-${taskIndex}" placeholder="Subtask Name">
            <button data-translate="add" id="add-subtask-btn-${taskIndex}">Add</button>
        `;

        // Adding Enter key functionality
        const newTypeInput = createSubtaskDiv.querySelector(`#subtask-name-${taskIndex}`);

        if (newTypeInput) {
            newTypeInput.addEventListener('keypress', function (event) {
                if (event.key === 'Enter') {
                    createSubtaskDiv.querySelector(`#add-subtask-btn-${taskIndex}`).click();
                }
            });
        }

        // Add subtask creation logic
        createSubtaskDiv.querySelector(`#add-subtask-btn-${taskIndex}`).addEventListener('click', () => {
            const input = createSubtaskDiv.querySelector(`#subtask-name-${taskIndex}`);
            let subtaskName = input.value.trim();
            if (subtaskName) {
                // Ensure unique subtask names
                let counter = 1;
                const originalName = subtaskName;
                while (task.subtasks.some(subtask => subtask.name === subtaskName)) {
                    subtaskName = `${originalName} ${counter}`;
                    counter++;
                }

                // Assign the subtask an index based on the current length of subtasks
                const subtaskIndex = task.subtasks.length;
                console.log(`Added subtask: ${subtaskName}, index: ${subtaskIndex}`);
                task.subtasks.push({ name: subtaskName, status: 'To do', subtaskIndex: subtaskIndex });

                saveData();
                renderSubtasks(container, task, taskIndex);
            }
        });

        container.appendChild(createSubtaskDiv);

        // Create layout for To Do, Doing, and Done
        const subtaskGrid = document.createElement('div');
        subtaskGrid.classList.add('subtask-grid');

        const toDoSection = createDroppableSection('To Do', 'To do', task, taskIndex);
        const doingSection = createDroppableSection('Doing', 'Doing', task, taskIndex);
        const doneSection = createDroppableSection('Done', 'Done', task, taskIndex);

        subtaskGrid.appendChild(toDoSection); // Left
        subtaskGrid.appendChild(doingSection); // Center
        subtaskGrid.appendChild(doneSection); // Right

        container.appendChild(subtaskGrid);

        // Add Delete Subtask Section
        const deleteSection = document.createElement('div');
        deleteSection.classList.add('subtask-delete-section', `subtask-delete-section-${taskIndex}`);
        deleteSection.innerHTML = `
            <div data-translate="DragHereToDelete" class="delete-area">Drag here to delete</div>
        `;

        if (Object.keys(task.dependencies).length > 0) { // Check if there are any dependencies
            console.log(task.dependencies);
            const dependenciesDiv = document.createElement('div');
            dependenciesDiv.classList.add('subtask-dependencies');
            dependenciesDiv.textContent = 'Dependencies:';
            dependenciesDiv.appendChild(document.createElement('br'));
        
            Object.entries(task.dependencies).forEach(([dependency, dependencyValues], dependencyIndex) => {
                const dependencyLabel = document.createElement('label');
                dependencyLabel.textContent = `${dependency}:  `;
                dependencyLabel.setAttribute('for', `${dependency} - ${taskIndex}`);
        
                const dependencyInput = document.createElement('input');
                dependencyInput.setAttribute('type', 'text');
                dependencyInput.id = `${dependency} - ${taskIndex}`;
                dependencyInput.style.marginRight = '10px';
                dependencyInput.value = dependencyValues[0] || ''; // Use the first value or an empty string
        
                dependencyInput.addEventListener('change', (e) => {
                    const newValue = e.target.value.trim(); // Get the input's value
                    if (newValue) {
                        task.dependencies[dependency] = [newValue]; // Update the dependency value
                    }
                });
        
                dependenciesDiv.appendChild(dependencyLabel);
                dependenciesDiv.appendChild(dependencyInput);
            });
        
            console.log(task.dependencies);
            console.log(dependenciesDiv.innerHTML);
            if (container) {
                console.log("Container has been found");
                container.appendChild(dependenciesDiv);
            } else {
                console.error("Container is not defined or found");
            }
        }
    } else { // Update subtasks
        const subtaskGrid = container.querySelector(`.subtask-grid`);
        subtaskGrid.innerHTML = ''; // Clear subtask list
        const toDoSection = createDroppableSection('To Do', 'To do', task, taskIndex);
        const doingSection = createDroppableSection('Doing', 'Doing', task, taskIndex);
        const doneSection = createDroppableSection('Done', 'Done', task, taskIndex);

        subtaskGrid.appendChild(toDoSection); // Left
        subtaskGrid.appendChild(doingSection); // Center
        subtaskGrid.appendChild(doneSection); // Right
    }
    applyLanguage();
}

function deleteSubtask(subtask, task, taskIndex) {
    const subtaskIndex = subtask.subtaskIndex;
    task.subtasks.splice(subtaskIndex, 1); // Remove the subtask
    task.subtasks.forEach ((subtask, index) => {
        subtask.subtaskIndex = index;
    });
    saveData();
    renderSubtasks(container = false, task, taskIndex);
    checkTaskCompletion(task, taskIndex); // Check if task is now completed
}

function createDroppableSection(title, status, task, taskIndex) {
    const section = document.createElement('div');
    section.classList.add('subtask-section');
    section.innerHTML = `<h4 data-translate="${title.replace(' ', '')}">${title}</h4>`;
    section.dataset.status = status;

    const subtaskList = document.createElement('ul');
    subtaskList.classList.add('subtask-list');
    task.subtasks
        .filter(subtask => subtask.status === status)
        .forEach((subtask) => {
            const subtaskItem = createDraggableSubtask(task, taskIndex, subtask, subtask.subtaskIndex);
            subtaskList.appendChild(subtaskItem);
        });

    section.appendChild(subtaskList);

    return section;
}

function createDraggableSubtask(task, taskIndex, subtask) {
    const item = document.createElement('li');
    item.classList.add('subtask');
    item.textContent = subtask.name;

    // Make draggable functionality
    item.addEventListener('mousedown', event => {
        event.preventDefault();

        const itemClone = item.cloneNode(true); // Create a clone to drag
        itemClone.classList.add('dragging');
        itemClone.style.width = item.offsetWidth + 'px';
        itemClone.textContent = item.textContent;
        document.body.appendChild(itemClone);

        let offsetX = event.clientX - item.getBoundingClientRect().left;
        let offsetY = event.clientY - item.getBoundingClientRect().top;

        function onMouseMove(event) {
            itemClone.style.position = 'absolute';
            itemClone.style.zIndex = '1000';
            itemClone.style.left = `${event.clientX - offsetX}px`;
            itemClone.style.top = `${event.clientY - offsetY}px`;
        }

        function onMouseUp (event) {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('touchstart', onMouseMove);
            itemClone.remove();
        
            const closestSection = getClosestDroppableSection(event.clientX, event.clientY);
            console.log(`Dropped subtask to ${closestSection.dataset.status}`);
            if (closestSection.dataset.status === undefined) { // Delete the subtask
                console.log(`Deleted subtask: ${subtask}`);
                deleteSubtask(subtask, task, taskIndex);
            } else if (closestSection && closestSection.dataset.status !== subtask.status) {
                subtask.status = closestSection.dataset.status;
                saveData();
                renderSubtasks(closestSection.parentElement.parentElement, task, taskIndex);
                checkTaskCompletion(task, taskIndex);
            }
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('touchstart', onMouseMove);

        document.addEventListener('mouseup', onMouseUp, { once: true });
        document.addEventListener('touchend', onMouseUp, { once: true });
    });

    return item;
}

function getClosestDroppableSection(x, y) {
    const droppableSections = document.querySelectorAll('.subtask-section');
    let closest = null;
    let closestDistance = Infinity;

    droppableSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distance = Math.hypot(centerX - x, centerY - y);
        if (distance < closestDistance) {
            closestDistance = distance;
            closest = section;
        }
    });

    return closest;
}

function checkTaskCompletion(task, taskIndex) {
    task.subtasks.forEach(subtask => {
        if (typeof subtask.status === 'undefined') {
            deleteSubtask(subtask, task, taskIndex);
        }
    });
    if (task.subtasks.length > 0 && task.subtasks.every(subtask => subtask.status === 'Done')) {
        // Move task to historic save
        const historicTasks = JSON.parse(localStorage.getItem('historicTasks') || '[]');
        historicTasks.push(task);
        localStorage.setItem('historicTasks', JSON.stringify(historicTasks));

        // Remove task from active tasks
        tasks.splice(taskIndex, 1);
        saveData();
        renderTasks();
        alert(`Task "${task.title}" has been completed and archived!`);
    }
}
