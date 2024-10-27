let currentAudio = null; // Variable to track currently playing audio
let currentAudioName = null;
let musicViewer = false;
let folders = null;
let playedTracks = [];  // Array to track previously played tracks

document.head = document.head || document.getElementsByTagName('head')[0];
function changeFavicon(src, albumName) {
    var link = document.createElement('link'),
        oldLink = document.getElementById('dynamic-favicon');
    
    link.id = 'dynamic-favicon';
    link.rel = 'shortcut icon';
    link.href = src;
    
    // Remove the old favicon if it exists
    if (oldLink) {
        document.head.removeChild(oldLink);
    }
  
    // Add the new favicon
    document.head.appendChild(link);
    if (albumName) {
        document.title = albumName;
        document.getElementById('name_of_the_music').textContent = albumName;
    } else {
        document.title = 'Reload';
        document.getElementById('name_of_the_music').textContent = 'Unknow album';
    }   
}

if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play', PlayMusic);     // Handles the play button
    navigator.mediaSession.setActionHandler('pause', PlayMusic);    // Handles the pause button (you might need a separate function for pause)
    navigator.mediaSession.setActionHandler('nexttrack', playNextTrack);  // Handles the next track button
    navigator.mediaSession.setActionHandler('previoustrack', playPreviousTrack);  // Handles the previous track button
}

window.onload = function() {
    const savedPath = localStorage.getItem('savedFolderPath');
    let loadSettingsButton = null;

    // Create a button to load settings
    loadSettingsButton = document.createElement('button');
    loadSettingsButton.textContent = savedPath ? 'Smash enter' : 'Set music or reload folder';
    loadSettingsButton.style.position = 'absolute';
    loadSettingsButton.style.top = '50%';
    loadSettingsButton.style.left = '50%';
    loadSettingsButton.style.transform = 'translate(-50%, -50%)';
    loadSettingsButton.style.padding = '20px';
    loadSettingsButton.style.fontSize = '1.5em';
    loadSettingsButton.style.backgroundColor = "#121212";
    loadSettingsButton.style.color = "#ccc";
    loadSettingsButton.style.border = "none";
    loadSettingsButton.style.borderRadius = "10px";
    loadSettingsButton.style.cursor = "pointer";
    loadSettingsButton.style.transition = "background-color 0.3s ease";
    document.body.appendChild(loadSettingsButton);

    loadSettingsButton.addEventListener('click', () => {
        document.getElementById('folderInput').click(); // Trigger the folder input
        document.body.removeChild(loadSettingsButton); // Remove the button after click
        loadSettingsButton = null; // Set to null after removal to prevent future 'Enter' triggers
    });

    // Check for the grid size slider
    const gridSizeSlider = document.getElementById('gridSizeSlider');
    const savedGridSize = localStorage.getItem('savedGridSize') || 25;
    if (gridSizeSlider) {
        gridSizeSlider.value = savedGridSize; // Set the initial grid size
        adjustGridSize({ target: { value: savedGridSize } });
        gridSizeSlider.addEventListener('input', adjustGridSize); // Move listener here
    } else {
        console.error('Grid size slider not found');
    }

    // Check for the jump force slider
    const jumpForceSlider = document.getElementById('jumpForceSlider');
    const jumpForceSize = localStorage.getItem('jumpForceSize') || 2;
    if (jumpForceSlider) {
        jumpForceSlider.value = jumpForceSize; // Set initial jump force slider value
        adjustJumpForce({ target: { value: jumpForceSize } }); // Ensure jump force is set
        jumpForceSlider.addEventListener('input', adjustJumpForce); // Move listener here
    } else {
        console.error('Jump force slider not found');
    }

    // Get the volume slider element
    const volumeSlider = document.getElementById('volumeSlider');
    const savedVolume = localStorage.getItem('volume') || 0.5;

    // Apply the saved volume to the slider and the current audio
    if (volumeSlider) {
        volumeSlider.value = savedVolume;
        if (currentAudio) {
            currentAudio.volume = savedVolume;
        }
        // Add event listener for changes in the slider
        volumeSlider.addEventListener('input', function() {
            const newVolume = this.value;

            if (currentAudio) {
                currentAudio.volume = newVolume; // Update the audio volume
            }
            // Save the new volume in localStorage
            localStorage.setItem('volume', newVolume);
        });
    } else {
        console.error('Volume slider not found');
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        if ((event.ctrlKey || event.metaKey) && (event.key === ',' || event.key === ';' || event.key === '.')) {
            SeeSettings()
        } else if (event.key === ' ' || event.key === 'k') {
            PlayMusic();
        } else if (event.key === 'Enter' && loadSettingsButton) {
            loadSettingsButton.click(); // Simulate a click on the button
        } else if (event.key === 'right' || event.key === 'l') {
            playNextTrack();
        } else if (event.key === 'left' || event.key === 'j') {
            playPreviousTrack();
        }
    });

    // Event listener for folder input change
    document.getElementById('folderInput').addEventListener('change', handleFiles, false);

    const settingsElement = document.querySelector('.settings');
    const ReloadLogo = document.getElementById('ReloadLogo');

    ReloadLogo.addEventListener('click', () => {
        SeeSettings()
    });

    initializeSliders(); // code in css/UpdateSliderColor.js that updates the sliders color
};

