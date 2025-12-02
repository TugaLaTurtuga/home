function showMenu(id) {
    const menus = document.querySelectorAll(".menu");

    for (let i = 0; i < menus.length; i++) {
        const menu = menus[i];

        if (menu.id === id) {
            menu.style.display = "block";
            menu.classList.remove("hidden");
        } else if (!menu.classList.contains("hidden")) {
            menu.style.display = "block";
            menu.classList.add("hidden");
        }
    }
}
