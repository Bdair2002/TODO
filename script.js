const todoTable = document.querySelector("table");
const todoCountElement = document.querySelector(".todoCount");
const newTodoInput = document.getElementById("newTodoInput");
const addTodoBtn = document.getElementById("addTodoBtn");
let canEdit = true;
let todos = [];
async function fetchTodos() {
  const response = await fetch("https://dummyjson.com/todos");
  const data = await response.json();
  todos = data.todos;
  displayTodos();
}

function displayTodos() {
  todoTable.innerHTML = `<tr>
          <th>ID</th>
          <th>TODO Description</th>
          <th>UserID</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>`;
  todos.forEach((todo, index) => {
    const todoItem = document.createElement("tr");
    todoItem.classList.add("selectable");
    todoItem.innerHTML = `
            <td class="id">${todo.id}</td>
            <td class="description editable"> ${todo.todo}</td>
            <td class="userId editable"> ${todo.userId}</td>
            <td class="status"> ${
              todo.completed
                ? `<div class="status-item"> <p>Done</p> <i class="fa-solid fa-square-check" style="color: #42f05f;"></i> </div>`
                : `<div class="status-item"> <p>Pending</p> <i class="fa-solid fa-spinner spin" style="color: #FFD43B;"></i> </div>`
            }</td>
            <td class="actionTD">
<svg onclick="deleteRow(event)" class="action-icon" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>           
<svg onclick="editRows(event)" class="rowsIcon action-icon" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"/></svg>
<svg onclick="markDone(event,true)" class="action-icon" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"/></svg>
<svg onclick="markDone(event,false)"  class="action-icon" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/></svg>
</td>
        `;
    todoTable.appendChild(todoItem);
  });
  makeEditable();
  updateTodoCount();
}
function updateTodoCount() {
  todoCountElement.innerText = `Total TODOs: ${todos.length}`;
}

let checkboxes = document.querySelectorAll("[type='checkbox']");
for (let box of checkboxes) {
  box.addEventListener("change", searchTable);
}

function searchTable() {
  let id = document.getElementById("id");
  let userId = document.getElementById("User-ID");
  let status = document.getElementById("Status");
  let description = document.getElementById("Description");
  let input = document.getElementById("input");
  let filter = input.value.toUpperCase();
  let rows = document.getElementsByTagName("tr");
  rows = Array.from(rows).slice(1);

  let td;

  for (let row of rows) {
    let found = false;
    if (
      id.checked &&
      row.children[0].innerHTML.toString().toUpperCase().includes(filter)
    ) {
      found = true;
    }
    if (
      description.checked &&
      row.children[1].innerHTML.toString().toUpperCase().includes(filter)
    ) {
      found = true;
    }
    if (
      userId.checked &&
      row.children[2].innerHTML.toString().toUpperCase().includes(filter)
    ) {
      found = true;
    }
    if (
      status.checked &&
      row.children[3].children[0].children[0].innerHTML
        .toString()
        .toUpperCase()
        .includes(filter)
    ) {
      found = true;
    }
    found ? (row.style.display = "") : (row.style.display = "none");
  }
}
let filterIcon = document.getElementById("filter-icon");

filterIcon.addEventListener("click", () => {
  let filterContainer = document.getElementsByClassName("filter-container");

  filterContainer[0].style.display == ""
    ? (filterContainer[0].style.display = "none")
    : (filterContainer[0].style.display = "");
});
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
  let st = document.getElementById("storage-status");
  st.style.display = "block";
  st.innerHTML = "Saved to LocalStorage!";
  setTimeout(() => {
    st.innerHTML = "";
    st.style.display = "none";
  }, 2000);
}

