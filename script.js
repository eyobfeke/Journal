// ==== Calendar ====
const calendarEl = document.getElementById("calendar");
const monthYearEl = document.getElementById("monthYear");
const themeBtn = document.getElementById("themeToggle");

let currentDate = new Date();

// ---- THEME ----
function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "🌙";
  } else {
    document.body.classList.remove("dark");
    themeBtn.textContent = "🌞";
  }
}

let savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);

themeBtn.onclick = () => {
  savedTheme = savedTheme === "light" ? "dark" : "light";
  localStorage.setItem("theme", savedTheme);
  applyTheme(savedTheme);
};

// ---- CALENDAR ----
function renderCalendar() {
  if (!calendarEl) return;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  monthYearEl.textContent = `${currentDate.toLocaleString("default", {
    month: "long",
  })} ${year}`;

  calendarEl.innerHTML = "";

  // Fill blanks before first day
  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement("div");
    calendarEl.appendChild(blank);
  }

  // Render each day
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    const cell = document.createElement("div");
    cell.classList.add("day");
    cell.innerHTML = `<div class="day-number">${day}</div>`;

    const trades = getTradesForDate(dateStr);
    if (trades.length) {
      const tradesDiv = document.createElement("div");
      tradesDiv.classList.add("trades");
      trades.forEach((t) => {
        const tradeDiv = document.createElement("div");
        tradeDiv.classList.add("trade", t.side.toLowerCase());
        tradeDiv.textContent = `${t.symbol} (${t.side}) - P&L: ${t.pnl}`;
        tradesDiv.appendChild(tradeDiv);
      });
      cell.appendChild(tradesDiv);
    }

    cell.addEventListener("click", () => {
      window.location.href = `day.html?date=${dateStr}`;
    });

    calendarEl.appendChild(cell);
  }
}

document.getElementById("prevMonth").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
};

document.getElementById("nextMonth").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
};

function getTradesForDate(date) {
  const allTrades = JSON.parse(localStorage.getItem("trades") || "[]");
  return allTrades.filter((t) => t.date === date);
}

renderCalendar();

