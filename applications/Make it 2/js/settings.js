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
                    <input type="text" data-translate="newDependency" placeholder="newCondition" id="new-dependency-${profileName}">
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
