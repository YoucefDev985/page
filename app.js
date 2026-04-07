let myTasks = JSON.parse(localStorage.getItem('mein_kram')) || [];
let activeFilter = 'all';

function renderUI() {
  const container = document.getElementById('task-list');
  container.innerHTML = '';

  const filtered = myTasks.filter(item => {
    if (activeFilter === 'active') return !item.done;
    if (activeFilter === 'completed') return item.done;
    return true;
  });

  filtered.forEach(item => {
    const li = document.createElement('li');
    li.className = 'task-item' + (item.done ? ' completed' : '');
    li.innerHTML = `
      <input type="checkbox" class="task-checkbox" ${item.done ? 'checked' : ''} onclick="toggleStatus('${item.id}')">
      <div class="task-content">
        <div class="task-text">${item.text}</div>
        ${item.date ? `<span class="task-date-badge">${item.date}</span>` : ''}
      </div>
      <button class="icon-btn" onclick="startDelete('${item.id}')" style="border:none; background:none; font-size:1.2rem; cursor:pointer;">✕</button>
    `;
    container.appendChild(li);
  });

  document.getElementById('stat-total').textContent = myTasks.length;
  document.getElementById('stat-active').textContent = myTasks.filter(x => !x.done).length;
  document.getElementById('stat-done').textContent = myTasks.filter(x => x.done).length;

  localStorage.setItem('mein_kram', JSON.stringify(myTasks));
  document.getElementById('empty-state').classList.toggle('hidden', filtered.length > 0);
}

window.toggleStatus = (id) => {
  const task = myTasks.find(x => x.id === id);
  task.done = !task.done;
  renderUI();
  flash(task.done ? 'Super, geschafft!' : 'Ach, doch wieder da?');
};

let itemToKill = null;
window.startDelete = (id) => {
  itemToKill = id;
  document.getElementById('modal-message').textContent = 'Soll das Teil wirklich weg?';
  document.getElementById('confirm-modal').classList.remove('hidden');
};

document.getElementById('modal-confirm').onclick = () => {
  setTimeout(() => {
    myTasks = myTasks.filter(x => x.id !== itemToKill);
    renderUI();
    flash('Weg damit!');
    document.getElementById('confirm-modal').classList.add('hidden');
  }, 200);
};

document.getElementById('modal-cancel').onclick = () => {
  document.getElementById('confirm-modal').classList.add('hidden');
};

document.getElementById('task-form').onsubmit = (e) => {
  e.preventDefault();
  const input = document.getElementById('task-input');
  const txt = input.value.trim();

  if (!txt) {
    flash('Halt, erst was reinschreiben!');
    return;
  }

  setTimeout(() => {
    myTasks.unshift({
      id: 'task_' + Math.random().toString(36).substr(2, 9),
      text: txt,
      date: document.getElementById('task-date').value,
      done: false
    });
    input.value = '';
    document.getElementById('task-date').value = '';
    renderUI();
    flash('Ok, hab\'s hinzugefügt!');
  }, 250);
};

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelector('.filter-btn.active').classList.remove('active');
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    renderUI();
  };
});

function flash(msg) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.getElementById('toast-container').appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

document.getElementById('theme-toggle').onclick = () => {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
};

renderUI();
