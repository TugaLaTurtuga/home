// State variables
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let profileTypes = JSON.parse(localStorage.getItem('profileTypes')) || {
    Work: { 
        types: ['Meeting', 'Coding', 'Presentation'], 
        dependencies: [],
        colors: { 
            primary: '#007bff', 
            secondary: '#6610f2' 
        },
    },
    Personal: { 
        types: ['Shopping', 'Exercise', 'Relaxation'], 
        dependencies: [], 
        colors: { 
            primary: '#007bff', 
            secondary: '#6610f2' 
        },
    }
};

let currentProfileType;

const profileSelector = document.getElementById('profile-select');
profileSelector.addEventListener('change', (e) => {
    getProfileSelected();    
});

function getProfileSelected() {
    currentProfileType = profileSelector.value;
    localStorage.setItem('profileType', currentProfileType);
    updateProfileColors();
    renderTasks();
}

function updateProfileColors() {
    const profileType = profileTypes[currentProfileType];
    const header = document.querySelector('.Header');

    console.log(profileType);

    header.style.background = `linear-gradient(to right, ${profileType.colors.primary}, ${profileType.colors.secondary})`;
}

let theme = localStorage.getItem('theme') || 'light';
let language = localStorage.getItem('language') || 'en'; // Default language is English

// Load the language from localStorage or default to English
let currentLanguage = localStorage.getItem('language') || 'en';

// Handle translations to the page
function applyLanguage() {
    fetch('translations.json')
        .then(response => response.json())
        .then(data => {
            const translations = data[currentLanguage]; // Ensure `currentLanguage` is defined and set globally
            
            const translateElements = document.querySelectorAll('[data-translate]');
            translateElements.forEach(element => {
                const key = element.getAttribute('data-translate');
                if (translations[key]) {
                    element.textContent = translations[key];
                } else {
                    element.textContent = 'uLove17yrsOldGirls'; // Replace with a default message if the translation is not found
                }
            });
        })
        .catch(error => console.error('Error loading translations:', error));
}

function getTranslation(key) {
    return fetch('translations.json')
        .then(response => response.json())
        .then(data => {
            if (data[currentLanguage][key]) {
                return data[currentLanguage][key];
            } else {
                return 'uLove17yrsOldGirls';
            }
        })
        .catch(error => {
            console.error('Error loading translations:', error);
            return 'uLove17yrsOldGirls';
        });
}

// Language Selection in Settings
const languageSelect = document.getElementById('language-select'); // Language selector
languageSelect.addEventListener('change', (e) => {
    language = e.target.value;
    localStorage.setItem('language', language); // Save language to localStorage
    applyLanguage(); // Apply the selected language
});

// Handle language selection
document.getElementById('language-select').addEventListener('change', (e) => {
    currentLanguage = e.target.value;
    localStorage.setItem('language', currentLanguage); // Save to localStorage
    applyLanguage(); // Apply the selected language
});

// Initialize the page with the correct language
document.addEventListener('DOMContentLoaded', () => {
    applyLanguage();
});

// Handle username
function applyUserName() {
    let userName = localStorage.getItem('userName');
    if (!userName) {
        userName = prompt('Please enter your name');
        localStorage.setItem('userName', userName); // Save to localStorage
    }
    document.getElementById('UserNameH1').textContent = ` ${userName} `;
}

function changeUserName() {
    const userName = prompt('Please enter your new name');
    if (userName) {
        localStorage.setItem('userName', userName); // Save to localStorage
        applyUserName(); // Update the user name on the page
    }
};

// DOM Elements
const addTaskBtn = document.getElementById('add-task-btn');
const themeSelect = document.getElementById('theme-select');
const downloadDataBtn = document.getElementById('download-data-btn');
const loadDataInput = document.getElementById('load-data-input');
const loadDataBtn = document.getElementById('load-data-btn');
const profileManagementDiv = document.getElementById('profile-management');
const profileList = document.getElementById('profile-list');

// Set the default theme or load from localStorage
function applyTheme() {
    document.documentElement.classList.remove('light-theme', 'dark-theme', 'dracula-theme');
    document.documentElement.classList.add(`${theme}-theme`);
    saveData(); // Save the theme whenever it is applied
}

// Theme Selection in Settings
themeSelect.addEventListener('change', (e) => {
    theme = e.target.value;
    applyTheme();
});

