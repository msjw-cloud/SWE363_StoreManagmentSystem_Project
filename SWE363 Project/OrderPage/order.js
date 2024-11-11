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

    // Tab Switching Logic
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    function switchTab(tabId) {
        // Remove active class from all tabs
        tabButtons.forEach(button => button.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));

        // Add active class to selected tab
        const selectedButton = document.querySelector(`[data-tab="${tabId}"]`);
        const selectedPane = document.getElementById(`${tabId}-tab`);
        
        if (selectedButton && selectedPane) {
            selectedButton.classList.add('active');
            selectedPane.classList.add('active');
        }
    }

    // Add click event listeners to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Sample employees data
    const employees = [
        { id: 1, name: "Faisal", email: "Faisal@example.com" },
        { id: 2, name: "Angel Jones", email: "glen.ramirez@example.com" },
        { id: 3, name: "Max Edwards", email: "renee.hughes@example.com" },
        { id: 4, name: "Bruce Fox", email: "craig.kelley@example.com" }
    ];

    // Sample orders data
    let orders = [
        {
            id: 'ORD-001',
            product: 'Laptop',
            quantity: 2,
            date: '2024-11-10',
            status: 'Pending'
        },
        {
            id: 'ORD-002',
            product: 'Mouse',
            quantity: 5,
            date: '2024-11-10',
            status: 'Pending'
        }
    ];

    let approvedOrders = [
        {
            id: 'ORD-003',
            product: 'Keyboard',
            quantity: 3,
            date: '2024-11-09',
            status: 'Approved',
            assignedTo: null
        }
    ];

    // Function to create a table row
    function createOrderRow(order) {
        if (order.status === 'Pending') {
            return `
                <tr>
                    <td>${order.id}</td>
                    <td>${order.product}</td>
                    <td>${order.quantity}</td>
                    <td>${order.date}</td>
                    <td>
                        <span class="status-badge status-pending">
                            <i class="fas fa-clock"></i>
                            ${order.status}
                        </span>
                    </td>
                    <td>
                        <button class="action-button approve-button" data-id="${order.id}">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button class="action-button delete-button" data-id="${order.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                </tr>
            `;
        } else {
            return `
                <tr>
                    <td>${order.id}</td>
                    <td>${order.product}</td>
                    <td>${order.quantity}</td>
                    <td>${order.date}</td>
                    <td>
                        <span class="status-badge status-approved">
                            <i class="fas fa-check-circle"></i>
                            ${order.status}
                        </span>
                    </td>
                    <td>
                        ${order.assignedTo ? 
                            `<span class="status-badge status-assigned">
                                <i class="fas fa-user-check"></i>
                                Assigned to ${order.assignedTo.name}
                            </span>` :
                            `<div class="assignment-dropdown-container">
                                <button class="assign-btn" onclick="toggleAssignmentDropdown('${order.id}')">
                                    <i class="fas fa-user-plus"></i>
                                    Assign Task
                                    <i class="fas fa-chevron-down"></i>
                                </button>
                                <div id="dropdown-${order.id}" class="assignment-dropdown">
                                    <div class="assignment-dropdown-header">
                                        <h3>
                                            <i class="fas fa-user-plus"></i>
                                            Assign Task
                                        </h3>
                                        <button onclick="toggleAssignmentDropdown('${order.id}')" class="close-btn">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </div>
                                    <div class="employees-list">
                                        ${employees.map(emp => `
                                            <button onclick="assignEmployee('${order.id}', ${emp.id})" class="employee-item">
                                                <div class="employee-info">
                                                    <div class="employee-name">
                                                        <i class="fas fa-user"></i> ${emp.name}
                                                    </div>
                                                    <div class="employee-email">
                                                        <i class="fas fa-envelope"></i> ${emp.email}
                                                    </div>
                                                </div>
                                            </button>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>`
                        }
                    </td>
                    <td>
                        <button class="action-button delete-button" data-id="${order.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                </tr>
            `;
        }
    }

    // Function to update table content
    function updateTables() {
        const ordersTableBody = document.getElementById('orders-table-body');
        const approvedTableBody = document.getElementById('approved-table-body');

        // Update pending orders table
        if (orders.length === 0) {
            ordersTableBody.innerHTML = '<tr class="empty-state"><td colspan="6">No orders found</td></tr>';
        } else {
            ordersTableBody.innerHTML = orders.map(order => createOrderRow(order)).join('');
        }

        // Update approved orders table
        if (approvedOrders.length === 0) {
            approvedTableBody.innerHTML = '<tr class="empty-state"><td colspan="7">No approved orders found</td></tr>';
        } else {
            approvedTableBody.innerHTML = approvedOrders.map(order => createOrderRow(order)).join('');
        }

        // Add event listeners to new buttons
        addButtonEventListeners();
    }

    // Function to toggle assignment dropdown
    window.toggleAssignmentDropdown = function(orderId) {
        const dropdown = document.getElementById(`dropdown-${orderId}`);
        const allDropdowns = document.querySelectorAll('.assignment-dropdown');
        
        // Close all other dropdowns
        allDropdowns.forEach(d => {
            if (d.id !== `dropdown-${orderId}`) {
                d.classList.remove('show');
            }
        });

        // Toggle the clicked dropdown
        dropdown.classList.toggle('show');
        event.stopPropagation();
    }

    // Function to assign employee to order
    window.assignEmployee = function(orderId, employeeId) {
        const order = approvedOrders.find(o => o.id === orderId);
        const employee = employees.find(e => e.id === employeeId);
        
        if (order && employee) {
            order.assignedTo = employee;
            updateTables();
        }
    }

    // Add event listeners to action buttons
    function addButtonEventListeners() {
        // Approve button listeners
        document.querySelectorAll('.approve-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const orderId = e.target.getAttribute('data-id');
                approveOrder(orderId);
            });
        });

        // Delete button listeners
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const orderId = e.target.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this order?')) {
                    deleteOrder(orderId);
                }
            });
        });
    }

    // Function to approve an order
    function approveOrder(orderId) {
        const orderIndex = orders.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
            const order = orders[orderIndex];
            order.status = 'Approved';
            order.assignedTo = null;
            approvedOrders.push(order);
            orders.splice(orderIndex, 1);
            updateTables();
        }
    }

    // Function to delete an order
    function deleteOrder(orderId) {
        orders = orders.filter(order => order.id !== orderId);
        approvedOrders = approvedOrders.filter(order => order.id !== orderId);
        updateTables();
    }

    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    let originalOrders = [...orders];
    let originalApprovedOrders = [...approvedOrders];

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            if (searchTerm === '') {
                // Restore original arrays if search is cleared
                orders = [...originalOrders];
                approvedOrders = [...originalApprovedOrders];
            } else {
                // Filter both arrays
                orders = originalOrders.filter(order => 
                    order.product.toLowerCase().includes(searchTerm) ||
                    order.id.toLowerCase().includes(searchTerm)
                );
                approvedOrders = originalApprovedOrders.filter(order => 
                    order.product.toLowerCase().includes(searchTerm) ||
                    order.id.toLowerCase().includes(searchTerm)
                );
            }
            
            updateTables();
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.assignment-dropdown-container')) {
            const dropdowns = document.querySelectorAll('.assignment-dropdown');
            dropdowns.forEach(dropdown => dropdown.classList.remove('show'));
        }
    });

    // Initialize tables with data
    updateTables();
});