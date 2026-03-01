import goblinSrc from '../img/goblin.png';

export class Goblin {
  constructor(cells, onHit, onMiss) {
    this.cells = cells;
    this.onHit = onHit;
    this.onMiss = onMiss;
    this.timer = null;
    this.currentCell = null;
    this.active = false;
    this.stopped = false;
    this.el = this.createElement();
  }

  createElement() {
    const img = document.createElement('img');
    img.src = goblinSrc;
    img.alt = 'goblin';
    img.className = 'goblin';
    img.addEventListener('click', () => this.handleClick());
    return img;
  }

  handleClick() {
    if (!this.active || this.stopped) return;
    this.active = false;
    clearTimeout(this.timer);
    this.hide();
    this.onHit();
    this.scheduleNext();
  }

  start() {
    this.stopped = false;
    this.showNext();
  }

  showNext() {
    if (this.stopped) return;
    const cell = this.getRandomCell();
    this.currentCell = cell;
    this.active = true;
    cell.appendChild(this.el);

    this.timer = setTimeout(() => {
      if (this.active && !this.stopped) {
        this.active = false;
        this.hide();
        this.onMiss();
        this.scheduleNext();
      }
    }, 1000);
  }

  scheduleNext() {
    if (this.stopped) return;
    this.timer = setTimeout(() => this.showNext(), 300);
  }

  hide() {
    if (this.el.parentElement) {
      this.el.parentElement.removeChild(this.el);
    }
  }

  getRandomCell() {
    let cell;
    do {
      cell = this.cells[Math.floor(Math.random() * this.cells.length)];
    } while (cell === this.currentCell);
    return cell;
  }

  stop() {
    this.stopped = true;
    this.active = false;
    clearTimeout(this.timer);
    this.hide();
  }
}
