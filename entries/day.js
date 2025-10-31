// day.js - enhanced: auto PnL + screenshot preview + persistent storage + permanent dark + remove screenshot

// --- get URL date param ---
const params = new URLSearchParams(window.location.search);
const date = params.get("date");

// --- DOM refs (expect these IDs from your day.html) ---
const dateTitle = document.getElementById("dateTitle");
const form = document.getElementById("tradeForm");
const tradeList = document.getElementById("tradeList");
const backBtn = document.getElementById("backBtn");
const themeBtn = document.getElementById("themeToggle");

// form fields
const symbolEl = document.getElementById("symbol");
const sideEl = document.getElementById("side");
const qtyEl = document.getElementById("qty");
const entryEl = document.getElementById("entry");
const exitEl = document.getElementById("exit");
const notesEl = document.getElementById("notes");
const pnlEl = document.getElementById("pnl");
let screenshotInput = document.getElementById("screenshot");
if (!screenshotInput && form) screenshotInput = form.querySelector('input[type="file"]');

// ------------------- Modal for big screenshot -------------------
function createImageModal() {
  const modal = document.createElement("div");
  modal.id = "screenshotModal";
  Object.assign(modal.style, {
    display: "none",
    position: "fixed",
    zIndex: 9999,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  });
  const img = document.createElement("img");
  img.id = "modalImage";
  img.style.maxWidth = "95%";
  img.style.maxHeight = "95%";
  img.style.borderRadius = "8px";
  modal.appendChild(img);

  modal.addEventListener("click", () => {
    modal.style.display = "none";
    img.src = "";
  });

  document.body.appendChild(modal);
  return { modal, img };
}
const { modal: imageModal, img: modalImg } = createImageModal();

// set page title
if (dateTitle) dateTitle.textContent = `Trades for ${date || "Unknown date"}`;

// ------------------- THEME (KEEP DARK PERMANENT) -------------------
const storedTheme = localStorage.getItem("theme") || "dark";
localStorage.setItem("theme", "dark");
document.documentElement.classList.add("dark");
document.body.classList.add("dark");
if (themeBtn) {
  themeBtn.textContent = "🌞";
  themeBtn.onclick = () => alert("Dark mode is permanently enabled.");
}

// ------------------- STORAGE -------------------
function getTrades() {
  return JSON.parse(localStorage.getItem("trades") || "[]");
}
function saveTrades(trades) {
  localStorage.setItem("trades", JSON.stringify(trades));
}

// ------------------- PnL Calculation -------------------
function computePnlValue(side, entryVal, exitVal, qtyVal) {
  const q = Number(qtyVal) || 0;
  const e = Number(entryVal) || 0;
  const x = Number(exitVal) || 0;
  const s = (side || "").toString().toLowerCase();
  return s === "short" || s === "sell" ? (e - x) * q : (x - e) * q;
}
function updatePnlField() {
  if (!pnlEl) return;
  const sideVal = sideEl?.value || "LONG";
  const entryVal = entryEl?.value || "";
  const exitVal = exitEl?.value || "";
  const qtyVal = qtyEl?.value || "";
  const p = computePnlValue(sideVal, entryVal, exitVal, qtyVal);
  pnlEl.value = p.toFixed(2);
}
if (entryEl) entryEl.addEventListener("input", updatePnlField);
if (exitEl) exitEl.addEventListener("input", updatePnlField);
if (qtyEl) qtyEl.addEventListener("input", updatePnlField);
if (sideEl) sideEl.addEventListener("change", updatePnlField);

// ------------------- Screenshot handling -------------------
let formScreenshotData = null;

if (screenshotInput) {
  screenshotInput.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      formScreenshotData = null;
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      formScreenshotData = ev.target.result;

      // remove old preview
      const existing = form.querySelector(".screenshot-wrapper");
      if (existing) existing.remove();

      // wrapper for preview + remove
      const wrapper = document.createElement("div");
      wrapper.className = "screenshot-wrapper";
      wrapper.style.display = "flex";
      wrapper.style.alignItems = "center";
      wrapper.style.gap = "8px";
      wrapper.style.marginTop = "6px";

      const thumb = document.createElement("img");
      thumb.className = "screenshot-preview";
      thumb.src = formScreenshotData;
      thumb.style.width = "64px";
      thumb.style.height = "64px";
      thumb.style.objectFit = "cover";
      thumb.style.borderRadius = "6px";
      thumb.style.cursor = "pointer";
      thumb.title = "Click to enlarge";

      thumb.addEventListener("click", () => {
        modalImg.src = formScreenshotData;
        imageModal.style.display = "flex";
      });

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "❌ Remove";
      removeBtn.type = "button";
      removeBtn.style.background = "#b33";
      removeBtn.style.color = "white";
      removeBtn.style.border = "none";
      removeBtn.style.padding = "4px 8px";
      removeBtn.style.borderRadius = "4px";
      removeBtn.style.cursor = "pointer";

      removeBtn.addEventListener("click", () => {
        wrapper.remove();
        screenshotInput.value = "";
        formScreenshotData = null;
      });

      wrapper.appendChild(thumb);
      wrapper.appendChild(removeBtn);
      screenshotInput.insertAdjacentElement("afterend", wrapper);
    };
    reader.readAsDataURL(file);
  });
}

