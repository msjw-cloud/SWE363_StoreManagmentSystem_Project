// Initial sample data
const initialOrders = [
    {
        id: 1,
        date: '1 Nov 2024',
        product: 'LG',
        items: 2,
        price: 900.00,
        category: 'Refrigerators',
        customer: {
            name: 'John Doe',
            address: '123 Main St',
            phone: '555-0123'
        },
        status: 'delivered',
        warranty: '1 Nov 2025',
        comments: 'Standard delivery requested'
    },
    {
        id: 2,
        date: '1 Nov 2024',
        product: 'BOSCH',
        items: 1,
        price: 999.00,
        category: 'Cooking',
        customer: {
            name: 'Jane Smith',
            address: '456 Oak Ave',
            phone: '555-0124'
        },
        status: 'shipping',
        warranty: '1 Nov 2025',
        comments: ''
    }
];

const initialReturns = [
    {
        id: 'R1',
        date: '30 Oct 2024',
        product: 'LG',
        items: 1,
        price: 900.00,
        category: 'Refrigerators',
        status: 'Processing',
        cause: 'Defective Unit',
        customer: {
            name: 'Alice Johnson',
            address: '789 Pine St',
            phone: '555-0125'
        },
        purchaseDate: '15 Oct 2024',
        productStatus: 'Minor Damage',
        investigation: 'Cooling system malfunction confirmed. Unit eligible for replacement.',
        returnStatus: 'received'
    },
    {
        id: 'R2',
        date: '29 Oct 2024',
        product: 'SAMSUNG',
        items: 1,
        price: 925.00,
        category: 'Washing Machines',
        status: 'Completed',
        cause: 'Wrong Model',
        customer: {
            name: 'Bob Wilson',
            address: '321 Elm St',
            phone: '555-0126'
        },
        purchaseDate: '20 Oct 2024',
        productStatus: 'Unopened',
        investigation: 'Customer ordered front-load instead of top-load. Approved for exchange.',
        returnStatus: 'refunded'
    },
    {
        id: 'R3',
        date: '28 Oct 2024',
        product: 'GREE',
        items: 2,
        price: 825.00,
        category: 'ACs',
        status: 'Pending',
        cause: 'Size Mismatch',
        customer: {
            name: 'Carol Brown',
            address: '654 Maple Ave',
            phone: '555-0127'
        },
        purchaseDate: '25 Oct 2024',
        productStatus: 'New',
        investigation: 'Pending inspection',
        returnStatus: 'shipping'
    }
];

// Initialize data on page load
window.onload = function() {
    // Name persistence from session
    const storedName = sessionStorage.getItem('userName');
    if (storedName) {
        document.querySelector('.user-info .name').textContent = storedName;
        const avatarElement = document.querySelector('#userAvatar');
        if (avatarElement) {
            avatarElement.textContent = storedName.charAt(0).toUpperCase();
        }
    }

    // Initialize orders if not exists
    if (!sessionStorage.getItem('ordersData')) {
        sessionStorage.setItem('ordersData', JSON.stringify(initialOrders));
    }
    
    // Initialize returns if not exists
    if (!sessionStorage.getItem('returnsData')) {
        sessionStorage.setItem('returnsData', JSON.stringify(initialReturns));
    }

    renderOrdersTable();
    renderReturnsTable();
};

// Tab switching functionality
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const tab = button.getAttribute('data-tab');
        if (tab === 'orders') {
            document.getElementById('ordersList').style.display = 'block';
            document.getElementById('returnsList').style.display = 'none';
        } else {
            document.getElementById('ordersList').style.display = 'none';
            document.getElementById('returnsList').style.display = 'block';
        }
    });
});

