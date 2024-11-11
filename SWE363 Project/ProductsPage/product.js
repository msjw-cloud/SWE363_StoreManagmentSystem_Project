// Import the data manager
import dataManager from '../HomePage/dataManager.js';

document.addEventListener('DOMContentLoaded', function() {
    // Profile image upload handling
    const profileImg = document.getElementById('profile-img');
    const profileUpload = document.getElementById('profile-upload');
    const profile = document.querySelector('.profile');

    if (profile && profileUpload && profileImg) {
        profile.addEventListener('click', function() {
            profileUpload.click();
        });

        profileUpload.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profileImg.src = e.target.result;
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }

    // Notification board toggle
    const notifications = document.querySelector('.notifications');
    const notificationBoard = document.querySelector('.notification-board');
    const profileBoard = document.querySelector('.profile-board');

    if (notifications && notificationBoard && profileBoard) {
        notifications.addEventListener('click', function(e) {
            e.stopPropagation();
            notificationBoard.style.display = notificationBoard.style.display === 'block' ? 'none' : 'block';
            profileBoard.style.display = 'none'; // Close profile board if open
        });

        // Profile board toggle
        if (profile) {
            profile.addEventListener('click', function(e) {
                e.stopPropagation();
                profileBoard.style.display = profileBoard.style.display === 'block' ? 'none' : 'block';
                notificationBoard.style.display = 'none'; // Close notification board if open
            });
        }

        // Close boards when clicking outside
        document.addEventListener('click', function() {
            notificationBoard.style.display = 'none';
            profileBoard.style.display = 'none';
        });

        // Prevent boards from closing when clicking inside them
        notificationBoard.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        profileBoard.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Tab Functionality
    const tabs = document.querySelectorAll('.tab');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all tabs and panes
            tabs.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');

            // Show corresponding tab content
            const tabName = this.getAttribute('data-tab');
            const targetPane = document.getElementById(tabName + '-products');
            if (targetPane) {
                targetPane.classList.add('active');
            }

            // Load appropriate content based on tab
            if (tabName === 'all') {
                loadAllProducts();
            } else if (tabName === 'returned') {
                loadReturnedProducts();
            }
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            // Filter products based on search term
            filterProducts(searchTerm);
        });
    }

    // Initial load of all products
    loadAllProducts();
});

function loadAllProducts() {
    const allProductsPane = document.getElementById('all-products');
    const categories = dataManager.getCategories();

    if (!categories || categories.length === 0) {
        if (allProductsPane) {
            allProductsPane.innerHTML = `
                <div class="empty-message">
                    <p>No products available</p>
                </div>
            `;
        }
        return;
    }

    // Create array of all products from all categories
    let allProducts = [];
    categories.forEach(category => {
        if (category.productTypes) {
            category.productTypes.forEach(productType => {
                if (productType.companies) {
                    productType.companies.forEach(company => {
                        allProducts.push({
                            categoryId: category.id,
                            categoryName: category.name,
                            productName: productType.name,
                            company: company.name,
                            image: company.image || 'https://via.placeholder.com/200',
                            price: company.price,
                            weight: company.weight,
                            quantity: company.quantity,
                            color: company.color
                        });
                    });
                }
            });
        }
    });

    // Generate HTML for products grid
    if (allProductsPane) {
        const productsHTML = `
            <div class="products-header">
                <div class="filter-options">
                    <select class="category-filter">
                        <option value="">All Categories</option>
                        ${[...new Set(allProducts.map(p => p.categoryName))].map(category => 
                            `<option value="${category}">${category}</option>`
                        ).join('')}
                    </select>
                    <select class="company-filter">
                        <option value="">All Companies</option>
                        ${[...new Set(allProducts.map(p => p.company))].map(company => 
                            `<option value="${company}">${company}</option>`
                        ).join('')}
                    </select>
                    <div class="price-filter">
                        <span>Price Range: $${Math.min(...allProducts.map(p => p.price))} - $${Math.max(...allProducts.map(p => p.price))}</span>
                    </div>
                </div>
            </div>
            <div class="products-grid">
                ${allProducts.map(product => `
                    <div class="product-card" data-category="${product.categoryName}" data-company="${product.company}">
                        <div class="product-image">
                            <img src="${product.image}" alt="${product.productName}">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">${product.productName}</h3>
                            <p class="product-company">${product.company}</p>
                            <div class="product-details">
                                <span class="weight">Weight: ${product.weight}kg</span>
                                <span class="quantity">${product.quantity} items</span>
                            </div>
                            <div class="product-price">
                                <span class="price">$${product.price}</span>
                                <button class="update-btn" onclick="editProduct(${product.categoryId}, '${product.company}', '${product.productName}', event)">
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        allProductsPane.innerHTML = productsHTML;

        // Add filter functionality
        setupFilters();
    }
}

function loadReturnedProducts() {
    const returnedProductsPane = document.getElementById('returned-products');
    if (returnedProductsPane) {
        returnedProductsPane.innerHTML = `
            <div class="empty-message">
                <p>No returned products found</p>
            </div>
        `;
    }
}

