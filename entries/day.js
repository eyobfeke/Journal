// ===== PERMANENT DARK MODE (SYNCED + STORED) =====
const themeBtn = document.getElementById("themeToggle");

// Ensure dark mode is stored
localStorage.setItem("theme", "dark");

// Apply dark mode immediately
document.documentElement.classList.add("dark");
document.body.classList.add("dark");

// Optional toggle behavior (you can remove this block if you want no toggle)
if (themeBtn) {
  themeBtn.textContent = "🌞";
  themeBtn.onclick = () => {
    alert("Dark mode is permanent 🌙");
  };
}
// === Get Date Parameter ===
const params = new URLSearchParams(window.location.search);
const date = params.get("date");

const dateTitle = document.getElementById("dateTitle");
const form = document.getElementById("tradeForm");
const tradeList = document.getElementById("tradeList");
const backBtn = document.getElementById("backBtn");
const themeBtn = document.getElementById("themeToggle");

dateTitle.textContent = `Trades for ${date}`;

// ===== PERMANENT DARK MODE (PERSISTENT) =====
function applyDarkTheme() {
  document.documentElement.classList.add("dark");
  document.body.classList.add("dark");
  if (themeBtn) themeBtn.textContent = "🌞";
}

// Save once, and always load dark mode
if (!localStorage.getItem("theme")) {
  localStorage.setItem("theme", "dark");
}

// Apply dark mode immediately
if (localStorage.getItem("theme") === "dark") {
  applyDarkTheme();
}

// Disable toggling — it stays dark
if (themeBtn) {
  themeBtn.onclick = () => {
    alert("Dark mode is permanently enabled 🌙");
  };
}

// ===== BACK BUTTON =====
backBtn.onclick = () => {
  window.location.href = "index.html";
};

// ===== TRADES STORAGE =====
function getTrades() {
  return JSON.parse(localStorage.getItem("trades") || "[]");
}

function saveTrades(trades) {
  localStorage.setItem("trades", JSON.stringify(trades));
}

// ===== DISPLAY TRADES =====
function renderTrades() {
  const trades = getTrades().filter((t) => t.date === date);
  tradeList.innerHTML = "";

  if (trades.length === 0) {
    tradeList.innerHTML = "<p>No trades logged for this date.</p>";
    return;
  }

  trades.forEach((t) => {
    const div = document.createElement("div");
    div.classList.add("trade-card");
    div.innerHTML = `
      <p><strong>${t.symbol}</strong> (${t.side})</p>
      <p>Qty: ${t.qty}</p>
      <p>Entry: ${t.entry} | Exit: ${t.exit}</p>
      <p>P&L: ${t.pnl}</p>
      <p>${t.notes}</p>
      <button class="delete-btn" data-id="${t.id}">🗑 Delete</button>
    `;
    tradeList.appendChild(div);
  });

  // delete button actions
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-id");
      const all = getTrades();
      const filtered = all.filter((t) => t.id !== id);
      saveTrades(filtered);
      renderTrades();
    };
  });
}

renderTrades();

// ===== ADD TRADE =====
form.onsubmit = (e) => {
  e.preventDefault();
  const symbol = document.getElementById("symbol").value;
  const side = document.getElementById("side").value;
  const qty = +document.getElementById("qty").value;
  const entry = +document.getElementById("entry").value;
  const exit = +document.getElementById("exit").value;
  const notes = document.getElementById("notes").value;
  const pnl = ((exit - entry) * qty).toFixed(2);

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
  };

  const all = getTrades();
  all.push(newTrade);
  saveTrades(all);

  form.reset();
  renderTrades();
};
