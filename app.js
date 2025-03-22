"use strict";
const department = document.querySelector(".dropdown--parent");
const departementContainer = document.querySelector(".instance--parent");
const dropdowns = document.querySelectorAll(".dropdown--parent");
const allButtons = document.querySelectorAll(".btn--filter");

document
  .querySelector(".inner--container")
  .addEventListener("click", function (e) {
    e.preventDefault();
    const clicked = e.target.closest(".btn");

    if (!clicked) return;

    const dataNumber = clicked.getAttribute("data-number");
    const department = document.querySelector(
      `.dropdown--parent[data-pressed="${dataNumber}"]`
    );
    clicked.classList.contains("active")
      ? removeAllSelected()
      : addAllSelected(clicked, department);
  });

// ==================== Functions ==================== //
const removeAllSelected = () => {
  allButtons.forEach((button) => {
    button.classList.remove("selected");
    button.classList.remove("active");
    button.querySelector("img").src = "./assets/Icon-arrow-down.svg";
  });
  dropdowns.forEach((dropdown) => {
    dropdown.classList.add("display--none");
  });
};

const addAllSelected = (btn, info) => {
  removeAllSelected();
  btn.classList.add("selected");
  btn.classList.add("active");
  info.classList.remove("display--none");
  btn.querySelector("img").src = "./assets/Icon-arrow-up.svg";
};

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

// Get the validation functions
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

const testFunc = function () {
  if (validateName() && validateLastname() && temp) {
    console.log(true);
  } else {
    console.log(false);
  }
};

setupInputValidation("name--input", "name--min", "name--max");
setupInputValidation("lastname--input", "lastname--min", "lastname--max");
// ==================== Fetching data from API ==================== //

