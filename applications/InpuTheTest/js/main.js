const typewriterContainer = document.getElementById('typewriter-container');
const restartBtn = document.getElementById('restart-btn');
const inpText = document.getElementById('inp');
// Global AudioContext (to avoid Chrome blocking sound)
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let soundBuffer = null;
// Preload the typing sound
fetch('sound/vfx/0.mp3')
    .then(response => response.arrayBuffer())
    .then(data => audioContext.decodeAudioData(data))
    .then(buffer => {
        soundBuffer = buffer;
    })
    .catch(error => console.error('Error loading sound:', error));
    const deletedChars = []; // Store deleted characters for undo functionality


let numKeydown = 0;
let difNumKeydown = 0;
const kp = document.getElementById('kp');
const kpd = document.getElementById('kpd');
const pressedKeys = new Set();
const difPressedKeys = new Set();

document.addEventListener('keyup', (event) => {
    pressedKeys.delete(event.key);
});

document.addEventListener('keydown', async function (event) {
    let key = event.key;
    
    if (!pressedKeys.has(key)) {
        pressedKeys.add(key);
        ++numKeydown;
        kp.textContent = `Keys pressed: ${numKeydown}`;

        if (!difPressedKeys.has(key) && key !== 'Dead') {
            difPressedKeys.add(key);
            ++difNumKeydown;
            kpd.textContent = `Dif keys pressed: ${difNumKeydown}`;
        }
    }

    // Prevent all default actions (including shortcuts)
    if (event.ctrlKey || event.altKey || event.metaKey) {
        event.preventDefault();
    }
    // Ensure AudioContext is running (fixes Chrome issue)
    if (audioContext.state === 'suspended') {
        await audioContext.resume();
    }
    
    let deleting = false;
    if (key === 'Backspace') {
            handleBackspace();
            deleting = true;
    } else {
        handleKeyRestoration();
        if (key !== 'Dead') {
            if (key === ' ') {
                addCharacter('Space');
            } else if (key) {
                addCharacter(key);
            }
        }
    }
    playTypeSound(deleting);
    selectInp();
});
// Ensure the hidden input is always selected
function selectInp() {
    inpText.focus();
}
// Handle input event to capture characters from dead keys
const deadKeyChars = ['~', '^', '´', '`', '"'];
inpText.addEventListener('input', () => {
    const char = inpText.value[0] || '';;
    inpText.value = '';
    // Only add the character if it is a recognized dead key
    if (deadKeyChars.includes(char)) {
        addCharacter(char);

        if (!difPressedKeys.has(char)) {
            difPressedKeys.add(char);
            ++difNumKeydown;
            kpd.textContent = `Dif keys pressed: ${difNumKeydown}`;
        }
    }
});

function createNewLine() {
    const newLine = document.createElement('div');
    newLine.classList.add('typewriter-line');
    typewriterContainer.prepend(newLine); // Adds at the top
    typewriterContainer.scrollTop = 0; // Keep scroll position at the top
    fadeOutOldLines();
}

function addCharacter(char) {
    let lines = document.querySelectorAll('.typewriter-line');
    if (lines.length === 0) {
        createNewLine();
        lines = document.querySelectorAll('.typewriter-line');
    }
    let currentLine = lines[0]; // Select the latest line (due to column-reverse)
    const charSpan = document.createElement('span');
    charSpan.classList.add('typed-char');
    charSpan.textContent = char;
    currentLine.appendChild(charSpan);
    // Ensure character appears
    setTimeout(() => {
        charSpan.style.transform = 'translateY(0px)';
        charSpan.style.opacity = 1;
    }, 10);
    // If line overflows, create a new one
    if (currentLine.getBoundingClientRect().width >= document.body.getBoundingClientRect().width - 50) {
        currentLine.removeChild(charSpan);
        createNewLine();
        lines = document.querySelectorAll('.typewriter-line');
        currentLine = lines[0]; // Select latest again
        currentLine.appendChild(charSpan);
    }
    typewriterContainer.scrollTop = typewriterContainer.scrollHeight;
}
// Function to fade out characters in lines older than 5
function fadeOutOldLines() {
    let lines = document.querySelectorAll('.typewriter-line');
    for (let i = 0; i < lines.length; ++i) {
        if (i >= 5 && lines[i].style.opacity !== 1) {
            
            setTimeout(() => {
                lines[i].style.opacity = 0;
                lines[i].style.transform = 'translateY(-100px)';
                setTimeout(() => {
                    typewriterContainer.removeChild(lines[i])
                }, 300)
            }, 300)
        }
    }
}
function handleBackspace() {
    let lines = document.querySelectorAll('.typewriter-line');
    if (lines.length === 0) return;
    // Start checking from the last line and move upwards if needed
    for (let lineIndex = 0; lineIndex < 5; ++lineIndex) {
        let currentLine = lines[lineIndex];
        const characters = currentLine.querySelectorAll('.typed-char');
        for (let i = characters.length - 1; i >= 0; i--) {
            if (characters[i].style.opacity === "" || characters[i].style.opacity === "1") {
                characters[i].style.opacity = 0; // Hide it
                characters[i].style.transform = 'translateY(20px)';
                deletedChars.push({ element: characters[i], parent: currentLine });
                return;
            }
        }
        // If the current line is empty after checking, remove it
        if (characters.length === 0 && lines.length > 1) {
            typewriterContainer.removeChild(currentLine);
        }
    }
}
// Restores deleted characters when a new key is pressed
function handleKeyRestoration() {
    while (deletedChars.length > 0) {
        const { element, parent } = deletedChars.pop();
        parent.removeChild(element)
    }
}
// Play typewriter sound with C chord effect
let playIndex = 0;
// C, E, G
const chordPitches = [5, 6.26, 5.5];
const chordPitchesDel = [5.5, 4.26, 5];

const gainNode = audioContext.createGain();
gainNode.gain.value = 0.5;      
function playTypeSound(del = false) {
    if (!soundBuffer) return; // Don't play if sound isn't loaded
    let chords = chordPitches;
    if (del) { chords = chordPitchesDel } 
    const pitch = chords[playIndex]
    const source = audioContext.createBufferSource();
    source.buffer = soundBuffer;
    source.playbackRate.value = pitch; // Adjust playback speed for pitch shift
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.start();
    playIndex++;
    if (playIndex >= chordPitches.length) { playIndex = 0; }
}
// Restart button functionality
restartBtn.addEventListener('click', function () {
    typewriterContainer.innerHTML = '';
});
