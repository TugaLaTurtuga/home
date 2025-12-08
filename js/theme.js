let theme = null;

const darkMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
function saveTheme(newTheme) {
    console.log("Saved theme:", newTheme ?? theme)
    localStorage.setItem("_theme", newTheme ?? theme);
}

function loadTheme() {
    theme = localStorage.getItem("_theme");
    if (theme === null || theme === undefined) {
        setTheme("system");
    } else {
        setTheme(theme, false);
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

        return ["system", "default", ...themeNames];
    } catch (error) {
        console.error("Error loading themes:", error);
        return [];
    }
}

function setTheme(name, save = true) {
    if (name) {
        theme = name;
        if (save) saveTheme(name);
    }
    
    let themeSet = theme;
    if (theme === "system") { // dark or light
        const isDark = darkMediaQuery.matches;
        if (isDark) {
            themeSet = "dark";
        } else {
            themeSet = "default";
        }
    }

    document.body.setAttribute("theme", themeSet);
}

darkMediaQuery.addEventListener("change", (e) => {
    isDark = e.matches;
    if (theme === "system") {
        setTheme();
    }
});

async function loadThemesIntoSelect() {
    try {
        const select = document.getElementById("allThemes");
        const themes = await getAllThemes();

        select.addEventListener("change", function () {
            setTheme(this.value);
        });
        
        select.innerHTML = "";

        let noThemeSelected = true;
        themes.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            if (name === theme) {
                option.selected = true; 
                noThemeSelected = false;
            } 
            select.appendChild(option);
        });

        if (noThemeSelected) {
            setTheme("system");
        }
    } catch(err) {
        return;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    loadTheme();
    loadThemesIntoSelect();
});
