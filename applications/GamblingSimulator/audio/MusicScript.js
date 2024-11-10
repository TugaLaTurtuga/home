// List of MP3 files (replace this with your actual files or fetch dynamically)
const musicFiles = [
    'audio/Music/GOAwayFromMe.mp3',
    'audio/Music/DrakeGoAway.mp3',
    'audio/Music/GoAway.mp3',
    'audio/Music/Touching.mp3',
    'audio/Music/TouchingKids.mp3',
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
let currentAudio = null; // To keep track of the currently playing audio
const musicVolumeSlider = document.getElementById('MusicVolume_settings');

// Function to update the slider based on the audio volume
function updateVolumeSlider() {
    if (currentAudio) {
        musicVolumeSlider.value = currentAudio.volume;

        // settings
        SettingsVariables.MusicVolume = currentAudio.volume;
        document.getElementById('MusicVolume-value').innerText = `${Math.round(currentAudio.volume * 100)}%`
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
            isAlreadyPlayingMusic = null;
        })
        .catch((error) => {
            isAlreadyPlayingMusic = false;
        });

    currentTrackIndex++;

    // Once the track ends, play the next one
    currentAudio.addEventListener('ended', playNextTrack);

    // Listen for volume changes and update the slider
    currentAudio.addEventListener('volumechange', updateVolumeSlider);

    // Update MediaSession metadata
    if (navigator.mediaSession && isAlreadyPlayingMusic === null) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: shuffledMusicFiles[currentTrackIndex].split('/').pop().replace('.mp3', ''),
            artist: 'Tuga La Turtuga', // You can update this dynamically
            album: 'Gambling simulator',   // You can update this dynamically
        });

        // Set up MediaSession actions (play, pause, etc.)
        navigator.mediaSession.setActionHandler('play', () => {
            currentAudio.play();
        });
        navigator.mediaSession.setActionHandler('pause', () => {
            currentAudio.pause();
        });
        navigator.mediaSession.setActionHandler('previoustrack', () => {
            playPreviousTrack();
        });
        navigator.mediaSession.setActionHandler('nexttrack', () => {
            playNextTrack();
        });
        navigator.mediaSession.setActionHandler('seekbackward', (details) => {
            currentAudio.currentTime = Math.max(currentAudio.currentTime - (details.seekOffset || 10), 0);
        });
        navigator.mediaSession.setActionHandler('seekforward', (details) => {
            currentAudio.currentTime = Math.min(currentAudio.currentTime + (details.seekOffset || 10), currentAudio.duration);
        });
    }
}

// Function to play the previous track
function playPreviousTrack() {
    currentTrackIndex--;
    currentTrackIndex--;
    if (currentTrackIndex <= 0) {
        currentTrackIndex = shuffledMusicFiles.length - 2; // Go to the last track
    }
    playNextTrack();
}

// Event listener for volume slider
musicVolumeSlider.addEventListener('input', () => {
    if (currentAudio) {
        currentAudio.volume = parseFloat(musicVolumeSlider.value);
        updateSliderBackground(musicVolumeSlider);
    }
});

// Define the types of interactions we want to capture
const interactionEvents = [
    'click', 'keydown', 'keyup', 'mousedown', 'mouseup', 'mousemove', 
    'touchstart', 'touchend', 'touchmove', 'wheel', 'focus', 'blur'
];

// Define the interaction handler as a named function
function interactionHandler(e) {
    if (isAlreadyPlayingMusic === false) {
        playNextTrack(); // Start playing the first track (sometimes it doens't work)

        if (isAlreadyPlayingMusic === null) {
            // Remove the event listeners after starting the music
            interactionEvents.forEach(event => {
                document.body.removeEventListener(event, interactionHandler);
            });
        }
    } else if (isAlreadyPlayingMusic === null) {
        // Remove the event listeners after starting the music
        interactionEvents.forEach(event => {
            document.body.removeEventListener(event, interactionHandler);
        });
    }
}

// Loop through all interaction events and add the event listeners
interactionEvents.forEach(event => {
    document.body.addEventListener(event, interactionHandler);
});
