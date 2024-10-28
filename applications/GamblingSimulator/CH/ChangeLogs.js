// ChangeLogs.js
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

                const description = document.createElement("p");
                description.innerHTML = changeLog.Description.replace(/-/g, "<br>-");

                contentDiv.appendChild(title);
                contentDiv.appendChild(description);
            }

            // Clear sidebar and add a button for each changelog item
            sidebar.innerHTML = ''; // Clear existing buttons if any
            data.forEach((changeLog, index) => {
                const button = document.createElement("button");
                button.classList.add("changelog-btn");
                button.textContent = changeLog.name;

                // Show the corresponding changelog on button click
                button.onclick = () => showChangeLog(index);

                sidebar.appendChild(button);
            });

            // Show the most recent changelog entry by default
            showChangeLog(data.length - 1);
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
}
