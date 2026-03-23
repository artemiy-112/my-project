function setupOrderSearchHandler(searchInput, searchClear, filterReady, filterNew, container) {
  function filterOrders() {
    const searchText = searchInput.value.trim().toLowerCase();
    const orders = container.querySelectorAll('.order');
    const readyChecked = filterReady.checked;
    const newChecked = filterNew.checked;
    orders.forEach(order => {
      let searchMatch = true;
      if (searchText) {
        const id = (order.dataset.id || '').toLowerCase();
        const title = order.querySelector('.order-title')?.textContent.toLowerCase() || '';
        const client = order.querySelector('.order-client')?.textContent.toLowerCase() || '';
        searchMatch =
          id.includes(searchText) ||
          title.includes(searchText) ||
          client.includes(searchText);
      }
      const status = order.dataset.status;
      const isReady = ['cooking', 'delivery', 'delivered'].includes(status);
      const isNew = status === 'new';
      let statusMatch = true;
      if (readyChecked || newChecked) {
        statusMatch =
          (readyChecked && isReady) ||
          (newChecked && isNew);
      }
      order.style.display = (searchMatch && statusMatch) ? '' : 'none';
    });
    searchClear.style.display = searchText ? 'inline' : 'none';
    }
  searchInput.addEventListener('input', filterOrders);
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
    filterOrders();
  });
  filterReady.addEventListener('change', filterOrders);
  filterNew.addEventListener('change', filterOrders);
  const observer = new MutationObserver(filterOrders);
  observer.observe(container, { childList: true });
  filterOrders();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { setupOrderSearchHandler };
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { setupOrderSearchHandler };
}