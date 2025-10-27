const params = new URLSearchParams(window.location.search);
const date = params.get("date");

const dateTitle = document.getElementById("dateTitle");
const form = document.getElementById("tradeForm");
const tradeList = document.getElementById("tradeList");
const backBtn = document.getElementById("backBtn");
const themeBtn = document.getElementById("themeToggle");

dateTitle.textContent = `Trades for ${date}`;

// ===== FORCE DARK MODE (PERMANENT) =====
document.body.classList.add("dark");
document.documentElement.classList.add("dark");

// Optional: change button icon to sun to match dark mode
if (themeBtn) themeBtn.textContent = "🌞";

// Remove toggle functionality — dark mode stays forever
if (themeBtn) {
  themeBtn.onclick = () => {
    alert("Dark mode is set permanently.");
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
const params = new URLSearchParams(window.location.search);
const date = params.get("date");

const dateTitle = document.getElementById("dateTitle");
const form = document.getElementById("tradeForm");
const tradeList = document.getElementById("tradeList");
const backBtn = document.getElementById("backBtn");
const themeBtn = document.getElementById("themeToggle");

dateTitle.textContent = `Trades for ${date}`;

// ===== FORCE DARK MODE (PERMANENT) =====
document.body.classList.add("dark");
document.documentElement.classList.add("dark");

// Optional: change button icon to sun to match dark mode
if (themeBtn) themeBtn.textContent = "🌞";

// Remove toggle functionality — dark mode stays forever
if (themeBtn) {
  themeBtn.onclick = () => {
    alert("Dark mode is set permanently.");
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
const params = new URLSearchParams(window.location.search);
const date = params.get("date");

const dateTitle = document.getElementById("dateTitle");
const form = document.getElementById("tradeForm");
const tradeList = document.getElementById("tradeList");
const backBtn = document.getElementById("backBtn");
const themeBtn = document.getElementById("themeToggle");

dateTitle.textContent = `Trades for ${date}`;

// ===== FORCE DARK MODE (PERMANENT) =====
document.body.classList.add("dark");
document.documentElement.classList.add("dark");

// Optional: change button icon to sun to match dark mode
if (themeBtn) themeBtn.textContent = "🌞";

// Remove toggle functionality — dark mode stays forever
if (themeBtn) {
  themeBtn.onclick = () => {
    alert("Dark mode is set permanently.");
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
const params = new URLSearchParams(window.location.search);
const date = params.get("date");

const dateTitle = document.getElementById("dateTitle");
const form = document.getElementById("tradeForm");
const tradeList = document.getElementById("tradeList");
const backBtn = document.getElementById("backBtn");
const themeBtn = document.getElementById("themeToggle");

dateTitle.textContent = `Trades for ${date}`;

// ===== FORCE DARK MODE (PERMANENT) =====
document.body.classList.add("dark");
document.documentElement.classList.add("dark");

// Optional: change button icon to sun to match dark mode
if (themeBtn) themeBtn.textContent = "🌞";

// Remove toggle functionality — dark mode stays forever
if (themeBtn) {
  themeBtn.onclick = () => {
    alert("Dark mode is set permanently.");
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
