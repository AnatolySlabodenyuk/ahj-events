export class Field {
  constructor(container, size = 9) {
    this.container = container;
    this.size = size;
    this.cells = [];
    this.render();
  }

  render() {
    this.container.innerHTML = "";
    this.cells = [];
    for (let i = 0; i < this.size; i++) {
      const cell = document.createElement("div");
      cell.className = "game-cell";
      this.container.append(cell);
      this.cells.push(cell);
    }
  }
}
