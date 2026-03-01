import { Field } from './Field';
import { Goblin } from './Goblin';

export class Game {
  constructor(container) {
    this.container = container;
    this.score = 0;
    this.misses = 0;
    this.maxMisses = 5;
    this.isRunning = false;
    this.goblin = null;
    this.scoreEl = null;
    this.missesEl = null;
    this.statusEl = null;
    this.startBtn = null;
    this.field = null;
    this.render();
  }

  render() {
    this.container.innerHTML = '';

    const controls = document.createElement('div');
    controls.className = 'game-controls';
    controls.innerHTML = `
      <button class="game-start-btn">Начать игру</button>
      <span class="game-score">Очки: <strong>0</strong></span>
      <span class="game-misses">Промахи: <strong>0</strong> / ${this.maxMisses}</span>
    `;
    this.container.appendChild(controls);

    this.startBtn = controls.querySelector('.game-start-btn');
    this.scoreEl = controls.querySelector('.game-score strong');
    this.missesEl = controls.querySelector('.game-misses strong');

    const fieldContainer = document.createElement('div');
    fieldContainer.className = 'field-container';
    this.container.appendChild(fieldContainer);

    this.statusEl = document.createElement('div');
    this.statusEl.className = 'game-status';
    this.container.appendChild(this.statusEl);

    this.field = new Field(fieldContainer);
    this.startBtn.addEventListener('click', () => this.start());
  }

  start() {
    this.score = 0;
    this.misses = 0;
    this.isRunning = true;
    this.statusEl.textContent = '';
    this.startBtn.disabled = true;
    this.updateUI();

    if (this.goblin) {
      this.goblin.stop();
    }

    this.goblin = new Goblin(
      this.field.cells,
      () => this.onHit(),
      () => this.onMiss(),
    );
    this.goblin.start();
  }

  onHit() {
    this.score++;
    this.updateUI();
  }

  onMiss() {
    this.misses++;
    this.updateUI();
    if (this.misses >= this.maxMisses) {
      this.gameOver();
    }
  }

  gameOver() {
    this.isRunning = false;
    this.goblin.stop();
    this.startBtn.disabled = false;
    this.statusEl.textContent = `Игра окончена! Ваш счёт: ${this.score}`;
  }

  updateUI() {
    this.scoreEl.textContent = this.score;
    this.missesEl.textContent = this.misses;
  }
}
