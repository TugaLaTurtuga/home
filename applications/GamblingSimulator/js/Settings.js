// TODO: Settings && Audio (Beta 1.3)
let hasEasyNavEnabled = true;
let PlayGames = true;
let FXVolume = 0;
let MusicVolume = 0;

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

if (hasTouchScreen) hasEasyNavEnabled = true // make the EasyNav enabled by default in mobile

document.addEventListener('keydown', function(event) {
    if ((event.ctrlKey || event.metaKey) && (event.key === ',' || event.key === ';' || event.key === '.')) {
        SeeSettings()
    }
});

function SeeSettings() {
    const settingsElement = document.querySelector('#Settings');
    if (settingsElement.classList.contains('show')) {
        settingsElement.classList.remove('show');
    } else {
        if (payingLoan || IsTakingLTD) {
            updateBank();
        }

        settingsElement.classList.add('show');
    }

    const buttons = document.querySelectorAll('.Globalbutton');
    if (!Array.from(buttons).some(button => button.classList.contains('highlight'))) {
        buttons[0].classList.add('highlight');
    }
}