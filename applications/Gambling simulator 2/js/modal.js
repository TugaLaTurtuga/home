/*
 * Function to open a modal with a title and inputs.
 * @param {string} title - The title of the modal.
 * @param {Array} inputs - An array of input elements.
 * @param {string} content - custom elements.
 *
 * content rewrites the innerHTML, and thus removes inputs and title.
 *
 * Then to read the content, you'll need to do it yourself,
 * the openModal func won't read it for you
 *
 * input on inputs:
 * {
 *   type: "text",
 *   placeholder: "Enter your name",
 *   max: "100",
 *   min: "0",
 *   step: "1",
 *   value: "50",
 *   mode: "10/2" // only works with range inputs, go to pageOpener for more info
 *   required: true,
 *   defaultReturn: "TugaLaTurtuga" // when there is no value on input
 *   returnOnEnter: true,
 *   id: "id",
 *   class: "class-1 class-2",
 *   description: "Description of the input", // this is hidden when there is no description
 *   span: "true", // in case of range, it is the value of the input based on mod
 * }
 */

/**
 * openModal(title, inputs, content)
 *
 * - title: string shown in the header (ignored if content is provided)
 * - inputs: array of input descriptor objects (see below)
 * - content: optional HTML string or element that replaces auto-built content
 *
 * Input descriptor example:
 * {
 *   type: "text" | "number" | "range" | "checkbox" | "textarea" | "select",
 *   name: "username", // optional - used as key in returned object, fallback to id or index
 *   id: "user-id", // optional
 *   class: "class-1 class-2", // optional
 *   placeholder: "Enter name",
 *   min: "0", max: "100", step: "1", value: "50",
 *   mode: "10/2", // only for range: interpreted as "<scale>/<unit>" to influence the small span display
 *   required: true,
 *   defaultReturn: "fallback",
 *   returnOnEnter: true,
 *   description: "A helpful hint",
 *   span: "true" // for ranges: show numeric span next to range
 *   options: [ {value: 'a', label: 'A'}, ... ] // for select
 * }
 *
 * Returns a Promise that resolves to:
 * - object { key: value, ... } where key is name || id || index
 * - null if canceled
 *
 * If `content` is provided, the modal body is replaced with `content` and the Promise resolves to null.
 */
