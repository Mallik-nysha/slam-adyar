// Slam Adyar — the only script on the page.

// The studio's WhatsApp/phone number, digits only with country code, e.g. "919876543210".
// Empty until Slam Adyar confirms it; while empty, every call/WhatsApp button scrolls to the Visit section.
const PHONE = "";

const wa = (text) => `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;

if (PHONE) {
  document.querySelectorAll("[data-wa]").forEach((a) => {
    a.href = wa(a.dataset.wa);
    a.target = "_blank";
    a.rel = "noopener";
  });
  document.querySelectorAll("[data-call]").forEach((a) => { a.href = `tel:+${PHONE}`; });
}

// Mobile menu
const menuBtn = document.querySelector(".menu-btn");
const nav = document.getElementById("nav");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
nav.addEventListener("click", (e) => {
  if (e.target.closest("a")) {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }
});

// Gallery filter
const grid = document.getElementById("grid");
document.querySelectorAll(".filters button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const f = btn.dataset.filter;
    document.querySelectorAll(".filters button").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    grid.querySelectorAll(".ph").forEach((ph) => { ph.hidden = f !== "all" && ph.dataset.cat !== f; });
  });
});

// Lightbox: opens the full-size photo named in data-full, or the thumbnail itself
grid.addEventListener("click", (e) => {
  const img = e.target.closest(".ph")?.querySelector("img");
  if (!img) return;
  const box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-label", img.alt);
  box.innerHTML = `<img src="${img.dataset.full || img.currentSrc || img.src}" alt=""><button type="button" aria-label="Close">×</button>`;
  box.querySelector("img").alt = img.alt;
  const close = () => { box.remove(); document.removeEventListener("keydown", onKey); };
  const onKey = (ev) => { if (ev.key === "Escape") close(); };
  box.addEventListener("click", (ev) => { if (ev.target === box || ev.target.closest("button")) close(); });
  document.addEventListener("keydown", onKey);
  document.body.append(box);
  box.querySelector("button").focus();
});

// Enquiry form: compose a WhatsApp message (the site has no server)
document.getElementById("enquiry").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const text = [
    `Hi Slam Adyar, I'm ${f.get("name")}.`,
    `I'd like a free trial: ${f.get("want")}.`,
    `Best time for me: ${f.get("when")}.`,
    f.get("note") ? `Note: ${f.get("note")}` : "",
  ].filter(Boolean).join("\n");
  if (PHONE) {
    window.open(wa(text), "_blank", "noopener");
  } else {
    const btn = e.target.querySelector("button[type=submit]");
    btn.textContent = "WhatsApp number not added yet";
  }
});
