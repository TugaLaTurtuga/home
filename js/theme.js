let theme = null;

function saveTheme() {
    localStorage.setItem("_theme", theme);
}

function loadTheme() {
    theme = localStorage.getItem("_theme");
    if (theme === null || theme === undefined) {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (isDark) {
            setTheme("dark");
        }
    } else {
        setTheme();
    }
}

async function getAllThemes() {
    const themesCSSPath = buildRootPath() + "css/theme.css";

    try {
        const response = await fetch(themesCSSPath);
        const data = await response.text();

        const themeMatches = data.match(/\[theme="(.*?)"\]/g) || [];

        const themeNames = themeMatches.map(match =>
            match.replace('[theme="', '').replace('"]', '')
        );

        console.log("Themes found:", themeNames);

        return ["default", ...themeNames];
    } catch (error) {
        console.error("Error loading themes:", error);
        return [];
    }
}

function setTheme(name, save = true) {
    if (name) {
        theme = name;
    }
    if (save) saveTheme();
    document.body.setAttribute("theme", theme);
}

async function loadThemesIntoSelect() {
    try {
        const select = document.getElementById("allThemes");
        const themes = await getAllThemes();

        select.addEventListener("change", function () {
            setTheme(this.value);
        });
        
        select.innerHTML = "";

        themes.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            if (name === theme) option.selected = true;
            select.appendChild(option);
        });
    } catch(err) {
        return;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    loadTheme();
    loadThemesIntoSelect();
});
