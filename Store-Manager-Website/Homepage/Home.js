import dataManager from './dataManager.js';

document.addEventListener('DOMContentLoaded', function() {
    // Profile image upload handling
    const profileImg = document.getElementById('profile-img');
    const profileUpload = document.getElementById('profile-upload');
    const profile = document.querySelector('.profile');

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

    // Notification board toggle
    const notifications = document.querySelector('.notifications');
    const notificationBoard = document.querySelector('.notification-board');

    notifications.addEventListener('click', function(e) {
        e.stopPropagation();
        notificationBoard.style.display = notificationBoard.style.display === 'block' ? 'none' : 'block';
        profileBoard.style.display = 'none'; // Close profile board if open
    });

    // Profile board toggle
    const profileBoard = document.querySelector('.profile-board');

    profile.addEventListener('click', function(e) {
        e.stopPropagation();
        profileBoard.style.display = profileBoard.style.display === 'block' ? 'none' : 'block';
        notificationBoard.style.display = 'none'; // Close notification board if open
    });

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

    // Initialize Sales Chart
    const ctx = document.getElementById('productSalesChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            datasets: [{
                label: 'Sales',
                data: [800, 350, 300, 300, 400, 50, 200, 350, 100, 150],
                backgroundColor: '#ffc107',
                borderRadius: 4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1000,
                    ticks: {
                        stepSize: 250
                    },
                    grid: {
                        color: '#f0f0f0'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Stock Details Functionality
    const searchInput = document.querySelector('#category-search');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            renderCategories(e.target.value);
        });
    }

    const addCategoryBtn = document.querySelector('#add-category-btn');
    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', function() {
            const form = document.querySelector('#add-category-form');
            form.style.display = 'block';
            resetForm();
        });
    }

    const cancelBtn = document.querySelector('#cancel-category-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            document.querySelector('#add-category-form').style.display = 'none';
        });
    }

    const addProductTypeBtn = document.querySelector('#add-product-type-btn');
    if (addProductTypeBtn) {
        addProductTypeBtn.addEventListener('click', addProductTypeEntry);
    }

    const saveCategory = document.querySelector('#save-category-btn');
    if (saveCategory) {
        saveCategory.addEventListener('click', handleAddCategory);
    }

    // Initial render
    renderCategories();
});

