let SettingsVariables = {
    EasyNav: false,
    AminateClickToEarn: true,
    PlayGames: true,
//    SFXVolume: 1,
    MusicVolume: 0, //.6,
    TurnOffVolumeWhenUnfocused: true,
};

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', function (event) {
        // Check for Ctrl/Meta key and specific key presses
        if (((event.ctrlKey || event.metaKey) && event.shiftKey) && (event.key === '.')) {
            localStorage.removeItem('SettingsVariables');
            location.reload(); // Refresh to apply default settings
        } else if ((event.ctrlKey || event.metaKey) && (event.key === ',' || event.key === ';' || event.key === '.')) {
            SeeSettings();
        }
    });
});

function SeeSettings() {
    const settingsElement = document.querySelector('.settingsWholeDiv');

    if (!settingsElement) {
        console.error('Settings element not found');
        return;
    }

    // Toggle the visibility of the settings
    if (settingsElement.classList.contains('show')) {
        settingsElement.classList.remove('show');
    } else {
        settingsElement.classList.add('show');
    }
}

var hasTouchScreen = false;

if ("maxTouchPoints" in navigator) {
    hasTouchScreen = navigator.maxTouchPoints > 0;
} else if ("msMaxTouchPoints" in navigator) {
    hasTouchScreen = navigator.msMaxTouchPoints > 0;
} else {
    var mQ = window.matchMedia && matchMedia("(pointer:coarse)");
    if (mQ && mQ.media === "(pointer:coarse)") {
        hasTouchScreen = !!mQ.matches;
    } else if ('orientation' in window) {
        hasTouchScreen = true; // deprecated, but good fallback
    } else {
        // Only as a last resort, fall back to user agent sniffing
        var UA = navigator.userAgent;
        hasTouchScreen = (
            /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
            /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
        );
    }
}

if (hasTouchScreen) SettingsVariables.EasyNav = true // make the EasyNav enabled by default in mobile

// Load settings from localStorage
function loadSettings() {
    const savedSettings = localStorage.getItem('SettingsVariables');
    if (savedSettings) {
        try {
            const parsedSettings = JSON.parse(savedSettings);
            SettingsVariables = { ...SettingsVariables, ...parsedSettings };
        } catch (error) {
            console.error("Failed to load settings:", error);
        }
    }
}

// Save settings to localStorage
function saveSettings() {
    localStorage.setItem('SettingsVariables', JSON.stringify(SettingsVariables));
}

// Animation easing function
function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

// Animation for toggle button
function animateToggle(id, isTurningOn, duration) {
    const toggleBtn = document.getElementById(id);
    if (!toggleBtn) return;

    const knob = toggleBtn.querySelector('.knob');
    let start = null;
    const knobDistance = 30; // Distance the knob should move

    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const easedProgress = easeOutExpo(progress);

        const offset = isTurningOn ? easedProgress * knobDistance : (1 - easedProgress) * knobDistance;
        knob.style.transform = `translateX(${offset}px)`;

        const startColor = isTurningOn ? { r: 204, g: 204, b: 204 } : { r: 76, g: 175, b: 80 };
        const endColor = isTurningOn ? { r: 76, g: 175, b: 80 } : { r: 204, g: 204, b: 204 };
        const r = Math.round(startColor.r + (endColor.r - startColor.r) * easedProgress);
        const g = Math.round(startColor.g + (endColor.g - startColor.g) * easedProgress);
        const b = Math.round(startColor.b + (endColor.b - startColor.b) * easedProgress);

        toggleBtn.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            toggleBtn.classList.toggle('on', isTurningOn);
        }
    }
    requestAnimationFrame(step);
}

function CreateTheListenerForToggle(id) {
    const toggleBtn = document.getElementById(id);
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
        const key = id.replace('_settings', '');
        const currentState = SettingsVariables[key];
        SettingsVariables[key] = !currentState;
        PutEasyNav();
        saveSettings();

        animateToggle(id, SettingsVariables[key], 200);
    });
}

function updateToggleUI(id, isTurningOn) {
    const toggleBtn = document.getElementById(id);
    if (!toggleBtn) return;

    const knob = toggleBtn.querySelector('.knob');
    const knobDistance = 30;

    knob.style.transform = `translateX(${isTurningOn ? knobDistance : 0}px)`;
    toggleBtn.style.backgroundColor = isTurningOn ? 'rgb(76, 175, 80)' : 'rgb(204, 204, 204)';
    toggleBtn.classList.toggle('on', isTurningOn);
}

function CreateSettings() {
    loadSettings();
    const settingsElement = document.getElementById('settings');
    if (!settingsElement) return;

    settingsElement.innerHTML = '';

    Object.entries(SettingsVariables).forEach(([key, value]) => {
        const VariableDiv = document.createElement('div');
        VariableDiv.classList.add('setting-item');

        if (typeof value === 'number') {
            VariableDiv.innerHTML = `
                <h3>${key}:</h3>
                <input type="range" id="${key}_settings" min="0" max="1" step="0.01" value="${value}" class="slider" style="margin-top: 32px; min-width: 100px; width: 100px; max-width: 80%;">
                <span id="${key}-value" style="margin-top: 15px; margin-left: 2px;">${Math.round(value * 100)}%</span>
            `;
            settingsElement.appendChild(VariableDiv);
            const rangeInput = document.getElementById(`${key}_settings`);
            setTimeout(() => {
                setSliderColor(rangeInput, 'rgb(76, 175, 80)', true, 'white');
            }, 1000);
           
            rangeInput.addEventListener('input', (event) => {
                const newValue = parseFloat(event.target.value);
                SettingsVariables[key] = newValue;
                document.getElementById(`${key}-value`).textContent = `${Math.round(newValue * 100)}%`;
                saveSettings();
            });

        } else if (typeof value === 'boolean') {
            VariableDiv.innerHTML = `
                <h3>${key}:</h3>
                <div class="toggle-btn ${value ? 'on' : ''}" id="${key}_settings">
                    <div class="knob"></div>
                </div>
            `;
            settingsElement.appendChild(VariableDiv);

            updateToggleUI(`${key}_settings`, value);
            CreateTheListenerForToggle(`${key}_settings`);
        }
    });
}

CreateSettings();
