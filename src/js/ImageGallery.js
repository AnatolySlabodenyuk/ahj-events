export class ImageGallery {
  constructor(container) {
    this.container = container;
    this.images = [];
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="gallery-input-row">
        <input type="text" class="gallery-name-input" placeholder="Название изображения">
        <input type="text" class="gallery-url-input" placeholder="URL изображения">
        <button class="gallery-add-btn">Добавить</button>
        <span class="gallery-error"></span>
      </div>
      <div class="gallery-grid"></div>
    `;

    this.nameInputEl = this.container.querySelector(".gallery-name-input");
    this.urlInputEl = this.container.querySelector(".gallery-url-input");
    this.addBtn = this.container.querySelector(".gallery-add-btn");
    this.errorEl = this.container.querySelector(".gallery-error");
    this.gridEl = this.container.querySelector(".gallery-grid");

    this.addBtn.addEventListener("click", () => this.addImage());
    this.urlInputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.addImage();
    });
    this.nameInputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.addImage();
    });
  }

  addImage() {
    const name = this.nameInputEl.value.trim();
    const url = this.urlInputEl.value.trim();

    if (!name || !url) {
      this.showError("Заполните все поля");
      return;
    }

    this.validateUrl(url, (valid) => {
      if (!valid) {
        this.showError("Неверный URL изображения");
        return;
      }
      this.images.push({ name, url });
      this.nameInputEl.value = "";
      this.urlInputEl.value = "";
      this.errorEl.textContent = "";
      this.renderImages();
    });
  }

  validateUrl(url, callback) {
    const img = new Image();
    img.onload = () => callback(true);
    img.onerror = () => callback(false);
    img.src = url;
  }

  deleteImage(index) {
    this.images.splice(index, 1);
    this.renderImages();
  }

  renderImages() {
    this.gridEl.innerHTML = "";
    this.images.forEach((item, index) => {
      const block = document.createElement("div");
      block.className = "gallery-item";
      block.innerHTML = `
        <img src="${item.url}" alt="${item.name}" class="gallery-img">
        <p class="gallery-img-name">${item.name}</p>
        <button class="gallery-delete-btn" title="Удалить">✕</button>
      `;
      block
        .querySelector(".gallery-delete-btn")
        .addEventListener("click", () => this.deleteImage(index));
      this.gridEl.append(block);
    });
  }

  showError(msg) {
    this.errorEl.textContent = msg;
    setTimeout(() => {
      this.errorEl.textContent = "";
    }, 3000);
  }
}
