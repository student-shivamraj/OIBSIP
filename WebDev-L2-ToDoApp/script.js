const STORAGE_KEY = 'todo-tasks';

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const pendingList = document.getElementById('pendingList');
const completedList = document.getElementById('completedList');
const pendingCount = document.getElementById('pendingCount');
const completedCount = document.getElementById('completedCount');
const pendingEmpty = document.getElementById('pendingEmpty');
const completedEmpty = document.getElementById('completedEmpty');

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  tasks.unshift({
    id: Date.now().toString(),
    text: trimmed,
    done: false,
    createdAt: new Date().toLocaleString()
  });
  save();
  render();
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  save();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
  render();
}

function editTask(id, newText) {
  const trimmed = newText.trim();
  if (!trimmed) return;
  tasks = tasks.map(t => t.id === id ? { ...t, text: trimmed } : t);
  save();
  render();
}

function createTaskEl(task) {
  const li = document.createElement('li');
  li.className = 'task' + (task.done ? ' done' : '');

  li.innerHTML = `
    <button class="check-btn"></button>
    <div style="flex:1;">
      <div class="task-text">${task.text}</div>
      <div class="task-meta">Added: ${task.createdAt}</div>
    </div>
    <button class="icon-btn edit-btn">✎</button>
    <button class="icon-btn delete-btn">✕</button>
  `;

  li.querySelector('.check-btn').onclick = () => toggleTask(task.id);
  li.querySelector('.delete-btn').onclick = () => deleteTask(task.id);
  li.querySelector('.edit-btn').onclick = () => {
    const newText = prompt('Edit task:', task.text);
    if (newText !== null) editTask(task.id, newText);
  };

  return li;
}

function render() {
  pendingList.innerHTML = '';
  completedList.innerHTML = '';

  const pending = tasks.filter(t => !t.done);
  const done = tasks.filter(t => t.done);

  pending.forEach(t => pendingList.appendChild(createTaskEl(t)));
  done.forEach(t => completedList.appendChild(createTaskEl(t)));

  pendingCount.textContent = `(${pending.length})`;
  completedCount.textContent = `(${done.length})`;

  pendingEmpty.style.display = pending.length === 0 ? 'block' : 'none';
  completedEmpty.style.display = done.length === 0 ? 'block' : 'none';
}

addBtn.onclick = () => {
  addTask(taskInput.value);
  taskInput.value = '';
};

taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTask(taskInput.value);
    taskInput.value = '';
  }
});

render();