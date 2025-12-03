let changeLogs = {};

function showChangeLog() {
    const overlay = document.getElementById("overlay");
    let isVisible = overlay.getAttribute("isVisible") === "true";
    if (isVisible) {
        overlay.style.display = "flex";
        const cleanup = () => {
            document.removeEventListener("keydown", onKeyDown);
            overlay.setAttribute("isVisible", isVisible);
            overlay.style.display = "none";
        };

        const onKeyDown = (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                cleanup();
            }
        };

        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                cleanup();
            }
        });

      document.addEventListener("keydown", onKeyDown);
    } else {
      overlay.style.display = "none";
    }
    overlay.setAttribute("isVisible", !isVisible);
}

async function loadChangeLogs() {
    let version = "";
    const changeLogsSidebar = document.querySelector(".change-logs-container");

    await fetch(`blogs/${blog}/changeLogs.json`)
        .then(res => res.text())
        .then(data => {
            changeLogs = JSON.parse(data);
            const values = Object.values(changeLogs);
            const first = values[0];
            const date = first.date;
            document.querySelector(".Hello_Text").textContent = date;
        })
        .catch(() => {
            document.querySelector(".Hello_Text").textContent = "";
        });

    // Get all version keys, sort descending (latest first)
    const versions = Object.keys(changeLogs).sort((a, b) => {
        // Split into numbers and compare
        const parse = (v) => v.split(".").map(Number);
        const [a1, a2, a3] = parse(a);
        const [b1, b2, b3] = parse(b);

        if (a1 !== b1) return b1 - a1;
        if (a2 !== b2) return b2 - a2;
        return b3 - a3;
    });

    for (const key of versions) {
        if (changeLogs[key].done) {
            const changeLogDiv = document.createElement("div");
            changeLogDiv.classList.add("change-logs-item");
            changeLogDiv.id = `change-logs-item-${key}`;
            changeLogDiv.textContent = key;
            changeLogDiv.onclick = () => {
                changeChangeLog(key);
            };
            changeLogsSidebar.appendChild(changeLogDiv);

            // set version only the first time (latest one)
            if (version === "") {
                version = key;
            }
        }
    }

    document.getElementById("version").textContent = version;
    changeChangeLog(version);
}

function changeChangeLog(key) {
  const sidebarItem = document.getElementById(`change-logs-item-${key}`);

  // remove active from all
  document.querySelectorAll(".change-logs-item").forEach((item) => {
    item.classList.remove("active");
  });

  if (sidebarItem) {
    sidebarItem.classList.add("active");

    // now update the main log area
    const changeLogContainer = document.querySelector(".change-log");
    const changeLogTitle = document.querySelector(".change-log-title");
    const changeLogDate = document.querySelector(".change-log-date");
    const changeLogContent = document.querySelector(".change-log-content");

    if (changeLogTitle)
      changeLogTitle.textContent = changeLogs[key].name || key;
    if (changeLogDate) changeLogDate.textContent = changeLogs[key].date || "";
    if (changeLogContent) {
      changeLogContent.innerHTML = "";
      const logs = changeLogs[key].logs.split("\n");
      logs.forEach((log) => {
        let text = log.trim();
        if (!text) return; // skip empty entries

        // capitalize first letter
        text = text.charAt(0).toUpperCase() + text.slice(1);

        const logElement = document.createElement("div");
        logElement.textContent = text;
        changeLogContent.appendChild(logElement);
        spacer = document.createElement("div");
        spacer.className = "spacer";
        changeLogContent.appendChild(spacer);
      });
    }
  }
}

document.getElementById("openRepo").addEventListener("click", () => {
    window.open("https://github.com/TugaLaTurtuga/home/tree/main/blogs")
});