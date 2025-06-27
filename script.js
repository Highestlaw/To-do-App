let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const savedMode = localStorage.getItem("darkMode");
if (savedMode === "enabled") {
  document.body.classList.add("dark-mode");
}

function addTask(completed = false, taskText = "", category = "General", dueDate = "") {
  const taskInput = document.getElementById("taskInput");
  const categorySelect = document.getElementById("categorySelect");
  const dueDateInput = document.getElementById("dueDateInput");
  const taskList = document.getElementById("taskList");

  const text = taskText || taskInput.value.trim();
  const cat = category || categorySelect.value;
  const date = dueDate || dueDateInput.value;

  if (text === "") {
    alert("Please enter a task");
    return;
  }

  const li = document.createElement("li");
  li.classList.add("task-item");
  if (completed) li.classList.add("completed");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = completed;
  checkbox.className = "task-checkbox";
  checkbox.onchange = () => {
    li.classList.toggle("completed");
    saveTasksToStorage();
    updateTaskCounter();
  };

  const taskDetails = document.createElement("div");
  taskDetails.className = "task-details";

  const span = document.createElement("span");
  span.textContent = text;

  const meta = document.createElement("div");
  meta.className = "task-meta";
  meta.textContent = `📁 ${cat} | 📅 ${date || "No date"}`;

  taskDetails.appendChild(span);
  taskDetails.appendChild(meta);

  const editBtn = document.createElement("button");
  editBtn.textContent = "✏️";
  let isEditing = false;
  editBtn.onclick = () => {
    if (!isEditing) {
      const input = document.createElement("input");
      input.type = "text";
      input.value = span.textContent;
      taskDetails.replaceChild(input, span);
      editBtn.textContent = "💾";
      isEditing = true;
    } else {
      const newText = taskDetails.querySelector("input").value.trim();
      if (newText !== "") {
        span.textContent = newText;
        taskDetails.replaceChild(span, taskDetails.querySelector("input"));
        editBtn.textContent = "✏️";
        isEditing = false;
        saveTasksToStorage();
      } else {
        alert("Task cannot be empty");
      }
    }
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️";
  deleteBtn.onclick = () => {
    li.classList.add("fade-out");
    setTimeout(() => {
      li.remove();
      saveTasksToStorage();
      updateTaskCounter();
    }, 300);
  };

  const actions = document.createElement("div");
  actions.className = "task-actions";
  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(checkbox);
  li.appendChild(taskDetails);
  li.appendChild(actions);
  taskList.appendChild(li);

  if (!taskText) taskInput.value = "";
  if (!taskText) categorySelect.value = "General";
  if (!taskText) dueDateInput.value = "";

  saveTasksToStorage();
  updateTaskCounter();
}

function saveTasksToStorage() {
  const tasksToSave = [];
  document.querySelectorAll(".task-item").forEach(li => {
    const text = li.querySelector(".task-details span").textContent;
    const category = li.querySelector(".task-meta").textContent.match(/📁 (.*?) \|/)[1];
    const dueDate = li.querySelector(".task-meta").textContent.match(/📅 (.*)/)[1];
    const completed = li.querySelector("input[type='checkbox']").checked;
    tasksToSave.push({ text, category, dueDate, completed });
  });
  localStorage.setItem("tasks", JSON.stringify(tasksToSave));
}

function filterTasks() {
  const searchValue = document.getElementById("searchInput").value.toLowerCase();
  const tasks = document.querySelectorAll(".task-item");
  tasks.forEach(task => {
    const text = task.querySelector(".task-details span").textContent.toLowerCase();
    task.style.display = text.includes(searchValue) ? "" : "none";
  });
}

function toggleDarkMode() {
  const isDark = document.body.classList.toggle("dark-mode");
  const btn = document.getElementById("darkModeBtn");
  btn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
}

function updateTaskCounter() {
  const total = document.querySelectorAll(".task-item").length;
  const completed = document.querySelectorAll(".task-item.completed").length;
  const counter = document.getElementById("taskCounter");
  counter.textContent = total
    ? `${completed} of ${total} task${total > 1 ? "s" : ""} completed`
    : "No tasks yet";
}

window.onload = function () {
  const darkBtn = document.getElementById("darkModeBtn");
  darkBtn.textContent = document.body.classList.contains("dark-mode")
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";

  tasks.forEach(task => {
    addTask(task.completed, task.text, task.category, task.dueDate);
  });

  updateTaskCounter();
};

