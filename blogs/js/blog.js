const params = new URLSearchParams(window.location.search);

const blog = params.get("blog");
let name = params.get("name");
const parentDiv = document.getElementById("grid-container-blog");

async function loadBlog() {
    try {
        const res = await fetch(`blogs/${blog}/blog.md`);

        if (!res.ok) {
            throw new Error(`Failed to load markdown file: ${res.status}`);
        }

        let resTxt = await res.text();

        const parsedResText = parseBlogSettings(resTxt);
        const blogSettings = parsedResText.blogSettings;
        const mdText = parsedResText.cleanedMarkdown;

        if (blogSettings.name) {
            name = blogSettings.name;
        }

        const blogSettingsValues = Object.values(blogSettings);
        const blogSettingsKeys = Object.keys(blogSettings);
        for (let i = 0; i < blogSettingsKeys.length; i++) {
            if (blogSettingsValues[i] !== "blog") {
                params.delete(blogSettingsKeys[i]);
            }
        }

        // Push new URL
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, "", newUrl);

        // Convert Markdown → HTML
        const html = marked.parse(mdText);
        parentDiv.innerHTML = html;

        // Process tip blocks
        const paragraphs = parentDiv.querySelectorAll("p");
        paragraphs.forEach(originalP => {
            const text = originalP.textContent.trim();

            if (text.startsWith("[!")) {
                const possibleTipNoTreatment = text.slice(2).split("]")[0];
                const possibleTip = possibleTipNoTreatment.trim().toLowerCase();

                if (possibleTip.split(" ").length === 1) {
                    const wrapper = document.createElement("div");
                    wrapper.classList.add("newTip", possibleTip);

                    const tipName = document.createElement("h2");
                    tipName.textContent = possibleTip[0].toUpperCase() + possibleTip.slice(1);

                    const tipBody = document.createElement("p");
                    tipBody.textContent = text.replace(`[!${possibleTipNoTreatment}]`, "").trim();

                    wrapper.appendChild(tipName);
                    wrapper.appendChild(tipBody);

                    originalP.replaceWith(wrapper);
                }
            }
        });

        // Highlight code
        const codeBlocks = parentDiv.querySelectorAll("code");
        codeBlocks.forEach(block => {
            const result = hljs.highlightAuto(block.textContent);
            block.innerHTML = result.value;
        });

        const preBlocks = parentDiv.querySelectorAll("pre");

        preBlocks.forEach(pre => {
            // Create wrapper div
            const wrapper = document.createElement("div");
            wrapper.classList.add("code-wrapper");

            // Replace pre in the DOM with wrapper
            pre.parentNode.replaceChild(wrapper, pre);
            wrapper.appendChild(pre);

            // Get <code> inside <pre>
            const code = pre.querySelector("code");
            if (!code) return;

            // Detect language
            const languageClass = Array.from(code.classList).find(c => c.startsWith("language-"));
            const language = languageClass ? languageClass.split("-")[1] : "text";

            // Create language badge
            const langDiv = document.createElement("div");
            langDiv.classList.add("language");
            langDiv.textContent = language;

            wrapper.appendChild(langDiv);
        });

        const as = parentDiv.querySelectorAll("a, img");
        as.forEach(a => {
            let usesSrc = false
            if (a.href === null || a.href == undefined) {
                a.href = a.src;
                usesSrc = true;
            } 
            const aHref = a.href;
            const currentHrefArray = location.href.split("/").filter(Boolean);
            const linkHrefArray = aHref.split("/").filter(Boolean);

            let isFile = false;
            let file = null;

            // Detect file extension
            if (/\.\w+$/.test(linkHrefArray[linkHrefArray.length - 1])) {
                file = linkHrefArray.pop();
                isFile = true;
            }

            // Compare dirs
            let localHref = true;
            for (let i = 0; i < currentHrefArray.length - 1; i++) {
                if (linkHrefArray[i] !== currentHrefArray[i]) {
                    localHref = false;
                    break;
                } else if (i + 2 === currentHrefArray.length) {
                    // if it ends in, ex test/code,
                    // put 'test/code' at the end instead of 'test', 'code'.
                    linkHrefArray[i + 1] = linkHrefArray.slice(i + 1).join("/");
                    linkHrefArray.length = i + 2; // trim the array
                }
            }

            if (localHref) {
                if (!isFile) {
                    // BLOG LINK
                    const blogLink = aHref.split("/").pop();
                    fetch(`blogs/${blogLink}/blog.md`)
                        .then(res => res.text())
                        .then(data => {
                            const params = new URLSearchParams({
                                blog: blogLink,
                                name: parseBlogSettings(data).name,
                            });
                            a.href = `?${params.toString()}`;
                        })
                        .catch(() => {
                            const params = new URLSearchParams({
                                blog: blogLink,
                                name: blogLink,
                            });
                            a.href = `?${params.toString()}`;
                        });

                } else {
                    // FILE LINK
                    const blogLink = linkHrefArray.pop();
                    if (file.toLowerCase().endsWith(".html")) {
                        const newA = document.createElement("div");

                        fetch(`blogs/${blogLink}/${file}`)
                            .then(res => res.text())
                            .then(html => {
                                newA.innerHTML = html;
                                newA.classList.add("injected-html");
                                a.replaceWith(newA);
                                const scripts = newA.querySelectorAll("script");
                                scripts.forEach(oldScript => {
                                    const s = document.createElement("script");

                                    if (oldScript.src) {
                                        // External script
                                        s.src = oldScript.src;
                                    } else {
                                        // Inline script
                                        s.textContent = oldScript.textContent;
                                    }

                                    oldScript.replaceWith(s);
                                });
                            });
                    }
                    a.href = `blogs/${blogLink}/${file}`;
                }
            }
            if (usesSrc) {
                a.src = a.href;
            }
        });

        if (window.MathJax) {
            window.MathJax.typesetPromise();
        }

        // Update headers and layout
        enableBlogCSS();
        enableBackToTop();
        document.querySelector(".ama").textContent = name;
        document.title = `Tuga's blog - ${name}`;
        document.querySelector(".ama").classList.add("blog");
        parentDiv.classList.remove("grid-container");
        parentDiv.classList.add("blog-container");

        // change log
        const versionNumber = document.createElement("div");
        versionNumber.id = "version";
        versionNumber.classList.add("version-number");

        versionNumber.addEventListener("click", () => {
            showChangeLog();
        });

        parentDiv.appendChild(versionNumber);
        loadChangeLogs();
    } catch (err) {
        console.error(err);
        document.querySelector(".Hello_Text").innerHTML = "<p>Unable to load blog content.</p>";
    }
}

function enableBlogCSS() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "css/blog.css";
    document.head.appendChild(link);
}

function enableBackToTop() {
    return;
}


if (blog) {
    loadBlog();
} else {
    FindBlogs();
}

async function loadBTT() {
    try {
        const select = document.getElementById("allbtt");

        select.addEventListener("change", function () {
            changeBTT(this.value);
            console.log(this.value);
        });
    } catch(err) {
        return;
    }
}

function changeBTT(value) {
    // Load from localStorage if no value passed
    if (value === undefined || value === null || value === "") {
        const saved = localStorage.getItem("_blogSettings");
        if (saved) {
            const parsed = JSON.parse(saved);
            value = parsed.btt;
            document.getElementById("allbtt").value = value;
        } else {
            return; // no stored value
        }
    }

    value = parseInt(value);

    backToTopAlwaysVisible = value === 1;
    backToTopAmination = value === 2;
    localStorage.setItem("_blogSettings", JSON.stringify({
        btt: value
    }));

    updateScrollToTop();
}

document.addEventListener("DOMContentLoaded", async () => {
    loadBTT();
    changeBTT();
});