function addProductTypeEntry() {
    const container = document.querySelector('#product-types-list');
    
    const entry = document.createElement('div');
    entry.className = 'product-type-entry';
    
    entry.innerHTML = `
        <div class="image-upload-container">
            <img src="https://via.placeholder.com/100" class="product-preview" alt="Product Image">
            <input type="file" class="product-image" accept="image/*" style="display: none;">
            <button type="button" class="upload-btn">
                <i class="fas fa-upload"></i> Upload Image
            </button>
        </div>
        
        <div class="form-group">
            <label class="input-label">Company Name</label>
            <input type="text" class="company-name" placeholder="Enter company name (e.g., LG, Samsung)">
        </div>

        <div class="form-group">
            <label class="input-label">Product Name</label>
            <input type="text" class="product-type-name" placeholder="Enter product name (e.g., X-33, Y-44)">
        </div>

        <div class="form-group">
            <label class="input-label">Quantity</label>
            <input type="number" class="quantity" min="0" placeholder="Enter quantity of items">
        </div>

        <div class="form-group">
            <label class="input-label">Price ($)</label>
            <input type="number" class="price" min="0" step="0.01" placeholder="Enter price per item">
        </div>

        <div class="form-group">
            <label class="input-label">Weight (kg)</label>
            <input type="number" class="weight" min="0" step="0.1" placeholder="Enter weight per item">
        </div>

        <div class="form-group">
            <label class="input-label">Color</label>
            <input type="text" class="color" placeholder="Enter product color">
        </div>

        <button type="button" class="delete-btn" onclick="removeProductTypeEntry(this)">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    container.appendChild(entry);
    
    // Set up image upload functionality
    const imageInput = entry.querySelector('.product-image');
    const imagePreview = entry.querySelector('.product-preview');
    const uploadBtn = entry.querySelector('.upload-btn');
    
    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => {
            imageInput.click();
        });
    }

    if (imageInput) {
        imageInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imagePreview.src = e.target.result;
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }
}

function removeProductTypeEntry(button) {
    button.closest('.product-type-entry').remove();
}

function resetForm() {
    const categoryInput = document.querySelector('#new-category-input');
    const productTypesList = document.querySelector('#product-types-list');
    
    if (categoryInput) {
        categoryInput.value = '';
    }
    
    if (productTypesList) {
        productTypesList.innerHTML = '';
        addProductTypeEntry();
    }
}

function handleAddCategory() {
    const categoryName = document.querySelector('#new-category-input').value.trim();
    const productTypeEntries = document.querySelectorAll('.product-type-entry');
    const productTypes = [];
    const productNames = new Set(); // To track product names

    if (!categoryName) {
        alert('Please enter a category name');
        return;
    }

    let isValid = true;
    productTypeEntries.forEach(entry => {
        const typeName = entry.querySelector('.product-type-name').value.trim();
        const companyName = entry.querySelector('.company-name').value.trim();
        const quantity = entry.querySelector('.quantity').value;
        const price = entry.querySelector('.price').value;
        const weight = entry.querySelector('.weight').value;
        const color = entry.querySelector('.color').value.trim();
        const imagePreview = entry.querySelector('.product-preview').src;

        if (!typeName || !companyName || !quantity || !price || !weight || !color) {
            isValid = false;
            return;
        }

        // Check if this product name already exists in our current entries
        if (productNames.has(typeName.toLowerCase())) {
            alert(`Duplicate product name "${typeName}" found. Product names must be unique within a category.`);
            isValid = false;
            return;
        }
        productNames.add(typeName.toLowerCase());

        const existingType = productTypes.find(type => type.name === typeName);
        if (existingType) {
            existingType.companies.push({
                name: companyName,
                quantity: parseInt(quantity),
                price: parseFloat(price),
                weight: parseFloat(weight),
                color: color,
                image: imagePreview
            });
        } else {
            productTypes.push({
                name: typeName,
                companies: [{
                    name: companyName,
                    quantity: parseInt(quantity),
                    price: parseFloat(price),
                    weight: parseFloat(weight),
                    color: color,
                    image: imagePreview
                }]
            });
        }
    });

    if (!isValid || productTypes.length === 0) {
        alert('Please fill in all product details');
        return;
    }

    const newCategory = dataManager.addCategory({
        name: categoryName,
        productTypes: productTypes
    });

    if (newCategory) {
        document.querySelector('#add-category-form').style.display = 'none';
        renderCategories();
    }
}

function renderCategories(searchTerm = '') {
    const categoriesContainer = document.querySelector('#categories-list');
    if (!categoriesContainer) return;

    const categories = searchTerm ? 
        dataManager.searchCategories(searchTerm) : 
        dataManager.getCategories();

    if (categories.length === 0) {
        categoriesContainer.innerHTML = `
            <div class="empty-message">
                ${searchTerm ? 'No categories found' : 'No categories added yet'}
            </div>
        `;
        return;
    }

    categoriesContainer.innerHTML = categories.map(category => `
        <div class="category-item" style="border-left: 4px solid ${category.color}">
            <div class="category-content" onclick="showProductTypes(${category.id})">
                <h3>${category.name}</h3>
                <p>${category.productTypes.length} product types</p>
            </div>
            <div class="category-actions">
                <button class="edit-btn" onclick="editCategory(${category.id}, event)">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteCategory(${category.id}, event)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function showProductTypes(categoryId) {
    const category = dataManager.getCategory(categoryId);
    if (!category) return;

    // First, group products by company
    const companyGroups = {};
    category.productTypes.forEach(type => {
        type.companies.forEach(company => {
            if (!companyGroups[company.name]) {
                companyGroups[company.name] = {
                    name: company.name,
                    products: []
                };
            }
            companyGroups[company.name].products.push({
                name: type.name,
                quantity: company.quantity,
                price: company.price,
                weight: company.weight,
                color: company.color,
                image: company.image
            });
        });
    });

    let modal = document.querySelector('#product-types-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'product-types-modal';
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Product Types - <span id="modal-category-name"></span></h3>
                    <button id="close-modal-btn" class="close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div id="modal-product-types" class="modal-body">
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const closeBtn = modal.querySelector('#close-modal-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeProductTypesModal);
        }
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeProductTypesModal();
            }
        });
    }

    const modalCategoryName = modal.querySelector('#modal-category-name');
    const modalContent = modal.querySelector('#modal-product-types');

    if (modalCategoryName && modalContent) {
        modalCategoryName.textContent = category.name;
        
        if (Object.keys(companyGroups).length === 0) {
            modalContent.innerHTML = `
                <div class="empty-message">
                    No companies added for this category
                </div>
            `;
        } else {
            modalContent.innerHTML = Object.values(companyGroups).map(company => {
                const totalQuantity = company.products.reduce((sum, product) => sum + product.quantity, 0);
                const stockStatus = getStockStatus(totalQuantity);
                const statusLabel = getStatusLabel(stockStatus);

                return `
                    <div class="product-type-item">
                        <div class="product-type-header">
                            ${company.name}
                        </div>
                        <div class="stock-indicator-container">
                            <div class="stock-circle status-${stockStatus}">
                                <div class="stock-circle-fill"></div>
                                <div class="stock-circle-status">${statusLabel}</div>
                            </div>
                            <span class="stock-status-text">Total Quantity: ${totalQuantity}</span>
                        </div>
                        <div class="company-list">
                            ${company.products.map(product => `
                                <div class="company-item">
                                    <img src="${product.image}" alt="${product.name}" class="company-product-image">
                                    <div class="company-details">
                                        <span class="company-name">${product.name}</span>
                                        <div class="company-info-grid">
                                            <span class="company-quantity">${product.quantity} items</span>
                                            <span class="company-price">$${product.price}</span>
                                            <span class="company-weight">${product.weight} kg</span>
                                            <span class="company-color">Color: ${product.color}</span>
                                        </div>
                                    </div>
                                    <div class="company-actions">
                                        <button class="edit-btn" onclick="editProduct(${category.id}, '${company.name}', '${product.name}', event)">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="delete-btn" onclick="deleteProduct(${category.id}, '${company.name}', '${product.name}', event)">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    modal.style.display = 'flex';
}

function closeProductTypesModal() {
    const modal = document.querySelector('#product-types-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function deleteCategory(categoryId, event) {
    event.stopPropagation();
    
    if (confirm('Are you sure you want to delete this category?')) {
        if (dataManager.deleteCategory(categoryId)) {
            renderCategories();
            closeProductTypesModal();
        }
    }
}

function deleteProductType(categoryId, productTypeName, event) {
    event.stopPropagation();
    
    if (confirm('Are you sure you want to delete this product type?')) {
        if (dataManager.deleteProductType(categoryId, productTypeName)) {
            showProductTypes(categoryId);
        }
    }
}

function deleteCompany(categoryId, productTypeName, companyName, event) {
    event.stopPropagation();
    
    if (confirm('Are you sure you want to delete this company?')) {
        if (dataManager.deleteCompany(categoryId, productTypeName, companyName)) {
            const category = dataManager.getCategory(categoryId);
            const productType = category.productTypes.find(type => type.name === productTypeName);
            if (!productType || productType.companies.length === 0) {
                deleteProductType(categoryId, productTypeName, event);
            } else {
                showProductTypes(categoryId);
            }
        }
    }
}

function editCompany(categoryId, productTypeName, companyName, event) {
    event.stopPropagation();
    
    const category = dataManager.getCategory(categoryId);
    if (!category) return;
    
    const productType = category.productTypes.find(type => type.name === productTypeName);
    if (!productType) return;
    
    const company = productType.companies.find(comp => comp.name === companyName);
    if (!company) return;
    
    const editModal = document.createElement('div');
    editModal.className = 'modal';
    editModal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h3>Edit Company Details</h3>
                <button onclick="closeEditModal()" class="close-btn">
                <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="image-upload-container">
                    <img src="${company.image}" class="product-preview" alt="Product Image" id="edit-image-preview">
                    <input type="file" id="edit-image-input" accept="image/*" style="display: none;">
                    <button type="button" class="upload-btn" onclick="document.getElementById('edit-image-input').click()">
                        <i class="fas fa-upload"></i> Update Image
                    </button>
                </div>
                <div class="form-group">
                    <input type="text" id="edit-company-name" value="${company.name}" class="form-control" placeholder="Company Name">
                </div>
                <div class="form-group">
                    <input type="number" id="edit-quantity" value="${company.quantity}" class="form-control" placeholder="Quantity">
                </div>
                <div class="form-actions">
                    <button onclick="saveCompanyEdit(${category.id}, '${productTypeName}', '${companyName}')" class="primary-btn">
                        <i class="fas fa-save"></i> Save Changes
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(editModal);
    
    const imageInput = document.getElementById('edit-image-input');
    const imagePreview = document.getElementById('edit-image-preview');
    
    imageInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });
}

function closeEditModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

function saveCompanyEdit(categoryId, productTypeName, originalCompanyName) {
    const updatedData = {
        name: document.getElementById('edit-company-name').value,
        quantity: parseInt(document.getElementById('edit-quantity').value),
        image: document.getElementById('edit-image-preview').src
    };
    
    if (dataManager.updateCompany(categoryId, productTypeName, originalCompanyName, updatedData)) {
        showProductTypes(categoryId);
        closeEditModal();
    }
}

function getStockStatus(quantity) {
    if (quantity <= 3) return 'understock';
    if (quantity >= 10) return 'overstock';
    return 'moderate';
}

function getStatusLabel(status) {
    switch(status) {
        case 'understock': return 'Under-Stock';
        case 'overstock': return 'Over-Stock';
        default: return 'Moderate';
    }
}

////////////////////////////////////////

function editCategory(categoryId, event) {
    event.stopPropagation();
    const category = dataManager.getCategory(categoryId);
    if (!category) return;

    let editModal = document.createElement('div');
    editModal.id = 'edit-category-modal';
    editModal.className = 'modal';
    
    const modalContent = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Edit Category: ${category.name}</h3>
                <button onclick="closeEditCategoryModal()" class="close-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="add-category-form">
                    <div class="form-group">
                        <label class="input-label">Product Type Name</label>
                        <input type="text" 
                               id="new-product-type" 
                               placeholder="New Product Type Name" 
                               class="form-control">
                    </div>
                    <div id="new-companies-list">
                        <div class="company-entry">
                            <div class="form-group">
                                <label class="input-label">Company Name</label>
                                <input type="text" placeholder="Enter company name" class="company-name form-control">
                            </div>
                            <div class="form-group">
                                <label class="input-label">Quantity</label>
                                <input type="number" placeholder="Enter quantity" class="quantity form-control" min="0">
                            </div>
                            <div class="form-group">
                                <label class="input-label">Price ($)</label>
                                <input type="number" placeholder="Enter price" class="price form-control" min="0" step="0.01">
                            </div>
                            <div class="form-group">
                                <label class="input-label">Weight (kg)</label>
                                <input type="number" placeholder="Enter weight" class="weight form-control" min="0" step="0.1">
                            </div>
                            <div class="form-group">
                                <label class="input-label">Color</label>
                                <input type="text" placeholder="Enter color" class="color form-control">
                            </div>
                            <div class="image-upload-container">
                                <img src="https://via.placeholder.com/100" class="product-preview" alt="Product Image">
                                <input type="file" class="company-image" accept="image/*" style="display: none;">
                                <button type="button" class="upload-btn">
                                    <i class="fas fa-upload"></i> Upload Image
                                </button>
                            </div>
                        </div>
                    </div>
                    <button onclick="addCompanyEntry()" class="secondary-btn">
                        <i class="fas fa-plus"></i> Add Company
                    </button>
                    <div class="form-actions">
                        <button onclick="saveNewProductType(${categoryId})" class="primary-btn">
                            <i class="fas fa-save"></i> Add Product Type
                        </button>
                        <button onclick="closeEditCategoryModal()" class="secondary-btn">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    editModal.innerHTML = modalContent;
    document.body.appendChild(editModal);
    
    // Setup initial image upload functionality
    const firstEntry = editModal.querySelector('.company-entry');
    if (firstEntry) {
        setupImageUpload(firstEntry);
    }
}

function closeEditCategoryModal() {
    const modal = document.getElementById('edit-category-modal');
    if (modal) {
        modal.remove();
    }
}

function addCompanyEntry() {
    const container = document.getElementById('new-companies-list');
    const entry = document.createElement('div');
    entry.className = 'company-entry';
    entry.innerHTML = `
        <div class="form-group">
            <label class="input-label">Company Name</label>
            <input type="text" placeholder="Company Name" class="company-name">
        </div>
        <div class="form-group">
            <label class="input-label">Quantity</label>
            <input type="number" placeholder="Quantity" class="quantity" min="0">
        </div>
        <div class="form-group">
            <label class="input-label">Price ($)</label>
            <input type="number" placeholder="Price" class="price" min="0" step="0.01">
        </div>
        <div class="form-group">
            <label class="input-label">Weight (kg)</label>
            <input type="number" placeholder="Weight" class="weight" min="0" step="0.1">
        </div>
        <div class="form-group">
            <label class="input-label">Color</label>
            <input type="text" placeholder="Color" class="color">
        </div>
        <div class="image-upload-container">
            <img src="https://via.placeholder.com/100" class="product-preview" alt="Product Image">
            <input type="file" class="company-image" accept="image/*" style="display: none;">
            <button type="button" class="upload-btn">
                <i class="fas fa-upload"></i> Upload Image
            </button>
        </div>
        <button class="delete-btn" onclick="this.parentElement.remove()">
            <i class="fas fa-trash"></i>
        </button>
    `;
    container.appendChild(entry);
    setupImageUpload(entry);
}

function saveNewProductType(categoryId) {
    const productTypeName = document.getElementById('new-product-type').value.trim();
    if (!productTypeName) {
        alert('Please enter a product type name');
        return;
    }

    // Check for duplicate product name
    if (dataManager.isProductNameTaken(categoryId, productTypeName)) {
        alert(`A product with the name "${productTypeName}" already exists in this category. Please choose a different name.`);
        return;
    }

    const companies = [];
    const companyEntries = document.querySelectorAll('.company-entry');
    
    // Validate all company entries
    for (let entry of companyEntries) {
        const name = entry.querySelector('.company-name').value.trim();
        const quantity = parseInt(entry.querySelector('.quantity').value);
        const price = parseFloat(entry.querySelector('.price').value);
        const weight = parseFloat(entry.querySelector('.weight').value);
        const color = entry.querySelector('.color').value.trim();
        const imagePreview = entry.querySelector('.product-preview')?.src || 'https://via.placeholder.com/100';

        if (!name || !quantity || !price || !weight || !color) {
            alert('Please fill in all company details');
            return;
        }

        companies.push({ 
            name, 
            quantity, 
            price, 
            weight, 
            color, 
            image: imagePreview 
        });
    }

    if (companies.length === 0) {
        alert('Please add at least one company');
        return;
    }

    const newProductType = {
        name: productTypeName,
        companies: companies
    };

    if (dataManager.addProductType(categoryId, newProductType)) {
        closeEditCategoryModal();
        showProductTypes(categoryId);
    } else {
        alert('Failed to add product type. Please try again.');
    }
}


function setupImageUpload(entryElement) {
    const uploadBtn = entryElement.querySelector('.upload-btn');
    const imageInput = entryElement.querySelector('.company-image');
    
    uploadBtn.addEventListener('click', () => {
        imageInput.click();
    });

    imageInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                let preview = entryElement.querySelector('img');
                if (!preview) {
                    preview = document.createElement('img');
                    preview.className = 'product-preview';
                    entryElement.insertBefore(preview, uploadBtn);
                }
                preview.src = e.target.result;
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });
}

