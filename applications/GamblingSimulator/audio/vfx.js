const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

const vfxAudioPath = 'audio/vfx/';
const vfx = {
    click: ['click.wav', 1],
    jobPurchase: ['buy.wav', 10],
    jobSell: ['error.wav', 1],
    bankrupt: ['bankrupt.wav', 1],
    warning: ['warning.wav', 1],
    saveChanges: ['buy.wav', 10],
    gameJackpot: ['gameJackpot.wav', 1],
    gameBonus: ['gameBonus.wav', 1],
    gameError: ['gameError.wav', 1],
};

// Pitch sequence (like chord progression)
const notes = [1, 1.1, 1.2, 1.25, 1.2, 1.1];
let currentNoteIndex = 0;

// Cache for decoded buffers
const audioBuffers = {};

async function loadSound(eventType) {
    const fileName = vfx[eventType]?.[0];
    if (!fileName) {
        console.warn(`Unknown eventType: "${eventType}"`);
        return null;
    }

    if (!audioBuffers[eventType]) {
        const response = await fetch(vfxAudioPath + fileName);
        const arrayBuffer = await response.arrayBuffer();
        const decoded = await audioCtx.decodeAudioData(arrayBuffer);
        audioBuffers[eventType] = decoded;
    }

    return audioBuffers[eventType];
}

function createDistortionCurve(amount = 50) {
    const k = typeof amount === 'number' ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
        const x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
}

async function playSoundAffect(eventType, distortion = 0, volume = 0) {
    const buffer = await loadSound(eventType);
    if (!buffer) return;

    let [_, volumeMultiplier = 1] = vfx[eventType];
    if (volume > 0) {
        volumeMultiplier = volume;
    }
    volumeMultiplier *= SettingsVariables.SFXVolume;
    console.log(`Volume multiplier for ${eventType}: ${volumeMultiplier}`);

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;

    const playbackRate = distortion > 0 ? distortion : notes[currentNoteIndex];
    console.log(`Playing sound: ${eventType}, playbackRate: ${playbackRate}, volume: ${volumeMultiplier}`);
    source.playbackRate.setValueAtTime(playbackRate, audioCtx.currentTime);

    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(volumeMultiplier, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);

    // Optional distortion
    let lastNode = gainNode;
    if (distortion > 0) {
        const distortionNode = audioCtx.createWaveShaper();
        distortionNode.curve = createDistortionCurve(distortion * 50);
        distortionNode.oversample = '4x';
        source.connect(distortionNode).connect(gainNode);
    } else {
        source.connect(gainNode); // ✅ THIS LINE WAS MISSING
    }

    lastNode.connect(audioCtx.destination);

    source.start();
    source.stop(audioCtx.currentTime + 0.2);

    currentNoteIndex = (currentNoteIndex + 1) % notes.length;
}

function createDistortionCurve(amount = 50) {
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
        const x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }
    return curve;
}