function SeeSettings() {
    const settingsElement = document.querySelector('.settings');
    if (settingsElement.classList.contains('show')) {
        settingsElement.classList.remove('show');
    
        // Delay changing visibility until after the opacity transition
        setTimeout(() => {
            settingsElement.classList.add('hide');
        }, 300); // 300ms matches the CSS transition duration for opacity
    } else {
        settingsElement.classList.remove('hide');
        settingsElement.classList.add('show');
    }
}

// Function to adjust grid size
function adjustGridSize(event) {
    const gridSize = event.target.value / 5 + 10; // Get the slider value
    const gridContainer = document.getElementById('grid-container');

    // Display the selected size
    document.getElementById('gridSizeValue').textContent = event.target.value.toString().padStart(3, '0');

    // Update CSS variables for grid item width
    gridContainer.style.setProperty('--grid-item-width', `${gridSize}%`);
    gridContainer.style.setProperty('--grid-item-gap', '10px');

    // Save the current grid size in local storage
    localStorage.setItem('savedGridSize', event.target.value);
}

// Function to adjust jump force value
let jumpForce = 2;
function adjustJumpForce(event) {
    // Get the current jump force value from the slider
    jumpForce = parseFloat(event.target.value); // Convert to a float for precision
    const jumpForceValueSpan = document.getElementById('jumpForceValue');

    // Display the selected jump force value, rounded to 2 decimal places
    if (jumpForceValueSpan) {
        if (jumpForce < 10) {
            jumpForceValueSpan.textContent = jumpForce.toFixed(2); // Format to 2 decimal places
        } else if (jumpForce < 100) {
            jumpForceValueSpan.textContent = jumpForce.toFixed(1); // Format to 1 decimal place
        } else {
            jumpForceValueSpan.textContent = 'und.'
        }
    } else {
        console.error('Jump force value span not found');
    }

    // Get all elements with the class 'grid-item'
    const gridItems = document.getElementsByClassName('grid-item');

    // Iterate over each grid item to set the jump force as a CSS variable
    for (let i = 0; i < gridItems.length; i++) {
        gridItems[i].style.setProperty('--jump-force', jumpForce);
    }

    // Save the current jump force in local storage
    localStorage.setItem('jumpForceSize', jumpForce);
}
// In the updateMusicViewer function, initialize the volume slider to the current audio volume
function updateMusicViewer(albumCover) {
    // Show the cover image in music viewer
    const coverImage = document.getElementById('coverImage');

    let pathParts = currentAudioName.toString().split('/');
    let albumName = pathParts[pathParts.length - 2];
    console.log(albumName)

    if (albumCover) {
        const reader = new FileReader();
        reader.onload = function(e) {
            coverImage.src = e.target.result; // Set the cover image source
            changeFavicon(e.target.result, albumName)
        };
        reader.readAsDataURL(albumCover); // Read the album cover file as a data URL
    } else {
        // If there's no album cover, set a default image
        coverImage.src = 'images/Volume/full_volume.png'; // Provide a default image path

        if (albumName) {
            changeFavicon('images/Reload.png', albumName)
        } else { changeFavicon('images/Reload.png', 'Reload') }
    }

    const viewerPlayButton = document.getElementById('viewerPlayButton');
    viewerPlayButton.onclick = () => {
        PlayMusic();
    };

    // Set initial volume slider value
    const volumeSlider = document.getElementById('volumeSlider');
    if (currentAudio) {
        volumeSlider.value = currentAudio.volume; // Set slider to current audio volume
    }
}

