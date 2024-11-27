// Generate a unique ID for each task list
function generateUniqueId() {
  return `id-${Date.now()}`; // Generates a unique ID using the current timestamp
}

// Open the popup when the "+" button is clicked
document.getElementById("open-popup").addEventListener("click", function () {
  document.getElementById("popup-menu").classList.remove("hidden");
});

// Close the popup when the "X" button is clicked
document.getElementById("close-popup").addEventListener("click", function () {
  document.getElementById("popup-menu").classList.add("hidden");
});

// Close the popup when clicking outside of the popup content
window.addEventListener("click", function (event) {
  const popup = document.getElementById("popup-menu");
  const popupContent = document.querySelector(".popup-content");

  if (!popupContent.contains(event.target) && !event.target.matches("#open-popup")) {
      popup.classList.add("hidden");
  }
});

// Event listener to handle "New Task List" button click
document.getElementById("create-task").addEventListener("click", function () {
  createDynamicPopup("Create New Task List", "Enter task list name", function (inputValue) {
      if (inputValue.trim() === "") {
          alert("Task list name cannot be empty!");
      } else {
          // Save task list to localStorage
          saveTaskList(inputValue);
          // Reload task lists to sidebar
          loadTaskLists();
      }
  });
});

// Function to create the dynamic popup
function createDynamicPopup(title, placeholder, onSubmit) {
  const popup = document.createElement("div");
  popup.classList.add("popup");

  const popupContent = document.createElement("div");
  popupContent.classList.add("popup-content");

  const closeButton = document.createElement("button");
  closeButton.textContent = "X";
  closeButton.classList.add("close-btn");
  closeButton.addEventListener("click", () => popup.remove());

  const popupTitle = document.createElement("h2");
  popupTitle.textContent = title;

  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.placeholder = placeholder;
  inputField.style.width = "80%";
  inputField.style.padding = "10px";
  inputField.style.marginBottom = "20px";
  inputField.style.border = "1px solid #ccc";
  inputField.style.borderRadius = "5px";

  const submitButton = document.createElement("button");
  submitButton.textContent = "Submit";
  submitButton.style.padding = "10px 20px";
  submitButton.style.backgroundColor = "#007bff";
  submitButton.style.color = "#fff";
  submitButton.style.border = "none";
  submitButton.style.borderRadius = "5px";
  submitButton.style.cursor = "pointer";
  submitButton.addEventListener("click", () => {
      const inputValue = inputField.value;
      onSubmit(inputValue);
      popup.remove(); // Close the popup after submission
  });

  // Add keydown listener to handle the Enter key
  inputField.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
          event.preventDefault(); // Prevent default form submission behavior
          submitButton.click(); // Trigger the submit button click
      }
  });

  popupContent.appendChild(closeButton);
  popupContent.appendChild(popupTitle);
  popupContent.appendChild(inputField);
  popupContent.appendChild(submitButton);
  popup.appendChild(popupContent);

  document.body.appendChild(popup);

  // Automatically focus on the input field
  inputField.focus();

  // Close the popup when clicking outside the popup content
  const handleClickOutside = (event) => {
      if (!popupContent.contains(event.target)) {
          popup.remove();
          document.removeEventListener("click", handleClickOutside);
      }
  };
  setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
  }, 0);
}



// Function to save the task list in localStorage with a unique ID
function saveTaskList(taskName) {
  const taskLists = JSON.parse(localStorage.getItem("taskLists")) || [];
  const newTaskList = { id: generateUniqueId(), name: taskName };
  taskLists.push(newTaskList);
  localStorage.setItem("taskLists", JSON.stringify(taskLists));
}

// Function to add the task list to the sidebar
function addTaskListToSidebar(taskList) {
  const sidebar = document.querySelector(".sidebar ul");
  const listItem = document.createElement("li");

  const listButton = document.createElement("button");
  listButton.textContent = taskList.name;
  listButton.classList.add("task-list-button");
  listButton.dataset.id = taskList.id;

  listButton.addEventListener("click", function () {
      displayTaskListPage(taskList.id, taskList.name);
  });

  listItem.appendChild(listButton);
  sidebar.appendChild(listItem);
}

// Function to load task lists from localStorage and display them in the sidebar
function loadTaskLists() {
  const taskLists = JSON.parse(localStorage.getItem("taskLists")) || [];
  const sidebar = document.querySelector(".sidebar ul");
  sidebar.innerHTML = ""; // Clear the sidebar before reloading
  taskLists.forEach(taskList => addTaskListToSidebar(taskList));
}

