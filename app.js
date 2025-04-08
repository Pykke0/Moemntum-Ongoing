"use strict";
const department = document.querySelector(".dropdown--parent");
const departementContainer = document.querySelector(".instance--parent");
const dropdowns = document.querySelectorAll(".dropdown--parent");
const allButtons = document.querySelectorAll(".btn--filter");
let temp = false;

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
const personName = document.querySelector(".name--input");
const lastName = document.querySelector(".lastname--input");
const fileInput = document.getElementById("fileInput");
let departmentId = document.getElementById("departments--list");
const testFunc = async function () {
  if (validateName() && validateLastname() && temp) {
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("name", personName.value);
    formData.append("surname", lastName.value);
    formData.append("avatar", file);
    formData.append("department_id", departmentId.value);

    try {
      const response = await fetch(
        "https://momentum.redberryinternship.ge/api/employees",
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
            Authorization: "Bearer 9e6c6c65-71d3-42f0-8424-9dd49a4775e3",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to upload");

      const result = await response.json();
      console.log("Success:", result);
      console.log(document.querySelector(".name--input").value);

      document.querySelector(".lastname--input").value = "";
    } catch (error) {
      console.error("Error:", error);
    }
  } else {
    console.log(false);
  }
};

document
  .getElementById("addEmployeeBtn")
  .addEventListener("click", () => testFunc());

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
        <div class="check-parent" data-id="${department.id}">
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

      const HTML2 = `
       <option value="${department.id}" class="departments--option">${department.name}</option>
      `;
      document
        .querySelector("#departments--list")
        .insertAdjacentHTML("beforeend", HTML2);
    });

    // Render tasks
    setTimeout(() => {
      tasks.forEach((task) => {
        const HTML = `<button class="task--container btn" data-id="${
          task.id
        }" data-department="${task.employee.department.id}" data-priority="${
          task.priority.id
        }" data-employee="${task.employee.id}">
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

        if (task.status.name === "დასაწყები") {
          document.querySelector(".__1").insertAdjacentHTML("beforeend", HTML);
        } else if (task.status.name == "პროგრესში") {
          document.querySelector(".__2").insertAdjacentHTML("beforeend", HTML);
        } else if (task.status.name == "მზად ტესტირებისთვის") {
          document.querySelector(".__3").insertAdjacentHTML("beforeend", HTML);
        } else if (task.status.name == "დასრულებული") {
          document.querySelector(".__4").insertAdjacentHTML("beforeend", HTML);
        }
      });
    }, 100);

    // Render employees
    employees.forEach((person) => {
      const HTML = `
        <div class="check-parent" data-id="${person.id}">
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
        <div class="check-parent" data-id="${prio.id}">
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

// ==================== Event Listeners ==================== //
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
  document
    .querySelector(".btn--newWork")
    .addEventListener(
      "click",
      () => (window.location.href = "./taskCreation/task-creation.html")
    );
});
document.addEventListener("DOMContentLoaded", () => {
  const parent = document.querySelectorAll(".instance--parent");
  parent.forEach((parent) => {
    parent.addEventListener("click", function (e) {
      const clickedParent = e.target.closest(".check-parent");
      if (!clickedParent) return;

      const vectorIcon = clickedParent.querySelector(".vector-icon");
      const isChecked = vectorIcon.classList.contains("checked");

      isChecked
        ? vectorIcon.classList.remove("checked")
        : vectorIcon.classList.add("checked");
    });
  });
});

// ==================== Test ==================== //
fetchData();
document.addEventListener("DOMContentLoaded", () => {
  const array_1 = [];
  const array_2 = [];
  const array_3 = [];
  const arrays = {
    1: array_1,
    2: array_2,
    3: array_3,
  };
  document
    .querySelector(".inner--container")
    .addEventListener("click", function (e) {
      const clicked = e.target.closest(".btn");
      if (!clicked) return;
      // console.log(clicked);

      const dataNumber = clicked.getAttribute("data-number");
      const department = document.querySelector(
        `.dropdown--parent[data-pressed="${dataNumber}"]`
      );
      clicked.classList.contains("active")
        ? removeAllSelected()
        : addAllSelected(clicked, department);
    });
  document.querySelectorAll(".button--wrapper").forEach((button) => {
    button.addEventListener("click", function () {
      const container = button.closest(".dropdown--parent");
      const arrayKey = button.getAttribute("data-id");
      const targetArray = arrays[arrayKey];
      targetArray.length = 0;
      container.querySelectorAll(".check-parent").forEach((element) => {
        if (
          element.querySelector(".vector-icon").classList.contains("checked")
        ) {
          const dataId = element.getAttribute("data-id");
          targetArray.push(dataId);
          // console.log(element.getAttribute("data-id"));
        }
      });
      updateFiltering();
      updatefilteringUI();
      // console.log(array_1, array_2, array_3);
    });
  });

  const updateFiltering = function () {
    document.querySelectorAll(".task--container").forEach((task) => {
      const taskDepartmentId = task.getAttribute("data-department");
      const taskPriorityId = task.getAttribute("data-priority");
      const taskEmployeeId = task.getAttribute("data-employee");

      const isDepartmentChecked =
        array_1.length === 0 || array_1.includes(taskDepartmentId);
      const isPriorityChecked =
        array_2.length === 0 || array_2.includes(taskPriorityId);
      const isEmployeeChecked =
        array_3.length === 0 || array_3.includes(taskEmployeeId);

      task.style.display =
        isDepartmentChecked && isPriorityChecked && isEmployeeChecked
          ? "flex"
          : "none";
    });
  };

  const updatefilteringUI = function () {
    const allOptionsContainer = document.querySelector(".all--options");
    if (!allOptionsContainer) return;

    // Clear existing options
    allOptionsContainer.innerHTML = "";

    // Add clear button visibility logic
    const clearButton = document.querySelector(".clear--button");
    let hasAnyOptions = false;

    // Rebuild options
    document.querySelectorAll(".check-parent").forEach((option) => {
      const vectorIcon = option.querySelector(".vector-icon");
      if (vectorIcon && vectorIcon.classList.contains("checked")) {
        hasAnyOptions = true;
        const text = option.querySelector(".button")?.textContent || "";
        const id = option.getAttribute("data-id");
        const arrayId = option
          .closest(".dropdown--parent")
          ?.getAttribute("data-pressed");

        if (id && arrayId) {
          const HTML = `
            <div class="option--parent" data-id="${id}" data-array="${arrayId}">
              <div>${text}</div>
              <button class="btn x--button">
                <img class="x--icon" alt="" src="./assets/icon-x.svg" />
              </button>
            </div>`;
          allOptionsContainer.insertAdjacentHTML("beforeend", HTML);
        }
      }
    });

    // Update clear button visibility
    if (clearButton) {
      clearButton.style.display = hasAnyOptions ? "block" : "none";
    }
  };

  document
    .querySelector(".clear--button")
    .addEventListener("click", function () {
      document
        .querySelectorAll(".check")
        .forEach((check) => check.classList.remove("checked"));
      array_1.length = 0;
      array_2.length = 0;
      array_3.length = 0;
      updateFiltering();
      updatefilteringUI();
      this.style.display = "none";
    });

  const deleteOptions = document.querySelector(".all--options");
  deleteOptions.addEventListener("click", function (event) {
    const button = event.target.closest(".x--button");
    if (button) {
      const option = button.closest(".option--parent");
      const id = option.getAttribute("data-id");
      const arrayKey = option.getAttribute("data-array");
      const targetArray = arrays[arrayKey];

      const index = targetArray.indexOf(id);
      if (index !== -1) targetArray.splice(index, 1);

      const checkParent = document.querySelector(
        `.check-parent[data-id="${id}"]`
      );
      const vectorIcon = checkParent.querySelector(".vector-icon");
      vectorIcon.classList.remove("checked");
      console.log(option);

      updateFiltering();
      updatefilteringUI();
      option.remove();
    }
  });

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

const fileText = document.querySelector(".file-text");
const filePreview = document.getElementById("filePreview");
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
