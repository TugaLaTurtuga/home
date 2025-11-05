let allProfiles = [
    {
        name: "profile 1",
        data: {},
        iscurr: true,
    },
    {
        name: "profile 2",
        data: {},
        iscurr: false,
    },
    {
        name: "profile 3",
        data: {},
        iscurr: false,
    },
]

let currProfile = {};

function loadData() {
    const savedData = localStorage.getItem('_rockHardData');

    if (Array.isArray(savedData)) {
        allProfiles = savedData;
    } else {
        // there is no data saved
        saveData()
    }
}

function saveData() {
    localStorage.setItem('_rockHardData', allProfiles);
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
