// Name persistence
window.onload = function() {
    const storedName = sessionStorage.getItem('userName');
    if (storedName) {
        document.querySelector('.user-info .name').textContent = storedName;
        const avatarElement = document.querySelector('#userAvatar');
        if (avatarElement) {
            avatarElement.textContent = storedName.charAt(0).toUpperCase();
        }
    }
    // Initialize inventory data if not exists
    if (!sessionStorage.getItem('inventoryData')) {
        const initialData = [
            { id: 1, product: 'LG', category: 'Refrigerators', items: 8, type: 'Large', price: 450.00 },
            { id: 2, product: 'SAMSUNG', category: 'Washing Machines', items: 9, type: 'Front Load', price: 925.00 },
            { id: 3, product: 'GREE', category: 'ACs', items: 20, type: 'Split Acs', price: 825.00 }
        ];
        sessionStorage.setItem('inventoryData', JSON.stringify(initialData));
    }
    renderInventoryTable();
    initializeSearch();
}

// Tab switching
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        const tab = button.getAttribute('data-tab');
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Toggle add product button visibility
        const addProductBtn = document.querySelector('.add-product-btn');
        addProductBtn.style.display = tab === 'current' ? 'block' : 'none';
        
        if (tab === 'current') {
            document.getElementById('currentInventory').style.display = 'block';
            document.getElementById('comingShipment').style.display = 'none';
        } else {
            document.getElementById('currentInventory').style.display = 'none';
            document.getElementById('comingShipment').style.display = 'block';
        }
    });
});

// Modal functions
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

// Add product functionality
document.getElementById('addProductForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const newProduct = {
        id: Date.now(), // Generate unique ID
        product: formData.get('productName'),
        category: formData.get('category'),
        items: parseInt(formData.get('quantity')),
        type: formData.get('type'),
        price: parseFloat(formData.get('price'))
    };
    
    // Get existing data
    let inventoryData = JSON.parse(sessionStorage.getItem('inventoryData') || '[]');
    inventoryData.push(newProduct);
    sessionStorage.setItem('inventoryData', JSON.stringify(inventoryData));
    
    // Update table
    renderInventoryTable();
    toggleModal('addProductModal');
    this.reset();
});

// Edit product functionality
function handleEdit(productId) {
    const inventoryData = JSON.parse(sessionStorage.getItem('inventoryData'));
    const product = inventoryData.find(item => item.id === productId);
    
    if (product) {
        // Populate edit form
        const form = document.getElementById('editProductForm');
        form.elements['productName'].value = product.product;
        form.elements['category'].value = product.category;
        form.elements['type'].value = product.type;
        form.elements['quantity'].value = product.items;
        form.elements['price'].value = product.price;
        
        // Store current product ID for update
        form.setAttribute('data-product-id', productId);
        
        toggleModal('editProductModal');
    }
}

// Handle edit form submission
document.getElementById('editProductForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const productId = parseInt(this.getAttribute('data-product-id'));
    const formData = new FormData(this);
    
    let inventoryData = JSON.parse(sessionStorage.getItem('inventoryData'));
    const index = inventoryData.findIndex(item => item.id === productId);
    
    if (index !== -1) {
        inventoryData[index] = {
            id: productId,
            product: formData.get('productName'),
            category: formData.get('category'),
            items: parseInt(formData.get('quantity')),
            type: formData.get('type'),
            price: parseFloat(formData.get('price'))
        };
        
        sessionStorage.setItem('inventoryData', JSON.stringify(inventoryData));
        renderInventoryTable();
        toggleModal('editProductModal');
    }
});

// Delete functionality
function handleDelete(productId) {
    toggleModal('deleteConfirmModal');
    document.getElementById('confirmDelete').setAttribute('data-product-id', productId);
}

document.getElementById('confirmDelete').addEventListener('click', function() {
    const productId = parseInt(this.getAttribute('data-product-id'));
    let inventoryData = JSON.parse(sessionStorage.getItem('inventoryData'));
    inventoryData = inventoryData.filter(item => item.id !== productId);
    sessionStorage.setItem('inventoryData', JSON.stringify(inventoryData));
    
    renderInventoryTable();
    toggleModal('deleteConfirmModal');
});