function handleFiles(event) {
    const files = event.target.files;  // FileList object
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = ''; // Clear existing content
    const albums = [];
    const singles = [];

    // Get the selected folder path
    const fullPath = files[0].webkitRelativePath.split('/')[0];
    localStorage.setItem('savedFolderPath', fullPath); // Save folder path to local storage

    for (const file of files) {
        const fullPath = file.webkitRelativePath;
        if (fullPath.includes('Album')) {
            albums.push(file);
        } else if (fullPath.includes('Single')) {
            singles.push(file);
        }
    }

    const groupedAlbums = groupByFolder(albums);
    const groupedSingles = groupByFolder(singles);
    folders = groupByFolder(albums.concat(singles));

    // Display music
    displayMusic(groupedAlbums, "Albums");
    displayMusic(groupedSingles, "Singles");

    // Adjust the grid size after displaying the music
    const currentGridSizeValue = document.getElementById('gridSizeSlider').value;
    adjustGridSize({ target: { value: currentGridSizeValue } });
}

function groupByFolder(files) {
    const folderGroups = {};
    files.forEach(file => {
        const folderPath = file.webkitRelativePath.split('/').slice(0, -1).join('/');
        if (!folderGroups[folderPath]) {
            folderGroups[folderPath] = [];
        }
        folderGroups[folderPath].push(file);
    });

    return folderGroups;
}

function getMusicFile(folder) {
    return folder.find(f => f.name.endsWith('.mp3'));;
}

function displayMusic(folderGroups, type) {
    const container = document.createElement('div');
    container.className = 'music-category'; // Class for category container

    const title = document.createElement('div');
    title.className = 'category-title';
    title.textContent = type; // Set title for each category
    container.appendChild(title);

    const gridContainer = document.createElement('div');
     gridContainer.className = 'grid-container'; // Create a new grid container for items
    container.appendChild(gridContainer);
   
    for (const [folder, files] of Object.entries(folderGroups)) {
        const audioFile = getMusicFile(files)

        // If an audio file exists, make the play button clickable
        if (audioFile) {
            const albumDiv = document.createElement('div');
            albumDiv.className = 'grid-item';
            albumDiv.style.setProperty('--jump-force', jumpForce)

           // Create and add the play button
            const playButton = document.createElement('img');
            playButton.src = 'images/play.png'; // Path to your play image
            playButton.id = audioFile.webkitRelativePath
            console.log(playButton.id)
            playButton.alt = 'Play';
            playButton.className = 'play-button'; // Class for styling
            playButton.style.cursor = 'pointer'; // Show it's clickable
            const iconFile = files.find(f => f.name === 'icon.png');
                    
            // Add event listener to play button
            playButton.addEventListener('click', () => {
                musicViewer = true;
                      
                // Stop the currently playing audio if different
                if (currentAudio && currentAudioName !== audioFile.webkitRelativePath) {
                    currentAudio.pause();
                }
                 // Play the new audio file if not already playing
                if (!currentAudio || currentAudioName !== audioFile.webkitRelativePath) {
                    PlayTheAudio(audioFile, iconFile)
                } else {
                    // If clicking the same play button, pause it
                    PlayMusic()
                }
            });

            albumDiv.appendChild(playButton);

            const img = document.createElement('img');
            const reader = new FileReader();
            reader.onload = function(e) {
                img.src = e.target.result;
            };

            // Optional: Display other files such as icon, author, year, etc.
            if (iconFile) {
                reader.readAsDataURL(iconFile);
                albumDiv.appendChild(img);
            } else { // If there's no album cover, set a default image
                reader.readAsDataURL('images/Volume/full_volume.png');
                albumDiv.appendChild(img);
            }

            const folderName = folder.split('/').pop();
            const title = document.createElement('h3');
            title.textContent = folderName; // Set folder name as title
            albumDiv.appendChild(title);

            // Append album info (author, year, genre, etc.)
            appendTextFileContent(albumDiv, files, 'Author.txt', 'Author: ');
            appendTextFileContent(albumDiv, files, 'Year.txt', 'Year: ');
            appendTextFileContent(albumDiv, files, 'Genre.txt', 'Genre: ');

            gridContainer.appendChild(albumDiv); // Append each album or single to the grid container
        }
    }
    document.getElementById('grid-container').appendChild(container); // Append the entire category to the main grid container
}