// Render orders table
function renderOrdersTable() {
    const tableBody = document.querySelector('#ordersList .table-body');
    const ordersData = JSON.parse(sessionStorage.getItem('ordersData') || '[]');
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        tableBody.innerHTML = ordersData.map(order => `
            <div class="table-row" onclick="showOrderDetails(${order.id})">
                <div class="mobile-card-table">
                    <div class="mobile-card-row">
                        <div class="cell"><i class="fas fa-hashtag"></i>Order ID</div>
                        <div class="cell">${order.id}</div>
                    </div>
                    <div class="mobile-card-row">
                        <div class="cell"><i class="fas fa-calendar"></i>Date</div>
                        <div class="cell">${order.date}</div>
                    </div>
                    <div class="mobile-card-row">
                        <div class="cell"><i class="fas fa-box"></i>Product</div>
                        <div class="cell">${order.product}</div>
                    </div>
                    <div class="mobile-card-row">
                        <div class="cell"><i class="fas fa-cubes"></i>Items</div>
                        <div class="cell">${order.items}</div>
                    </div>
                    <div class="mobile-card-row">
                        <div class="cell"><i class="fas fa-dollar-sign"></i>Price</div>
                        <div class="cell">$${order.price.toFixed(2)}</div>
                    </div>
                    <div class="mobile-card-row">
                        <div class="cell"><i class="fas fa-tag"></i>Category</div>
                        <div class="cell">${order.category}</div>
                    </div>
                </div>
                <div class="actions">
                    <button class="download-btn" onclick="downloadOrder(${order.id}); event.stopPropagation();">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            </div>
        `).join('');
    } else {
        // Original desktop table rendering
        tableBody.innerHTML = ordersData.map(order => `
            <div class="table-row" onclick="showOrderDetails(${order.id})">
                <div class="cell">${order.id}</div>
                <div class="cell">${order.date}</div>
                <div class="cell">${order.product}</div>
                <div class="cell">${order.items}</div>
                <div class="cell">$${order.price.toFixed(2)}</div>
                <div class="cell">${order.category}</div>
                <div class="cell">
                    <button class="download-btn" onclick="downloadOrder(${order.id}); event.stopPropagation();">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Render returns table
function renderReturnsTable() {
    const tableBody = document.querySelector('#returnsList .table-body');
    const returnsData = JSON.parse(sessionStorage.getItem('returnsData') || '[]');
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        tableBody.innerHTML = returnsData.map(return_item => `
            <div class="table-row" onclick="showReturnDetails('${return_item.id}')">
                <div class="mobile-card-table">
                    <div class="mobile-card-row">
                        <div class="cell"><i class="fas fa-hashtag"></i>Return ID</div>
                        <div class="cell">${return_item.id}</div>
                    </div>
                    <div class="mobile-card-row">
                        <div class="cell"><i class="fas fa-calendar"></i>Date</div>
                        <div class="cell">${return_item.date}</div>
                    </div>
                    <div class="mobile-card-row">
                        <div class="cell"><i class="fas fa-box"></i>Product</div>
                        <div class="cell">${return_item.product}</div>
                    </div>
                    <div class="mobile-card-row">
                        <div class="cell"><i class="fas fa-cubes"></i>Items</div>
                        <div class="cell">${return_item.items}</div>
                    </div>
                    <div class="mobile-card-row">
                        <div class="cell"><i class="fas fa-info-circle"></i>Status</div>
                        <div class="cell">${return_item.status}</div>
                    </div>
                    <div class="mobile-card-row">
                        <div class="cell"><i class="fas fa-exclamation-circle"></i>Cause</div>
                        <div class="cell">${return_item.cause}</div>
                    </div>
                </div>
                <div class="actions">
                    <button class="download-btn" onclick="downloadReturn('${return_item.id}'); event.stopPropagation();">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            </div>
        `).join('');
    } else {
        // Original desktop table rendering
        tableBody.innerHTML = returnsData.map(return_item => `
            <div class="table-row" onclick="showReturnDetails('${return_item.id}')">
                <div class="cell">${return_item.id}</div>
                <div class="cell">${return_item.date}</div>
                <div class="cell">${return_item.product}</div>
                <div class="cell">${return_item.items}</div>
                <div class="cell status">
                    <span class="status-indicator status-${return_item.status.toLowerCase()}"></span>
                    ${return_item.status}
                </div>
                <div class="cell">${return_item.cause}</div>
                <div class="cell">
                    <button class="download-btn" onclick="downloadReturn('${return_item.id}'); event.stopPropagation();">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Show order details
function showOrderDetails(orderId) {
    const ordersData = JSON.parse(sessionStorage.getItem('ordersData'));
    const order = ordersData.find(o => o.id === orderId);
    
    if (order) {
        const modal = document.getElementById('orderDetailsModal');
        modal.setAttribute('data-order-id', orderId);
        
        // Fill customer info
        modal.querySelector('[placeholder="Name"]').value = order.customer.name;
        modal.querySelector('[placeholder="Address"]').value = order.customer.address;
        modal.querySelector('[placeholder="Phone"]').value = order.customer.phone;
        
        // Fill product info
        modal.querySelector('[placeholder="Product Name"]').value = order.product;
        modal.querySelector('[placeholder="Purchase date"]').value = order.date;
        modal.querySelector('[placeholder="No. of Items"]').value = order.items;
        modal.querySelector('[placeholder="Price"]').value = `$${order.price.toFixed(2)}`;
        modal.querySelector('[placeholder="Warranty Due Date"]').value = order.warranty || 'N/A';

        // Fill editable comments
        const commentsTextarea = modal.querySelector('textarea.editable');
        if (commentsTextarea) {
            commentsTextarea.value = order.comments || '';
            // Make only comments editable
            modal.querySelectorAll('.form-input:not(textarea.editable)').forEach(input => {
                input.setAttribute('readonly', true);
            });
            commentsTextarea.removeAttribute('readonly');
        }
        
        // Update save button state
        const saveBtn = modal.querySelector('.save-btn');
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Save';
        }
        
        // Update status timeline
        updateOrderStatus(order.status);
        
        // Show modal
        toggleModal('orderDetailsModal');

        // Add event listener for comments changes
        if (commentsTextarea) {
            commentsTextarea.addEventListener('input', function() {
                const saveBtn = modal.querySelector('.save-btn');
                if (saveBtn) {
                    saveBtn.disabled = false;
                    saveBtn.innerHTML = '<i class="fas fa-save"></i> Save';
                }
            });
        }
    }
}

// Show return details
function showReturnDetails(returnId) {
    const returnsData = JSON.parse(sessionStorage.getItem('returnsData'));
    const return_item = returnsData.find(r => r.id === returnId);
    
    if (return_item) {
        const modal = document.getElementById('returnDetailsModal');
        modal.setAttribute('data-return-id', returnId);
        
        // Fill customer info
        modal.querySelector('[placeholder="Name"]').value = return_item.customer.name;
        modal.querySelector('[placeholder="Address"]').value = return_item.customer.address;
        modal.querySelector('[placeholder="Phone"]').value = return_item.customer.phone;
        
        // Fill product info
        modal.querySelector('[placeholder="Product Name"]').value = return_item.product;
        modal.querySelector('[placeholder="Purchase date"]').value = return_item.purchaseDate;
        modal.querySelector('[placeholder="No. of Items"]').value = return_item.items;
        modal.querySelector('[placeholder="Price"]').value = `$${return_item.price.toFixed(2)}`;
        modal.querySelector('[placeholder="Product status"]').value = return_item.productStatus;
        modal.querySelector('[placeholder="Cause of Return"]').value = return_item.cause;

        // Fill editable investigation report
        const investigationTextarea = modal.querySelector('textarea.editable');
        if (investigationTextarea) {
            investigationTextarea.value = return_item.investigation || '';
            // Make only investigation report editable
            modal.querySelectorAll('.form-input:not(textarea.editable)').forEach(input => {
                input.setAttribute('readonly', true);
            });
            investigationTextarea.removeAttribute('readonly');
        }
        
        // Update save button state
        const saveBtn = modal.querySelector('.save-btn');
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Save';
        }
        
        // Update return status timeline
        updateReturnStatus(return_item.returnStatus);
        
        // Show modal
        toggleModal('returnDetailsModal');

        // Add event listener for investigation changes
        if (investigationTextarea) {
            investigationTextarea.addEventListener('input', function() {
                const saveBtn = modal.querySelector('.save-btn');
                if (saveBtn) {
                    saveBtn.disabled = false;
                    saveBtn.innerHTML = '<i class="fas fa-save"></i> Save';
                }
            });
        }
    }
}

