function searchOrdersOnServer(searchText) {
   return new Promise((resolve, reject) => {
      setTimeout(() => {
         const allOrders = [
            { id: 1, title: 'Заказ #A-101', comment: 'Оставить у двери', status: 'new' },
            { id: 2, title: 'Заказ #A-100', comment: 'Быстрее',  status: 'delivery' },
            { id: 3, title: 'Заказ #A-099', comment: 'Я доплачу', status: 'cooking' },
            { id: 4, title: 'Заказ #A-098', comment: 'Оставьте себе', status: 'delivered' },
         ];
         const filteredOrders = searchText
                 ? allOrders.filter(order => order.title.includes(searchText))
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
  function renderOrders(orders) {
    container.innerHTML = '';
    if (orders.length === 0) {
      const noResults = document.createElement('div');
      noResults.className = 'no-results';
      noResults.textContent = 'Ничего не найдено';
      container.appendChild(noResults);
      return;
    }
    orders.forEach(order => {
      const orderDiv = document.createElement('div');
      orderDiv.className = `order ${order.status}`;
      orderDiv.dataset.id = order.id;
      const titleDiv = document.createElement('div');
      titleDiv.className = 'order-title';
      titleDiv.textContent = order.title;
      const commentDiv = document.createElement('div');
      commentDiv.className = 'order-comment';
      commentDiv.textContent = order.comment;
      orderDiv.appendChild(titleDiv);
      orderDiv.appendChild(commentDiv);
      container.appendChild(orderDiv);
    });
  }
  async function loadOrders(searchText) {
    container.innerHTML = '<div class="loading">Загрузка...</div>';
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
    try {
      const orders = await searchOrdersOnServer(searchText);
      renderOrders(orders);
    } catch (err) {
      console.error(err);
      container.innerHTML = '';
      errorDiv.textContent = 'Ошибка при загрузке заказов';
      errorDiv.style.display = 'block';
    }
  }
  function updateClearButtonVisibility() {
    searchClear.style.display = searchInput.value.trim() !== '' ? 'inline' : 'none';
  }
  searchInput.addEventListener('input', function() {
    updateClearButtonVisibility();
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      loadOrders(searchInput.value.trim());
    }, 300);
  });
  searchClear.addEventListener('click', function() {
    searchInput.value = '';
    updateClearButtonVisibility();
    if (debounceTimeout) clearTimeout(debounceTimeout);
    loadOrders('');
  });
  loadOrders('');
  updateClearButtonVisibility();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { setupOrderSearchServerHandler, searchOrdersOnServer };
}