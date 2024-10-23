import "./index.css"; 
console.log("Script loaded.");
const formPreview = document.getElementById("form-preview");
const saveBtn = document.getElementById("save-btn");
const elementOptions = document.querySelectorAll(".element-option");
const hamburgerMenu = document.getElementById("hamburger-menu");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

function toggleSidebar() {
  hamburgerMenu.classList.toggle("active");
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
}

hamburgerMenu.addEventListener("click", toggleSidebar);
overlay.addEventListener("click", toggleSidebar);

function handleResize() {
  if (window.innerWidth > 768) {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    hamburgerMenu.classList.remove("active");
  }
}

window.addEventListener("resize", handleResize);

function closeSidebarOnMobile() {
  if (window.innerWidth <= 768) {
    toggleSidebar();
  }
}

elementOptions.forEach((option) => {
  option.querySelector(".add-btn").addEventListener("click", () => {
    const type = option.getAttribute("data-type");
    addElement(type);
    closeSidebarOnMobile();
  });
});

let elements = [];

function addElement(type) {
  const id = generateId();
  let newElement;

  switch (type) {
    case "input":
      newElement = createInputElement(id);
      break;
    case "select":
      newElement = createSelectElement(id);
      break;
    case "textarea":
      newElement = createTextareaElement(id);
      break;
  }

  elements.push({ id, type });
  formPreview.appendChild(newElement);
  addDragAndDrop(newElement);
}

function createInputElement(id) {
  const div = document.createElement("div");
  div.className = "form-element draggable";
  div.setAttribute("draggable", true);
  div.id = id;
  div.innerHTML = `
                <label>
                    Sample Label
                    <button class="delete-btn">✕</button>
                </label>
                <input type="text" placeholder="Sample placeholder">
            `;
  div
    .querySelector(".delete-btn")
    .addEventListener("click", () => deleteElement(id));
  return div;
}

function createSelectElement(id) {
  const div = document.createElement("div");
  div.className = "form-element draggable";
  div.setAttribute("draggable", true);
  div.id = id;
  div.innerHTML = `
                <label>
                    Select
                    <button class="delete-btn">✕</button>
                </label>
                <select>
                    <option>Sample option 1</option>
                     <option>Sample option 2</option>
                      <option>Sample option 3</option>
                </select>
            `;
  div
    .querySelector(".delete-btn")
    .addEventListener("click", () => deleteElement(id));
  return div;
}

function createTextareaElement(id) {
  const div = document.createElement("div");
  div.className = "form-element draggable";
  div.setAttribute("draggable", true);
  div.id = id;
  div.innerHTML = `
                <label>
                    Text area
                    <button class="delete-btn">✕</button>
                </label>
                <textarea placeholder="Sample placeholder"></textarea>
            `;
  div
    .querySelector(".delete-btn")
    .addEventListener("click", () => deleteElement(id));
  return div;
}

function deleteElement(id) {
  const element = document.getElementById(id);
  if (element) {
    formPreview.removeChild(element);
    elements = elements.filter((el) => el.id !== id);
  }
}

function generateId() {
  return "id-" + Math.random().toString(36).substr(2, 9);
}

function addDragAndDrop(element) {
  element.addEventListener("dragstart", dragStart);
  element.addEventListener("dragend", dragEnd);
  element.addEventListener("dragover", dragOver);
  element.addEventListener("drop", drop);
}

function dragStart(e) {
  e.target.classList.add("dragging");
  e.dataTransfer.setData("text/plain", e.target.id);
}

function dragEnd(e) {
  e.target.classList.remove("dragging");
}

function dragOver(e) {
  e.preventDefault();
  const draggable = document.querySelector(".dragging");
  if (draggable) {
    const dropzone = e.target.closest(".form-element");
    if (dropzone) {
      dropzone.classList.add("drag-over");
    }
  }
}

function drop(e) {
  e.preventDefault();
  const draggedId = e.dataTransfer.getData("text/plain");
  const draggedElement = document.getElementById(draggedId);
  const dropzone = e.target.closest(".form-element");

  document.querySelectorAll(".drag-over").forEach((el) => {
    el.classList.remove("drag-over");
  });

  if (dropzone && dropzone !== draggedElement) {
    const rect = dropzone.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;

    if (y < height / 2) {
      dropzone.parentNode.insertBefore(draggedElement, dropzone);
    } else {
      dropzone.parentNode.insertBefore(draggedElement, dropzone.nextSibling);
    }
  }
}

saveBtn.addEventListener("click", () => {
  const formData = elements.map((element) => {
    const el = document.getElementById(element.id);
    return {
      id: element.id,
      type: element.type,
      label: el.querySelector(".label-text")?.textContent?.trim()|| "",
      value: el.querySelector("input, select, textarea")?.value || "",
    };
  });
  console.log(JSON.stringify(formData, null, 2));
});
