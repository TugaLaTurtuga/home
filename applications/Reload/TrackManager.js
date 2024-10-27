// Define global variables
let albumsPlayed = [''];
let currentGenre = '';
let albumsAlreadyPlayed = [];
let allAlbums = [];
let allAlbumsAudio = [];

// Function to play the next song
function playNextSong(currentAlbumName, folders) {
    console.log('Playing next music / Skipping music');
    for (const [folder, files] of Object.entries(folders)) {
        allAlbums.push(folder)
        allAlbumsAudio.push(getMusicFile(files));
    }

    // Shuffle albums
    const shuffleNumber = Math.random()
    allAlbums = shuffleArray(allAlbums, shuffleNumber);
    allAlbumsAudio = shuffleArray(allAlbumsAudio, shuffleNumber);
    const AudioFolder = currentAlbumName.split('/').slice(0, -1).join('/') // mimus the last part

    if (AudioFolder) {
        // Find and read Genre.txt from the album folder
        const genreFilePath = `${AudioFolder}/Genre.txt`;
        console.log("Reading genre file from: ", genreFilePath);

        readFile(genreFilePath, genre => {
            currentGenre = genre; // Assign the genre from the file
            console.log("Current genre: ", currentGenre);
        });
    } else {
        console.log("No album found matching the current one.");
    }

    albumsPlayed.push(currentAlbumName);
    console.log("Trying songs with same genre...");

    // Try songs from the same genre
    let i = 0
    for (const album of allAlbums) {
        const albumPath = getFolderPath(album); // get folder of the album
        const genreFilePath = `${albumPath}/Genre.txt`;

        // Read the Genre.txt file
        readFile(genreFilePath, genre => {
            if (genre === currentGenre && album !== currentAlbumName && !albumsPlayed.includes(album)) {
                albumsPlayed.push(albumsAlreadyPlayed[i]);
                console.log("Try nº: 1 succeeded");
                return playMusic(albumsAlreadyPlayed[i]); // play the found album
            }
        });
        ++i;
    }

    console.log("No more songs available in the selected genre. Trying others with same author...");

    // Try albums by the same author
    i = 0
    for (const album of allAlbums) {
        const albumPath = getFolderPath(album);
        const authorFilePath = `${albumPath}/Author.txt`;

        // Read Author.txt file
        readFile(authorFilePath, author => {
            if (author === currentAuthor && album !== currentAlbumName && !albumsPlayed.includes(album)) {
                albumsPlayed.push(albumsAlreadyPlayed[i]);
                console.log("Try nº: 2 succeeded");
                currentGenre = genre;
                return playMusic(albumsAlreadyPlayed[i]);
            }
        });
        ++i;
    }

    console.log("No more songs available in the selected author. Trying others with same genre but replayed...");

    // Reset albums played and retry with the same genre
    albumsPlayed = [currentAlbumName];
    i = 0;
    for (const album of allAlbums) {
        const albumPath = getFolderPath(album);
        const genreFilePath = `${albumPath}/Genre.txt`;

        // Read Genre.txt again
        readFile(genreFilePath, genre => {
            if (genre === currentGenre && album !== currentAlbumName) {
                albumsPlayed.push(allAlbumsAudio[i]);
                console.log("Try nº: 3 succeeded");
                return playMusic(allAlbumsAudio[i]);
            }
        });
        ++i;
    }

    console.log("No more songs available. Trying a random album...");

    // Finally, play a random album if no conditions match
    const randomAlbum = allAlbumsAudio.find(album => album !== currentAlbumName);
    if (randomAlbum) {
        albumsPlayed.push(randomAlbum);
        console.log("Try nº: 5 succeeded");
        return playTheAudio(randomAlbum, 'Images/Reload.png');
    }

    console.log("No more songs available. Playing the same album...");
    return playTheAudio(currentAlbumName, 'Images/Reload.png');
}

// Function to play the previous song
function playBeforeSong() {
    if (albumsAlreadyPlayed.length > 0) {
        const previousAlbum = albumsAlreadyPlayed[albumsAlreadyPlayed.length - 2];
        if (previousAlbum && previousAlbum !== currentAlbumName) {
            console.log(`Music currently being played: ${currentAlbumName}`);
            console.log(`Changing it to: ${previousAlbum}`);
            albumsAlreadyPlayed.pop();
            return playMusic(previousAlbum);
        } else {
            console.log("Could not find any songs played before.");
        }
    }
}

// Helper function to get the path of the folder (browser-specific)
function getFolderPath(file) {
    // This could depend on how you're retrieving the albums (for example, using File API)
    return file.webkitRelativePath ? file.webkitRelativePath.split('/')[0] : file.name;
}

// Function to play the music file
function playMusic(album) {
    console.log(`Playing album: ${album}`);
    // Add your logic to play the music (e.g., create an <audio> element, etc.)
}

// Helper function to shuffle an array
function shuffleArray(array, rNum) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(rNum * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Helper function to read text files (Genre.txt, Author.txt)
function readFile(filePath, callback) {
    fetch(filePath)
        .then(response => response.text())
        .then(text => callback(text))
        .catch(error => console.error('Error reading file:', error));
}

function getMusicFile(folder) {
    return folder.find(f => f.name.endsWith('.mp3'));;
}
