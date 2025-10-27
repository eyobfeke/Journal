// === Calendar Setup ===
const monthTitle = document.getElementById("month-title");
const calendar = document.querySelector(".calendar");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");

let currentDate = new Date();

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  monthTitle.textContent = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  calendar.innerHTML = "";
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const emptyDiv = document.createElement("div");
    calendar.appendChild(emptyDiv);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement("div");
    dayDiv.textContent = day;
    dayDiv.onclick = () => (window.location.href = `daily.html?day=${day}&month=${month + 1}&year=${year}`);
    calendar.appendChild(dayDiv);
  }
}

prevMonthBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
};

nextMonthBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
};

renderCalendar();

// === Theme Toggle (Permanent Dark Mode) ===
const themeToggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    document.body.classList.add("dark");
    themeToggle.textContent = "🌞";
  } else {
    document.documentElement.classList.remove("dark");
    document.body.classList.remove("dark");
    themeToggle.textContent = "🌙";
  }
}

// Always default to dark and save it
let savedTheme = localStorage.getItem("theme");
if (!savedTheme) {
  savedTheme = "dark";
  localStorage.setItem("theme", "dark");
}

// Apply immediately before any rendering
applyTheme(savedTheme);

// Disable switching (keep dark permanent)
themeToggle.onclick = () => {
  alert("Dark mode is always enabled 🌙");
};
