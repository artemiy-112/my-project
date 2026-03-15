function setupOrderSearchHandler(searchInput, searchClear, filterReady, filterNew, container) {
    function filterOrders() {
        const searchText = searchInput.value.trim().toLowerCase();
        const orders = container.querySelectorAll('.order');
        const readyChecked = filterReady.checked;
        const newChecked = filterNew.checked;
        const noStatusFilter = !readyChecked && !newChecked;
        orders.forEach(order => {
            let searchMatch = true;
            if (searchText !== '') {
                const id = (order.dataset.id || '').toLowerCase();
                const titleEl = order.querySelector('.order-title');
                const title = titleEl ? titleEl.textContent.toLowerCase() : '';
                const clientEl = order.querySelector('.order-client');
                const client = clientEl ? clientEl.textContent.toLowerCase() : '';

                searchMatch = id.includes(searchText) ||
                             title.includes(searchText) ||
                             client.includes(searchText);
            }
            let statusMatch = true;
            if (!noStatusFilter) {
                const status = order.dataset.status;
                const isReady = status === 'cooking' || status === 'delivery' || status === 'delivered';
                const isNew = status === 'new';

                statusMatch = (readyChecked && isReady) || (newChecked && isNew);
            }
            if (searchMatch && statusMatch) {
                order.style.display = ''; 
            } else {
                order.style.display = 'none';
            }
        });
        if (searchInput.value !== '') {
            searchClear.style.display = 'inline'; 
        } else {
            searchClear.style.display = 'none'; 
        }
    }
    searchInput.addEventListener('input', filterOrders);
    searchClear.addEventListener('click', function() {
        searchInput.value = '';    
        searchInput.focus();         
        filterOrders();            
    });
    filterReady.addEventListener('change', filterOrders);
    filterNew.addEventListener('change', filterOrders);
    filterOrders();
    const observer = new MutationObserver(filterOrders);
    observer.observe(container, { childList: true, subtree: false });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { setupOrderSearchHandler };
}