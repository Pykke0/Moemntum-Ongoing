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
    const validText = value.replace(/[^a-zA-Zა-ჰ]/g, "");
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
