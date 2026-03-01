export class Task {
  constructor(text) {
    this.id = Date.now() + Math.random();
    this.text = text;
    this.pinned = false;
  }
}
