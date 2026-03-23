function setupFavoriteHandler(container) {
  const animations = new Map();

  function startRotation(button) {
    let angle = 0;

    function rotate() {
      angle += 6;
      button.style.transform = `rotate(${angle}deg)`;

      const id = requestAnimationFrame(rotate);
      animations.set(button, id);
    }

    rotate();
  }

  function stopRotation(button) {
    if (animations.has(button)) {
      cancelAnimationFrame(animations.get(button));
      animations.delete(button);
    }
    button.style.transform = '';
  }
  container.addEventListener('click', (e) => {
    const button = e.target.closest('.favorite-button');
    if (!button) return;
    const order = button.closest('.order');
    const isFavorite = button.classList.contains('favorite');
    const isRotating = button.classList.contains('rotating');
    if (!isFavorite && !isRotating) {
      button.classList.add('favorite');
      order.classList.add('favorite');
    }
    else if (isFavorite && !isRotating) {
      button.classList.add('rotating');
      startRotation(button);
    }
    else {
      button.classList.remove('favorite', 'rotating');
      order.classList.remove('favorite');
      stopRotation(button);
    }
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { setupFavoriteHandler };
}