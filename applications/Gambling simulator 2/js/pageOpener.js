let pages = document.querySelectorAll(".page");
let pageOpeners = document.querySelectorAll("#open-page");
let openedPage = null;

pages.forEach((page, index) => {
  if (index === 0) {
    if (page.getAttribute("display")) {
      page.style.display = page.getAttribute("display");
    } else {
      page.style.display = "block";
    }

    openedPage = page.getAttribute("page");

    pageOpeners.forEach((pageOpener, index) => {
      if (openedPage === pageOpener.getAttribute("page")) {
        pageOpener.classList.add("active");
        return;
      }
    });
  } else {
    page.style.display = "none";
  }
});

pageOpeners.forEach((pageOpener, index) => {
  pageOpener.addEventListener("click", () => {
    var pageToOpen = pageOpener.getAttribute("page");
    pages.forEach((page, pageIndex) => {
      if (pageToOpen === page.getAttribute("page")) {
        if (page.getAttribute("display")) {
          page.style.display = page.getAttribute("display");
        } else {
          page.style.display = "block";
        }
        openedPage = pageToOpen;
        return;
      } else {
        page.style.display = "none";
      }
    });
  });
});

document.querySelectorAll(".footer-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".footer-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

function updateSliders() {
  document.querySelectorAll('input[type="range"]').forEach((slider) => {
    function update() {
      const val = (slider.value - slider.min) / (slider.max - slider.min);
      slider.style.background = `linear-gradient(to right,
        var(--accent) 0%,
        var(--accent) ${val * 100}%,
        var(--bg) ${val * 100}%,
        var(--bg) 100%)`;
    }

    slider.addEventListener("input", update);

    slider.addEventListener("wheel", (e) => {
      e.preventDefault(); // stop page scrolling
      const step = Number(slider.step) || 1; // fallback step
      let scroll = (e.deltaX + e.deltaY) / 7;
      slider.value = Number(slider.value) + step * Math.floor(scroll);
      slider.value = Math.min(slider.max, Math.max(slider.min, slider.value)); // clamp to bounds
      slider.dispatchEvent(new Event("input"));
      update();
    });

    update(); // initialize on load
  });
}

updateSliders();

const tooltip = document.createElement("div");
tooltip.className = "custom-tooltip";
document.body.appendChild(tooltip);

function getTooltips() {
  // Show tooltip on hover for elements with [title]
  document.querySelectorAll("[title]").forEach((el) => {
    const titleText = String(el.getAttribute("title")).trim().toUpperCase();
    const descriptionText = String(el.getAttribute("description")).trim();
    const costText = String(el.getAttribute("cost")).trim();

    const isEncoded = String(el.getAttribute("encoded")).trim() === "true";

    el.addEventListener("mouseenter", (e) => {
      const parts = [];

      if (descriptionText) {
        if (isEncoded) {
          parts.push(
            `<p class="custom-tooltip-header">${encrypt(titleText)}</p>`,
          );
          parts.push(
            `<p class="custom-tooltip-description">${encrypt(descriptionText)}</p>`,
          );
        } else {
          parts.push(`<p class="custom-tooltip-header">${titleText}</p>`);
          parts.push(
            `<p class="custom-tooltip-description">${descriptionText}</p>`,
          );
        }
      }

      if (costText) {
        if (parts.length === 0) {
          if (isEncoded) {
            parts.push(
              `<p class="custom-tooltip-header no-border">${encrypt(titleText)}</p>`,
            );
          } else {
            parts.push(
              `<p class="custom-tooltip-header no-border">${titleText}</p>`,
            );
          }
        }

        if (isEncoded) {
          parts.push(
            `<p class="custom-tooltip-cost no-border">${formatCost(costText)}</p>`,
          );
        } else {
          parts.push(
            `<p class="custom-tooltip-cost no-border">${formatCost(costText)}</p>`,
          );
        }
      }

      if (parts.length === 0) {
        tooltip.innerHTML = "";
        tooltip.textContent = titleText;
      } else {
        tooltip.innerHTML = parts.join("");
      }

      el.setAttribute("data-title", titleText); // store for accessibility
      el.removeAttribute("title"); // prevent native tooltip
      tooltip.classList.add("show");
    });

    el.addEventListener("mousemove", (e) => {
      const tooltipRect = tooltip.getBoundingClientRect();

      let left = e.pageX;
      let top = e.pageY + 25;

      left = Math.max(
        0,
        Math.min(left, window.innerWidth - tooltipRect.width / 2),
      );

      top = Math.max(
        0,
        Math.min(top, window.innerHeight - tooltipRect.height / 2),
      );

      tooltip.style.left = left + "px";
      tooltip.style.top = top + "px";
    });

    el.addEventListener("mouseleave", () => {
      tooltip.classList.remove("show");
    });
  });
}
getTooltips();
