// List of MP3 files (replace this with your actual files or fetch dynamically)
const musicFiles = [
    'audio/Music/Background noise by TugaLaTurtuga™/piano noise.MP3',
];

let SettingsVariables = {
    EasyNav: false,
    AminateClickToEarn: true,
    PlayGames: true,
    MusicVolume: 0,
    TurnOffVolumeWhenUnfocused: false,
};

// Function to shuffle the array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Shuffle the music files
const shuffledMusicFiles = shuffleArray(musicFiles);

let currentTrackIndex = 0;
let isAlreadyPlayingMusic = false;
let currentAudio = null;
let audioContext = null;
let gainNode = null;
const musicVolumeSlider = document.getElementById('MusicVolume_settings');

// Function to initialize AudioContext (needed for iOS Safari)
function initializeAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);
    }
}

// Function to update the slider based on the audio volume
function updateVolumeSlider() {
    if (currentAudio && gainNode) {
        musicVolumeSlider.value = gainNode.gain.value;
        SettingsVariables.MusicVolume = gainNode.gain.value;
        saveSettings();
        document.getElementById('MusicVolume-value').innerText = `${Math.round(gainNode.gain.value * 100)}%`;
    }
}

// Function to initialize AudioContext
function initializeAudioContext() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            gainNode = audioContext.createGain();
            gainNode.connect(audioContext.destination);
            console.log("AudioContext initialized.");
        } catch (error) {
            console.error("Error creating the AudioContext:", error);
        }
    }

    // Resume immediately if suspended
    if (audioContext && audioContext.state === "suspended") {
        try {
            audioContext.resume();
            console.log("AudioContext resumed.");
        } catch (error) {
            console.error("Error resuming the AudioContext:", error);
        }
    }
}

// Define the types of interactions we want to capture
const interactionEvents = [
    'click', 'keydown', 'keyup', 'mousedown', 'mouseup', 'mousemove', 
    'touchstart', 'touchend', 'touchmove', 'wheel', 'focus', 'blur'
];

// Interaction handler
function interactionHandler() {
    initializeAudioContext();
    playNextTrack();

    if (isAlreadyPlayingMusic) {
        // Remove interaction event listeners
        interactionEvents.forEach(event => {
            document.body.removeEventListener(event, interactionHandler);
        });
    }
}

// Add interaction event listeners
interactionEvents.forEach(event => {
    document.body.addEventListener(event, interactionHandler, { once: true });
});

// Function to play the next track
function playNextTrack() {
    if (currentTrackIndex >= shuffledMusicFiles.length) {
        currentTrackIndex = 0; // Restart from the beginning
    }

    // Stop the previous track if any
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    currentAudio = new Audio(shuffledMusicFiles[currentTrackIndex]);

    // Ensure AudioContext is initialized
    initializeAudioContext();

    // Create a media element source for the current track
    const trackSource = audioContext.createMediaElementSource(currentAudio);
    trackSource.connect(gainNode);

    // Set initial volume using GainNode
    gainNode.gain.value = parseFloat(musicVolumeSlider.value);

    // Sync the slider with the audio volume
    updateVolumeSlider();

    currentAudio.play()
        .then(() => {
            isAlreadyPlayingMusic = true;
        })
        .catch(() => {
            isAlreadyPlayingMusic = false;
        });

    // Once the track ends, play the next one
    currentAudio.addEventListener('ended', playNextTrack);

    // Listen for volume changes and update the slider
    currentAudio.addEventListener('volumechange', updateVolumeSlider);

    // Update MediaSession metadata
    if (navigator.mediaSession) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: shuffledMusicFiles[currentTrackIndex].split('/').pop().replace(/\.[^/.]+$/, ''),
            artist: 'Tuga La Turtuga',
            album: shuffledMusicFiles[currentTrackIndex].split('/')[2],
            artwork: [
                {
                    src: 'icon.webp',
                    sizes: '512x512',
                    type: 'image/webp'
                }
            ]
        });

        // Set up MediaSession actions (play, pause, etc.)
        navigator.mediaSession.setActionHandler('play', () => currentAudio.play());
        navigator.mediaSession.setActionHandler('pause', () => currentAudio.pause());
        navigator.mediaSession.setActionHandler('previoustrack', playPreviousTrack);
        navigator.mediaSession.setActionHandler('nexttrack', playNextTrack);
        navigator.mediaSession.setActionHandler('seekbackward', (details) => {
            currentAudio.currentTime = Math.max(currentAudio.currentTime - (details.seekOffset || 10), 0);
        });
        navigator.mediaSession.setActionHandler('seekforward', (details) => {
            currentAudio.currentTime = Math.min(currentAudio.currentTime + (details.seekOffset || 10), currentAudio.duration);
        });
    }

    currentTrackIndex++;
}

