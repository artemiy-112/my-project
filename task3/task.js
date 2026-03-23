function searchOrdersOnServer(searchText) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const allOrders = [
        { id: 1, title: 'Заказ #A-101', comment: 'Оставить у двери', status: 'new' },
        { id: 2, title: 'Заказ #A-100', comment: 'Быстрее', status: 'delivery' },
        { id: 3, title: 'Заказ #A-099', comment: 'Я доплачу', status: 'cooking' },
        { id: 4, title: 'Заказ #A-098', comment: 'Оставьте себе', status: 'delivered' },
      ];
      const filteredOrders = searchText
        ? allOrders.filter(order =>
            order.title.toLowerCase().includes(searchText.toLowerCase())
          )
        : allOrders;
      if (Math.random() > 0.2) {
        resolve(filteredOrders);
      } else {
        reject('Ошибка поиска заказов');
      }
    }, 300);
  });
}

function setupOrderSearchServerHandler(searchInput, searchClear, container) {
  const errorDiv = document.getElementById('search-error');
  let debounceTimeout = null;
  let lastRequestId = 0; 
  function renderOrders(orders) {
    container.innerHTML = '';
    if (!orders.length) {
      container.innerHTML = '<div class="no-results">Ничего не найдено</div>';
      return;
    }
    orders.forEach(order => {
      const div = document.createElement('div');
      div.className = `order ${order.status}`;
      div.innerHTML = `
        <div class="order-title">${order.title}</div>
        <div class="order-comment">${order.comment}</div>
      `;
      container.appendChild(div);
    });
  }
  async function loadOrders(searchText) {
    const requestId = ++lastRequestId;
    container.innerHTML = '<div class="loading">Загрузка...</div>';
    errorDiv.style.display = 'none';
    try {
      const orders = await searchOrdersOnServer(searchText);
      if (requestId !== lastRequestId) return;
      renderOrders(orders);
    } catch (err) {
      if (requestId !== lastRequestId) return;
      container.innerHTML = '';
      errorDiv.textContent = 'Ошибка при загрузке заказов';
      errorDiv.style.display = 'block';
    }
  }
  function updateClearButton() {
    searchClear.style.display =
      searchInput.value.trim() ? 'inline' : 'none';
  }
  searchInput.addEventListener('input', () => {
    updateClearButton();
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      loadOrders(searchInput.value.trim());
    }, 400); 
  });
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    updateClearButton();
    if (debounceTimeout) clearTimeout(debounceTimeout);
    loadOrders('');
  });
  loadOrders('');
  updateClearButton();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    setupOrderSearchServerHandler,
    searchOrdersOnServer
  };
}