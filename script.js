// العناصر
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const todoList = document.getElementById("todoList");
const form = document.querySelector(".task-form");
const taskCount = document.getElementById("taskCount");
const clearAllButton = document.getElementById("clearAll");
const filterButtons = document.querySelectorAll(".filter");

// تحميل المهام عند تشغيل الصفحة
window.onload = () => {
  loadTasks();
  updateTaskCount();
};

// إضافة مهمة جديدة
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  addTask(taskText);
  saveTask(taskText);
  taskInput.value = "";
  updateTaskCount();
});

// إنشاء عنصر مهمة جديدة
function addTask(taskText, completed = false) {
  const li = document.createElement("li");
  li.className = "todo-item";
  if (completed) li.classList.add("completed");

  li.innerHTML = `
    <span class="task-text">${taskText}</span>
    <div class="actions">
      <button class="complete-btn" title="Mark as done"><i class="fa-solid fa-check"></i></button>
      <button class="delete-btn" title="Delete"><i class="fa-solid fa-trash"></i></button>
    </div>
  `;

  todoList.appendChild(li);

  // زر الشطب
  li.querySelector(".complete-btn").addEventListener("click", () => {
    li.classList.toggle("completed");
    updateLocalStorage();
    updateTaskCount();
  });

  // زر الحذف
  li.querySelector(".delete-btn").addEventListener("click", () => {
    li.remove();
    updateLocalStorage();
    updateTaskCount();
  });

  applyFilter(); // لتحديث الفلترة تلقائيًا بعد الإضافة
}

// حفظ المهمة الجديدة
function saveTask(taskText) {
  const tasks = getTasks();
  tasks.push({ text: taskText, completed: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// تحميل المهام من التخزين المحلي
function loadTasks() {
  const tasks = getTasks();
  tasks.forEach((task) => addTask(task.text, task.completed));
}

// تحديث المهام في localStorage بعد تعديل
function updateLocalStorage() {
  const tasks = [];
  document.querySelectorAll(".todo-item").forEach((item) => {
    tasks.push({
      text: item.querySelector(".task-text").textContent,
      completed: item.classList.contains("completed"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// الحصول على المهام
function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

// تحديث عداد المهام
function updateTaskCount() {
  const count = document.querySelectorAll(".todo-item").length;
  taskCount.textContent = `Total: ${count}`;
}

// زر Clear All
clearAllButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all tasks?")) {
    todoList.innerHTML = "";
    localStorage.removeItem("tasks");
    updateTaskCount();
  }
});

// الفلاتر
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    applyFilter();
  });
});

function applyFilter() {
  const filter = document.querySelector(".filter.active").dataset.filter;
  const items = document.querySelectorAll(".todo-item");

  items.forEach((item) => {
    const isCompleted = item.classList.contains("completed");

    if (filter === "all") {
      item.style.display = "flex";
    } else if (filter === "active" && isCompleted) {
      item.style.display = "none";
    } else if (filter === "completed" && !isCompleted) {
      item.style.display = "none";
    } else {
      item.style.display = "flex";
    }
  });
}
