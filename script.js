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



// === THEME SYSTEM (FINAL WORKING VERSION) ===
const themeToggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "🌞"; // sun icon for light mode
  } else {
    document.body.classList.remove("dark");
    themeToggle.textContent = "🌙"; // moon icon for dark mode
  }
}

// Load saved theme or default → light
let savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);

// Toggle + save permanently
themeToggle.onclick = () => {
  const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
  applyTheme(newTheme);
  localStorage.setItem("theme", newTheme);
};



// ✅✅✅ === PERMANENT SCREENSHOT SYSTEM === ✅✅✅

// Get the current day from URL
const params = new URLSearchParams(window.location.search);
const day = params.get("day");
const month = params.get("month");
const year = params.get("year");

// Unique key for saving screenshot of this day
const DAY_KEY = `${year}-${month}-${day}`;

// Save screenshot into localStorage
function saveScreenshot(base64) {
  let data = JSON.parse(localStorage.getItem("journalScreenshots") || "{}");
  data[DAY_KEY] = base64;
  localStorage.setItem("journalScreenshots", JSON.stringify(data));
}

// Load screenshot if it exists
function loadScreenshot() {
  let data = JSON.parse(localStorage.getItem("journalScreenshots") || "{}");
  const saved = data[DAY_KEY];

  if (saved) {
    document.querySelectorAll('.screenshot-container').forEach(container => {
      const preview = container.querySelector('.screenshot-preview');
      const removeBtn = container.querySelector('.remove-screenshot');
      const label = container.querySelector('.upload-label');

      preview.src = saved;
      preview.style.display = "block";
      removeBtn.style.display = "inline";
      label.style.display = "none";
    });
  }
}

loadScreenshot();


// === SCREENSHOT UPLOAD SYSTEM (UPDATED WITH SAVE) ===
document.querySelectorAll('.screenshot-input').forEach(input => {
  input.addEventListener('change', function() {
    const container = this.closest('.screenshot-container');
    const preview = container.querySelector('.screenshot-preview');
    const removeBtn = container.querySelector('.remove-screenshot');
    const file = this.files[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const base64 = e.target.result;

        preview.src = base64;
        preview.style.display = 'block';
        removeBtn.style.display = 'inline';
        container.querySelector('.upload-label').style.display = 'none';

        // ✅ Save permanently
        saveScreenshot(base64);
      };
      reader.readAsDataURL(file);
    }
  });
});

// === REMOVE SCREENSHOT (UPDATED WITH DELETE) ===
document.querySelectorAll('.remove-screenshot').forEach(button => {
  button.addEventListener('click', function() {
    const container = this.closest('.screenshot-container');
    const preview = container.querySelector('.screenshot-preview');
    const input = container.querySelector('.screenshot-input');
    const label = container.querySelector('.upload-label');

    input.value = '';
    preview.src = '';
    preview.style.display = 'none';
    this.style.display = 'none';
    label.style.display = 'inline-flex';

    // ✅ Remove from localStorage
    let data = JSON.parse(localStorage.getItem("journalScreenshots") || "{}");
    delete data[DAY_KEY];
    localStorage.setItem("journalScreenshots", JSON.stringify(data));
  });
});

// Enlarged popup image view
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('screenshot-preview')) {
    const img = e.target;
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    `;
    const enlarged = document.createElement('img');
    enlarged.src = img.src;
    enlarged.style.cssText = `
      max-width: 90%;
      max-height: 90%;
      border-radius: 10px;
    `;
    overlay.appendChild(enlarged);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', () => overlay.remove());
  }
});
/* =============================
   ✅ SCREENSHOT UPGRADE (KEEP ORIGINAL HTML)
   ============================= */

const SS_KEY = `screenshots-${date}`;    // per-day storage key
let SS_DB = JSON.parse(localStorage.getItem(SS_KEY) || "{}");

// Function to save screenshots
function saveScreenshots() {
  localStorage.setItem(SS_KEY, JSON.stringify(SS_DB));
}

// Automatically insert preview <img> NEXT to your upload-placeholder
function insertPreviewElement(cell) {
  let img = cell.querySelector(".auto-preview");
  if (!img) {
    img = document.createElement("img");
    img.className = "auto-preview";
    img.style.cssText = `
      width: 70px;
      height: 70px;
      border-radius: 6px;
      object-fit: cover;
      margin-top: 6px;
      display: none;
    `;
    cell.appendChild(img);
  }
  return img;
}

// Load saved screenshots on page load
function loadSavedScreenshots() {
  const rows = document.querySelectorAll("#tradeBody tr");
  rows.forEach((row, index) => {
    const cell = row.querySelectorAll("td")[6];  // screenshot column
    if (!cell) return;

    const saved = SS_DB[index];
    if (!saved) return;

    const img = insertPreviewElement(cell);
    img.src = saved;
    img.style.display = "block";

    // Hide placeholder
    const placeholder = cell.querySelector(".upload-placeholder");
    if (placeholder) placeholder.style.display = "none";
  });
}

// Handle screenshot upload
document.addEventListener("change", e => {
  if (!e.target.matches('td input[type="file"]')) return;

  const file = e.target.files[0];
  if (!file) return;

  const row = e.target.closest("tr");
  const index = Array.from(row.parentNode.children).indexOf(row);
  const reader = new FileReader();

  reader.onload = ev => {
    const base64 = ev.target.result;

    // save
    SS_DB[index] = base64;
    saveScreenshots();

    // show preview
    const cell = e.target.closest("td");
    const img = insertPreviewElement(cell);
    img.src = base64;
    img.style.display = "block";

    // hide "Upload" placeholder
    const placeholder = cell.querySelector(".upload-placeholder");
    if (placeholder) placeholder.style.display = "none";
  };

  reader.readAsDataURL(file);
});

// When deleting a row, shift screenshot indexes
document.addEventListener("click", e => {
  if (!e.target.classList.contains("deleteRow")) return;

  const tr = e.target.closest("tr");
  const index = Array.from(tr.parentNode.children).indexOf(tr);

  delete SS_DB[index];

  // rebuild map so screenshot indexes match row order
  const newMap = {};
  document.querySelectorAll("#tradeBody tr").forEach((row, i) => {
    if (SS_DB[i] !== undefined) newMap[i] = SS_DB[i];
  });

  SS_DB = newMap;
  saveScreenshots();
});
  
// Call loader after HTML is built
window.addEventListener("load", loadSavedScreenshots);
