function setupOrderHandlers(container) {
  function createOrderDetails(order) {
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'order-details';
    detailsDiv.innerHTML = `
      <strong>Клиент:</strong> ${order.dataset.client}<br>
      <strong>Товары:</strong> ${order.dataset.items}<br>
      <strong>Сумма:</strong> ${order.dataset.total}<br>
      <strong>Адрес:</strong> ${order.dataset.address}
    `;
    return detailsDiv;
  }
  container.addEventListener('mouseover', (event) => {
    const order = event.target.closest('.order');
    if (!order || !container.contains(order)) return;
    if (!order.querySelector('.order-details')) {
      const details = createOrderDetails(order);
      order.appendChild(details);
    }
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { setupOrderHandlers };
}