// Helper functions for status updates
function updateOrderStatus(status) {
    const statusPoints = document.querySelectorAll('#orderDetailsModal .status-point');
    updateStatusTimeline(statusPoints, status);
    animateTimeline(statusPoints);
}

function updateReturnStatus(status) {
    const statusPoints = document.querySelectorAll('#returnDetailsModal .status-point');
    updateStatusTimeline(statusPoints, status);
    animateTimeline(statusPoints);
}

function updateStatusTimeline(points, currentStatus) {
    let activeFound = false;
    points.forEach((point) => {
        const pointStatus = point.querySelector('span').textContent.toLowerCase();
        if (!activeFound && (pointStatus === currentStatus || !currentStatus)) {
            point.classList.add('active');
            activeFound = true;
        } else {
            point.classList.remove('active');
        }
    });
}

function animateTimeline(points) {
    points.forEach((point, index) => {
        if (point.classList.contains('active')) {
            setTimeout(() => {
                const icon = point.querySelector('.status-icon');
                icon.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    icon.style.transform = 'scale(1)';
                }, 200);
            }, index * 300);
        }
    });
}

// Download functions
function downloadOrder(orderId) {
    console.log('Downloading order:', orderId);
    // Implement download functionality
}

function downloadReturn(returnId) {
    console.log('Downloading return:', returnId);
    // Implement download functionality
}