function renderProfileSelectors() {
    const profileSelectors = document.querySelectorAll('.profile-selector');
    console.log(profileSelectors);

    // Generate the HTML for the <option> elements
    const optionsHTML = Object.keys(profileTypes)
        .map(profileName => `<option value="${profileName}">${profileName}</option>`)
        .join('');

    console.log(optionsHTML);

    // Update each selector's innerHTML
    profileSelectors.forEach((selector) => {
        selector.innerHTML = optionsHTML; // Directly set the options HTML
    });
    getProfileSelected();
}

// Render Settings with Translations
function renderSettings() {
    profileList.innerHTML = ''; // Clear existing profile list

    Object.keys(profileTypes).forEach(profileName => {
        const profileDiv = document.createElement('div');
        profileDiv.classList.add('profile-div');
        profileDiv.innerHTML = `
            <h4>${profileName}</h4>
            <div class="profile-types" id="profile-section">
                <h5 data-translate="types">types</h5>
                <div class="profile-seperator">
                    <input type="text" data-translate="newType" placeholder="newType" id="new-type-${profileName}">
                    <button class="add-type-btn" data-profile="${profileName}" data-translate="addType">addType</button>
                    
                    <ul id="type-list-${profileName}">
                        ${profileTypes[profileName].types
                            .map(type => `<li>${type} 
                                <button class="delete-type-btn" data-profile="${profileName}" data-type="${type}" data-translate="delete">delete</button>
                            </li>`)
                            .join('')}
                    </ul>
                </div>
            </div>
            <div class="profile-dependencies" id="profile-section">
                <h5 data-translate="dependencies">dependencies</h5>
                
                <div class="profile-seperator">
                    <input type="text" data-translate="newDependency" placeholder="newDependency" id="new-dependency-${profileName}">
                    <button class="add-dependency-btn" data-profile="${profileName}" data-translate="addDependency">addDependency</button>

                    <ul id="dependency-list-${profileName}">
                        ${profileTypes[profileName].dependencies
                            .map(dep => `<li>${dep} 
                                <button class="delete-dependency-btn" data-profile="${profileName}" data-dependency="${dep}" data-translate="delete">delete</button>
                            </li>`)
                            .join('')}
                    </ul>
                </div>
            </div>
            <div class="profile-colors" id="profile-section">
                <h5 data-translate="colors">colors</h5>
              
                <div class="profile-seperator">
                    <label for="primary-color-${profileName}" data-translate="primaryColor">Primary Color</label>
                    <input type="color" id="primary-color-${profileName}" style="padding: 0;" value="${profileTypes[profileName].colors.primary}" />
                    <br>
                    <label for="secondary-color-${profileName}" data-translate="secondaryColor">Secondary Color</label>
                    <input type="color" id="secondary-color-${profileName}" style="padding: 0;" value="${profileTypes[profileName].colors.secondary}" />
                </div>
            </div>
            <button class="delete-profile-btn" style="margin-top: 10px" data-translate="delete">delete</button>
        `;
        profileList.appendChild(profileDiv); // Append to DOM before adding event listeners

        // Adding Enter key functionality
        const newTypeInput = document.getElementById(`new-type-${profileName}`);
        const newDependencyInput = document.getElementById(`new-dependency-${profileName}`);

        if (newTypeInput) {
            newTypeInput.addEventListener('keypress', function (event) {
                if (event.key === 'Enter') {
                    document.querySelector(`.add-type-btn[data-profile="${profileName}"]`).click();
                }
            });
        }

        if (newDependencyInput) {
            newDependencyInput.addEventListener('keypress', function (event) {
                if (event.key === 'Enter') {
                    document.querySelector(`.add-dependency-btn[data-profile="${profileName}"]`).click();
                }
            });
        }

        // Profile Actions (Delete Profile, Add Type, Add Dependency)
        profileDiv.querySelector('.delete-profile-btn').addEventListener('click', () => {
            delete profileTypes[profileName];
            saveData();
            renderSettings();
        });

        profileDiv.querySelector(`.add-type-btn[data-profile="${profileName}"]`).addEventListener('click', () => {
            const newType = newTypeInput.value.trim();
            if (newType) {
                profileTypes[profileName].types.push(newType);
                saveData();
                renderSettings();
            }
        });

        profileDiv.querySelector(`.add-dependency-btn[data-profile="${profileName}"]`).addEventListener('click', () => {
            const newDependency = newDependencyInput.value.trim();
            if (newDependency) {
                profileTypes[profileName].dependencies.push(newDependency);
                saveData();
                renderSettings();
            }
        });

        // Delete Type & Dependency
        profileDiv.querySelectorAll('.delete-type-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const profile = btn.dataset.profile;
                const type = btn.dataset.type;
                profileTypes[profile].types = profileTypes[profile].types.filter(t => t !== type);
                saveData();
                renderSettings();
            });
        });

        profileDiv.querySelectorAll('.delete-dependency-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const profile = btn.dataset.profile;
                const dependency = btn.dataset.dependency;
                profileTypes[profile].dependencies = profileTypes[profile].dependencies.filter(d => d !== dependency);
                saveData();
                renderSettings();
            });
        });

        const header = document.querySelector('.Header');

        // Utility function to handle events
        function handleColorEvents(inputId, colorKey) {
            let oldSelectedProfile; // Not ready yet (currentProfileType = null), so put the variable string on click
            const input = profileDiv.querySelector(inputId);

            input.addEventListener('click', () => {
                header.style.position = 'fixed'; // Fix header position on click
                oldSelectedProfile = currentProfileType;
                profileSelector.value = profileName;
                getProfileSelected();
            });

            input.addEventListener('input', (e) => {
                profileTypes[profileName].colors[colorKey] = e.target.value; // Update color
                updateProfileColors(); // Apply new colors
                saveData(); // Save data
            });

            input.addEventListener('change', (e) => {
                profileSelector.value = oldSelectedProfile; // put old selected profile
                getProfileSelected(); // Update it
                header.style.position = 'relative'; // Reset header position
            });

            input.addEventListener('blur', () => {
                profileSelector.value = oldSelectedProfile; // put old selected profile
                getProfileSelected(); // Update it
                header.style.position = 'relative'; // Reset header position when deselected
            });
        }

        // Set up events for primary and secondary color inputs
        handleColorEvents(`#primary-color-${profileName}`, 'primary');
        handleColorEvents(`#secondary-color-${profileName}`, 'secondary');
    });

    themeSelect.value = theme;
    languageSelect.value = currentLanguage;

    renderProfileSelectors();
    applyLanguage();
}

