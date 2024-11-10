// List of MP3 files (replace this with your actual files or fetch dynamically)
const musicFiles = [
    'audio/Music/Those pedos/Banger.mp3',
    'audio/Music/Those pedos/P.Diddy touches.mp3',
    'audio/Music/Those pedos/Go away.mp3',
    'audio/Music/Those pedos/Go away from me.mp3',
    'audio/Music/Those pedos/Drake go away.mp3',
];

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
let audioContext = null; // For iOS AudioContext
const musicVolumeSlider = document.getElementById('MusicVolume_settings');

// Function to initialize AudioContext (needed for iOS Safari)
function initializeAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }
}

// Function to update the slider based on the audio volume
function updateVolumeSlider() {
    if (currentAudio) {
        musicVolumeSlider.value = currentAudio.volume;
        SettingsVariables.MusicVolume = currentAudio.volume;
        document.getElementById('MusicVolume-value').innerText = `${Math.round(currentAudio.volume * 100)}%`;
    }
}

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

    // Set initial volume (convert string to number)
    currentAudio.volume = parseFloat(musicVolumeSlider.value);

    // Sync the slider with the audio volume
    updateVolumeSlider();

    currentAudio.play()
        .then(() => {
            isAlreadyPlayingMusic = true;
        })
        .catch((error) => {
            isAlreadyPlayingMusic = false;
        });

    // Once the track ends, play the next one
    currentAudio.addEventListener('ended', playNextTrack);

    // Listen for volume changes and update the slider
    currentAudio.addEventListener('volumechange', updateVolumeSlider);

    // Update MediaSession metadata
    if (navigator.mediaSession) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: shuffledMusicFiles[currentTrackIndex].split('/').pop().replace('.mp3', ''),
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
        navigator.mediaSession.setActionHandler('previoustrack', () => playPreviousTrack());
        navigator.mediaSession.setActionHandler('nexttrack', () => playNextTrack());
        navigator.mediaSession.setActionHandler('seekbackward', (details) => {
            currentAudio.currentTime = Math.max(currentAudio.currentTime - (details.seekOffset || 10), 0);
        });
        navigator.mediaSession.setActionHandler('seekforward', (details) => {
            currentAudio.currentTime = Math.min(currentAudio.currentTime + (details.seekOffset || 10), currentAudio.duration);
        });
    }

    currentTrackIndex++;
}

document.addEventListener('keydown', (event) => {
    // Check if the spacebar key was pressed and currentAudio exists
    if (event.key === ' ' && currentAudio) {
        event.preventDefault();
        if (currentAudio.paused) {
            currentAudio.play();
        } else {
            currentAudio.pause();
        }
    }
});


// Function to play the previous track
function playPreviousTrack() {
    currentTrackIndex -= 2;
    if (currentTrackIndex < 0) {
        currentTrackIndex = shuffledMusicFiles.length - 1;
    }
    playNextTrack();
}

// Event listener for volume slider
musicVolumeSlider.addEventListener('input', () => {
    if (currentAudio) {
        currentAudio.volume = parseFloat(musicVolumeSlider.value);
        updateVolumeSlider();
    }
});

// Define the types of interactions we want to capture
const interactionEvents = [
    'click', 'keydown', 'keyup', 'mousedown', 'mouseup', 'mousemove', 
    'touchstart', 'touchend', 'touchmove', 'wheel', 'focus', 'blur'
];

// Define the interaction handler as a named function
function interactionHandler(e) {
    if (!isAlreadyPlayingMusic) {
        initializeAudioContext(); // Ensure AudioContext is ready for iOS
        playNextTrack();

        if (isAlreadyPlayingMusic) {
            // Remove the event listeners after starting the music
            interactionEvents.forEach(event => {
                document.body.removeEventListener(event, interactionHandler);
            });
        }
    }
}

// Loop through all interaction events and add the event listeners
interactionEvents.forEach(event => {
    document.body.addEventListener(event, interactionHandler, { once: true });
});