// Filter functionality
function toggleFilter(type) {
    const menuId = `${type}FilterMenu`;
    const menu = document.getElementById(menuId);
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// Sorting functions
function sortBy(criteria) {
    let ordersData = JSON.parse(sessionStorage.getItem('ordersData'));
    
    switch(criteria) {
        case 'date':
            ordersData.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'price':
            ordersData.sort((a, b) => b.price - a.price);
            break;
        case 'category':
            ordersData.sort((a, b) => a.category.localeCompare(b.category));
            break;
    }
    
    sessionStorage.setItem('ordersData', JSON.stringify(ordersData));
    renderOrdersTable();

    // Close both desktop and mobile filter menus
    const desktopFilterMenu = document.getElementById('ordersFilterMenu');
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

function sortReturnsBy(criteria) {
    let returnsData = JSON.parse(sessionStorage.getItem('returnsData'));
    
    switch(criteria) {
        case 'date':
            returnsData.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'status':
            returnsData.sort((a, b) => a.status.localeCompare(b.status));
            break;
        case 'product':
            returnsData.sort((a, b) => a.product.localeCompare(b.product));
            break;
    }
    
    sessionStorage.setItem('returnsData', JSON.stringify(returnsData));
    renderReturnsTable();

    // Close both desktop and mobile filter menus
    const desktopFilterMenu = document.getElementById('returnsFilterMenu');
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

// Modal toggle
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

// Search functionality
const searchInput = document.querySelector('.search-bar input');
searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
    
    if (activeTab === 'orders') {
        const ordersData = JSON.parse(sessionStorage.getItem('ordersData'));
        const filteredOrders = ordersData.filter(order => 
            order.product.toLowerCase().includes(searchTerm) ||
            order.category.toLowerCase().includes(searchTerm) ||
            order.id.toString().includes(searchTerm)
        );
        renderFilteredOrders(filteredOrders);
    } else {
        const returnsData = JSON.parse(sessionStorage.getItem('returnsData'));
        const filteredReturns = returnsData.filter(return_item => 
            return_item.product.toLowerCase().includes(searchTerm) ||
            return_item.cause.toLowerCase().includes(searchTerm) ||
            return_item.id.toString().includes(searchTerm)
        );
        renderFilteredReturns(filteredReturns);
    }
});

function renderFilteredOrders(orders) {
    const tableBody = document.querySelector('#ordersList .table-body');
    tableBody.innerHTML = orders.map(order => `
        <div class="table-row" onclick="showOrderDetails(${order.id})">
            <div class="cell">${order.id}</div>
            <div class="cell">${order.date}</div>
            <div class="cell">${order.product}</div>
            <div class="cell">${order.items}</div>
            <div class="cell">$${order.price.toFixed(2)}</div>
            <div class="cell">${order.category}</div>
            <div class="cell">
                <button class="download-btn" onclick="downloadOrder(${order.id}); event.stopPropagation();">
                    <i class="fas fa-download"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function renderFilteredReturns(returns) {
    const tableBody = document.querySelector('#returnsList .table-body');
    tableBody.innerHTML = returns.map(return_item => `
        <div class="table-row" onclick="showReturnDetails('${return_item.id}')">
            <div class="cell">${return_item.id}</div>
            <div class="cell">${return_item.date}</div>
            <div class="cell">${return_item.product}</div>
            <div class="cell">${return_item.items}</div>
            <div class="cell status">
                <span class="status-indicator status-${return_item.status.toLowerCase()}"></span>
                ${return_item.status}
            </div>
            <div class="cell">${return_item.cause}</div>
            <div class="cell">
                <button class="download-btn" onclick="downloadReturn('${return_item.id}'); event.stopPropagation();">
                    <i class="fas fa-download"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Clear search
document.querySelector('.clear-search').addEventListener('click', function() {
    searchInput.value = '';
    const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
    if (activeTab === 'orders') {
        renderOrdersTable();
    } else {
        renderReturnsTable();
    }
});

// Close dropdowns and modals when clicking outside
document.addEventListener('click', function(event) {
    // Close filter menus
    if (!event.target.closest('.filter-dropdown')) {
        document.querySelectorAll('.filter-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    }
    
    // Close modals when clicking outside
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});

// Status helpers
function getStatusColor(status) {
    switch(status.toLowerCase()) {
        case 'pending':
            return '#ffc107';
        case 'processing':
            return '#17a2b8';
        case 'completed':
            return '#28a745';
        default:
            return '#6c757d';
    }
}

// Pagination functionality
document.querySelectorAll('.page-btn').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');
        
        // Here you would typically load the corresponding page of data
        // For now, we'll just keep the current data
        const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
        if (activeTab === 'orders') {
            renderOrdersTable();
        } else {
            renderReturnsTable();
        }
    });
});

// Download handlers with progress indication
function downloadOrder(orderId, event) {
    if (event) event.stopPropagation();
    const button = event.currentTarget;
    const originalContent = button.innerHTML;
    
    // Show downloading state
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    button.disabled = true;
    
    // Simulate download process
    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            button.innerHTML = originalContent;
            button.disabled = false;
        }, 1000);
    }, 1500);
}

