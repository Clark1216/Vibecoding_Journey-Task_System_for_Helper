const STORAGE_KEY = "helper-task-log-v1";

const taskForm = document.getElementById("taskForm");
const taskDate = document.getElementById("taskDate");
const taskName = document.getElementById("taskName");
const taskNotes = document.getElementById("taskNotes");
const taskPhoto = document.getElementById("taskPhoto");
const photoPreview = document.getElementById("photoPreview");
const taskList = document.getElementById("taskList");
const clearBtn = document.getElementById("clearBtn");
const emptyState = document.getElementById("emptyState");

let pendingPhotoDataUrl = null;

function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function renderTasks() {
  const tasks = loadTasks();
  taskList.innerHTML = "";

  if (!tasks.length) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  tasks
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)
    .forEach((task) => {
      const item = document.createElement("li");
      item.className = "task-item";

      const title = document.createElement("h3");
      title.textContent = task.name;

      const meta = document.createElement("p");
      meta.className = "task-meta";
      const niceDate = new Date(`${task.date}T00:00:00`).toLocaleDateString();
      meta.textContent = `Date: ${niceDate}`;

      item.append(title, meta);

      if (task.notes?.trim()) {
        const notes = document.createElement("p");
        notes.textContent = task.notes;
        item.append(notes);
      }

      if (task.photoDataUrl) {
        const image = document.createElement("img");
        image.src = task.photoDataUrl;
        image.alt = `${task.name} completion proof`;
        image.className = "task-photo";
        image.loading = "lazy";
        item.append(image);
      }

      taskList.append(item);
    });
}

function resetForm() {
  taskName.value = "";
  taskNotes.value = "";
  taskPhoto.value = "";
  pendingPhotoDataUrl = null;
  photoPreview.hidden = true;
  photoPreview.src = "";
  taskName.focus();
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

async function compressImage(file) {
  const original = await fileToDataUrl(file);
  const image = await loadImage(original);

  const maxWidth = 1280;
  const scale = Math.min(1, maxWidth / image.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);

  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL("image/jpeg", 0.75);
}

async function onPhotoChange() {
  const file = taskPhoto.files?.[0];
  if (!file) {
    pendingPhotoDataUrl = null;
    photoPreview.hidden = true;
    photoPreview.src = "";
    return;
  }

  try {
    pendingPhotoDataUrl = await compressImage(file);
    photoPreview.src = pendingPhotoDataUrl;
    photoPreview.hidden = false;
  } catch {
    alert("Could not process image. Please try another photo.");
    taskPhoto.value = "";
    pendingPhotoDataUrl = null;
    photoPreview.hidden = true;
    photoPreview.src = "";
  }
}

function onSubmit(event) {
  event.preventDefault();

  const name = taskName.value.trim();
  const date = taskDate.value;
  const notes = taskNotes.value.trim();

  if (!name || !date) return;

  const tasks = loadTasks();
  tasks.push({
    name,
    date,
    notes,
    photoDataUrl: pendingPhotoDataUrl,
    createdAt: Date.now(),
  });

  saveTasks(tasks);
  renderTasks();
  resetForm();
}

function onClear() {
  if (!confirm("Clear all saved tasks?")) return;
  localStorage.removeItem(STORAGE_KEY);
  renderTasks();
}

function setDefaultDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  taskDate.value = `${year}-${month}-${day}`;
}

setDefaultDate();
renderTasks();
taskForm.addEventListener("submit", onSubmit);
taskPhoto.addEventListener("change", onPhotoChange);
clearBtn.addEventListener("click", onClear);