// Add Profile
document.getElementById('add-profile-btn').addEventListener('click', () => {
    const message = getTranslation('PutProfileName')
    const newProfile = prompt(message);
    if (newProfile && !profileTypes[newProfile]) {
        profileTypes[newProfile] = { types: [], dependencies: [], colors: { primary: '#000', secondary: '#000' },};
        saveData();
        renderSettings();
    }
});

// Save Data
function saveData() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('profileTypes', JSON.stringify(profileTypes));
    localStorage.setItem('theme', theme);
    localStorage.setItem('language', language); // Save language preference 
}

// Delete Data
function deleteData(keys = []) {
    if (keys.length === 0) {
        // If no keys are specified, clear all saved data related to the app
        localStorage.removeItem('tasks');
        localStorage.removeItem('historicTasks');
        localStorage.removeItem('profileTypes');
        alert('All application data has been deleted.');
    } else {
        // Remove only the specified keys
        keys.forEach(key => localStorage.removeItem(key));
        alert(`The following data has been deleted: ${keys.join(', ')}`);
    }
    window.location.reload();
}

// Delete Data btn
document.querySelector("#delete-data-btn").addEventListener("click", () => {
    const confirmDelete = confirm("Are you sure you want to delete all saved data? This action cannot be undone.");
    if (confirmDelete) {
        deleteData(); // Calls the deleteData function to remove all relevant data
    }
});

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

function renderSubtasks(container, task, taskIndex) {
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

        // Allow dropping subtasks to delete
        const deleteArea = deleteSection.querySelector('.delete-area');
        deleteArea.addEventListener('dragover', event => event.preventDefault());
        deleteArea.addEventListener('drop', event => {
            const subtaskIndex = event.dataTransfer.getData('subtaskIndex');
            const originTaskIndex = event.dataTransfer.getData('taskIndex');
            if (originTaskIndex == taskIndex) {
                task.subtasks.splice(subtaskIndex, 1); // Remove the subtask
                task.subtasks.forEach ((subtask, index) => {
                    subtask.subtaskIndex = index;
                });
                saveData();
                renderSubtasks(container, task, taskIndex);
                checkTaskCompletion(task, taskIndex); // Check if task is now completed
            }
        });

        container.appendChild(deleteSection);
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

    // Allow dropping
    section.addEventListener('dragover', event => event.preventDefault());
    section.addEventListener('drop', event => {
        const subtaskIndex = event.dataTransfer.getData('subtaskIndex');
        const originTaskIndex = event.dataTransfer.getData('taskIndex');
        const originStatus = event.dataTransfer.getData('status'); // Get the current status of the subtask being dragged

        if (originTaskIndex == taskIndex && originStatus !== status) {
            // Update the subtask's status
            task.subtasks[subtaskIndex].status = status;
            saveData();
            renderSubtasks(section.parentElement.parentElement, task, taskIndex); // Update the UI dynamically
            checkTaskCompletion(task, taskIndex); // Check if task is now completed
        }
    });
    return section;
}