// Render table function
function renderInventoryTable(data = null) {
    const tableBody = document.querySelector('.table-body');
    const inventoryData = data || JSON.parse(sessionStorage.getItem('inventoryData') || '[]');
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        tableBody.innerHTML = inventoryData.map(item => `
            <div class="table-row">
                <div class="mobile-card-table">
                    <div class="mobile-card-row">
                        <div class="cell"><i class="fas fa-box"></i>Product</div>
                        <div class="cell">${item.product}</div>
                    </div>
                    <div class="mobile-card-row">
                        <div class="cell"><i class="fas fa-tag"></i>Category</div>
                        <div class="cell">${item.category}</div>
                    </div>
                    <div class="mobile-card-row">
                        <div class="cell"><i class="fas fa-cubes"></i>Items</div>
                        <div class="cell">${item.items}</div>
                    </div>
                    <div class="mobile-card-row">
                        <div class="cell"><i class="fas fa-info-circle"></i>Type</div>
                        <div class="cell">${item.type}</div>
                    </div>
                    <div class="mobile-card-row">
                        <div class="cell"><i class="fas fa-dollar-sign"></i>Price</div>
                        <div class="cell price">$${item.price.toFixed(2)}</div>
                    </div>
                </div>
                <div class="actions">
                    <button class="edit-btn" onclick="handleEdit(${item.id})" title="Edit">
                        <i class="fas fa-pen"></i> Edit
                    </button>
                    <button class="delete-btn" onclick="handleDelete(${item.id})" title="Delete">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    } else {
        // Original desktop table rendering
        tableBody.innerHTML = inventoryData.map(item => `
            <div class="table-row">
                <div class="cell actions">
                    <button class="edit-btn" onclick="handleEdit(${item.id})" title="Edit">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button class="delete-btn" onclick="handleDelete(${item.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="cell">${item.product}</div>
                <div class="cell">${item.category}</div>
                <div class="cell">${item.items}</div>
                <div class="cell">${item.type}</div>
                <div class="cell price">$${item.price.toFixed(2)}</div>
            </div>
        `).join('');
    }

    // Show "No results found" message if no matches
    if (inventoryData.length === 0) {
        tableBody.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No matching products found</p>
            </div>
        `;
    }
}

// Add resize listener to handle layout changes
window.addEventListener('resize', () => {
    renderInventoryTable();
});

// Filter functionality
function toggleFilter() {
    const menu = document.getElementById('filterMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

function sortBy(criteria) {
    let inventoryData = JSON.parse(sessionStorage.getItem('inventoryData'));
    
    switch(criteria) {
        case 'category':
            inventoryData.sort((a, b) => a.category.localeCompare(b.category));
            break;
        case 'price':
            inventoryData.sort((a, b) => a.price - b.price);
            break;
        case 'name':
            inventoryData.sort((a, b) => a.product.localeCompare(b.product));
            break;
        case 'items':
            inventoryData.sort((a, b) => b.items - a.items);
            break;
    }
    
    sessionStorage.setItem('inventoryData', JSON.stringify(inventoryData));
    renderInventoryTable();

    // Close both desktop and mobile filter menus
    const desktopFilterMenu = document.getElementById('filterMenu');
    const mobileFilterMenu = document.getElementById('mobileFilterMenu');
    
    if (desktopFilterMenu) {
        desktopFilterMenu.style.display = 'none';
    }
    if (mobileFilterMenu) {
        mobileFilterMenu.classList.remove('active');
        const chevronIcon = document.querySelector('.mobile-filter-btn .fa-chevron-down');
        if (chevronIcon) {
            chevronIcon.style.transform = 'rotate(0)';
        }
    }
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
    
    // Close mobile filter menu when clicking outside
    if (!event.target.closest('.mobile-filter-container')) {
        const filterMenu = document.getElementById('mobileFilterMenu');
        const chevronIcon = document.querySelector('.mobile-filter-btn .fa-chevron-down');
        if (filterMenu.classList.contains('active')) {
            filterMenu.classList.remove('active');
            chevronIcon.style.transform = 'rotate(0)';
        }
    }
}

// Add event listener for search input
document.querySelector('.inventory-controls .search-bar input').addEventListener('input', handleSearch);
document.querySelector('.clear-search').addEventListener('click', clearSearch);

// Search functionality
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const inventoryData = JSON.parse(sessionStorage.getItem('inventoryData') || '[]');
    
    if (searchTerm === '') {
        renderInventoryTable(inventoryData);
        return;
    }

    const filteredData = inventoryData.filter(item => {
        return (
            item.product.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm) ||
            item.type.toLowerCase().includes(searchTerm) ||
            item.price.toString().includes(searchTerm) ||
            item.items.toString().includes(searchTerm)
        );
    });

    renderInventoryTable(filteredData);
    
    // Show/hide clear button
    const clearButton = document.querySelector('.clear-search');
    clearButton.style.display = searchTerm ? 'block' : 'none';
}

