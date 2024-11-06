// Set the version name to the last changelog name on page load
function setInitialVersionName() {
    fetch("CH/ChangeLogs.json")
        .then(response => response.json())
        .then(data => {
            // Find the last changelog entry with a valid name
            const latestIndex = data.findLastIndex((entry) => entry.name);
            if (latestIndex !== -1) {
                // Set VersionName to the last changelog's name
                document.getElementById('VersionName').innerText = data[latestIndex].name;
            }
        })
        .catch(error => console.error("Error loading version name:", error));
}

function loadChangeLogs() {
    fetch("CH/ChangeLogs.json")
        .then(response => response.json())
        .then(data => {
            const contentDiv = document.getElementById("changelog-content");
            const sidebar = document.getElementById("sidebar");

            // Function to show a specific changelog entry
            function showChangeLog(index) {
                const changeLog = data[index];
                contentDiv.innerHTML = ''; // Clear previous content

                const title = document.createElement("h2");
                title.textContent = changeLog.name;

                const subtitle = document.createElement("h6");
                subtitle.textContent = changeLog.Subtitle;

                const description = document.createElement("p");
                description.innerHTML = changeLog.Description.replace(/-/g, "<br>-");

                contentDiv.appendChild(title);
                contentDiv.appendChild(subtitle);
                contentDiv.appendChild(description);
            }

            // Clear sidebar and add a button for each changelog item with a valid name
            sidebar.innerHTML = ''; // Clear existing buttons if any
            data.forEach((changeLog, index) => {
                if (!changeLog.name) return; // Skip if 'name' is missing or empty

                const button = document.createElement("button");
                button.classList.add("changelog-btn");
                button.textContent = changeLog.name;

                // Show the corresponding changelog on button click
                button.onclick = () => showChangeLog(index);

                sidebar.appendChild(button);
            });

            // Show the most recent changelog entry with a valid name by default
            const latestIndex = data.findLastIndex((entry) => entry.name);
            if (latestIndex !== -1) {
                showChangeLog(latestIndex); // Show latest entry in changelog content
            }
        })
        .catch(error => console.error("Error loading changelogs:", error));
}

// Toggle visibility of the changelog container
function SeeChangeLogs() {
    const settingsDiv = document.getElementById("CH");
    if (settingsDiv.classList.contains("show")) {
        settingsDiv.classList.remove("show");
    } else {
        loadChangeLogs(); // Load changelogs when showing
        settingsDiv.classList.add("show");
    }

    // Select the .changelog-sidebar element
    const changelogSidebar = document.querySelector('.changelog-sidebar');

    // Add an event listener for the wheel event
    changelogSidebar.addEventListener('wheel', function(event) {
        // Prevent the default vertical scroll behavior
        event.preventDefault();

        // Scroll horizontally by the amount of vertical scroll (event.deltaY)
        changelogSidebar.scrollLeft += event.deltaY;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setInitialVersionName(); // Set initial version name on page load
    document.addEventListener('keydown', function(event) {
        if ((event.ctrlKey || event.metaKey) && (event.shiftKey || event.altKey) && event.code === 'KeyC') {
            SeeChangeLogs();
            event.preventDefault();
        }
    });
});
