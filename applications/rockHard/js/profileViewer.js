let shopUI = document.getElementById("shopUI");
let deckUI = document.getElementById("deckMenu");
let deckBtn = document.getElementById("deckBtn");
let gameUI = document.getElementById("ui");

function populateProfiles() {
    const allProfilesDiv = document.querySelectorAll("#profiles");

    for (let i = 0; i < allProfilesDiv.length; i++) {
        const profileDiv = allProfilesDiv[i];
        profileDiv.innerHTML = "";
        const profileContainer = document.createElement("div");
        profileContainer.classList.add("profile-container");

        for (let j = 0; j < allProfiles.length; j++) {
        const newLine = document.createElement("div");
        newLine.classList.add("profile-item");

        const inputText = document.createElement("input");
        inputText.type = "text";
        inputText.value = allProfiles[j].name;
        inputText.placeholder = "Profile name";

        // Save on Enter, revert on Escape
        inputText.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
            allProfiles[j].name = inputText.value;
            inputText.blur();
            } else if (e.key === "Escape") {
            inputText.value = allProfiles[j].name;
            inputText.blur();
            }
        });

        // Prevent blur if value has changed (forces user to commit or cancel)
        inputText.addEventListener("blur", () => {
            if (inputText.value !== allProfiles[j].name) {
            inputText.focus();
            }
        });

        // Handle selecting a new profile (no full re-render)
        newLine.addEventListener("click", () => {
            if (!allProfiles[j].iscurr) {
            // Remove "active" class from all, and reset iscurr
            document
                .querySelectorAll(".profile-item.active")
                .forEach((el) => el.classList.remove("active"));
            allProfiles.forEach((p) => (p.iscurr = false));

            // Activate this one
            allProfiles[j].iscurr = true;
            newLine.classList.add("active");
            inputText.focus();

            // Call your state setter if needed
            setCurrentProfile(j);
            }
        });

        newLine.appendChild(inputText);

        // Initial active state
        if (allProfiles[j].iscurr) {
            newLine.classList.add("active");
        }

        profileContainer.appendChild(newLine);
        }
        profileDiv.appendChild(profileContainer);
    }
}

function populateDeckUI() {
    if (!deckUI) return;
    const deck = deckUI.querySelector("#deck");
    deck.innerHTML = "";
    for (let i = 0; i < playerEntities.entities.length; i++) {
        const newLine = document.createElement("div");
        newLine.textContent = `${playerEntities.entities[i].name}, ${playerEntities.entities[i].amount}`;
        console.log(newLine);
        deck.appendChild(newLine);
    }
    for (let i = 0; i < playerEntities.specialEntities.length; i++) {
        const newLine = document.createElement("div");
        newLine.textContent = `${playerEntities.specialEntities[i].name}, ${playerEntities.specialEntities[i].amount}`;
        console.log(newLine);
        deck.appendChild(newLine);
    }
    console.log(deck);
}