// Function to display a task list page
function displayTaskListPage(taskId, taskName) {
  const homePage = document.querySelector(".home");
  homePage.innerHTML = "";

  const taskPageWrapper = document.createElement("div");
  taskPageWrapper.classList.add("task-page-wrapper");

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete List";
  deleteButton.classList.add("delete-btn");
  deleteButton.addEventListener("click", function () {
      deleteTaskList(taskId);
      displayHomePage();
  });

  const taskPageTitle = document.createElement("h1");
  taskPageTitle.textContent = taskName;

  taskPageWrapper.appendChild(deleteButton);
  taskPageWrapper.appendChild(taskPageTitle);

  const taskDescription = document.createElement("p");
  taskDescription.textContent = `Here you can add tasks for "${taskName}".`;
  taskPageWrapper.appendChild(taskDescription);

  homePage.appendChild(taskPageWrapper);
}

// Function to delete a task list by ID
function deleteTaskList(taskId) {
  const taskLists = JSON.parse(localStorage.getItem("taskLists")) || [];
  const updatedTaskLists = taskLists.filter(task => task.id !== taskId);
  localStorage.setItem("taskLists", JSON.stringify(updatedTaskLists));
  loadTaskLists();
}

// Function to display the home page content
function displayHomePage() {
  const homePage = document.querySelector(".home");
  homePage.innerHTML = "";

  const welcomeMessage = document.createElement("h1");
  welcomeMessage.textContent = "Welcome to To-Do List";
  homePage.appendChild(welcomeMessage);

  const instructions = document.createElement("p");
  instructions.textContent = "Start by adding your tasks!";
  homePage.appendChild(instructions);
}

// Load task lists when the page loads
window.addEventListener("DOMContentLoaded", function () {
  loadTaskLists();
});


























/*function addDragAndDropToSidebar() {
  const sidebar = document.querySelector(".sidebar ul");
  let draggedItem = null;

  // Event listeners for draggable items
  sidebar.addEventListener("dragstart", (event) => {
      if (event.target.classList.contains("task-list-button")) {
          draggedItem = event.target;
          event.target.classList.add("dragging");
      }
  });

  sidebar.addEventListener("dragend", (event) => {
      if (draggedItem) {
          event.target.classList.remove("dragging");
          draggedItem = null;
      }
  });

  sidebar.addEventListener("dragover", (event) => {
      event.preventDefault(); // Allow drop by preventing default behavior
      const afterElement = getDragAfterElement(sidebar, event.clientY);
      const draggingElement = document.querySelector(".dragging");
      if (afterElement == null) {
          sidebar.appendChild(draggingElement);
      } else {
          sidebar.insertBefore(draggingElement, afterElement);
      }
  });

  sidebar.addEventListener("drop", () => {
      updateTaskOrderInStorage(); // Update task list order in localStorage
  });
}

// Determine the position to drop based on mouse Y-coordinate
function getDragAfterElement(container, y) {
  const draggableElements = [
      ...container.querySelectorAll(".task-list-button:not(.dragging)"),
  ];

  return draggableElements.reduce(
      (closest, child) => {
          const box = child.getBoundingClientRect();
          const offset = y - box.top - box.height / 2;
          if (offset < 0 && offset > closest.offset) {
              return { offset: offset, element: child };
          } else {
              return closest;
          }
      },
      { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

// Update task list order in localStorage after reordering
function updateTaskOrderInStorage() {
  const taskButtons = document.querySelectorAll(".task-list-button");
  const updatedOrder = [];

  taskButtons.forEach((button) => {
      updatedOrder.push({
          id: button.dataset.id,
          name: button.textContent.trim(),
      });
  });

  localStorage.setItem("taskLists", JSON.stringify(updatedOrder));
}

// Initialize drag-and-drop when loading task lists
function loadTaskLists() {
  const taskLists = JSON.parse(localStorage.getItem("taskLists")) || [];
  const sidebar = document.querySelector(".sidebar ul");
  sidebar.innerHTML = ""; // Clear sidebar before reloading
  taskLists.forEach((taskList) => addTaskListToSidebar(taskList));

  addDragAndDropToSidebar(); // Enable drag-and-drop
}

// Apply draggable property to task list buttons
function addTaskListToSidebar(taskList) {
  const sidebar = document.querySelector(".sidebar ul");
  const listItem = document.createElement("li");

  const listButton = document.createElement("button");
  listButton.textContent = taskList.name;
  listButton.classList.add("task-list-button");
  listButton.dataset.id = taskList.id;
  listButton.draggable = true; // Enable drag-and-drop

  listButton.addEventListener("click", function () {
      displayTaskListPage(taskList.id, taskList.name);
  });

  listItem.appendChild(listButton);
  sidebar.appendChild(listItem);
}

// Call loadTaskLists on page load
window.addEventListener("DOMContentLoaded", function () {
  loadTaskLists();
});




*/