function createDraggableSubtask(task, taskIndex, subtask) {
    const item = document.createElement('li');
    item.classList.add('subtask');
    item.textContent = subtask.name;
    item.draggable = true;

    // Set drag data, including the status
    item.addEventListener('dragstart', event => {
        event.dataTransfer.setData('subtaskIndex', subtask.subtaskIndex);
        event.dataTransfer.setData('taskIndex', taskIndex);
        event.dataTransfer.setData('status', subtask.status); // Include the current status
    });

    return item;
}

function checkTaskCompletion(task, taskIndex) {
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

const taskProfileSelect = document.getElementById('task-profile');
const taskTypeSelect = document.getElementById('task-type');

// Initialize the type dropdown based on the default profile
taskProfileSelect.dispatchEvent(new Event('change'));

const addTaskModal = document.getElementById('add-task-modal');
const cancelBtn = document.getElementById('cancel-btn');
const saveTaskBtn = document.getElementById('save-task-btn');

addTaskBtn.addEventListener('click', () => {
    profileOnAddTask();
    addTaskModal.classList.remove('hidden');
});

cancelBtn.addEventListener('click', () => {
    addTaskModal.classList.add('hidden');
});

saveTaskBtn.addEventListener('click', () => {
    const taskTitle = document.getElementById('task-title').value;
    const taskUrgency = document.getElementById('task-urgency').value;
    const taskProfile = document.getElementById('task-profile').value;
    const taskType = document.getElementById('task-type').value;
    const taskTime = document.getElementById('task-time').value;
    
    const tDependencies = Array.from(document.querySelectorAll('.task-dependency:checked'))
    .map(checkbox => checkbox.value);
    let taskDependencies = {};

    tDependencies.forEach(dependency => {
        if (!taskDependencies[dependency]) {
            taskDependencies[dependency] = [];
        }
        taskDependencies[dependency].push('');
    });

    console.log(taskDependencies);

    if (taskTitle) {
        tasks.push({
            title: taskTitle,
            urgency: taskUrgency,
            profile: taskProfile,
            type: taskType,
            creationTime: new Date().toISOString(),
            timeToCompletion: taskTime || 'None',
            dependencies: taskDependencies,
            timer: '00:00:00',
            subtasks: [],
        });

        console.log(tasks);

        saveData();
        renderTasks();
        addTaskModal.classList.add('hidden'); // Hide modal after saving
    } else {
        alert('Please enter a task title.');
    }
});

function profileOnAddTask() {
    const profile = taskProfileSelect.value; // Get the selected profile
    console.log(profile);
    const dependencyContainer = document.getElementById('task-dependency-container');
    dependencyContainer.innerHTML = ''; // Clear previous dependencies

    if (profileTypes[profile]) {
        profileTypes[profile].dependencies.forEach(dep => {
            const depCheckbox = document.createElement('input');
            depCheckbox.type = 'checkbox';
            depCheckbox.className = 'task-dependency';
            depCheckbox.value = dep;

            const depLabel = document.createElement('label');
            depLabel.textContent = dep;

            const depWrapper = document.createElement('div');
            depWrapper.appendChild(depCheckbox);
            depWrapper.appendChild(depLabel);

            dependencyContainer.appendChild(depWrapper);
        });
        updateProfileTypes(profile, '#task-type'); // Update task type dropdown
    }
}

taskProfileSelect.addEventListener('change', profileOnAddTask);

function updateProfileTypes(profile, dropdown) {
    const profileTypeDropdown = document.querySelector(dropdown);

    // Ensure `profileTypes[profile]` has a `types` property and use it to populate the dropdown
    if (profileTypes[profile] && Array.isArray(profileTypes[profile].types)) {
        profileTypeDropdown.innerHTML = profileTypes[profile].types
            .map(typeName => `<option value="${typeName}">${typeName}</option>`)
            .join('');
    } else {
        console.error("Invalid profile or types not found");
        profileTypeDropdown.innerHTML = '<option value="">No types available</option>';
    }
}

// Initial Render
applyUserName();
applyTheme();

// Initialize Settings (will also initialize the tasks && lenguage)
document.addEventListener('DOMContentLoaded', () => {
    renderSettings();
});