function appendTextFileContent(albumDiv, files, fileName, label) {
    const file = files.find(f => f.name === fileName);
    if (file) {
        const element = document.createElement('p');
        const reader = new FileReader();
        reader.onload = function(e) {
            element.textContent = label + e.target.result;
        };
        reader.readAsText(file);
        albumDiv.appendChild(element);
    }
}

let FirstTime = true;
function PlayTheAudio(audioFile, iconFile) {
    try {
        if (!audioFile) throw new Error("Audio file not found or inaccessible.");

        // Stop and reset the current audio if it's already playing
        if (currentAudio) {
            currentAudio.pause();      // Pause the current audio
            currentAudio.currentTime = 0;  // Reset its position to the beginning
        }

        // Create a new audio object from the file
        currentAudio = new Audio(URL.createObjectURL(audioFile));
        currentAudioName = audioFile.webkitRelativePath;  // Track the current audio file name        

        PlayMusic();  // Start playing the new music
        updateMusicViewer(iconFile);  // Update music viewer with the provided icon
        playedTracks.push(audioFile);  // Track played files for previous navigation
    } catch (error) {
        console.error("Error playing audio: ", error.message);
    }
}

function PlayMusic() {
    if (currentAudio) {
        if (musicViewer) {
            let src = '';

            // Check if the audio is paused or playing
            if (currentAudio.paused) {
                currentAudio.play();  // Play the audio
                src = 'images/Pause.png';  // Set the pause icon
            } else {
                currentAudio.pause();  // Pause the audio
                src = 'images/play.png';  // Set the play icon
            }

            // Update the viewer play button
            document.getElementById('viewerPlayButton').src = src;

            // Update all grid play buttons
            const allPlayButtons = document.querySelectorAll('.play-button');
            allPlayButtons.forEach(button => {
                if (currentAudioName === button.id) {
                    button.src = src;  // Set the corresponding button to pause or play
                } else {
                    button.src = 'images/play.png';  // Reset other buttons to play
                }
            });
        }

        // Handle first-time player initialization
        if (FirstTime) {
            document.querySelector('.music-viewer').classList.add('show');  // Show viewer UI
            const volumeSlider = document.getElementById('volumeSlider');
            currentAudio.volume = volumeSlider.value;  // Set the volume

            // Sync volume slider with the audio object
            currentAudio.addEventListener('volumechange', function () {
                const newVolume = currentAudio.volume;
                volumeSlider.value = newVolume;
                localStorage.setItem('volume', newVolume);  // Save volume setting
                updateSliderBackground(volumeSlider);
            });

            // Handle track end event
            currentAudio.addEventListener('ended', function () {
                console.log('Track ended, playing next...');
                playNextTrack();  // Play the next track automatically
                currentAudio.currentTime = 0;  // Reset track position
            });
            FirstTime = false;
        } else {
            currentAudio.volume = document.getElementById('volumeSlider').value;  // Set volume for subsequent plays
        }
    }
}


