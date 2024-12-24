// ------------ Model ------------ //
let _showTaskModal = document.getElementById("showTaskModal");
let _todoCard = document.getElementById("todoCard");
let _todoList = document.getElementById("todoList");
let _inProgressCard = document.getElementById("inProgressCard");
let _inProgressList = document.getElementById("inProgressList");
let _doneCard = document.getElementById("doneCard");
let _doneList = document.getElementById("doneList");
let _blockedCard = document.getElementById("blockedCard");
let _blockedList = document.getElementById("blockedList");
let _taskName = document.getElementById("taskName");
let _taskStatus = document.getElementById("taskStatus");
let tasks = [];

// ------------ Controller ------------ //
_showTaskModal.onclick = function () {
  document.getElementById("taskbarModal").style.display = "flex";
};

window.onclick = function (event) {
  if (
    event.target === document.getElementById("taskbarModal") ||
    event.target === document.getElementById("taskbarEditModal")
  ) {
    document.getElementById("taskbarModal").style.display = "none";
    document.getElementById("taskbarEditModal").style.display = "none";
  }
};

// ------------ Model ------------ //
const Model = {
  tasks: [],
  addTask(name, status) {
    const id = Math.random().toString(36).substr(2, 9);
    this.tasks.push({ id, name, status });
  },
  editTask(id, newName, newStatus) {
    const task = this.tasks.find((task) => task.id === id);
    if (task) {
      task.name = newName;
      task.status = newStatus;
    }
  },
  deleteTask(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  },
};

// ------------ View ------------ //
const View = {
  taskLists: {
    todo: document.getElementById("todoList"),
    "in-progress": document.getElementById("inProgressList"),
    done: document.getElementById("doneList"),
    blocked: document.getElementById("blockedList"),
  },
  render(tasks) {
    Object.values(this.taskLists).forEach((list) => (list.innerHTML = ""));

    const taskCounts = {
      todo: 0,
      "in-progress": 0,
      done: 0,
      blocked: 0,
    };

    tasks.forEach(({ id, name, status }) => {
      taskCounts[status]++;

      const taskItem = document.createElement("div");
      taskItem.className = "task_item";
      taskItem.id = id;
      taskItem.innerHTML = `
        <span>
          <input type="radio">
          <span class="task_name">${name}</span>
        </span>
        <span class="task_actions">
          <i onclick="Controller.handleEditTask('${id}')" class="fa-solid fa-pencil" style="color: #d7d8db;"></i>
          <i onclick="Controller.handleDeleteTask('${id}')" class="fa-solid fa-trash" style="color: #a30000;"></i>
        </span>
      `;
      this.taskLists[status].appendChild(taskItem);
    });

    document
      .getElementById("todoCard")
      .querySelector(".number_list").textContent = taskCounts.todo;
    document
      .getElementById("inProgressCard")
      .querySelector(".number_list").textContent = taskCounts["in-progress"];
    document
      .getElementById("doneCard")
      .querySelector(".number_list").textContent = taskCounts.done;
    document
      .getElementById("blockedCard")
      .querySelector(".number_list").textContent = taskCounts.blocked;
  },
};

// ------------ Controller ------------ //
const Controller = {
  init() {
    document.getElementById("submitTask").onclick = this.handleAddTask;
    window.onclick = this.handleCloseModals;
    View.render(Model.tasks);
  },
  handleAddTask() {
    const name = document.getElementById("taskName").value.trim();
    const status = document.getElementById("taskStatus").value;
    if (!name) {
      alert("Please enter a task name.");
      return;
    }
    Model.addTask(name, status);
    View.render(Model.tasks);
    document.getElementById("taskName").value = "";
    document.getElementById("taskStatus").selectedIndex = 0;
    document.getElementById("taskbarModal").style.display = "none";
  },
  handleEditTask(id) {
    const task = Model.tasks.find((task) => task.id === id);
    if (!task) return;
    document.getElementById("editTaskName").value = task.name;
    document.getElementById("editTaskStatus").value = task.status;
    document.getElementById("taskbarEditModal").style.display = "flex";

    document.getElementById("editTaskSubmit").onclick = () => {
      const newName = document.getElementById("editTaskName").value.trim();
      const newStatus = document.getElementById("editTaskStatus").value;
      if (!newName) {
        alert("Please enter a task name.");
        return;
      }
      Model.editTask(id, newName, newStatus);
      View.render(Model.tasks);
      document.getElementById("taskbarEditModal").style.display = "none";
    };
  },
  handleDeleteTask(id) {
    Model.deleteTask(id);
    View.render(Model.tasks);
  },
  handleCloseModals(event) {
    const taskbarModal = document.getElementById("taskbarModal");
    const taskbarEditModal = document.getElementById("taskbarEditModal");
    if (event.target === taskbarModal || event.target === taskbarEditModal) {
      taskbarModal.style.display = "none";
      taskbarEditModal.style.display = "none";
    }
  },
};

Controller.init();
