let firstShowModalElementsRun = true;
function showModalElements(id) {
    const modal = document.querySelector(".modal");
    Array.from(modal.children).forEach(div => {
        if (firstShowModalElementsRun) {
            const originalDisplay =
                getComputedStyle(div).display || "block";
            div.setAttribute("display", originalDisplay);
        }

        if (div.id === id) {
            div.style.display = div.getAttribute("display");
        } else {
            div.style.display = "none";
        }
    });
    firstShowModalElementsRun = false;
}

function showOverlay() {
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

function showChangeLog() {
    showModalElements("changeLogs");
    showOverlay();
}

function showSettings() {
    showModalElements("settings");
    showOverlay();
}