// Function to play the previous track
function playPreviousTrack() {
    currentTrackIndex -= 2;
    if (currentTrackIndex < 0) {
        currentTrackIndex = shuffledMusicFiles.length - 1;
    }
    playNextTrack();
}

// Event listener for spacebar to play/pause
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' && (e.ctrlKey || e.metaKey) && currentAudio) {
        e.preventDefault();
        if (currentAudio.paused) {
            currentAudio.play();
        } else {
            currentAudio.pause();
        }
    }
});

// Event listener for volume slider
musicVolumeSlider.addEventListener('input', () => {
    if (gainNode) {
        gainNode.gain.value = parseFloat(musicVolumeSlider.value);
        updateVolumeSlider();
    }
});

// Handle focus and blur events for pausing/resuming
let wasPausedByUnfocusing = false;
window.addEventListener('blur', () => {
    if (SettingsVariables.TurnOffVolumeWhenUnfocused && !currentAudio.paused) {
        currentAudio.pause();
        wasPausedByUnfocusing = true;
    }
});

window.addEventListener('focus', () => {
    if (SettingsVariables.TurnOffVolumeWhenUnfocused && wasPausedByUnfocusing) {
        currentAudio.play();
        wasPausedByUnfocusing = false;
    }
});

// Load settings from localStorage
function loadSettings() {
    const savedSettings = localStorage.getItem('SettingsVariables');
    console.log(savedSettings);
    if (savedSettings) {
        try {
            const parsedSettings = JSON.parse(savedSettings);
            SettingsVariables = { ...SettingsVariables, ...parsedSettings };
            musicVolumeSlider.value = parsedSettings.MusicVolume;
            updateSliderBackground(musicVolumeSlider);
        } catch (error) {
            console.error("Failed to load settings:", error);
        }
    }
}

// Save settings to localStorage
function saveSettings() {
    localStorage.setItem('SettingsVariables', JSON.stringify(SettingsVariables));
}

function updateSliderBackground(slider) {
    const percentage = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.setProperty('--slider-value', `${percentage}%`); // Set slider value dynamically
}

// Function to set the slider color dynamically
function setSliderColor(slider, color, differentThumbColor = false, thumbColor = 'white') {
    // Set the main track color
    slider.style.setProperty('--slider-color', color);

    // Set a different color for the thumb if specified
    if (differentThumbColor) {
        slider.style.setProperty('--slider-thumb-color', thumbColor);
    } else {
        // Fallback to the same color as the track
        slider.style.setProperty('--slider-thumb-color', color);
    }
}

function setSliderBackGroundColor(slider, color) {
    slider.style.setProperty('--slider-background-color', color);
}

// Function to handle scroll events on the slider
function handleSliderScroll(event, slider) {
    event.preventDefault(); // Prevent the page from scrolling
    const scrollSpeed = 0.25;
    const step = (slider.max - slider.min) / 100 * event.deltaY * scrollSpeed;

    // Update the slider's value based on scroll direction
    slider.value = Math.max(slider.min, Math.min(slider.max, parseFloat(slider.value) - step));

    // Trigger the input event programmatically
    const inputEvent = new Event('input', { bubbles: true });
    slider.dispatchEvent(inputEvent); // Dispatch input event to trigger any associated listeners
}

// Function to add listeners to sliders
function addSliderListeners(slider) {
    // Add 'input' event listener to update the slider background
    slider.addEventListener('input', () => updateSliderBackground(slider));

    // Add 'wheel' event listener for scroll functionality
    slider.addEventListener('wheel', (event) => handleSliderScroll(event, slider));
}

function initializeSliders() {
    const sliders = document.querySelectorAll('.slider');

    // Loop through each slider and set its initial state
    sliders.forEach((slider) => {
        addSliderListeners(slider);
        setSliderColor(slider, '#4caf50', true); // Set the default track color
        setSliderBackGroundColor(slider, '#f1f1f1'); // Set the default background color
    });
}

initializeSliders();
loadSettings();