// Event listener for the "Menu" button to return to the home page
document.getElementById("home-btn-top").addEventListener("click", function () {
  displayHomePage();
  loadTaskLists(); // Reload the sidebar to ensure everything is up-to-date
});
















// Variable to keep track of the selected task list
let selectedTaskListId = null;

// Function to handle the "Create Folder" button for adding tasks
document.getElementById("create-folder").addEventListener("click", function () {
  if (!selectedTaskListId) {
    alert("No task list selected!");
    return;
  }

  createDynamicPopup("Add Task", "Enter task name", function (taskName) {
    if (taskName.trim() === "") {
      alert("Task name cannot be empty!");
    } else {
      addTaskToList(selectedTaskListId, taskName);
      displayTaskListPage(selectedTaskListId, getTaskListNameById(selectedTaskListId));
    }
  });
});

// Function to add a task to a task list
function addTaskToList(taskListId, taskName) {
  const taskLists = JSON.parse(localStorage.getItem("taskLists")) || [];
  const taskList = taskLists.find(list => list.id === taskListId);
  if (taskList) {
    taskList.tasks = taskList.tasks || []; // Ensure the tasks array exists
    taskList.tasks.push({ id: generateUniqueId(), name: taskName });
    localStorage.setItem("taskLists", JSON.stringify(taskLists));
  }
}

// Function to get the name of a task list by its ID
function getTaskListNameById(taskListId) {
  const taskLists = JSON.parse(localStorage.getItem("taskLists")) || [];
  const taskList = taskLists.find(list => list.id === taskListId);
  return taskList ? taskList.name : "Unknown List";
}

// Update the task list page to display its tasks
function displayTaskListPage(taskId, taskName) {
  selectedTaskListId = taskId; // Set the selected task list
  const homePage = document.querySelector(".home");
  homePage.innerHTML = "";

  const taskPageWrapper = document.createElement("div");
  taskPageWrapper.classList.add("task-page-wrapper");

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete List";
  deleteButton.classList.add("delete-btn");
  deleteButton.addEventListener("click", function () {
    deleteTaskList(taskId);
    displayHomePage();
  });

  const taskPageTitle = document.createElement("h1");
  taskPageTitle.textContent = taskName;

  const taskDescription = document.createElement("p");
  taskDescription.textContent = `Tasks for "${taskName}":`;

  const taskListContainer = document.createElement("ul");
  taskListContainer.classList.add("task-list-container");

  const taskLists = JSON.parse(localStorage.getItem("taskLists")) || [];
  const taskList = taskLists.find(list => list.id === taskId);
  if (taskList && taskList.tasks) {
    taskList.tasks.forEach(task => {
      const taskItem = document.createElement("li");
      taskItem.textContent = task.name;
      taskListContainer.appendChild(taskItem);
    });
  }

  taskPageWrapper.appendChild(deleteButton);
  taskPageWrapper.appendChild(taskPageTitle);
  taskPageWrapper.appendChild(taskDescription);
  taskPageWrapper.appendChild(taskListContainer);

  homePage.appendChild(taskPageWrapper);
}










// Update the task list page to display tasks with delete buttons
function displayTaskListPage(taskId, taskName) {
  selectedTaskListId = taskId; // Set the selected task list
  const homePage = document.querySelector(".home");
  homePage.innerHTML = "";

  const taskPageWrapper = document.createElement("div");
  taskPageWrapper.classList.add("task-page-wrapper");

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete List";
  deleteButton.classList.add("delete-btn");
  deleteButton.addEventListener("click", function () {
    deleteTaskList(taskId);
    displayHomePage();
  });

  const taskPageTitle = document.createElement("h1");
  taskPageTitle.textContent = taskName;

  const taskDescription = document.createElement("p");
  taskDescription.textContent = `Tasks for "${taskName}":`;

  const taskListContainer = document.createElement("ul");
  taskListContainer.classList.add("task-list-container");

  const taskLists = JSON.parse(localStorage.getItem("taskLists")) || [];
  const taskList = taskLists.find(list => list.id === taskId);
  if (taskList && taskList.tasks) {
    taskList.tasks.forEach(task => {
      const taskItem = document.createElement("li");
      taskItem.classList.add("task-item");

      const taskNameSpan = document.createElement("span");
      taskNameSpan.textContent = task.name;

      const deleteTaskButton = document.createElement("button");
      deleteTaskButton.textContent = "X";
      deleteTaskButton.classList.add("delete-task-btn");
      deleteTaskButton.addEventListener("click", function () {
        deleteTask(taskId, task.id);
        displayTaskListPage(taskId, taskName); // Refresh the task list page
      });

      taskItem.appendChild(taskNameSpan);
      taskItem.appendChild(deleteTaskButton);
      taskListContainer.appendChild(taskItem);
    });
  }

  taskPageWrapper.appendChild(deleteButton);
  taskPageWrapper.appendChild(taskPageTitle);
  taskPageWrapper.appendChild(taskDescription);
  taskPageWrapper.appendChild(taskListContainer);

  homePage.appendChild(taskPageWrapper);
}