function playNextTrack() {
    const nextTrack = getNextTrackBasedOnPreferences();

    if (nextTrack) {
        console.log('Next track selected:', nextTrack.webkitRelativePath); // Log the webkitRelativePath of the next track
        
        const folderPath = nextTrack.webkitRelativePath;
        console.log('Folder path for the next track:', folderPath);
        
        // Check if the folder exists in the 'folders' object
        if (folders[folderPath]) {
            const iconFile = folders[folderPath].find(f => f.name === 'icon.png'); // Find the icon for the next track
            console.log('Icon file for the next track:', iconFile);
            
            PlayTheAudio(nextTrack, iconFile); // Play the next track
        } else {
            console.error('Folder not found in folders:', folderPath);
            currentAudio.currentTime = 0; // Reset current track if no next track is found
            PlayMusic(); // Play current track again
        }
    } else {
        console.log('No next track found. Repeating the current track.');
        currentAudio.currentTime = 0; // Reset current track if no next track is found
        PlayMusic(); // Play current track again
    }
}

function getNextTrackBasedOnPreferences() {
    const allTracks = [...Object.values(folders || [])].flat(); // Flatten all tracks from folders
    if (!allTracks || allTracks.length === 0) return null; // If there are no tracks, return null

    // Shuffle the track list to randomize selection
    const shuffledTracks = allTracks.sort(() => Math.random() - 0.5);

    let preferredTracks = [];

    console.log('Current track metadata: ', {
        genre: currentAudio.genre,
        author: currentAudio.author,
        year: currentAudio.year
    });

    // Preference 1: Same genre and author
    preferredTracks = shuffledTracks.filter(track => track.genre === currentAudio.genre && track.author === currentAudio.author);
    if (preferredTracks.length > 0) {
        console.log('Using preference: Same genre and author');
        return preferredTracks[0];
    }

    // Preference 2: Same genre
    preferredTracks = shuffledTracks.filter(track => track.genre === currentAudio.genre);
    if (preferredTracks.length > 0) {
        console.log('Using preference: Same genre');
        return preferredTracks[0];
    }

    // Preference 3: Same author
    preferredTracks = shuffledTracks.filter(track => track.author === currentAudio.author);
    if (preferredTracks.length > 0) {
        console.log('Using preference: Same author');
        return preferredTracks[0];
    }

    // Preference 4: Same decade (assuming you can get the year from the track)
    preferredTracks = shuffledTracks.filter(track => Math.floor(track.year / 10) === Math.floor(currentAudio.year / 10));
    if (preferredTracks.length > 0) {
        console.log('Using preference: Same decade');
        return preferredTracks[0];
    }

    // Preference 5: Random track
    console.log('Using preference: Random track');
    return shuffledTracks[0]; // If none of the above, just return any random track
}


// Function to play the previous track
function playPreviousTrack() {
    // Assuming you store a playback history
    const previousTrack = playedTracks.pop(); // Retrieve the last track from playback history
    if (previousTrack) {
        const iconFile = folders[previousTrack.folder].find(f => f.name === 'icon.png'); // Find the icon for the previous track
        PlayTheAudio(previousTrack, iconFile); // Play the previous track
    } else {
        console.log('No previous track found.');
        // Optionally, you can add logic to repeat the current song or handle empty history
    }
}

// Helper function to extract text content from files like Genre.txt, Author.txt, etc.
function getTextFileContent(files, fileName) {
    const file = files.find(f => f.name === fileName);
    if (file) {
        const reader = new FileReader();
        reader.readAsText(file);
        return file ? file.text().trim() : null;
    }
    return null;
}