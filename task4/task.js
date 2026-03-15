function setupFavoriteHandler(container) {
  const animations = new Map();
  function startRotation(button) {
    let angle = 0;
    function rotate() {
      angle = (angle + 5) % 360;
      button.style.transform = `rotate(${angle}deg)`;
      const animationId = requestAnimationFrame(rotate);
      animations.set(button, animationId);
    }
    rotate();
  }
  function stopRotation(button) {
    if (animations.has(button)) {
      cancelAnimationFrame(animations.get(button));
      animations.delete(button);
      button.style.transform = '';
    }
  }
  container.addEventListener('click', (event) => {
    const button = event.target.closest('.favorite-button');
    if (!button) return;
    event.stopPropagation(); 
    const hasFavorite = button.classList.contains('favorite');
    const hasRotating = button.classList.contains('rotating');
    if (!hasFavorite && !hasRotating) {
      button.classList.add('favorite');
    } else if (hasFavorite && !hasRotating) {
      button.classList.add('rotating');
      startRotation(button);
    } else if (hasFavorite && hasRotating) {
      button.classList.remove('favorite', 'rotating');
      stopRotation(button);
    }
  });
}

function setupFavoriteHandlerAdditional() {
  const container = document.getElementById('orders');
  if (!container) return;
  let searchContainer = document.querySelector('.search-container');
  if (!searchContainer) {
    searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
      <input type="text" id="order-search" placeholder="Поиск по ID, заголовку, клиенту...">
      <span class="search-clear">✕</span>
      <div id="search-error" class="error-message"></div>
    `;
    container.parentNode.insertBefore(searchContainer, container);
  }
  let filtersDiv = document.querySelector('.filters');
  if (!filtersDiv) {
    filtersDiv = document.createElement('div');
    filtersDiv.className = 'filters';
    filtersDiv.innerHTML = `
      <label><input type="checkbox" class="filter-ready" checked> Готовые (cooking, delivery, delivered)</label>
      <label><input type="checkbox" class="filter-new" checked> Новые (new)</label>
    `;
    container.parentNode.insertBefore(filtersDiv, container);
  }
  if (!document.getElementById('dynamic-styles')) {
    const style = document.createElement('style');
    style.id = 'dynamic-styles';
    style.textContent = `
      .search-container {
        position: relative;
        max-width: 500px;
        margin-bottom: 20px;
      }
      #order-search {
        width: 100%;
        padding: 8px 30px 8px 10px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      .search-clear {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        font-size: 18px;
        color: #999;
        display: none;
      }
      .search-clear:hover {
        color: #333;
      }
      .error-message {
        color: #d32f2f;
        font-size: 14px;
        margin-top: 5px;
        display: none;
      }
      .filters {
        margin-bottom: 20px;
      }
      .filters label {
        margin-right: 20px;
        cursor: pointer;
      }
      .order {
        position: relative;
        background: white;
        border-radius: 6px;
        padding: 14px;
        margin-bottom: 10px;
        color: black;
        font-weight: bold;
        transition: transform 0.2s, box-shadow 0.2s;
        user-select: none;
        border-left: 5px solid transparent;
      }
      .order.new { border-left-color: #3498db; background: #eef7ff; }
      .order.cooking { border-left-color: #f39c12; background: #fff4e0; }
      .order.delivery { border-left-color: #9b59b6; background: #f3e5f5; }
      .order.delivered { border-left-color: #2ecc71; background: #e8f5e9; }

      .order:hover {
        transform: scale(1.01);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      .order-details {
        margin-top: 10px;
        padding: 12px;
        background: #fafafa;
        border-radius: 6px;
        font-size: 14px;
        line-height: 1.5;
        border: 1px solid #eee;
        opacity: 0;
        height: 0;
        overflow: hidden;
        transition: opacity 0.2s ease, height 0.2s ease;
      }
      .order:hover .order-details {
        opacity: 1;
        height: auto;
      }
      .favorite-button {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 24px;
        background: none;
        border: none;
        cursor: pointer;
        color: #ccc;
        transition: color 0.2s;
      }
      .favorite-button.favorite {
        color: red;
      }
      .favorite-button.rotating {
        animation: spin 1s infinite linear;
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .loading, .no-results, .error-message {
        text-align: center;
        padding: 20px;
        color: #666;
      }
      .error-message {
        color: #d32f2f;
      }
    `;
    document.head.appendChild(style);
  }
  const searchInput = document.getElementById('order-search');
  const searchClear = document.querySelector('.search-clear');
  const filterReady = document.querySelector('.filter-ready');
  const filterNew = document.querySelector('.filter-new');
  const errorDiv = document.getElementById('search-error');
  const mockOrders = [
    { id: 1, title: 'Заказ #A-101', comment: 'Оставить у двери', status: 'new',
      client: 'Иван Иванов', items: 'Бургер, Картошка фри', total: '420 ₽',
      address: 'ул. Пушкина, д. 10' },
    { id: 2, title: 'Заказ #A-100', comment: 'Позвонить за 15 минут', status: 'delivery',
      client: 'Мария Смирнова', items: 'Салат Цезарь, Суп', total: '380 ₽',
      address: 'ул. Ленина, д. 5' },
    { id: 3, title: 'Заказ #A-099', comment: 'Острая пицца', status: 'cooking',
      client: 'Петр Петров', items: 'Пицца Пепперони, Кола', total: '650 ₽',
      address: 'ул. Гагарина, д. 15' },
    { id: 4, title: 'Заказ #A-098', comment: 'Дополнительный соус', status: 'delivered',
      client: 'Анна Сидорова', items: 'Роллы Филадельфия, Васаби', total: '890 ₽',
      address: 'пр. Мира, д. 7' },
    { id: 5, title: 'Заказ #A-097', comment: 'Без лука', status: 'new',
      client: 'Сергей Иванов', items: 'Бургер, Картошка фри, Пиво', total: '620 ₽',
      address: 'ул. Лесная, д. 3' }
  ];
  function createOrderCard(order) {
    const orderDiv = document.createElement('div');
    orderDiv.className = `order ${order.status}`;
    orderDiv.dataset.id = order.id;
    orderDiv.dataset.status = order.status;
    orderDiv.dataset.client = order.client;
    orderDiv.dataset.items = order.items;
    orderDiv.dataset.total = order.total;
    orderDiv.dataset.address = order.address;
    const titleDiv = document.createElement('div');
    titleDiv.className = 'order-title';
    titleDiv.textContent = order.title;
    const clientDiv = document.createElement('div');
    clientDiv.className = 'order-client';
    clientDiv.textContent = `Клиент: ${order.client}`;
    const commentDiv = document.createElement('div');
    commentDiv.className = 'order-comment';
    commentDiv.textContent = order.comment;
    const favBtn = document.createElement('button');
    favBtn.className = 'favorite-button';
    favBtn.title = 'Добавить в избранное';
    favBtn.innerHTML = '❤';
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'order-details';
    detailsDiv.innerHTML = `
      <strong>Клиент:</strong> ${order.client}<br>
      <strong>Товары:</strong> ${order.items}<br>
      <strong>Сумма:</strong> ${order.total}<br>
      <strong>Адрес:</strong> ${order.address}
    `;
    orderDiv.appendChild(titleDiv);
    orderDiv.appendChild(clientDiv);
    orderDiv.appendChild(commentDiv);
    orderDiv.appendChild(detailsDiv);
    orderDiv.appendChild(favBtn);
    return orderDiv;
  }
  async function searchOrdersOnServer(searchText) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.2) {
          let filtered = mockOrders;
          if (searchText) {
            const lower = searchText.toLowerCase();
            filtered = mockOrders.filter(order =>
              order.title.toLowerCase().includes(lower) ||
              order.comment.toLowerCase().includes(lower) ||
              order.id.toString().includes(lower) ||
              order.client.toLowerCase().includes(lower)
            );
          }
          resolve(filtered);
        } else {
          reject('Ошибка сервера');
        }
      }, 500); 
    });
  }
  function renderOrders(orders) {
    container.innerHTML = '';
    if (orders.length === 0) {
      const noRes = document.createElement('div');
      noRes.className = 'no-results';
      noRes.textContent = 'Ничего не найдено';
      container.appendChild(noRes);
      return;
    }
    orders.forEach(order => container.appendChild(createOrderCard(order)));
  }
  function applyFilters(orders) {
    const readyChecked = filterReady ? filterReady.checked : true;
    const newChecked = filterNew ? filterNew.checked : true;
    const noStatusFilter = !readyChecked && !newChecked;
    let filtered = orders;
    if (!noStatusFilter) {
      filtered = orders.filter(order => {
        const isReady = ['cooking', 'delivery', 'delivered'].includes(order.status);
        const isNew = order.status === 'new';
        return (readyChecked && isReady) || (newChecked && isNew);
      });
    }
    renderOrders(filtered);
  }
  async function loadOrders(searchText = '') {
    container.innerHTML = '<div class="loading">Загрузка...</div>';
    if (errorDiv) {
      errorDiv.style.display = 'none';
      errorDiv.textContent = '';
    }
    try {
      const orders = await searchOrdersOnServer(searchText);
      applyFilters(orders);
    } catch (err) {
      console.error(err);
      container.innerHTML = '';
      if (errorDiv) {
        errorDiv.textContent = 'Ошибка при загрузке заказов';
        errorDiv.style.display = 'block';
      } else {
        const errEl = document.createElement('div');
        errEl.className = 'error-message';
        errEl.textContent = 'Ошибка при загрузке заказов';
        container.appendChild(errEl);
      }
    } finally {
      if (searchClear) {
        searchClear.style.display = searchInput && searchInput.value.trim() !== '' ? 'inline' : 'none';
      }
    }
  }
  let debounceTimeout = null;
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      if (searchClear) {
        searchClear.style.display = searchInput.value.trim() !== '' ? 'inline' : 'none';
      }
      debounceTimeout = setTimeout(() => {
        loadOrders(searchInput.value.trim());
      }, 300); 
    });
  }
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchClear.style.display = 'none';
        loadOrders('');
      }
    });
  }
  if (filterReady) {
    filterReady.addEventListener('change', () => {
      loadOrders(searchInput ? searchInput.value.trim() : '');
    });
  }
  if (filterNew) {
    filterNew.addEventListener('change', () => {
      loadOrders(searchInput ? searchInput.value.trim() : '');
    });
  }
  loadOrders('');
  setupFavoriteHandler(container);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { setupFavoriteHandler, setupFavoriteHandlerAdditional };
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('orders')) {
      setupFavoriteHandlerAdditional();
    }
  });
}