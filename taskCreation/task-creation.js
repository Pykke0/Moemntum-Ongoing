"use strict";

$(document).ready(function () {
  $("#selectedDate").datepicker({
    showButtonPanel: true,
    dateFormat: "yy-mm-dd",
  });

  $("#showCalendarBtn").on("click", function () {
    $("#selectedDate").focus();
  });

  $("#selectedDate").on("change", function () {
    let selectedDate = $(this).val();
    console.log("Selected Date: " + selectedDate);
  });
});
const modal = document.getElementById("myModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeBtn = document.getElementsByClassName("close-btn")[0];

openModalBtn.onclick = function () {
  modal.style.display = "block";
};

closeBtn.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
const input = document.getElementById("fileInput");
input.addEventListener("change", function (event) {
  const file = event.target.files[0];
  console.log(file);
});
// green n red validation shit idk
function setupInputValidation(inputId, minMessageId, maxMessageId) {
  const input = document.querySelector(`.${inputId}`);
  const minMessage = document.querySelector(`.${minMessageId}`);
  const maxMessage = document.querySelector(`.${maxMessageId}`);

  function validateInput() {
    const value = input.value;
    const validText = value.replace(/[^a-zA-Zა-ჰ ]/g, "");

    input.value = validText;
    const textLength = validText.length;

    minMessage.style.color = textLength >= 2 ? "green" : "red";
    maxMessage.style.color = textLength <= 255 ? "green" : "red";

    return textLength >= 2 && textLength <= 255;
  }

  input.addEventListener("input", validateInput);

  return validateInput;
}
const validateName = setupInputValidation(
  "name--input",
  "name--min",
  "name--max"
);
const validateLastname = setupInputValidation(
  "lastname--input",
  "lastname--min",
  "lastname--max"
);
const validateTitle = setupInputValidation(
  "title--input",
  "title--min",
  "title--max"
);
const validateDescription = setupInputValidation(
  "description",
  "description--min",
  "description--max"
);
const fileInput = document.getElementById("fileInput");
const fileText = document.querySelector(".file-text");
const filePreview = document.getElementById("filePreview");
let temp = false;
fileInput.addEventListener("change", function () {
  const file = fileInput.files[0];
  temp = true;
  if (file) {
    fileText.style.display = "none";
    const imageUrl = URL.createObjectURL(file);

    filePreview.src = imageUrl;
    filePreview.style.display = "block";
  } else {
    fileText.style.display = "inline-block";
    filePreview.style.display = "none";
  }
});
// DROPDOWN
document
  .querySelector(".main--container")
  .addEventListener("click", function (e) {
    e.preventDefault(); // hope this shit doesnt break whole thing

    const clicked = e.target.closest(".custom-select");
    if (!clicked) return;

    const selectedText = clicked.querySelector(".selected--text");
    const selectedPhoto = clicked.querySelector(".selected--photo");
    const optionsContainer = clicked.querySelector(".options");

    const isOpen = optionsContainer.style.display === "block";
    document
      .querySelectorAll(".options")
      .forEach((opt) => (opt.style.display = "none"));
    optionsContainer.style.display = isOpen ? "none" : "block";

    const img = clicked.querySelector(".img");
    const isDown = img.src.includes("Icon-arrow-down.svg");
    img.src = isDown
      ? "../assets/Icon-arrow-up.svg"
      : "../assets/Icon-arrow-down.svg";

    clicked.querySelectorAll(".option").forEach((option) => {
      option.addEventListener("click", (event) => {
        selectedText.textContent = option.textContent;
        optionsContainer.style.display = "none";
        if (selectedPhoto) selectedPhoto.src = option.querySelector("img").src;
        event.stopPropagation();
      });
    });
  });

document.addEventListener("click", (e) => {
  if (!e.target.closest(".custom-select")) {
    document
      .querySelectorAll(".options")
      .forEach((opt) => (opt.style.display = "none"));
  }
});

const priority = document.querySelector(".priority");
const statusesDIV = document.querySelector(".status");
const departmentsDIV = document.querySelector(".department");

// ========================= API FETCHING ========================== //
async function fetchData() {
  const baseURL = "https://momentum.redberryinternship.ge/api";
  const headers = {
    Accept: "application/json",
    Authorization: "Bearer 9e6c6c65-71d3-42f0-8424-9dd49a4775e3",
  };

  try {
    const [priorities, statuses, departments, employees] = await Promise.all([
      fetch(`${baseURL}/priorities`, { headers }).then((res) => res.json()),
      fetch(`${baseURL}/statuses`, { headers }).then((res) => res.json()),
      fetch(`${baseURL}/departments`, { headers }).then((res) => res.json()),
      fetch(`${baseURL}/employees`, { headers }).then((res) => res.json()),
    ]);
    // Priorities
    priorities.forEach((prio) => {
      const HTML = `
              <div class="option" data-id="${prio.id}">
                <img src="${prio.icon}" />
                <p class="selected--text">${prio.name}</p>
              </div>

      `;
      priority.querySelector(".options").insertAdjacentHTML("beforeend", HTML);
    });

    // Statuses
    statuses.forEach((stat) => {
      const HTML = `
              <div class="option" data-id="${stat.id}">${stat.name}</div>
      `;

      statusesDIV
        .querySelector(".options")
        .insertAdjacentHTML("beforeend", HTML);
    });

    // Departments

    departments.forEach((department) => {
      const HTML = `
              <div class="option" data-id="${department.id}">${department.name}</div>
    `;

      departmentsDIV
        .querySelector(".options")
        .insertAdjacentHTML("beforeend", HTML);
        console.log(department);
        
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
fetchData();
