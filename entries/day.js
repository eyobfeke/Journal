/* === SCREENSHOT SAVE SYSTEM === */

// current day key
const dayKey = `screenshots-${date}`;

// Load existing screenshot data
let screenshotDB = JSON.parse(localStorage.getItem(dayKey) || "{}");

// On page load – populate screenshots
function loadScreenshots() {
  const rows = document.querySelectorAll("#tradeBody tr");
  rows.forEach((tr, index) => {
    const ssBox = tr.querySelector(".screenshot-box");
    const preview = ssBox.querySelector(".ss-preview");
    const remove = ssBox.querySelector(".ss-remove");
    const uploadBtn = ssBox.querySelector(".ss-upload-btn");

    if (screenshotDB[index]) {
      preview.src = screenshotDB[index];
      preview.style.display = "block";
      remove.style.display = "inline";
      uploadBtn.style.display = "none";
    }
  });
}

// Track screenshot uploads
document.addEventListener("click", e => {
  if (e.target.classList.contains("ss-upload-btn")) {
    const box = e.target.closest(".screenshot-box");
    box.querySelector(".ss-input").click();
  }

  if (e.target.classList.contains("ss-remove")) {
    const tr = e.target.closest("tr");
    const index = [...tradeBody.children].indexOf(tr);

    delete screenshotDB[index];
    localStorage.setItem(dayKey, JSON.stringify(screenshotDB));

    const preview = e.target.previousElementSibling;
    const uploadBtn = e.target.nextElementSibling;

    preview.style.display = "none";
    e.target.style.display = "none";
    uploadBtn.style.display = "inline";
  }
});

// Handle file selection
document.addEventListener("change", e => {
  if (e.target.classList.contains("ss-input")) {
    const file = e.target.files[0];
    const tr = e.target.closest("tr");
    const index = [...tradeBody.children].indexOf(tr);

    const reader = new FileReader();
    reader.onload = function(ev) {
      screenshotDB[index] = ev.target.result;
      localStorage.setItem(dayKey, JSON.stringify(screenshotDB));

      const box = e.target.closest(".screenshot-box");
      const preview = box.querySelector(".ss-preview");
      const remove = box.querySelector(".ss-remove");
      const uploadBtn = box.querySelector(".ss-upload-btn");

      preview.src = ev.target.result;
      preview.style.display = "block";
      remove.style.display = "inline";
      uploadBtn.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});


// Load screenshots immediately
loadScreenshots();
