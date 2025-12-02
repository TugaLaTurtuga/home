const EasyNavDiv = document.getElementById('EasyNav');

function PutEasyNav() {
    if (SettingsVariables.EasyNav) {
        EasyNavDiv.innerHTML = `
        <div id="ENSlider" class="Globalbutton-container" style="margin-top: 0px; margin-bottom: -20px; overflow-x: scroll; ">
            <button id="TopBtn1" class="EasyNavbutton" onclick="ScrollToCasinoGame(1); playSoundAffect('click', 1)">Poker</button>
            <span class="Globalseparator">|</span>
            <button id="TopBtn2" class="EasyNavbutton" onclick="ScrollToCasinoGame(2); playSoundAffect('click', 1)">Roulette</button>
            <span class="Globalseparator">|</span>
            <button id="TopBtn2" class="EasyNavbutton" onclick="ScrollToCasinoGame(3); playSoundAffect('click', 1)">Slots</button>
            <span class="Globalseparator">|</span>
            <button id="TopBtn2" class="EasyNavbutton" onclick="ScrollToCasinoGame(4); playSoundAffect('click', 1)">Scratch Cards</button>
            <span class="Globalseparator">|</span>
            <button id="TopBtn2" class="EasyNavbutton" onclick="ScrollToCasinoGame(5); playSoundAffect('click', 1)">Blackjack</button>
            <span class="Globalseparator">|</span>
            <button id="TopBtn2" class="EasyNavbutton" onclick="ScrollToCasinoGame(6); playSoundAffect('click', 1)">Lotteries</button>
        </div>
        `
    
        // Select the .changelog-sidebar element
        const ENSidebar = document.querySelector('#ENSlider');
    
        // Add an event listener for the wheel event
        ENSidebar.addEventListener('wheel', function(event) {
            // Prevent the default vertical scroll behavior
            event.preventDefault();
    
            // Scroll horizontally by the amount of vertical scroll (event.deltaY)
            ENSidebar.scrollLeft += event.deltaY;
        });
    } else {
        EasyNavDiv.innerHTML = '';
    }
}
PutEasyNav();

function ScrollToCasinoGame(Place) {
    Place = parseInt(Place);
    switch (Place) {
        case 1:
            ScrollTo(document.getElementById('Poker'));
            return;
        case 2:
            ScrollTo(document.getElementById('Roulette'));
            return;
        case 3:
            ScrollTo(document.getElementById('Slots'));
            return;
        case 4:
            ScrollTo(document.getElementById('ScratchCards'));
            return;
        case 5:
            ScrollTo(document.getElementById('Blackjack'));
            return;
        case 6:
            ScrollTo(document.getElementById('Lotteries'));
            return;    
        default:
            return;   
    }
}

function ScrollTo(targetElement) {
    event.preventDefault();
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 110; //offset

    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}