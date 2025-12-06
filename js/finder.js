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

const blogs = [
    { name: 'blogs/blogs/test', displayText: "Test blog" },
];

async function FindBlogs() {
    const allBlogs = blogs.map(subpage  => {
        const name = buildRootPath() + subpage.name;

        // URLSearchParams for the last part of the path
        const params = new URLSearchParams({
            blog: subpage.name.split("/").pop(),
            name: subpage.displayText,
        });

        return {
            name,
            params,
            displayText: subpage.displayText
        };
    });

    const gridContainer = document.getElementById("grid-container-blog");
    gridContainer.innerHTML = ""; // Clear existing content

    allBlogs.forEach(blog => {
        const div = document.createElement("div");
        div.className = "grid-item blog";

        const img = document.createElement("img");
        img.src = `${blog.name}/icon.png`;
        img.alt = `${blog.displayText} icon`;
        img.className = 'grid-icon';
        img.onclick = () => {
            const url = `${buildRootPath()}blogs/?${blog.params.toString()}`;
            window.open(url, "_parent");
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

        const text = document.createElement("div");
        text.className = "title";
        text.textContent = blog.displayText;

        const subtext = document.createElement("div");
        subtext.className = "subtext";

        // Fetch description
        fetch(`${blog.name}/Description.txt`)
            .then(res => res.text())
            .then(data => {
                subtext.textContent = data;
            })
            .catch(() => {
                subtext.textContent = "Description not available.";
            });


        const dateText = document.createElement("div");
        dateText.className = "subtext date";

        fetch(`${blog.name}/changeLogs.json`)
            .then(res => res.text())
            .then(data => {
                const parsed = JSON.parse(data);
                const values = Object.values(parsed);
                const first = values[0];
                const date = first?.date;
                dateText.textContent = date;
            })
            .catch(() => {
                dateText.textContent = "";
            });

        const button = document.createElement("button");
        button.textContent = "See more";
        button.className = "see-more-btn";

        // Build the final URL
        button.onclick = () => {
            const url = `${buildRootPath()}blogs/?${blog.params.toString()}`;
            window.open(url, "_parent");
        };

        div.append(img, text, subtext, button, dateText);
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