function editProduct(categoryId, companyName, productName, event) {
    event.stopPropagation();
    
    // Convert categoryId to number to ensure consistent comparison
    categoryId = parseInt(categoryId);
    
    // Validate inputs
    if (!categoryId || !companyName || !productName) {
        console.error('Missing required parameters');
        alert('Error: Invalid product information');
        return;
    }

    // Validate product type existence
    if (!validateProductType(categoryId, productName)) {
        console.error('Invalid product type:', productName);
        alert('Error: Product type not found');
        return;
    }
    
    const category = dataManager.getCategory(categoryId);
    if (!category) {
        console.error('Category not found:', categoryId);
        alert('Error: Category not found');
        return;
    }
    
    const productType = category.productTypes.find(type => type.name === productName);
    if (!productType) {
        console.error('Product type not found:', productName);
        alert('Error: Product type not found');
        return;
    }
    
    const company = productType.companies.find(comp => comp.name === companyName);
    if (!company) {
        console.error('Company not found:', companyName);
        alert('Error: Company not found');
        return;
    }

    // Check for existing modal and remove it if exists
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal
    const editModal = document.createElement('div');
    editModal.className = 'modal';
    editModal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h3>Edit Product Details</h3>
                <button class="close-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="image-upload-container">
                    <img src="${company.image || 'https://via.placeholder.com/100'}" 
                         class="product-preview" 
                         alt="Product Image" 
                         id="edit-image-preview">
                    <input type="file" 
                           id="edit-image-input" 
                           accept="image/*" 
                           style="display: none;">
                    <button type="button" 
                            class="upload-btn" 
                            id="edit-image-button">
                        <i class="fas fa-upload"></i> Update Image
                    </button>
                </div>
                <div class="form-group">
                    <label class="input-label">Product Name (Read-only)</label>
                    <input type="text" 
                           id="edit-product-name" 
                           value="${productName}" 
                           class="form-control"
                           readonly 
                           disabled>
                </div>
                <div class="form-group">
                    <label class="input-label">Company Name (Read-only)</label>
                    <input type="text" 
                           value="${companyName}" 
                           class="form-control" 
                           readonly 
                           disabled>
                </div>
                <div class="form-group">
                    <label class="input-label">Quantity</label>
                    <input type="number" 
                           id="edit-quantity" 
                           value="${company.quantity}" 
                           class="form-control" 
                           min="0" 
                           placeholder="Enter quantity">
                </div>
                <div class="form-group">
                    <label class="input-label">Price ($)</label>
                    <input type="number" 
                           id="edit-price" 
                           value="${company.price}" 
                           class="form-control" 
                           min="0" 
                           step="0.01"
                           placeholder="Enter price">
                </div>
                <div class="form-group">
                    <label class="input-label">Weight (kg)</label>
                    <input type="number" 
                           id="edit-weight" 
                           value="${company.weight}" 
                           class="form-control" 
                           min="0" 
                           step="0.1"
                           placeholder="Enter weight">
                </div>
                <div class="form-group">
                    <label class="input-label">Color</label>
                    <input type="text" 
                           id="edit-color" 
                           value="${company.color}" 
                           class="form-control"
                           placeholder="Enter color">
                </div>
                <div class="form-actions">
                    <button class="primary-btn save-edit-btn">
                        <i class="fas fa-save"></i> Save Changes
                    </button>
                    <button class="secondary-btn cancel-edit-btn">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Append modal to body
    document.body.appendChild(editModal);
    
    // Set up image upload functionality
    const imageInput = editModal.querySelector('#edit-image-input');
    const imagePreview = editModal.querySelector('#edit-image-preview');
    const imageButton = editModal.querySelector('#edit-image-button');
    
    // Handle image upload button click
    imageButton.addEventListener('click', () => {
        imageInput.click();
    });
    
    // Handle image selection
    imageInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // Setup event listeners for modal actions
    const closeButton = editModal.querySelector('.close-btn');
    const saveButton = editModal.querySelector('.save-edit-btn');
    const cancelButton = editModal.querySelector('.cancel-edit-btn');
    
    // Close modal handler
    const closeModalHandler = () => {
        editModal.remove();
    };

    // Save changes handler
    const saveHandler = () => {
        saveProductEdit(categoryId, companyName, productName);
    };

    // Add event listeners
    closeButton.addEventListener('click', closeModalHandler);
    cancelButton.addEventListener('click', closeModalHandler);
    saveButton.addEventListener('click', saveHandler);

    // Close modal when clicking outside
    editModal.addEventListener('click', function(e) {
        if (e.target === editModal) {
            closeModalHandler();
        }
    });

    // Prevent modal closing when clicking inside modal content
    editModal.querySelector('.modal-content').addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

function deleteProduct(categoryId, companyName, productName, event) {
    event.stopPropagation();
    
    if (confirm('Are you sure you want to delete this product?')) {
        const category = dataManager.getCategory(categoryId);
        if (!category) return;

        // Find the product type and remove the product
        category.productTypes = category.productTypes.map(type => {
            if (type.name === productName) {
                type.companies = type.companies.filter(comp => comp.name !== companyName);
            }
            return type;
        }).filter(type => type.companies.length > 0);

        dataManager.saveData();
        showProductTypes(categoryId);
    }
}

function saveProductEdit(categoryId, companyName, originalProductName) {
    // Convert categoryId to number
    categoryId = parseInt(categoryId);
    
    // Get only the editable values
    const quantity = parseInt(document.getElementById('edit-quantity').value);
    const price = parseFloat(document.getElementById('edit-price').value);
    const weight = parseFloat(document.getElementById('edit-weight').value);
    const color = document.getElementById('edit-color').value.trim();
    const imagePreview = document.getElementById('edit-image-preview');
    
    // Basic input validation
    if (isNaN(quantity) || isNaN(price) || isNaN(weight) || !color) {
        alert('Please fill in all required fields with valid values');
        return;
    }

    // Get current category
    const category = dataManager.getCategory(categoryId);
    if (!category) {
        console.error('Category not found:', categoryId);
        alert('Error: Category not found');
        return;
    }

    // Find the product type
    const productType = category.productTypes.find(type => 
        type.name === originalProductName
    );

    if (!productType) {
        console.error('Product type not found:', originalProductName);
        alert('Error: Product type not found');
        return;
    }

    // Find the company within the product type
    const companyIndex = productType.companies.findIndex(comp => 
        comp.name === companyName
    );

    if (companyIndex === -1) {
        console.error('Company not found:', companyName);
        alert('Error: Company not found');
        return;
    }

    // Update only the editable fields
    const updatedCompany = {
        ...productType.companies[companyIndex],  // Keep existing data
        quantity: quantity,
        price: price,
        weight: weight,
        color: color,
        image: imagePreview.src
    };

    // Update the company data
    productType.companies[companyIndex] = updatedCompany;

    // Save updates
    if (dataManager.saveData()) {
        const modal = document.querySelector('.modal');
        if (modal) modal.remove();
        showProductTypes(categoryId);
    } else {
        alert('Failed to save changes. Please try again.');
    }
}
// Add this helper function to validate product type existence:
function validateProductType(categoryId, productTypeName) {
    const category = dataManager.getCategory(categoryId);
    if (!category) return false;
    
    return category.productTypes.some(type => type.name === productTypeName);
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

// Make functions globally accessible
window.removeProductTypeEntry = removeProductTypeEntry;
window.deleteCategory = deleteCategory;
window.deleteProductType = deleteProductType;
window.deleteCompany = deleteCompany;
window.editCompany = editCompany;
window.closeEditModal = closeEditModal;
window.saveCompanyEdit = saveCompanyEdit;
window.showProductTypes = showProductTypes;

window.editCategory = editCategory;
window.closeEditCategoryModal = closeEditCategoryModal;
window.addCompanyEntry = addCompanyEntry;
window.saveNewProductType = saveNewProductType;

//////

window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.saveProductEdit = saveProductEdit;