// Clear search
function clearSearch() {
    const searchInput = document.querySelector('.inventory-controls .search-bar input');
    searchInput.value = '';
    
    // Hide clear button
    document.querySelector('.clear-search').style.display = 'none';
    
    // Show all inventory items
    const inventoryData = JSON.parse(sessionStorage.getItem('inventoryData') || '[]');
    renderInventoryTable(inventoryData);
}

// Add this function for mobile filter
function toggleMobileFilter() {
    const filterMenu = document.getElementById('mobileFilterMenu');
    const filterBtn = document.querySelector('.mobile-filter-btn');
    const chevronIcon = filterBtn.querySelector('.fa-chevron-down');
    
    filterMenu.classList.toggle('active');
    chevronIcon.style.transform = filterMenu.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
}

// Add these search handling functions
function initializeSearch() {
    const desktopSearchInput = document.querySelector('.inventory-controls .search-bar input');
    const mobileSearchInput = document.querySelector('.mobile-search-bar input');
    const desktopClearBtn = document.querySelector('.inventory-controls .clear-search');
    const mobileClearBtn = document.querySelector('.mobile-search-bar .clear-search');

    // Desktop search
    desktopSearchInput.addEventListener('input', function(e) {
        handleSearch(e.target.value);
        desktopClearBtn.style.display = e.target.value ? 'block' : 'none';
        // Sync mobile search
        mobileSearchInput.value = e.target.value;
        mobileClearBtn.style.display = e.target.value ? 'block' : 'none';
    });

    // Mobile search
    mobileSearchInput.addEventListener('input', function(e) {
        handleSearch(e.target.value);
        mobileClearBtn.style.display = e.target.value ? 'block' : 'none';
        // Sync desktop search
        desktopSearchInput.value = e.target.value;
        desktopClearBtn.style.display = e.target.value ? 'block' : 'none';
    });

    // Clear search handlers
    desktopClearBtn.addEventListener('click', clearSearch);
    mobileClearBtn.addEventListener('click', clearSearch);
}

function handleSearch(searchTerm) {
    const inventoryData = JSON.parse(sessionStorage.getItem('inventoryData') || '[]');
    searchTerm = searchTerm.toLowerCase().trim();

    if (!searchTerm) {
        renderInventoryTable(inventoryData);
        return;
    }

    const filteredData = inventoryData.filter(item => 
        item.product.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm) ||
        item.type.toLowerCase().includes(searchTerm) ||
        item.price.toString().includes(searchTerm) ||
        item.items.toString().includes(searchTerm)
    );

    renderInventoryTable(filteredData);
}

function clearSearch() {
    // Clear both search inputs
    document.querySelectorAll('.search-bar input, .mobile-search-bar input').forEach(input => {
        input.value = '';
    });
    
    // Hide clear buttons
    document.querySelectorAll('.clear-search').forEach(btn => {
        btn.style.display = 'none';
    });
    
    // Show all inventory items
    const inventoryData = JSON.parse(sessionStorage.getItem('inventoryData') || '[]');
    renderInventoryTable(inventoryData);
}