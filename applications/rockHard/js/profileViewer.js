function populateProfiles() {
    const allProfilesDiv = document.querySelectorAll("#profiles");

    console.log(allProfilesDiv);

    for (let i = 0; i < allProfilesDiv.length; i++) {
        const profileDiv = allProfilesDiv[i];
        profileDiv.innerHTML = "";
        const profileContainer = document.createElement("div");
        profileContainer.classList.add("profile-container");
        for (let j = 0; j < allProfiles.length; j++) {
            const newLine = document.createElement("div");
            newLine.classList.add("profile-item");

            if (allProfiles[j].iscurr) {
                newLine.classList.add("active");
            }

            newLine.textContent = allProfiles[j].name;

            newLine.addEventListener('click', () => {
                setCurrentProfile(j);
                populateProfiles();
            }, { once: true });

            profileContainer.appendChild(newLine);
        }
        profileDiv.appendChild(profileContainer);
    }
}

function populateDeckUI() {
  const deck = deckUI.querySelector("#deck");
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
