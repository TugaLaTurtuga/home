let defaultRootPath = "";

function buildRootPath() {
    const hrefParts = location.href
        .replace(location.origin, "")
        .split("?")[0]
        .split("/")
        .filter(Boolean)
    let rootPath = "";

    let istart = 0;
    if (hrefParts[0] === "home") {
        istart = 1;
    }

    for (let i = istart; i < hrefParts.length; i++) {
        rootPath += "../";
    }
    return rootPath;
}

function adjustPadding(div, img) {
    const aspectRatio = window.innerWidth / window.innerHeight;

    div.style.padding = '5px';

    if (aspectRatio > 1) {
        const maxPadding = parseFloat(getComputedStyle(div).width);
        div.style.paddingLeft = `${Math.min(img.width + 10, maxPadding)}px`;
    } else {
        const maxPadding = parseFloat(getComputedStyle(div).height);
        div.style.paddingTop = `${Math.min(img.height + 10, maxPadding)}px`;
    }
}

function parseBlogSettings(mdResText) {
    const blogSettings = {};
    const lines = mdResText.split("\n");

    let i = 0;
    while (i < lines.length) {
        const line = lines[i].trim();
        const [key, value] = line.split("=");

        if (key && value) {
            if (isInQuotes(value)) {
                blogSettings[key.trim()] = value.trim().slice(1, -1); // remove quotes
            } else if (startsWithQuotes(value)) {
                let theValue = value.trim().slice(1) + '\n'; // remove first quote
                i++; // goes to next line
                while (i < lines.length) {
                    const aLine = lines[i].trim();
                    if (!endsWithQuotes(aLine)) {
                        theValue += aLine + '\n';
                    } else {
                        theValue += aLine.slice(0, -1); // remove last quote
                        break;
                    }
                    i++;
                }
                blogSettings[key.trim()] = theValue;
            } else {
                blogSettings[key.trim()] = value.trim();
            }
        } else if (line === '') {
            // continue
        } else {
            break;
        }
        i++;
    }

    // The rest is the real markdown content
    const cleanedMarkdown = lines.slice(i).join("\n").trimStart();

    return { blogSettings, cleanedMarkdown };
}

function isInQuotes(str) {
    return startsWithQuotes(str) && endsWithQuotes(str);
}

function startsWithQuotes(str) {
    str = str.trim();
    if (str.startsWith('"') || str.startsWith("'") || str.startsWith('`') ) {
        return true;
    } else {
        return false;
    }
}

function endsWithQuotes(str) {
    str = str.trim();
    if (str.endsWith('"') || str.endsWith("'") || str.endsWith('`') ) {
        return true;
    } else {
        return false;
    }
}

const blogs = [
    'blogs/blogs/test',
];

async function FindBlogs() {
    const allBlogs = await Promise.all(
        blogs.map(async (subpage) => {
            if (typeof subpage === "string") {
                subpage = {
                    name: subpage,
                    displayText: null,
                }
            }
            const name = buildRootPath() + subpage.name;
            let theme = null;
            let description = null;
            let displayText = subpage.displayText;
            let blogMD = null;

            try {
                const res = await fetch(`${name}/blog.md`);
                const data = await res.text();
                const parsed = parseBlogSettings(data);
                blogMD = parsed.cleanedMarkdown;

                if (parsed.blogSettings.name) {
                    displayText = parsed.blogSettings.name;
                }

                if (parsed.blogSettings.theme) {
                    theme = parsed.blogSettings.theme;
                }

                if (parsed.blogSettings.description) {
                    description = parsed.blogSettings.description;
                }
            } catch (e) {
                // blog doens't exist
                return null;
            }

            if (!displayText) {
                // fall back: use the first line of the blog
                displayText = blogMD.split("\n")[0];
            }

            // Build URL params
            const params = new URLSearchParams({
                blog: subpage.name.split("/").pop(),
                name: displayText,
            });

            return {
                name,
                params,
                displayText,
                theme,
                description,
            };
        }).filter(Boolean)  // remove null entries
    );

    buildBlogGrid(allBlogs);
}