// Function to delete a specific task
function deleteTask(taskListId, taskId) {
  const taskLists = JSON.parse(localStorage.getItem("taskLists")) || [];
  const taskList = taskLists.find(list => list.id === taskListId);
  if (taskList) {
    taskList.tasks = taskList.tasks.filter(task => task.id !== taskId); // Remove the task
    localStorage.setItem("taskLists", JSON.stringify(taskLists));
  }
}






// Function to show a confirmation popup
function showConfirmationPopup(message, onConfirm) {
  const popup = document.createElement("div");
  popup.classList.add("popup");

  const popupContent = document.createElement("div");
  popupContent.classList.add("popup-content");

  const messageText = document.createElement("p");
  messageText.textContent = message;

  const confirmButton = document.createElement("button");
  confirmButton.textContent = "Yes";
  confirmButton.style.backgroundColor = "#e74c3c";
  confirmButton.style.marginRight = "10px";
  confirmButton.addEventListener("click", () => {
    onConfirm();
    popup.remove(); // Close the popup
  });

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "No";
  cancelButton.style.backgroundColor = "#2ecc71";
  cancelButton.addEventListener("click", () => {
    popup.remove(); // Close the popup
  });

  popupContent.appendChild(messageText);
  popupContent.appendChild(confirmButton);
  popupContent.appendChild(cancelButton);
  popup.appendChild(popupContent);

  document.body.appendChild(popup);
}

// Update delete button in the displayTaskListPage function
function displayTaskListPage(taskId, taskName) {
  selectedTaskListId = taskId;
  const homePage = document.querySelector(".home");
  homePage.innerHTML = "";

  const taskPageWrapper = document.createElement("div");
  taskPageWrapper.classList.add("task-page-wrapper");

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete List";
  deleteButton.classList.add("delete-btn");
  deleteButton.addEventListener("click", function () {
    showConfirmationPopup(`Are you sure you want to delete "${taskName}"?`, () => {
      deleteTaskList(taskId);
      displayHomePage(); // Redirect to the home page
    });
  });

  const taskPageTitle = document.createElement("h1");
  taskPageTitle.textContent = taskName;

  const taskDescription = document.createElement("p");
  taskDescription.textContent = `Tasks for "${taskName}":`;

  const taskListContainer = document.createElement("ul");
  taskListContainer.classList.add("task-list-container");

  const taskLists = JSON.parse(localStorage.getItem("taskLists")) || [];
  const taskList = taskLists.find(list => list.id === taskId);
  if (taskList && taskList.tasks) {
    taskList.tasks.forEach(task => {
      const taskItem = document.createElement("li");
      taskItem.classList.add("task-item");

      const taskNameSpan = document.createElement("span");
      taskNameSpan.textContent = task.name;

      const deleteTaskButton = document.createElement("button");
      deleteTaskButton.textContent = "X";
      deleteTaskButton.classList.add("delete-task-btn");
      deleteTaskButton.addEventListener("click", function () {
        deleteTask(taskId, task.id);
        displayTaskListPage(taskId, taskName); // Refresh the task list page
      });

      taskItem.appendChild(taskNameSpan);
      taskItem.appendChild(deleteTaskButton);
      taskListContainer.appendChild(taskItem);
    });
  }

  taskPageWrapper.appendChild(deleteButton);
  taskPageWrapper.appendChild(taskPageTitle);
  taskPageWrapper.appendChild(taskDescription);
  taskPageWrapper.appendChild(taskListContainer);

  homePage.appendChild(taskPageWrapper);
}















const taskList = document.querySelector('.task-list-container');
let draggingElement = null;

// Triggered when dragging starts
taskList.addEventListener('dragstart', (e) => {
  draggingElement = e.target;
  draggingElement.classList.add('dragging');
});

// Triggered when dragging ends
taskList.addEventListener('dragend', () => {
  draggingElement.classList.remove('dragging');
  draggingElement = null;
});

// Allow dragging to happen by preventing default behavior
taskList.addEventListener('dragover', (e) => {
  e.preventDefault(); // This allows for the drop
  const afterElement = getDragAfterElement(taskList, e.clientY);
  const draggable = document.querySelector('.dragging');
  
  if (afterElement == null) {
    taskList.appendChild(draggable);
  } else {
    taskList.insertBefore(draggable, afterElement);
  }
});

// Helper function to determine where the dragged element should go
function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}
































