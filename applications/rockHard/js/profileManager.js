let allProfiles = [
    {
        name: "Profile 1",
        data: {},
        iscurr: true,
    },
    {
        name: "Profile 2",
        data: {},
        iscurr: false,
    },
    {
        name: "Profile 3",
        data: {},
        iscurr: false,
    },
]

let currProfile = {};

function saveData() {
  localStorage.setItem('_rockHardData', JSON.stringify(allProfiles));
  const savedData = localStorage.getItem('_rockHardData');
  console.log("Saved data:", savedData);
}

function loadData() {
  const savedData = localStorage.getItem('_rockHardData');
  console.log("Raw data from storage:", savedData);

  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      if (Array.isArray(parsed)) {
        allProfiles = parsed;
        console.log("Loaded profiles:", allProfiles);
      } else {
        console.warn("Saved data is not an array, resetting...");
        saveData();
      }
    } catch (e) {
      console.error("Failed to parse saved data:", e);
      saveData();
    }
  } else {
    // No data saved yet
    console.log("No saved data found, creating default...");
    saveData();
  }
  reloadUI();
}

function deleteData() {
    if (confirm("Are you sure you want to delete all your data? This change is unreversable.")) {
        localStorage.removeItem('_rockHardData');
        window.location.reload();
    }
}

loadData();

function reloadUI() {
    const functionNames = ["populateDeckUI", "populateProfiles"];

    for (let i = 0; i < functionNames.length; i++) {
        const fn = window[functionNames[i]];
        if (typeof fn === "function") {
            fn();
        }
    }
}



function getCurrentProfile() {
    for (let i = 0; i < allProfiles.length; i++) {
        if (allProfiles[i].iscurr) {
            currProfile = allProfiles[i];
            return;
        }
    }

    // there is no curr profile, select a random one
    const randomProfile = Math.floor(Math.random() * allProfiles.length);
    allProfiles[randomProfile].iscurr = true;
    currProfile = allProfiles[randomProfile];
    return;
}

function setCurrentProfile(profile) {
    for (let i = 0; i < allProfiles.length; i++) {
        allProfiles[i].iscurr = false;
    }

    if (typeof profile === 'number') {
        if (profile < allProfiles.length) {
            currProfile = allProfiles[profile];
            allProfiles[profile].iscurr = true;
        } else {
            // create a new one
            allProfiles.push({
                name: `profile ${allProfiles.length}`,
                data: {},
                iscurr: true,
            })

            currProfile = allProfiles[allProfiles.length - 1]
        }
        return;
    } else {
        for (let i = 0; i < allProfiles.length; i++) {
            if (profile.trim().toLowerCase() === allProfiles[i].name.trim().toLowerCase()) {
                currProfile = allProfiles[i];
                allProfiles[i].iscurr = true;
                return;
            }
        }

        // there is none with the profile name, so create one with that name
        allProfiles.push({
            name: profile,
            data: {},
            iscurr: true,
        })

        currProfile = allProfiles[allProfiles.length - 1]

        return;
    }
}

function addProfile(name) {
    if (name === null || !name) {
        name = `Profile ${allProfiles.length + 1}`;
    }

    for (let i = 0; i < allProfiles.length; i++) {
        allProfiles[i].iscurr = false;
    }

    allProfiles.push({
        name,
        data: {},
        iscurr: true,
    })

    populateProfiles();
}