function openModal(title = "", inputs = [], content = null) {
  const modalRoot = document.querySelector(".modal");
  const modalContent = document.querySelector(".modal-content");

  if (!modalRoot || !modalContent) {
    throw new Error(
      "Modal elements `.modal` and `.modal-content` must exist in DOM.",
    );
  }

  // Helper to create elements quickly
  const el = (tag, attrs = {}, children = []) => {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") node.className = v;
      else if (k === "style") node.style.cssText = v;
      else if (k === "html") node.innerHTML = v;
      else if (k === "text") node.textContent = v;
      else node.setAttribute(k, v);
    }
    (Array.isArray(children) ? children : [children]).forEach((c) => {
      if (c == null) return;
      if (typeof c === "string") node.insertAdjacentHTML("beforeend", c);
      else node.appendChild(c);
    });
    return node;
  };

  // Show modal (assumes .modal hidden by .hidden class)
  function show() {
    modalRoot.classList.remove("hidden");
    modalRoot.setAttribute("aria-hidden", "false");
  }
  function hide() {
    modalRoot.classList.add("hidden");
    modalRoot.setAttribute("aria-hidden", "true");
  }

  // Clear previous content
  modalContent.innerHTML = "";

  // If content provided, replace innerHTML with it and do not build inputs.
  if (content) {
    if (typeof content === "string") modalContent.innerHTML = content;
    else modalContent.appendChild(content);
    show();
    // Per your comment, openModal won't read content for you.
    return Promise.resolve(null);
  }

  // Build modal structure: header, body (form), footer
  const header = el("header", { class: "modal-header" }, [
    el("h2", { class: "modal-title", text: title }),
  ]);

  const body = el("div", { class: "modal-body" });
  const form = el("form", {
    class: "modal-form",
    role: "form",
    novalidate: "",
  });

  // We'll keep references to input elements to gather values later
  const inputRefs = [];

  // Helper: interpret boolean-like strings
  const truthy = (v) => v === true || v === "true";

  // Helper to render a single input descriptor
  function renderInput(desc, index) {
    const type = (desc.type || "text").toLowerCase();
    const nameKey = desc.name || desc.id || `input_${index}`;
    const wrapper = el("div", { class: `modal-input-row modal-input-${type}` });

    // optional label (use title or name if present)
    if (desc.label || desc.name) {
      const lab = el("label", {
        class: "modal-input-label",
        for: desc.id || nameKey,
        text: desc.label || desc.name,
      });
      wrapper.appendChild(lab);
    }

    // description shown below input
    const descEl = desc.description
      ? el("div", { class: "modal-input-desc", text: desc.description })
      : null;

    // Input element factory
    let inputEl = null;
    if (type === "textarea") {
      inputEl = el("textarea", {
        id: desc.id || nameKey,
        class: desc.class || "",
        placeholder: desc.placeholder || "",
        name: nameKey,
        rows: desc.rows || 3,
      });
      if (desc.value != null) inputEl.value = String(desc.value);
    } else if (type === "select") {
      inputEl = el("select", {
        id: desc.id || nameKey,
        class: desc.class || "",
        name: nameKey,
      });
      if (Array.isArray(desc.options)) {
        desc.options.forEach((opt) => {
          const option = el("option", {
            value: opt.value || opt,
            text: opt.label || opt.value || opt,
          });
          if (String(opt.value || opt) === String(desc.value))
            option.selected = true;
          inputEl.appendChild(option);
        });
      }
    } else if (type === "checkbox") {
      inputEl = el("input", {
        type: "checkbox",
        id: desc.id || nameKey,
        class: desc.class || "",
        name: nameKey,
      });
      if (truthy(desc.value)) inputEl.checked = true;
    } else {
      // text, number, range and other native inputs
      inputEl = el("input", {
        type: type,
        id: desc.id || nameKey,
        class: desc.class || "",
        name: nameKey,
        placeholder: desc.placeholder || "",
        value: desc.value != null ? desc.value : "",
        min: desc.min != null ? desc.min : undefined,
        max: desc.max != null ? desc.max : undefined,
        step: desc.step != null ? desc.step : undefined,
      });
    }

    // mark required
    if (desc.required) inputEl.setAttribute("required", "");

    // Add aria description if provided
    if (desc.description) {
      const rid = `${nameKey}-desc`;
      inputEl.setAttribute("aria-describedby", rid);
      if (descEl) descEl.id = rid;
    }

    // range specific extra: optional span to show current computed value
    let rangeSpan = null;
    if (type === "range" && truthy(desc.span)) {
      rangeSpan = el("span", {
        class: "modal-range-span",
        text: String(inputEl.value || desc.value || ""),
      });
      // mode interpretation:
      // If desc.mode is like "scale/unit" (e.g. "10/2"), we compute displayed = (value / unit).toFixed(2)
      // If mode is a single number we'll show value/thatNumber. If parsing fails, we show raw value.
      function updateRangeSpan() {
        const val = Number(inputEl.value || 0);
        if (
          desc.mode &&
          typeof desc.mode === "string" &&
          desc.mode.includes("/")
        ) {
          const [scaleStr, unitStr] = desc.mode.split("/").map((s) => s.trim());
          const unit = Number(unitStr) || 1;
          const display = val / unit;
          rangeSpan.textContent = isFinite(display)
            ? String(display)
            : String(val);
        } else if (desc.mode && !isNaN(Number(desc.mode))) {
          const divisor = Number(desc.mode);
          rangeSpan.textContent = isFinite(val / divisor)
            ? String(val / divisor)
            : String(val);
        } else {
          rangeSpan.textContent = String(val);
        }
      }
      inputEl.addEventListener("input", updateRangeSpan);
      // initialize
      setTimeout(updateRangeSpan, 0);
    }

    // Add returnOnEnter support - pressing Enter will submit if allowed
    if (desc.returnOnEnter) {
      inputEl.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") {
          ev.preventDefault();
          submitForm(); // defined later
        }
      });
    }

    // append elements to wrapper in logical order
    if (type === "checkbox") {
      // checkbox label after input for compactness
      wrapper.appendChild(inputEl);
      if (desc.label) {
        const lab = el("label", {
          for: desc.id || nameKey,
          text: desc.label,
          class: "modal-checkbox-label",
        });
        wrapper.appendChild(lab);
      }
      if (descEl) wrapper.appendChild(descEl);
    } else {
      wrapper.appendChild(inputEl);
      if (rangeSpan) wrapper.appendChild(rangeSpan);
      if (descEl) wrapper.appendChild(descEl);
    }

    // store reference
    inputRefs.push({
      key: desc.name || desc.id || nameKey,
      el: inputEl,
      defaultReturn: desc.defaultReturn,
      required: !!desc.required,
      type,
    });

    return wrapper;
  }

  // Build inputs and append to form
  inputs.forEach((inputDesc, i) => {
    form.appendChild(renderInput(inputDesc, i));
  });

  body.appendChild(form);

  // footer with buttons
  const footer = el("footer", { class: "modal-footer" }, [
    el("button", {
      type: "button",
      class: "modal-btn modal-btn-cancel",
      text: "Cancel",
    }),
    el("button", {
      type: "button",
      class: "modal-btn modal-btn-ok",
      text: "OK",
    }),
  ]);

  modalContent.appendChild(header);
  modalContent.appendChild(body);
  modalContent.appendChild(footer);

  show();

  // Promise control
  let resolvePromise;
  let rejectPromise;
  const resultPromise = new Promise((res, rej) => {
    resolvePromise = res;
    rejectPromise = rej;
  });

  // helper to gather values
  function gatherValues() {
    const out = {};
    for (let i = 0; i < inputRefs.length; i++) {
      const { key, el, defaultReturn, type } = inputRefs[i];
      let value;
      if (!el) {
        value = defaultReturn != null ? defaultReturn : null;
      } else if (type === "checkbox") {
        value = !!el.checked;
      } else if (type === "select") {
        value = el.value;
      } else {
        value = el.value;
        if (value === "" || value == null) {
          value = defaultReturn != null ? defaultReturn : value;
        }
        // convert numeric types
        if (type === "number" || type === "range") {
          if (value !== "" && value != null) {
            const n = Number(value);
            value = isNaN(n) ? value : n;
          }
        }
      }
      out[key] = value;
    }
    return out;
  }

  // validation: ensure required fields filled
  function validate() {
    for (let r of inputRefs) {
      if (r.required) {
        const el = r.el;
        if (!el) return false;
        if (r.type === "checkbox") {
          if (!el.checked) return false;
        } else {
          if ((el.value || "").toString().trim() === "") return false;
        }
      }
    }
    return true;
  }

  // Submit handling
  function submitForm() {
    if (!validate()) {
      // simple visual feedback: shake or focus first invalid
      const firstInvalid = inputRefs.find(
        (r) =>
          r.required &&
          (!r.el ||
            (r.el.value || "").toString().trim() === "" ||
            (r.type === "checkbox" && !r.el.checked)),
      );
      if (firstInvalid && firstInvalid.el) {
        firstInvalid.el.focus();
        firstInvalid.el.classList.add("modal-input-invalid");
        setTimeout(
          () => firstInvalid.el.classList.remove("modal-input-invalid"),
          900,
        );
      }
      return;
    }
    const values = gatherValues();
    cleanup();
    hide();
    resolvePromise(values);
  }

  function cancelForm() {
    cleanup();
    hide();
    resolvePromise(null);
  }

  // wire up footer buttons
  const btnCancel = footer.querySelector(".modal-btn-cancel");
  const btnOK = footer.querySelector(".modal-btn-ok");

  btnCancel.addEventListener("click", cancelForm);
  btnOK.addEventListener("click", submitForm);

  // global keyboard support: Esc to cancel
  function keyHandler(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      cancelForm();
    }
  }
  document.addEventListener("keydown", keyHandler);

  // clean up everything (listeners, nodes)
  function cleanup() {
    document.removeEventListener("keydown", keyHandler);
    btnCancel.removeEventListener("click", cancelForm);
    btnOK.removeEventListener("click", submitForm);
    inputRefs.forEach((r) => {
      if (r.el && r.el.removeEventListener) {
        // cannot remove anonymous handlers reliably here; that's fine — they get GC'd when modal removed
      }
    });
  }

  // expose programmatic close via modal root dataset
  modalRoot.dataset.modalOpen = "1";

  // initialize nice focus behavior
  const firstInput = inputRefs.length ? inputRefs[0].el : null;
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 40);
  } else {
    // focus OK for accessibility
    setTimeout(() => btnOK.focus(), 40);
  }

  return resultPromise;
}

openModal("Test", [
  {
    type: "text",
    name: "username", // optional - used as key in returned object, fallback to id or index
    id: "user-id", // optional
    class: "class-1 class-2", // optional
    placeholder: "Enter name",
    min: "0",
    max: "100",
    step: "1",
    value: "50",
    mode: "10/2", // only for range: interpreted as "<scale>/<unit>" to influence the small span display
    required: true,
    defaultReturn: "fallback",
    returnOnEnter: true,
    description: "A helpful hint",
    span: "true", // for ranges: show numeric span next to range
    options: [{ value: "a", label: "A" }], // for select
  },
]);