function loadTodos() {
  const savedTodos = localStorage.getItem("todos");
  let st = document.getElementById("storage-status");
  if (savedTodos) {
    todos = JSON.parse(savedTodos);
  }
  st.style.display = "block";
  st.innerHTML = "Loaded from LocalStoarge!";
  setTimeout(() => {
    st.innerHTML = "";
    st.style.display = "none";
  }, 2000);
  displayTodos();
}
function openModal(m) {
  let overlay = document.getElementById("overlay");
  let modal = document.getElementById(m);
  overlay.hidden = false;
  modal.style.display = "flex";
}
function quitModal(m) {
  let overlay = document.getElementById("overlay");
  let modal = document.getElementById(m);
  overlay.hidden = true;
  modal.style.display = "none";
}
function submitForm() {
  quitModal("addModal");
  let newDesc = document.getElementById("new-desc");
  let newUserid = document.getElementById("new-userid");
  let newTodo = {
    id: todos.length + 1,
    todo: newDesc.value,
    completed: false,
    userId: newUserid.value,
  };
  todos.push(newTodo);
  displayTodos();
  newDesc.value = "";
  newUserid.value = "";
}
document.getElementById("my-form").addEventListener("submit", (e) => {
  e.preventDefault();
  submitForm();
});
const selectedRows = new Set();
let selectedRow = null;
const updateSelection = (row) => {
  if (selectedRows.has(row)) {
    clearRowSelection(row);
  } else {
    row.isSelected = true;
    row.style.backgroundColor = "#4799fd";
    selectedRows.add(row);
  }
};
const clearRowSelection = (row) => {
  if (row) {
    row.isSelected = false;
    row.style.backgroundColor = "";
    selectedRows.delete(row);
  }
};
document.addEventListener("mousedown", function (event) {
  event.preventDefault();
});
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("submit")) return;
  const targetRow = e.target.tagName === "TD" ? e.target.closest("tr") : null;
  if (targetRow) {
    handleRowSelection(e, targetRow);
  } else {
    clearSelections();
  }
});

function handleRowSelection(e, targetRow) {
  if (e.ctrlKey) {
    updateSelection(targetRow);
  } else if (e.shiftKey) {
    handleShiftSelection(e, targetRow);
  } else {
    clearSelections();
    updateSelection(targetRow);
  }
}

function handleShiftSelection(e, targetRow) {
  if (selectedRows.size === 0) return;

  const firstSelectedRow = [...selectedRows][0];
  const isFollowing =
    e.target.compareDocumentPosition(firstSelectedRow) &
    Node.DOCUMENT_POSITION_FOLLOWING;
  const isPreceding =
    e.target.compareDocumentPosition(firstSelectedRow) &
    Node.DOCUMENT_POSITION_PRECEDING;
  if (isFollowing) {
    selectRange(targetRow, firstSelectedRow, "nextElementSibling");
  } else if (isPreceding) {
    selectRange(targetRow, firstSelectedRow, "previousElementSibling");
  }
}

function selectRange(startRow, endRow, direction) {
  let currentRow = startRow;
  while (currentRow && currentRow !== endRow) {
    updateSelection(currentRow);
    currentRow = currentRow[direction];
  }
}

function clearSelections() {
  selectedRows.forEach(clearRowSelection);
}

document.addEventListener("keydown", (e) => {
  if (selectedRows.size > 0) {
    const isEditable = e.target.tagName !== "INPUT";
    if (isEditable) {
      switch (e.key) {
        case "Delete":
          openModal("confirmModal");
          break;
        case "D":
        case "d":
          selectedRows.forEach((row) => {
            markDone(undefined, true, row);
            clearRowSelection(row);
          });
          break;
        case "U":
        case "u":
          selectedRows.forEach((row) => {
            markDone(undefined, false, row);
            clearRowSelection(row);
          });
          break;
        case "Escape":
          selectedRows.forEach((row) => {
            clearRowSelection(row);
          });
          break;
      }
    }
  }
});

function makeEditable() {
  const editableCells = document.querySelectorAll(".editable");
  editableCells.forEach((cell) => {
    const row = cell.closest("tr");
    cell.addEventListener("click", function (e) {
      if (!canEdit || e.target.tagName === "INPUT") return;

      const idCell = cell.previousElementSibling.classList.contains("id")
        ? cell.previousElementSibling
        : cell.previousElementSibling.previousElementSibling;

      const currentText = this.innerText;
      const input = document.createElement("input");
      input.classList.add("editInput");
      input.value = currentText;
      this.innerHTML = "";
      this.appendChild(input);
      input.focus();

      input.addEventListener("blur", () => {
        const newValue = input.value;
        this.innerText = newValue;
        saveChanges(input, idCell, this, row);
      });

      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          const newValue = input.value;
          this.innerText = newValue;
          saveChanges(input, idCell, this, row);
        } else if (event.key === "Escape") {
          this.innerHTML = "";
          this.innerText = currentText;
        }
      });
    });
  });
}

