import { Game } from './Game';
import { TaskManager } from './TaskManager';
import { ImageGallery } from './ImageGallery';

document.addEventListener('DOMContentLoaded', () => {
  const gameContainer = document.querySelector('.game-container');
  if (gameContainer) new Game(gameContainer);

  const taskContainer = document.querySelector('.task-container');
  if (taskContainer) new TaskManager(taskContainer);

  const galleryContainer = document.querySelector('.gallery-container');
  if (galleryContainer) new ImageGallery(galleryContainer);
});
