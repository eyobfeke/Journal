// day.js - enhanced: auto PnL + screenshot preview + persistent storage + permanent dark

// --- get URL date param ---
const params = new URLSearchParams(window.location.search);
const date = params.get("date");

// --- DOM refs (expect these IDs from your day.html) ---
const dateTitle = document.getElementById("dateTitle");
const form = document.getElementById("tradeForm");
const tradeList = document.getElementById("tradeList");
const backBtn = document.getElementById("backBtn");
const themeBtn = document.getElementById("themeToggle");

// form fields (ids expected: symbol, side, qty, entry, exit, notes, pnl optional, screenshot optional)
const symbolEl = document.getElementById("symbol");
const sideEl = document.getElementById("side");
const qtyEl = document.getElementById("qty");
const entryEl = document.getElementById("entry");
const exitEl = document.getElementById("exit");
const notesEl = document.getElementById("notes");
const pnlEl = document.getElementById("pnl"); // optional if your markup has a pnl input
// file input: prefer id="screenshot", else fallback to first file input inside the form
let screenshotInput = document.getElementById("screenshot");
if (!screenshotInput && form) screenshotInput = form.querySelector('input[type="file"]');

// small helper: create modal for viewing big screenshot
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
// ensure dark is applied early; if index sets localStorage('theme') we respect it; otherwise default dark
const storedTheme = localStorage.getItem("theme") || "dark";
localStorage.setItem("theme", storedTheme === "dark" ? "dark" : "dark"); // force dark as requested
document.documentElement.classList.add("dark");
document.body.classList.add("dark");
if (themeBtn) themeBtn.textContent = "🌞";
if (themeBtn) themeBtn.onclick = () => alert("Dark mode is permanently enabled.");

// ------------------- TRADES STORAGE -------------------
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

  let pnl = 0;
  const s = (side || "").toString().toLowerCase();
  if (s === "short" || s === "sell") {
    pnl = (e - x) * q;
  } else {
    // default long/buy
    pnl = (x - e) * q;
  }
  return Number.isFinite(pnl) ? pnl : 0;
}

// update PnL input in real time (if a PnL input exists)
function updatePnlField() {
  if (!pnlEl) return;
  const sideVal = sideEl ? sideEl.value : "LONG";
  const entryVal = entryEl ? entryEl.value : "";
  const exitVal = exitEl ? exitEl.value : "";
  const qtyVal = qtyEl ? qtyEl.value : "";
  const p = computePnlValue(sideVal, entryVal, exitVal, qtyVal);
  pnlEl.value = p.toFixed(2);
}

// attach listeners to compute PnL live
if (entryEl) entryEl.addEventListener("input", updatePnlField);
if (exitEl) exitEl.addEventListener("input", updatePnlField);
if (qtyEl) qtyEl.addEventListener("input", updatePnlField);
if (sideEl) sideEl.addEventListener("change", updatePnlField);

// ------------------- Screenshot handling for the FORM -------------------
let formScreenshotData = null; // base64 string for the form-uploaded screenshot

if (screenshotInput) {
  screenshotInput.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      formScreenshotData = null;
      // remove preview if you show one in the form (not required)
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      formScreenshotData = ev.target.result; // base64 data URL
      // optionally show a small preview next to the file input if you want:
      const existing = form.querySelector(".screenshot-preview");
      if (existing) existing.remove();
      const thumb = document.createElement("img");
      thumb.className = "screenshot-preview";
      thumb.src = formScreenshotData;
      thumb.style.width = "64px";
      thumb.style.height = "64px";
      thumb.style.objectFit = "cover";
      thumb.style.borderRadius = "6px";
      thumb.style.marginLeft = "8px";
      screenshotInput.insertAdjacentElement("afterend", thumb);
    };
    reader.readAsDataURL(file);
  });
}

// ------------------- RENDER SAVED TRADES -------------------
function renderTrades() {
  const trades = getTrades().filter((t) => t.date === date);
  tradeList.innerHTML = "";

  if (trades.length === 0) {
    tradeList.innerHTML = "<p>No trades logged for this date.</p>";
    return;
  }

  trades.forEach((t) => {
    // compute pnl if not present (backwards compatibility)
    let pnlValue = t.pnl;
    if (pnlValue === undefined || pnlValue === null || pnlValue === "") {
      pnlValue = computePnlValue(t.side, t.entry, t.exit, t.qty).toFixed(2);
    }

    const card = document.createElement("div");
    card.className = "trade-card";
    card.style.cssText = "border-radius:8px;padding:10px;margin-bottom:10px;background:var(--card);color:var(--text);box-shadow:0 1px 4px var(--shadow);";

    // main info
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

    // screenshot thumbnail + view button
    const row = document.createElement("div");
    row.style.marginTop = "8px; display:flex; gap:10px; align-items:center;";
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
      viewBtn.style.marginRight = "8px";
      viewBtn.addEventListener("click", () => {
        modalImg.src = t.screenshot;
        imageModal.style.display = "flex";
      });
      row.appendChild(viewBtn);
    }

    // delete button
    const del = document.createElement("button");
    del.textContent = "🗑 Delete";
    del.style.marginLeft = "10px";
    del.addEventListener("click", () => {
      const all = getTrades();
      const filtered = all.filter((x) => x.id !== t.id);
      saveTrades(filtered);
      renderTrades();
    });
    row.appendChild(del);

    card.appendChild(row);
    tradeList.appendChild(card);
  });
}

// small HTML-escape helper for notes
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// initial render
renderTrades();

// ------------------- FORM SUBMIT (ADD TRADE) -------------------
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // read values
    const symbol = symbolEl ? symbolEl.value.trim() : "";
    const side = sideEl ? sideEl.value : "LONG";
    const qty = Number(qtyEl ? qtyEl.value : 0);
    const entry = parseFloat(entryEl ? entryEl.value : 0) || 0;
    const exit = parseFloat(exitEl ? exitEl.value : 0) || 0;
    const notes = notesEl ? notesEl.value : "";

    // compute pnl (store as string to be safe)
    const pnl = computePnlValue(side, entry, exit, qty).toFixed(2);

    // screenshot: use base64 read earlier or if file selected and not read (rare), read synchronously
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

    // reset form fields
    form.reset();
    formScreenshotData = null;
    // remove preview if any
    const prev = form.querySelector(".screenshot-preview");
    if (prev) prev.remove();

    renderTrades();
  });
}

// ------------------- convenient "Add Trade" quick-row support (if you have a dynamic table) -------------------
// If your HTML uses a table with an "Add Trade" button that appends rows (earlier versions),
// this code does not override that behavior. The form submission above is used for adding trades.

// ------------------- small accessibility/failsafe: back button -------------------
if (backBtn) {
  backBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

// ------------------- Make sure modal closes on escape key -------------------
document.addEventListener("keydown", (ev) => {
  if (ev.key === "Escape") {
    if (imageModal.style.display === "flex") {
      imageModal.style.display = "none";
      modalImg.src = "";
    }
  }
});
