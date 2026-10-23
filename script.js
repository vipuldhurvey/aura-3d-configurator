const finishes = {
  graphite: {
    label: "Graphite",
    description: "Soft-touch graphite with a brushed silver accent.",
    shell: "#343c3b", accent: "#aeb89d", cushion: "#171b1b"
  },
  sand: {
    label: "Warm sand",
    description: "A warm stone finish paired with a soft ivory accent.",
    shell: "#c8b598", accent: "#e6d9bf", cushion: "#786e60"
  },
  moss: {
    label: "Forest moss",
    description: "Grounded olive green with a light botanical accent.",
    shell: "#4d604f", accent: "#c3d394", cushion: "#222e26"
  }
};

let bagCount = 0;
let toastTimer;

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2300);
}

function setFinish(name, source = "picker") {
  const finish = finishes[name] || finishes.graphite;
  document.documentElement.dataset.finish = name;
  document.documentElement.style.setProperty("--model-color", finish.shell);
  document.documentElement.style.setProperty("--model-accent", finish.accent);
  document.documentElement.style.setProperty("--model-cushion", finish.cushion);
  document.querySelectorAll("[data-finish]").forEach((button) => {
    const selected = button.dataset.finish === name;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  document.querySelector("#finish-description").textContent = finish.description;
  window.dispatchEvent(new CustomEvent("aura:finish", { detail: name }));
  if (source === "prompt") {
    document.querySelector("#prompt-status").textContent = `Local concept applied: ${finish.label}. This demo maps keywords; no AI service is connected.`;
  }
}

function applyPrompt() {
  const prompt = document.querySelector("#style-prompt").value.trim();
  const status = document.querySelector("#prompt-status");
  if (!prompt) {
    status.textContent = "Add a short mood or style idea first.";
    document.querySelector("#style-prompt").focus();
    return;
  }

  const brief = prompt.toLowerCase();
  let finish = "graphite";
  if (/forest|moss|olive|green|nature|grounded|botanical|leaf/.test(brief)) finish = "moss";
  else if (/sand|warm|cream|neutral|soft|minimal|beige|stone|calm|natural|earth/.test(brief)) finish = "sand";
  else if (/dark|black|bold|studio|night|graphite|modern/.test(brief)) finish = "graphite";
  setFinish(finish, "prompt");
}

function readBagCount() {
  try {
    const saved = Number(localStorage.getItem("aura-one-demo-bag"));
    return Number.isFinite(saved) && saved > 0 ? Math.floor(saved) : 0;
  } catch {
    return 0;
  }
}

function saveBagCount() {
  document.querySelector("#bag-count").textContent = bagCount;
  try { localStorage.setItem("aura-one-demo-bag", String(bagCount)); } catch { /* Bag stays usable for this page view. */ }
}

document.querySelectorAll(".finish-option").forEach((button) => {
  button.addEventListener("click", () => setFinish(button.dataset.finish));
});

document.querySelector("#apply-prompt").addEventListener("click", applyPrompt);
document.querySelector("#style-prompt").addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    applyPrompt();
  }
});

document.querySelectorAll("[data-style-prompt]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector("#style-prompt").value = button.dataset.stylePrompt;
    applyPrompt();
  });
});

document.querySelector("#add-to-bag").addEventListener("click", () => {
  bagCount += 1;
  saveBagCount();
  showToast(`${finishes[document.documentElement.dataset.finish || "graphite"].label} Aura One added to your demo bag`);
});

document.querySelector("#bag-button").addEventListener("click", () => {
  showToast(`Demo bag · ${bagCount} item${bagCount === 1 ? "" : "s"}. Checkout is not connected.`);
});

document.querySelectorAll("[data-rotate]").forEach((button) => {
  button.addEventListener("click", () => window.dispatchEvent(new CustomEvent("aura:rotate", { detail: Number(button.dataset.rotate) })));
});

document.querySelector("#year").textContent = new Date().getFullYear();
bagCount = readBagCount();
saveBagCount();
setFinish("graphite");

window.setTimeout(() => {
  if (!document.querySelector("#model-stage").classList.contains("is-three-ready")) {
    document.querySelector("#model-status").textContent = "CSS preview · publish on GitHub Pages for live 3D";
  }
}, 1800);
