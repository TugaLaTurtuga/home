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

// CREATES THE TASK
saveTaskBtn.addEventListener('click', () => {
    let taskTitle = document.getElementById('task-title').value;
    const taskUrgency = document.getElementById('task-urgency').value;
    const taskProfile = document.getElementById('task-profile').value;
    const taskType = document.getElementById('task-type').value;
    let taskCreationTime = document.getElementById('task-time').value;
   
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
        if (!taskCreationTime) taskCreationTime = new Date().toISOString()

        // Ensure unique task names
        let counter = 1;
        const originalName = taskTitle;
        while (tasks.some(task => task.title === taskTitle)) {
            taskTitle = `${originalName} ${counter}`;
            counter++;
        }

        tasks.push({
            title: taskTitle,
            urgency: taskUrgency,
            profile: taskProfile,
            type: taskType,
            creationTime: taskCreationTime,
            dependencies: taskDependencies,
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
function initializePage() {
    applyUserName();
    applyTheme();
    renderSettings();
}
document.addEventListener('DOMContentLoaded', initializePage);
