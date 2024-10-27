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
        img.src = `${blog.name}/icon.png`; // Use shortened name
        img.alt = `${blog.displayText} icon`;

        const text = document.createElement('div');
        text.textContent = blog.displayText;

        const subtext = document.createElement('div');
        subtext.className = 'subtext';

        // Fetch the content of the Description.txt file
        fetch(`${blog.name}/Description.txt`) // Use shortened name
            .then(response => response.text())
            .then(data => {
                subtext.textContent = data;
            })
            .catch(error => {
                subtext.textContent = 'Description not available.';
                console.error('Error fetching description:', error);
            });

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'buttoncontainer';

        const button = document.createElement('button');
        button.textContent = 'See blog';
        button.onclick = function() {
            window.open(blog.name, '_self'); // Use shortened name
        };

        buttonContainer.appendChild(button);

        div.appendChild(img);
        div.appendChild(text);
        div.appendChild(subtext);
        div.appendChild(buttonContainer);
        gridContainer.appendChild(div);
    });
}

const apps = [
    { name: "apps/Games/ball-game", displayText: "Ball game"},
    { name: "apps/Utility/Reload", displayText: "Reload" },
    { name: "apps/Utility/Make_it", displayText: "Make it" },
    { name: "apps/Stutility/Windows_destroyer", displayText: "Windows destroyer" },
    { name: "applications/GamblingSimulator", displayText: "Gambling simulator"}
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
    allApps.forEach((blog, index) => {
        const div = document.createElement('div');
        div.className = 'grid-item';

        const img = document.createElement('img');
        img.src = `${blog.name}/icon.webp`; // Use shortened name
        img.alt = `${blog.displayText} icon`;

        const text = document.createElement('div');
        text.textContent = blog.displayText;

        const subtext = document.createElement('div');
        subtext.className = 'subtext';

        // Fetch the content of the Description.txt file
        fetch(`${blog.name}/Description.txt`) // Use shortened name
            .then(response => response.text())
            .then(data => {
                subtext.textContent = data;
            })
            .catch(error => {
                subtext.textContent = 'Description not available.';
                console.error('Error fetching description:', error);
            });

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'buttoncontainer';

        const button = document.createElement('button');
        button.textContent = 'See app';
        button.onclick = function() {
            window.open(blog.name, '_self'); // Use shortened name
        };

        buttonContainer.appendChild(button);

        div.appendChild(img);
        div.appendChild(text);
        div.appendChild(subtext);
        div.appendChild(buttonContainer);
        gridContainer.appendChild(div);
    });
}