function buildBlogGrid(allBlogs) {
    const gridContainer = document.getElementById("grid-container-blog");
    gridContainer.innerHTML = "";

    allBlogs.forEach(blog => {
        const div = document.createElement("div");
        div.className = "grid-item blog";

        const img = document.createElement("img");
        img.src = `${blog.name}/icon.png`;
        img.className = "grid-icon";
        img.onclick = () => {
            window.open(`${buildRootPath()}blogs/?${blog.params.toString()}`, "_parent");
        };

        const text = document.createElement("div");
        text.className = "title";
        text.textContent = blog.displayText;

        const subtext = document.createElement("div");
        subtext.className = "subtext";

        // Description
        if (blog.description) {
            subtext.textContent = blog.description;
        } else {
            subtext.textContent = "";
            subtext.style.display = "none";
        }
        

        // Last updated date
        const dateText = document.createElement("div");
        dateText.className = "subtext date";
        fetch(`${blog.name}/changeLogs.json`)
            .then(r => r.json())
            .then(json => {
                const first = Object.values(json)[0];
                dateText.textContent = first?.date || "";
            })
            .catch(() => dateText.textContent = "");

        // Theme
        const themeText = document.createElement("div");
        themeText.className = "theme";
        themeText.style.display = blog.theme ? "block" : "none";
        if (blog.theme) themeText.textContent = `Theme: ${blog.theme}`;

        const button = document.createElement("button");
        button.textContent = "See more";
        button.className = "see-more-btn";
        button.onclick = () => {
            window.open(`${buildRootPath()}blogs/?${blog.params.toString()}`, "_parent");
        };

        div.append(img, text, subtext, button, dateText, themeText);
        gridContainer.appendChild(div);
    });
}

const apps = [
    { name: "apps/Games/Ball game", displayText: "Ball game"},
    { name: "apps/Utility/Reload legacy", displayText: "Reload legacy" },
    { name: "apps/Utility/Make it", displayText: "Make it" },
    { name: "applications/Make it 2", displayText: "Make it 2"},
    { name: "apps/Stutility/Windows destroyer", displayText: "Windows destroyer" },
    { name: "applications/Gambling simulator", displayText: "Gambling simulator"},
];

function FindApps() {
    const allApps = []; // Initialize an array to hold shortened blog names

    // Construct allBlogs with shortened paths and display text
    apps.forEach(subpage => {
        let NewApp = {}; // Create an object for each blog

        let Name = buildRootPath() + subpage.name;
        
        NewApp.name = Name; // Store the name in the object
        NewApp.displayText = subpage.displayText; // Store the display text in the object

        allApps.push(NewApp); // Add the blog object to the allBlogs array
    });

    const gridContainer = document.getElementById("grid-container-app");
    gridContainer.innerHTML = ""; // Clear existing content

    // Create grid items for each subpage
    allApps.forEach((app, index) => {
        const div = document.createElement('div');
        div.className = 'grid-item app';

        const img = document.createElement('img');
        img.src = `${app.name}/icon.webp`;
        img.alt = `${app.displayText} icon`;
        img.className = 'grid-icon';
        img.onclick = () => {
            window.open(app.name, '_parent');
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
                    adjustPadding(div, img);
                }
            });
        }, { threshold: 0.2 });
        if (buildRootPath() === defaultRootPath) {
            img.onload = () => observer.observe(div);
        }

        div.appendChild(img);

        const text = document.createElement('div');
        text.className = "title";
        text.textContent = app.displayText;

        const subtext = document.createElement('div');
        subtext.className = 'subtext';

        // Fetch the content of the Description.txt file
        fetch(`${app.name}/Description.txt`)
            .then(response => response.text())
            .then(data => {
                subtext.textContent = data;
            })
            .catch(error => {
                subtext.textContent = 'Description not available.';
                console.error('Error fetching description:', error);
            });

        const button_SM = document.createElement('button');
        button_SM.textContent = 'See more';
        button_SM.className = 'see-more-btn';
        button_SM.onclick = function() {
            window.open(app.name, '_parent');
        };

        div.appendChild(img);
        div.appendChild(text);
        div.appendChild(subtext);
        div.appendChild(button_SM);
        gridContainer.appendChild(div);
    });
}