async function fetchData() {
  const baseURL = "https://momentum.redberryinternship.ge/api";
  const headers = {
    Accept: "application/json",
    Authorization: "Bearer 9e6c6c65-71d3-42f0-8424-9dd49a4775e3",
  };

  try {
    const [statuses, employees, priorities, departments, tasks] =
      await Promise.all([
        fetch(`${baseURL}/statuses`, { headers }).then((res) => res.json()),
        fetch(`${baseURL}/employees`, { headers }).then((res) => res.json()),
        fetch(`${baseURL}/priorities`, { headers }).then((res) => res.json()),
        fetch(`${baseURL}/departments`, { headers }).then((res) => res.json()),
        fetch(`${baseURL}/tasks`, { headers }).then((res) => res.json()),
      ]);

    // Render departments
    departments.forEach((department) => {
      const HTML = `
        <div class="check-parent">
          <div class="check btn">
            <img class="vector-icon" alt="" src="" />
          </div>
          <div class="frame-wrapper">
            <div class="button">${department.name}</div>
          </div>
        </div>`;
      document
        .querySelector(".instance--parent")
        .insertAdjacentHTML("beforeend", HTML);
    });

    // Render tasks
    setTimeout(() => {
      tasks.forEach((task) => {
        const HTML = `<button class="task--container btn" data-id="${task.id}">
        <div class="layer--1-container">
        <div class="layer--1-inner-container">
        <div class="importance--parent importance--${task.priority.id}">
        <img class="importance-icon" alt="" src="${task.priority.icon}" />
        <div>${task.priority.name}</div>
        </div>
        <div class="type--parent">
        <div>${task.employee.department.name
          .split(" ")
          .map((word) => word.slice(0, 3) + ".")
          .join(" ")}</div>
          </div>
          </div>
          <div class="date">${task.due_date.split("T")[0]}</div>
          </div>
          <div class="redberry--container">
          <div class="redberry-text">${task.name}</div>
          <div>${task.description}</div>
          </div>
          <div class="layer--2-container">
          <img class="frame-child" data-id="${task.employee.id}" src="${
          task.employee.avatar
        }" />
          <div class="comments--parent">
          <img class="comments-icon" alt="" src="./assets/icon-comment.svg" />
          <div>${task.total_comments}</div>
          </div>
          </div>
          </button>`;
        // console.log(task);

        if (task.status.name === "დასაწყები") {
          document.querySelector(".__1").insertAdjacentHTML("beforeend", HTML);
        } else if (task.status.name == "პროგრესში") {
          document.querySelector(".__2").insertAdjacentHTML("beforeend", HTML);
        } else if (task.status.name == "მზად ტესტირებისთვის") {
          document.querySelector(".__3").insertAdjacentHTML("beforeend", HTML);
        } else if (task.status.name == "დასრულებული") {
          document.querySelector(".__3").insertAdjacentHTML("beforeend", HTML);
        }

        // console.log(task.status.name);
      });
    }, 100);

    // Render employees
    employees.forEach((person) => {
      const HTML = `
        <div class="check-parent">
          <div class="check btn">
            <img class="vector-icon" alt="" src="" />
          </div>
          <div class="ellipse-parent">
            <img class="frame-child" alt="" src="${person.avatar}" />
            <div class="wrapper">
              <div class="button" data-id="${person.id}">${person.name} ${person.surname}</div>
            </div>
          </div>
        </div>`;
      document
        .querySelector(".instance-parent")
        .insertAdjacentHTML("beforeend", HTML);
      // console.log(person);
    });

    // Render statuses
    statuses.forEach((status) => {
      const HTML = `
        <div class="tasks--inner-container">
          <div class="task--title-container _${status.id}">
            <div class="task--title">${status.name}</div>
          </div>
          <div class="tasks--grid __${status.id}"></div>
        </div>`;
      document
        .querySelector(".tasks--container")
        .insertAdjacentHTML("beforeend", HTML);
    });

    // Render priorities
    priorities.forEach((prio) => {
      const HTML = `
        <div class="check-parent">
          <button class="check btn">
            <img class="vector-icon" alt="" src="" />
          </button>
          <div class="frame-wrapper">
            <div class="button">${prio.name}</div>
          </div>
        </div>`;
      document.querySelector(".priority").insertAdjacentHTML("beforeend", HTML);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (event) => {
    const button = event.target.closest(".task--container");
    if (button) {
      const taskId = button.getAttribute("data-id");
      if (taskId) {
        window.location.href = `task-details.html?id=${taskId}`;
        console.log("works");
      }
    }
  });
  document.querySelector(".btn--newWork").addEventListener("click", () => {
    console.log("Redirecting to task creation page...");
    window.location.href = "./taskCreation/task-creation.html";
  });
});

// ==================== Test ==================== //
window.addEventListener("DOMContentLoaded", () => {
  fetchData();
  const filteredAddons = [];

  // STUPID PIECE OF SHIT CHECKING IF WE SHOULD FUCKING SORT IF OR NOT FUCK THIS SHIT MAN
  document.addEventListener("click", function (event) {
    if (event.target.type === "file") {
      return;
    }

    event.preventDefault();

    if (event.target.closest(".check")) {
      const img = event.target.closest(".check").querySelector(".vector-icon");
      img.classList.toggle("checked");

      if (img.classList.contains("checked")) {
        filteredAddons.push(
          img.closest(".check-parent").querySelector(".button").outerHTML
        );
      } else {
        console.log(img.closest(".check-parent").querySelector(".button"));

        filteredAddons.splice(
          filteredAddons.indexOf(
            img.closest(".check-parent").querySelector(".button")
          ),
          1
        );
      }
    }
  });

  const unCheckAll = function (e) {
    document.querySelectorAll(".check").forEach((check) => {
      check.classList.remove("checked");
    });
  };

  // X button deletion
  const deleteOptions = document.querySelector(".all--options");
  deleteOptions.addEventListener("click", function (event) {
    const button = event.target.closest(".x--button");
    if (button) {
      unCheckAll();
      button.closest(".option--parent").remove();
      filteredAddons.splice(
        filteredAddons.indexOf(
          img.closest(".check-parent").querySelector(".button").textContent
        ), // BUG HERE
        1
      );
    }
  });

  document
    .querySelector(".clear--button")
    .addEventListener("click", function () {
      document.querySelectorAll(".option--parent").forEach((option) => {
        option.remove();
      });
      this.classList.add("display--none");
      filteredAddons.length = 0;
      document.querySelectorAll(".vector-icon").forEach((check) => {
        check.classList.remove("checked");
      });
    });

  // Filtering Yet again
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("btn--purple")) {
      // here
      updateFiltering();
      // event.target.closest(".dropdown--parent").classList.add("display--none");
    }
  });

  const updateFiltering = function () {
    document.querySelectorAll(".option--parent").forEach((element) => {
      element.remove();
    });
    filteredAddons.forEach((addon) => {
      const HTML = `
          <div class="option--parent">
            <div>${addon}</div>
            <button class="btn x--button">
              <img class="x--icon" alt="" src="./assets/icon-x.svg" />
            </button>
          </div>`;
      document
        .querySelector(".all--options")
        .insertAdjacentHTML("beforeend", HTML);

      console.log(addon.getAttribute);
    });
    if (filteredAddons.length > 0) {
      document
        .querySelector(".clear--button")
        .classList.remove("display--none");
    } else {
      document.querySelector(".clear--button").classList.add("display--none");
    }

    document.querySelectorAll(".task--container").forEach((task) => {
      // console.log(task.querySelector(".frame-child").getAttribute("data-id"));
      // console.log(filteredAddons);
    });
  };

  // ============= MODAL MANIPULATION =============== //
  const modal = document.getElementById("myModal2");
  const openModalBtn = document.getElementById("openModalBtn2");
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
});
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
