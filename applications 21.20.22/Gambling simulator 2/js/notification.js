/**
 * notify(message, options)
 * options = {
 *   title: string,
 *   type: 'info'|'warn'|'error' (affects left accent color override),
 *   timeout: ms (auto-dismiss)
 * }
 */
const notificationContainer = document.getElementById("notifications");

// color map for types (falls back to --activeColor)
const notificationTypeColors = {
  info: {
    color: "var(--activeColor)",
    timeout: 90,
  },
  warn: {
    color: "#f59e0b",
    timeout: 150,
  },
  error: {
    color: "#ef4444",
    timeout: 300,
  },
};

function notify(message, options = {}) {
  function escapeHtml(s) {
    // small escape to safely build html string for the console-message representation
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  message = message.trim();
  const title = options.title || "LOG";
  const type = options.type || "info";
  let timeout =
    typeof options.timeout === "number"
      ? options.timeout
      : notificationTypeColors[type].timeout;

  timeout = timeout * message.replace(" ", "").split("").length;

  // make element
  const el = document.createElement("div");
  el.className = "notification";
  el.setAttribute("role", "status");
  el.setAttribute("data-type", type);

  // set accent color for this item
  const accent = notificationTypeColors[type].color;
  el.style.setProperty("--color", accent);

  // inner html structure
  el.innerHTML = `
<div class="content">
  <div class="title">${escapeHtml(title)}</div>
  <div class="body">${escapeHtml(message)}</div>
</div>
<div class="meta">x</div>
`;

  // click to dismiss
  el.addEventListener("click", () => dismiss(el));

  // append and animate
  notificationContainer.prepend(el);
  requestAnimationFrame(() => {
    el.classList.remove("hide");
  });

  // auto-dismiss
  let timer = null;
  if (timeout > 0) {
    timer = setTimeout(() => dismiss(el), timeout);
  }

  // dismiss helper
  function dismiss(node) {
    node.classList.add("hide");
    clearTimeout(timer);
    setTimeout(() => node.remove(), 220);
  }

  const literalHtml = `<logged-item data-type="${type}">${escapeHtml(message)}</logged-item>`;

  console.log("%cLOG: %s", `color: ${accent}; font-weight:600;`, literalHtml);

  // return an object so caller can programmatically dismiss if needed
  return {
    element: el,
    dismiss: () => dismiss(el),
  };
}