function saveChanges(input, id, cell, row) {
  row.style.backgroundColor = "";
  for (let todo of todos) {
    if (todo.id == id.innerHTML) {
      if (cell.classList.contains("description")) {
        todo.todo = input.value;
      } else if (cell.classList.contains("userId")) {
        todo.userId = input.value;
      }
    }
  }
}

document.getElementById("deleteForm").addEventListener("submit", (e) => {
  e.preventDefault();
  quitModal("confirmModal");

  const rowsToRemove =
    selectedRows.size > 0 ? Array.from(selectedRows) : [selectedRow];

  rowsToRemove.forEach((selectedRow) => {
    const todoId = selectedRow.children[0].innerHTML;
    todos = todos.filter((todo) => todo.id != todoId);
    clearRowSelection(selectedRow);
  });

  displayTodos();
});

async function init() {
  await fetchTodos();
}

function markDone(event, res, row) {
  row = row ? row : event.target.closest("tr");
  row.children[3].innerHTML = "";
  row.children[3].innerHTML = res
    ? `
    <div class="status-item">
      <p>Done</p>
      <i class="fa-solid fa-square-check" style="color: #42f05f;"></i>
    </div>`
    : `
    <div class="status-item">
      <p>Pending</p>
      <i class="fa-solid fa-spinner spin" style="color: #FFD43B;"></i>
    </div>
  `;
  for (let todo of todos) {
    if (todo.id == row.children[0].innerHTML) {
      todo.completed = res;
    }
  }
}

function deleteRow(event) {
  selectedRow = event.target.closest("tr");
  openModal("confirmModal");
}
function editRows(event) {
  canEdit = false;
  selectedRow = event.target.closest("tr");
  let descVal = selectedRow.children[1];
  let userIDVal = selectedRow.children[2];

  const in1 = document.createElement("input");
  const in2 = document.createElement("input");
  if (descVal.children[0]) {
    descVal = descVal.children[0];
  }
  if (userIDVal.children[0]) {
    userIDVal = userIDVal.children[0];
  }
  in1.classList.add("in1");
  in2.classList.add("in2");
  in1.value = descVal.innerHTML;
  in2.value = userIDVal.innerHTML;

  descVal.innerHTML = "";
  userIDVal.innerHTML = "";
  descVal.appendChild(in1);
  userIDVal.appendChild(in2);
  let icon = event.target;
  if (icon.tagName === "path") {
    icon = icon.closest("svg");
  }

  icon.outerHTML = `
  <i onclick="confirmEdit(event)" class="editIcon done fa-regular fa-square-check fa-lg" style="color: #0bef31;"></i>
  `;
}
function confirmEdit(event) {
  const icon = event.target;
  icon.outerHTML = `<svg onclick="editRows(event)" class="rowsIcon action-icon" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"/></svg>`;

  const inputs = [
    document.querySelector(".in1"),
    document.querySelector(".in2"),
  ];

  inputs.forEach((input) => {
    if (input) {
      const row = input.closest("tr");
      const id = row.children[0].innerHTML;

      todos.forEach((todo) => {
        if (todo.id == id) {
          if (input.classList.contains("in1")) {
            todo.todo = input.value;
            input.parentElement.innerText = input.value;
          } else if (input.classList.contains("in2")) {
            todo.userId = input.value;
            input.parentElement.innerText = input.value;
          }
        }
      });
    }
  });
  canEdit = true;
}
async function sendRequest(url, method = "GET", data = null) {
  try {
    const options = {
      method: method,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: data ? JSON.stringify(data) : undefined,
    };
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Request failed. Status: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
}
init();
