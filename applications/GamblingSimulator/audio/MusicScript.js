// List of MP3 files (replace this with your actual files or fetch dynamically)
const musicFiles = [
    'audio/Music/Those pedos/Banger.mp3',
    'audio/Music/Those pedos/P.Diddy touches.mp3',
    'audio/Music/Those pedos/Go away.mp3',
    'audio/Music/Those pedos/Go away from me.mp3',
    'audio/Music/Those pedos/Drake go away.mp3',
    'audio/Music/Those pedos/The court has decided.mp3',
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
        document.getElementById('MusicVolume-value').innerText = `${Math.round(gainNode.gain.value * 100)}%`;
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
document.addEventListener('keydown', (event) => {
    if (event.key === ' ' && currentAudio) {
        event.preventDefault();
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

// Define the types of interactions we want to capture
const interactionEvents = [
    'click', 'keydown', 'keyup', 'mousedown', 'mouseup', 'mousemove', 
    'touchstart', 'touchend', 'touchmove', 'wheel', 'focus', 'blur'
];

// Interaction handler to initialize audio on iOS
function interactionHandler() {
    if (!isAlreadyPlayingMusic) {
        initializeAudioContext();
        playNextTrack();

        if (isAlreadyPlayingMusic) {
            interactionEvents.forEach(event => {
                document.body.removeEventListener(event, interactionHandler);
            });
        }
    }
}

// Add event listeners for user interactions
interactionEvents.forEach(event => {
    document.body.addEventListener(event, interactionHandler, { once: true });
});

// Handle focus and blur events for pausing/resuming
let wasPausedByUnfocusing = false;
window.addEventListener('blur', () => {
    if (currentAudio && SettingsVariables.TurnOffVolumeWhenUnfocused && !currentAudio.paused) {
        currentAudio.pause();
        wasPausedByUnfocusing = true;
    }
});

window.addEventListener('focus', () => {
    if (currentAudio && SettingsVariables.TurnOffVolumeWhenUnfocused && wasPausedByUnfocusing) {
        currentAudio.play();
        wasPausedByUnfocusing = false;
    }
});