function filterProducts(searchTerm) {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const productName = card.querySelector('.product-name').textContent.toLowerCase();
        const companyName = card.querySelector('.product-company').textContent.toLowerCase();
        
        if (productName.includes(searchTerm) || companyName.includes(searchTerm)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

function setupFilters() {
    const categoryFilter = document.querySelector('.category-filter');
    const companyFilter = document.querySelector('.company-filter');
    
    if (categoryFilter && companyFilter) {
        const filterProducts = () => {
            const selectedCategory = categoryFilter.value;
            const selectedCompany = companyFilter.value;
            const productCards = document.querySelectorAll('.product-card');

            productCards.forEach(card => {
                const categoryMatch = !selectedCategory || card.dataset.category === selectedCategory;
                const companyMatch = !selectedCompany || card.dataset.company === selectedCompany;
                card.style.display = categoryMatch && companyMatch ? '' : 'none';
            });
        };

        categoryFilter.addEventListener('change', filterProducts);
        companyFilter.addEventListener('change', filterProducts);
    }
}

function editProduct(categoryId, companyName, productName, event) {
    event.preventDefault();
    event.stopPropagation();
    
    const category = dataManager.getCategory(categoryId);
    if (!category) return;
    
    const productType = category.productTypes.find(type => type.name === productName);
    if (!productType) return;
    
    const company = productType.companies.find(comp => comp.name === companyName);
    if (!company) return;

    // Create modal
    const editModal = document.createElement('div');
    editModal.className = 'modal';
    editModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Update Product Details</h3>
                <button class="close-btn">×</button>
            </div>
            <div class="modal-body">
                <form id="edit-product-form">
                    <div class="form-group">
                        <label>Product Name</label>
                        <input type="text" id="edit-product-name" class="form-control" value="${productName}" readonly disabled>
                    </div>

                    <div class="form-group">
                        <label>Company Name</label>
                        <input type="text" class="form-control" value="${companyName}" readonly disabled>
                    </div>

                    <div class="form-group">
                        <label>Quantity</label>
                        <input type="number" id="edit-quantity" class="form-control" value="${company.quantity}">
                    </div>

                    <div class="form-group">
                        <label>Price ($)</label>
                        <input type="number" id="edit-price" class="form-control" value="${company.price}" step="0.01">
                    </div>

                    <div class="form-group">
                        <label>Weight (kg)</label>
                        <input type="number" id="edit-weight" class="form-control" value="${company.weight}" step="0.1">
                    </div>

                    <div class="form-group">
                        <label>Color</label>
                        <input type="text" id="edit-color" class="form-control" value="${company.color}">
                    </div>
                </form>
            </div>
            <div class="form-actions">
                <button class="btn btn-secondary" id="cancel-edit">Cancel</button>
                <button class="btn btn-primary" id="save-edit">Save Changes</button>
            </div>
        </div>
    `;

    document.body.appendChild(editModal);

    // Add event listeners
    const closeModal = () => editModal.remove();

    // Close button handler
    editModal.querySelector('.close-btn').addEventListener('click', closeModal);
    
    // Cancel button handler
    document.getElementById('cancel-edit').addEventListener('click', closeModal);
    
    // Save button handler
    document.getElementById('save-edit').addEventListener('click', () => {
        const updatedProduct = {
            quantity: parseInt(document.getElementById('edit-quantity').value),
            price: parseFloat(document.getElementById('edit-price').value),
            weight: parseFloat(document.getElementById('edit-weight').value),
            color: document.getElementById('edit-color').value
        };

        if (isNaN(updatedProduct.quantity) || 
            isNaN(updatedProduct.price) || 
            isNaN(updatedProduct.weight) || 
            !updatedProduct.color) {
            alert('Please fill in all fields with valid values');
            return;
        }

        if (updateProduct(categoryId, productName, companyName, updatedProduct)) {
            closeModal();
            loadAllProducts(); // Refresh the product list
        } else {
            alert('Failed to update product. Please try again.');
        }
    });

    // Close modal when clicking outside
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) closeModal();
    });

    // Add escape key listener
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });
}

function updateProduct(categoryId, productName, companyName, updatedData) {
    const category = dataManager.getCategory(categoryId);
    if (!category) return false;

    const productType = category.productTypes.find(type => type.name === productName);
    if (!productType) return false;

    const company = productType.companies.find(comp => comp.name === companyName);
    if (!company) return false;

    // Update only allowed fields
    company.quantity = updatedData.quantity;
    company.price = updatedData.price;
    company.weight = updatedData.weight;
    company.color = updatedData.color;

    return dataManager.saveData();
}

// Make functions available globally
window.editProduct = editProduct;
window.updateProduct = updateProduct;
window.loadAllProducts = loadAllProducts;
window.loadReturnedProducts = loadReturnedProducts;
window.filterProducts = filterProducts;