function downloadReturn(returnId, event) {
    if (event) event.stopPropagation();
    const button = event.currentTarget;
    const originalContent = button.innerHTML;
    
    // Show downloading state
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    button.disabled = true;
    
    // Simulate download process
    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            button.innerHTML = originalContent;
            button.disabled = false;
        }, 1000);
    }, 1500);
}

// Helper function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Helper function to format dates
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Initialize tooltips for status indicators
function initializeTooltips() {
    const statusIndicators = document.querySelectorAll('.status-indicator');
    statusIndicators.forEach(indicator => {
        indicator.title = indicator.parentElement.textContent.trim();
    });
}

// Call initialization functions
document.addEventListener('DOMContentLoaded', function() {
    initializeTooltips();
});

// Handle window resize for responsive adjustments
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        const activeModal = document.querySelector('.modal[style*="display: flex"]');
        if (activeModal) {
            adjustModalPosition(activeModal);
        }
    }, 250);
});

function adjustModalPosition(modal) {
    const modalContent = modal.querySelector('.modal-content');
    const windowHeight = window.innerHeight;
    const modalHeight = modalContent.offsetHeight;
    
    if (modalHeight > windowHeight - 40) {
        modalContent.style.height = (windowHeight - 40) + 'px';
        modalContent.style.overflow = 'auto';
    } else {
        modalContent.style.height = '';
        modalContent.style.overflow = '';
    }
}

// Add these functions to handle saving comments and investigation reports
function saveComments(button) {
    const textarea = button.closest('.form-group').querySelector('textarea');
    const orderId = button.closest('.modal').getAttribute('data-order-id');
    const newComments = textarea.value;
    
    // Get current orders data
    let ordersData = JSON.parse(sessionStorage.getItem('ordersData') || '[]');
    const orderIndex = ordersData.findIndex(order => order.id.toString() === orderId);
    
    if (orderIndex !== -1) {
        ordersData[orderIndex].comments = newComments;
        sessionStorage.setItem('ordersData', JSON.stringify(ordersData));
        
        // Show success feedback
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Saved';
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 2000);
    }
}

function saveInvestigation(button) {
    const textarea = button.closest('.form-group').querySelector('textarea');
    const returnId = button.closest('.modal').getAttribute('data-return-id');
    const newInvestigation = textarea.value;
    
    // Get current returns data
    let returnsData = JSON.parse(sessionStorage.getItem('returnsData') || '[]');
    const returnIndex = returnsData.findIndex(return_item => return_item.id === returnId);
    
    if (returnIndex !== -1) {
        returnsData[returnIndex].investigation = newInvestigation;
        sessionStorage.setItem('returnsData', JSON.stringify(returnsData));
        
        // Show success feedback
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Saved';
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 2000);
    }
}

// Add resize listener to handle layout changes
window.addEventListener('resize', () => {
    renderOrdersTable();
    renderReturnsTable();
});

// Add mobile filter functionality
function toggleMobileFilter() {
    const filterMenu = document.getElementById('mobileFilterMenu');
    const filterBtn = document.querySelector('.mobile-filter-btn');
    const chevronIcon = filterBtn.querySelector('.fa-chevron-down');
    const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
    
    // Show appropriate filters based on active tab
    const ordersFilters = filterMenu.querySelector('.orders-filters');
    const returnsFilters = filterMenu.querySelector('.returns-filters');
    
    ordersFilters.style.display = activeTab === 'orders' ? 'block' : 'none';
    returnsFilters.style.display = activeTab === 'returns' ? 'block' : 'none';
    
    filterMenu.classList.toggle('active');
    chevronIcon.style.transform = filterMenu.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
}

// Close filter menu when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.closest('.mobile-filter-container')) {
        const filterMenu = document.getElementById('mobileFilterMenu');
        const chevronIcon = document.querySelector('.mobile-filter-btn .fa-chevron-down');
        if (filterMenu.classList.contains('active')) {
            filterMenu.classList.remove('active');
            chevronIcon.style.transform = 'rotate(0)';
        }
    }
});
