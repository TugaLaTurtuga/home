function adjustPadding(div, img) {
    const aspectRatio = window.innerWidth / window.innerHeight;
    div.style.paddingLeft = '10px';
    div.style.paddingTop = '10px';
    if (aspectRatio > 1) {
        const maxPadding = parseFloat(getComputedStyle(div).width);
        const padded = Math.min(img.width + 20, maxPadding);
        div.style.paddingLeft = `${padded}px`;
    } else {
        const maxPadding = parseFloat(getComputedStyle(div).height);
        const padded = Math.min(img.height + 20, maxPadding);
        div.style.paddingTop = `${padded}px`;
    }
}

const blogs = [
    { name: 'blogs/blogs/First-blog', displayText: "First blog!" },
];

function FindBlogs(place = false) {
    const allBlogs = []; // Initialize an array to hold shortened blog names

    // Construct allBlogs with shortened paths and display text
    blogs.forEach(subpage => {
        let NewBlog = {}; // Create an object for each blog

        let Name = subpage.name;
        if (place) {
            Name = subpage.name.replace(/blogs\/blogs\//, 'blogs/'); // Adjust the path if place is true
        }
        
        NewBlog.name = Name; // Store the name in the object
        NewBlog.displayText = subpage.displayText; // Store the display text in the object

        allBlogs.push(NewBlog); // Add the blog object to the allBlogs array
    });

    const gridContainer = document.getElementById('grid-container-blog');

    // Create grid items for each subpage
    allBlogs.forEach((blog, index) => {
        const div = document.createElement('div');
        div.className = 'grid-item';

        const img = document.createElement('img');
        img.src = `${blog.name}/icon.png`;
        img.alt = `${blog.displayText} icon`;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
                    adjustPadding(div, img);
                }
            });
        }, { threshold: 0.2 });
        observer.observe(div);

        div.appendChild(img);

        const text = document.createElement('div');
        text.textContent = blog.displayText;

        const subtext = document.createElement('div');
        subtext.className = 'subtext';

        // Fetch the content of the Description.txt file
        fetch(`${blog.name}/Description.txt`)
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
            window.open(blog.name, '_blank');
        };

        div.appendChild(img);
        div.appendChild(text);
        div.appendChild(subtext);
        div.appendChild(button_SM);
        gridContainer.appendChild(div);
    });
}

const apps = [
    { name: "apps/Games/ball-game", displayText: "Ball game"},
    { name: "apps/Utility/Reload", displayText: "Reload" },
    { name: "apps/Utility/Make_it", displayText: "Make it" },
    { name: "applications/Make it 2", displayText: "Make it 2"},
    { name: "apps/Stutility/Windows_destroyer", displayText: "Windows destroyer" },
    { name: "applications/GamblingSimulator", displayText: "Gambling simulator"},
];

function FindApps(place = false) {
    const allApps = []; // Initialize an array to hold shortened blog names

    // Construct allBlogs with shortened paths and display text
    apps.forEach(subpage => {
        let NewApp = {}; // Create an object for each blog

        let Name = subpage.name;
        if (place) {
            Name = subpage.name.replace('/apps', ''); // Adjust the path if place is true
        }
        
        NewApp.name = Name; // Store the name in the object
        NewApp.displayText = subpage.displayText; // Store the display text in the object

        allApps.push(NewApp); // Add the blog object to the allBlogs array
    });

    const gridContainer = document.getElementById('grid-container-app');

    // Create grid items for each subpage
    allApps.forEach((app, index) => {
        const div = document.createElement('div');
        div.className = 'grid-item';

        const img = document.createElement('img');
        img.src = `${app.name}/icon.webp`;
        img.alt = `${app.displayText} icon`;
        img.className = 'grid-icon';

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
                    adjustPadding(div, img);
                }
            });
        }, { threshold: 0.2 });
        observer.observe(div);

        div.appendChild(img);

        const text = document.createElement('div');
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
            window.open(app.name, '_blank');
        };

        div.appendChild(img);
        div.appendChild(text);
        div.appendChild(subtext);
        div.appendChild(button_SM);
        gridContainer.appendChild(div);
    });
}

FindBlogs();
FindApps();
