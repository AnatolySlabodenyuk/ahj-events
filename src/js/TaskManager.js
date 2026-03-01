import { Task } from './Task';

export class TaskManager {
  constructor(container) {
    this.container = container;
    this.tasks = [];
    this.filter = '';
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="task-input-row">
        <input type="text" class="task-input" placeholder="Введите задачу и нажмите Enter">
        <span class="task-error"></span>
      </div>
      <div class="task-filter-row">
        <input type="text" class="task-filter" placeholder="Фильтр по названию...">
      </div>
      <div class="task-pinned-section">
        <h3>Закреплённые</h3>
        <div class="task-pinned-list"></div>
      </div>
      <div class="task-all-section">
        <h3>Все задачи</h3>
        <div class="task-all-list"></div>
      </div>
    `;

    this.inputEl = this.container.querySelector('.task-input');
    this.errorEl = this.container.querySelector('.task-error');
    this.filterEl = this.container.querySelector('.task-filter');
    this.pinnedListEl = this.container.querySelector('.task-pinned-list');
    this.allListEl = this.container.querySelector('.task-all-list');

    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.addTask();
    });

    this.filterEl.addEventListener('input', () => {
      this.filter = this.filterEl.value.toLowerCase();
      this.renderTasks();
    });

    this.renderTasks();
  }

  addTask() {
    const text = this.inputEl.value.trim();
    if (!text) {
      this.showError('Введите текст задачи');
      return;
    }
    this.errorEl.textContent = '';
    const task = new Task(text);
    this.tasks.push(task);
    this.inputEl.value = '';
    this.renderTasks();
  }

  showError(msg) {
    this.errorEl.textContent = msg;
    setTimeout(() => {
      this.errorEl.textContent = '';
    }, 2000);
  }

  togglePin(task) {
    task.pinned = !task.pinned;
    this.renderTasks();
  }

  deleteTask(task) {
    this.tasks = this.tasks.filter((t) => t !== task);
    this.renderTasks();
  }

  renderTasks() {
    const pinned = this.tasks.filter((t) => t.pinned);
    const filtered = this.tasks.filter(
      (t) => !t.pinned && t.text.toLowerCase().startsWith(this.filter),
    );

    this.pinnedListEl.innerHTML = '';
    if (pinned.length === 0) {
      const msg = document.createElement('p');
      msg.className = 'no-tasks';
      msg.textContent = 'Нет закреплённых задач';
      this.pinnedListEl.appendChild(msg);
    } else {
      pinned.forEach((task) => {
        this.pinnedListEl.appendChild(this.createTaskEl(task));
      });
    }

    this.allListEl.innerHTML = '';
    if (filtered.length === 0) {
      const msg = document.createElement('p');
      msg.className = 'no-tasks';
      msg.textContent = 'Задачи не найдены';
      this.allListEl.appendChild(msg);
    } else {
      filtered.forEach((task) => {
        this.allListEl.appendChild(this.createTaskEl(task));
      });
    }
  }

  createTaskEl(task) {
    const el = document.createElement('div');
    el.className = 'task-item' + (task.pinned ? ' task-item--pinned' : '');
    el.innerHTML = `
      <span class="task-text">${task.text}</span>
      <button class="task-pin-btn" title="${task.pinned ? 'Открепить' : 'Закрепить'}">
        ${task.pinned ? 'Открепить' : 'Закрепить'}
      </button>
      <button class="task-delete-btn" title="Удалить">✕</button>
    `;
    el.querySelector('.task-pin-btn').addEventListener('click', () => this.togglePin(task));
    el.querySelector('.task-delete-btn').addEventListener('click', () => this.deleteTask(task));
    return el;
  }
}
