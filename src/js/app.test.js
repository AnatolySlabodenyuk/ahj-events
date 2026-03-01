import { Field } from './Field';
import { Game } from './Game';
import { Task } from './Task';
import { TaskManager } from './TaskManager';

// ─── Field ───────────────────────────────────────────────────────────────────

describe('Field', () => {
  test('creates 9 cells by default', () => {
    document.body.innerHTML = '<div class="field-container"></div>';
    const container = document.querySelector('.field-container');
    const field = new Field(container);
    expect(field.cells).toHaveLength(9);
    expect(container.querySelectorAll('.game-cell')).toHaveLength(9);
  });

  test('creates custom number of cells', () => {
    document.body.innerHTML = '<div></div>';
    const container = document.querySelector('div');
    const field = new Field(container, 6);
    expect(field.cells).toHaveLength(6);
  });
});

// ─── Game ─────────────────────────────────────────────────────────────────────

describe('Game', () => {
  test('renders start button and score display', () => {
    document.body.innerHTML = '<div class="game-container"></div>';
    const container = document.querySelector('.game-container');
    new Game(container);
    expect(container.querySelector('.game-start-btn')).not.toBeNull();
    expect(container.querySelector('.game-score')).not.toBeNull();
    expect(container.querySelector('.game-misses')).not.toBeNull();
  });

  test('score starts at 0', () => {
    document.body.innerHTML = '<div class="game-container"></div>';
    const game = new Game(document.querySelector('.game-container'));
    expect(game.score).toBe(0);
    expect(game.misses).toBe(0);
  });

  test('start button disables after click', () => {
    document.body.innerHTML = '<div class="game-container"></div>';
    const game = new Game(document.querySelector('.game-container'));
    game.startBtn.click();
    expect(game.startBtn.disabled).toBe(true);
    game.goblin.stop();
  });

  test('gameOver re-enables start button', () => {
    document.body.innerHTML = '<div class="game-container"></div>';
    const game = new Game(document.querySelector('.game-container'));
    game.startBtn.click();
    game.gameOver();
    expect(game.startBtn.disabled).toBe(false);
    expect(game.statusEl.textContent).toMatch(/Игра окончена/);
  });

  test('onHit increments score', () => {
    document.body.innerHTML = '<div class="game-container"></div>';
    const game = new Game(document.querySelector('.game-container'));
    game.startBtn.click();
    game.onHit();
    expect(game.score).toBe(1);
    game.goblin.stop();
  });

  test('onMiss increments misses and triggers gameOver at maxMisses', () => {
    document.body.innerHTML = '<div class="game-container"></div>';
    const game = new Game(document.querySelector('.game-container'));
    game.startBtn.click();
    for (let i = 0; i < game.maxMisses; i++) {
      game.onMiss();
    }
    expect(game.misses).toBe(game.maxMisses);
    expect(game.isRunning).toBe(false);
  });
});

// ─── Task ─────────────────────────────────────────────────────────────────────

describe('Task', () => {
  test('creates task with text', () => {
    const task = new Task('Buy milk');
    expect(task.text).toBe('Buy milk');
  });

  test('task is not pinned by default', () => {
    const task = new Task('Buy milk');
    expect(task.pinned).toBe(false);
  });

  test('task has unique id', () => {
    const t1 = new Task('A');
    const t2 = new Task('B');
    expect(t1.id).not.toBe(t2.id);
  });
});

// ─── TaskManager ──────────────────────────────────────────────────────────────

describe('TaskManager', () => {
  function makeManager() {
    document.body.innerHTML = '<div class="task-container"></div>';
    const container = document.querySelector('.task-container');
    return new TaskManager(container);
  }

  test('renders input and filter', () => {
    const manager = makeManager();
    expect(manager.inputEl).not.toBeNull();
    expect(manager.filterEl).not.toBeNull();
  });

  test('adds task on Enter key', () => {
    const manager = makeManager();
    manager.inputEl.value = 'Test task';
    manager.inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(manager.tasks).toHaveLength(1);
    expect(manager.tasks[0].text).toBe('Test task');
  });

  test('does not add empty task', () => {
    const manager = makeManager();
    manager.inputEl.value = '';
    manager.addTask();
    expect(manager.tasks).toHaveLength(0);
    expect(manager.errorEl.textContent).not.toBe('');
  });

  test('togglePin pins and unpins task', () => {
    const manager = makeManager();
    manager.inputEl.value = 'Pinnable task';
    manager.addTask();
    const task = manager.tasks[0];
    manager.togglePin(task);
    expect(task.pinned).toBe(true);
    manager.togglePin(task);
    expect(task.pinned).toBe(false);
  });

  test('deleteTask removes task', () => {
    const manager = makeManager();
    manager.inputEl.value = 'To delete';
    manager.addTask();
    manager.deleteTask(manager.tasks[0]);
    expect(manager.tasks).toHaveLength(0);
  });

  test('filter shows only matching tasks', () => {
    const manager = makeManager();
    manager.inputEl.value = 'Apple';
    manager.addTask();
    manager.inputEl.value = 'Banana';
    manager.addTask();
    manager.filter = 'app';
    manager.renderTasks();
    expect(manager.allListEl.querySelectorAll('.task-item')).toHaveLength(1);
  });

  test('pinned tasks do not appear in filtered all-tasks list', () => {
    const manager = makeManager();
    manager.inputEl.value = 'Pinned task';
    manager.addTask();
    manager.togglePin(manager.tasks[0]);
    manager.renderTasks();
    expect(manager.allListEl.querySelectorAll('.task-item')).toHaveLength(0);
    expect(manager.pinnedListEl.querySelectorAll('.task-item')).toHaveLength(1);
  });
});
