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
modal.style.display = "block";

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
  // Check if preventDefault() is necessary
  // If not needed, let the default action occur
  const file = event.target.files[0];
  console.log(file);
});

// Example where preventDefault is used only for certain events
document
  .getElementById("someForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // This is okay for form submission, not for file input
    console.log("Form submission intercepted");
  });
