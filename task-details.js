"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const taskId = urlParams.get("id");

  if (!taskId) {
    document.getElementById("task-details").innerHTML =
      "<p>Task not found.</p>";
    return;
  }

  try {
    const [taskRes, departmentsRes] = await Promise.all([
      fetch(`https://momentum.redberryinternship.ge/api/tasks/${taskId}`, {
        headers: {
          Authorization: "Bearer 9e6c6c65-71d3-42f0-8424-9dd49a4775e3",
        },
      }),
      fetch(`https://momentum.redberryinternship.ge/api/departments`, {
        headers: {
          Authorization: "Bearer 9e6c6c65-71d3-42f0-8424-9dd49a4775e3",
        },
      }),
    ]);

    if (!taskRes.ok) throw new Error(`HTTP Error: ${taskRes.status}`);

    const task = await taskRes.json();
    const departments = await departmentsRes.json();

    const HTML = `
      <div class="inner--frame-parent">
        <div class="inner--frame-group">
          <div class="inner--instance-parent">
            <div class="inner--medium-parent importance--${task.priority.id}">
              <img class="inner--medium-icon" alt="" src="${
                task.priority.icon
              }" />
              <div class="inner--difficulty-label">${task.priority.name}</div>
            </div>
            <div class="inner--category-wrapper">
              <div class="inner--category">
                ${task.department.name
                  .split(" ")
                  .map((word) => word.slice(0, 3) + ".")
                  .join(" ")}
              </div>
            </div>
          </div>
          <div class="inner--project-title">${task.name}</div>
        </div>
        <div class="inner--responsive-wrapper">
          <div class="inner--project-description">${task.description}</div>
        </div>
      </div>

      <div class="inner--info-frame-parent">
        <div class="inner--info-wrapper">
          <div class="inner--info-div">დავალების დეტალები</div>
        </div>
        <div class="inner--info-frame-group">
          <div class="inner--info-frame-container">
            <div class="inner--info-pie-chart-parent">
              <img class="inner--info-pie-chart-icon" alt="" src="./assets/icon-pie-chart.svg" />
              <div class="inner--info-div1">სტატუსი</div>
            </div>
            <div class="inner--info-frame-wrapper">
              <div class="inner--info-parent">
                <div class="inner--info-div2">${task.status.name}</div>
                <img class="inner--info-down-icon" alt="" src="./assets/Icon-arrow-down.svg" />
              </div>
              <div class="options" style="display: none;">
                <div class="option" data-id="1">დასაწყები</div>
                <div class="option" data-id="2">პროგრესში</div>
                <div class="option" data-id="3">მზად ტესტირებისთვის</div>
                <div class="option" data-id="4">დასრულებული</div>
              </div>
            </div>
          </div>

          <div class="inner--info-frame-div">
            <div class="inner--info-pie-chart-parent">
              <div class="inner--info-user-wrapper">
                <img class="user" src="./assets/icon-user.svg" />
              </div>
              <div class="inner--info-div1">თანამშრომელი</div>
            </div>
            <div class="inner--info-frame-parent2">
              <div class="inner--info-container">
                <div class="inner--info-div4">${task.department.name}</div>
              </div>
              <div class="inner--info-ellipse-parent">
                <img class="inner--info-frame-child" alt="" src="${
                  task.employee.avatar
                }" />
                <div class="inner--info-frame">
                  <div class="inner--info-div5">${task.employee.name} ${
      task.employee.surname
    }</div>
                </div>
              </div>
            </div>
          </div>

          <div class="inner--info-frame-parent3">
            <div class="inner--info-calendar-parent">
              <img class="inner--info-pie-chart-icon" alt="" src="./assets/icon-calendar.svg" />
              <div class="inner--info-div1">დავალების ვადა</div>
            </div>
            <div class="inner--info-pie-chart-group">
              <div class="inner--info-div7">სტატუსი</div>
            </div>
            <div class="inner--info-wrapper1">
              <div class="inner--info-div1">${task.due_date.split("T")[0]}</div>
            </div>
          </div>
        </div>
      </div>
    `;

    document
      .querySelector(".left--container")
      .insertAdjacentHTML("beforeend", HTML);
    console.log(task);

    // DEPARTMENTs ==========================
    departments.forEach((dep) => {
      const HTML2 = `<option value="${dep.id}" class="departments--option">${dep.name}</option>`;
      document
        .querySelector("#departments--list")
        .insertAdjacentHTML("beforeend", HTML2);
    });
  } catch (error) {
    console.error("Error fetching task details:", error);
    document.getElementById("task-details").innerHTML =
      "<p>Failed to load task details.</p>";
  }

  // ========================= anything else ========================= //
  const options = document.querySelector(".options");
  const optionElements = document.querySelectorAll(".option");
  const dropdown = document.querySelector(".inner--info-parent");

  dropdown.addEventListener("click", () => {
    options.style.display = options.style.display === "none" ? "block" : "none";
  });

  optionElements.forEach((option) => {
    option.addEventListener("click", async function () {
      const selectedValue = this.innerText;
      const selectedId = this.getAttribute("data-id");

      dropdown.querySelector(".inner--info-div2").innerText = selectedValue;
      dropdown
        .querySelector(".inner--info-div2")
        .setAttribute("data-id", selectedId);
      options.style.display = "none";
      console.log("Selected ID:", selectedId);

      // something
      await fetch(
        `https://momentum.redberryinternship.ge/api/tasks/${taskId}`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer 9e6c6c65-71d3-42f0-8424-9dd49a4775e3",
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status_id: selectedId }),
        }
      );
    });
  });
});

// Modal thingies
const modal = document.getElementById("myModal2");
const openModalBtn = document.getElementById("openModalBtn");
const closeBtn = document.getElementsByClassName("close-btn")[0];

openModalBtn.onclick = () => {
  modal.style.display = "block";
};

closeBtn.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