// ------------------- Render Trades -------------------
function renderTrades() {
  const trades = getTrades().filter((t) => t.date === date);
  tradeList.innerHTML = trades.length ? "" : "<p>No trades logged for this date.</p>";

  trades.forEach((t) => {
    const pnlValue = t.pnl ?? computePnlValue(t.side, t.entry, t.exit, t.qty).toFixed(2);
    const card = document.createElement("div");
    card.className = "trade-card";
    card.style.cssText = "border-radius:8px;padding:10px;margin-bottom:10px;background:var(--card);color:var(--text);box-shadow:0 1px 4px var(--shadow);";

    const info = document.createElement("div");
    info.innerHTML = `
      <div style="display:flex; justify-content:space-between; gap:12px; align-items:center;">
        <div><strong>${t.symbol}</strong> <small style="opacity:0.75">(${t.side})</small></div>
        <div>Qty: ${t.qty}</div>
        <div>Entry: ${t.entry}</div>
        <div>Exit: ${t.exit}</div>
        <div>P&L: $${Number(pnlValue).toFixed(2)}</div>
      </div>
      <div style="margin-top:8px;">${t.notes ? `<em>${escapeHtml(t.notes)}</em>` : ""}</div>
    `;
    card.appendChild(info);

    const row = document.createElement("div");
    row.style.cssText = "margin-top:8px; display:flex; gap:10px; align-items:center;";

    if (t.screenshot) {
      const thumb = document.createElement("img");
      thumb.src = t.screenshot;
      thumb.className = "screenshot-thumb";
      thumb.style.width = "80px";
      thumb.style.height = "50px";
      thumb.style.objectFit = "cover";
      thumb.style.borderRadius = "6px";
      thumb.style.cursor = "pointer";
      thumb.style.marginRight = "10px";
      thumb.addEventListener("click", () => {
        modalImg.src = t.screenshot;
        imageModal.style.display = "flex";
      });
      row.appendChild(thumb);

      const viewBtn = document.createElement("button");
      viewBtn.textContent = "View";
      viewBtn.addEventListener("click", () => {
        modalImg.src = t.screenshot;
        imageModal.style.display = "flex";
      });
      row.appendChild(viewBtn);
    }

    const del = document.createElement("button");
    del.textContent = "🗑 Delete";
    del.addEventListener("click", () => {
      const all = getTrades().filter((x) => x.id !== t.id);
      saveTrades(all);
      renderTrades();
    });
    row.appendChild(del);

    card.appendChild(row);
    tradeList.appendChild(card);
  });
}
function escapeHtml(str) {
  return String(str || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
renderTrades();

// ------------------- Add Trade -------------------
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const symbol = symbolEl?.value.trim() || "";
    const side = sideEl?.value || "LONG";
    const qty = Number(qtyEl?.value || 0);
    const entry = parseFloat(entryEl?.value || 0) || 0;
    const exit = parseFloat(exitEl?.value || 0) || 0;
    const notes = notesEl?.value || "";
    const pnl = computePnlValue(side, entry, exit, qty).toFixed(2);
    const screenshotData = formScreenshotData || null;

    const newTrade = {
      id: Date.now().toString(),
      date,
      symbol,
      side,
      qty,
      entry,
      exit,
      pnl,
      notes,
      screenshot: screenshotData,
    };

    const all = getTrades();
    all.push(newTrade);
    saveTrades(all);

    form.reset();
    formScreenshotData = null;
    const prev = form.querySelector(".screenshot-wrapper");
    if (prev) prev.remove();

    renderTrades();
  });
}

// ------------------- Back Button -------------------
if (backBtn) backBtn.addEventListener("click", () => (window.location.href = "index.html"));

// ------------------- Close modal with Escape -------------------
document.addEventListener("keydown", (ev) => {
  if (ev.key === "Escape" && imageModal.style.display === "flex") {
    imageModal.style.display = "none";
    modalImg.src = "";
  }
});
