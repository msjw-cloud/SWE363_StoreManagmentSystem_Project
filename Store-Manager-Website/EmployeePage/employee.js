document.addEventListener('DOMContentLoaded', function() {
    // Initial employees data
    let employees = [
        { id: 1, name: 'Pat Black', gender: 'Male', email: 'bill.berry@example.com', age: 28 },
        { id: 2, name: 'Angel Jones', gender: 'Female', email: 'glen.ramirez@example.com', age: 36 },
        { id: 3, name: 'Max Edwards', gender: 'Female', email: 'renee.hughes@example.com', age: 27 },
        { id: 4, name: 'Bruce Fox', gender: 'Male', email: 'craig.kelley@example.com', age: 43 },
        { id: 5, name: 'Devon Fisher', gender: 'Male', email: 'joy.ramos@example.com', age: 32 }
    ];

    // DOM Elements
    const modal = document.getElementById('employeeModal');
    const addEmployeeBtn = document.getElementById('addEmployeeBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const employeeForm = document.getElementById('employeeForm');
    const searchInput = document.getElementById('searchInput');
    const modalTitle = document.getElementById('modalTitle');
    const employeesTableBody = document.getElementById('employeesTableBody');
    
    // Profile Elements
    const profileImg = document.getElementById('profile-img');
    const profileUpload = document.getElementById('profile-upload');
    const profile = document.querySelector('.profile');
    const notifications = document.querySelector('.notifications');
    const notificationBoard = document.querySelector('.notification-board');
    const profileBoard = document.querySelector('.profile-board');

    // Form Elements
    const employeeIdInput = document.getElementById('employeeId');
    const nameInput = document.getElementById('name');
    const genderInput = document.getElementById('gender');
    const emailInput = document.getElementById('email');
    const ageInput = document.getElementById('age');

    // Function to render employees table
    function renderEmployees(employeesToRender = employees) {
        employeesTableBody.innerHTML = '';
        employeesToRender.forEach(employee => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${employee.name}</td>
                <td>${employee.gender}</td>
                <td>${employee.email}</td>
                <td>${employee.age}</td>
                <td>
                    <button onclick="editEmployee(${employee.id})" class="edit-btn">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteEmployee(${employee.id})" class="delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            employeesTableBody.appendChild(tr);
        });
    }

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredEmployees = employees.filter(emp => 
            emp.name.toLowerCase().includes(searchTerm) ||
            emp.email.toLowerCase().includes(searchTerm)
        );
        renderEmployees(filteredEmployees);
    });

    // Add new employee button click
    addEmployeeBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Add New Employee';
        employeeForm.reset();
        employeeIdInput.value = '';
        modal.style.display = 'block';
    });

    // Form submission handler
    employeeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const employeeData = {
            name: nameInput.value,
            gender: genderInput.value,
            email: emailInput.value,
            age: parseInt(ageInput.value)
        };

        const employeeId = employeeIdInput.value;

        if (employeeId) {
            // Update existing employee
            const id = parseInt(employeeId);
            employees = employees.map(emp => 
                emp.id === id ? { ...employeeData, id } : emp
            );
        } else {
            // Add new employee
            const newId = Math.max(...employees.map(emp => emp.id)) + 1;
            employees.push({ ...employeeData, id: newId });
        }

        modal.style.display = 'none';
        renderEmployees();
    });

    // Edit employee function
    window.editEmployee = function(id) {
        const employee = employees.find(emp => emp.id === id);
        if (employee) {
            modalTitle.textContent = 'Edit Employee';
            employeeIdInput.value = employee.id;
            nameInput.value = employee.name;
            genderInput.value = employee.gender;
            emailInput.value = employee.email;
            ageInput.value = employee.age;
            modal.style.display = 'block';
        }
    };

    // Delete employee function
    window.deleteEmployee = function(id) {
        if (confirm('Are you sure you want to delete this employee?')) {
            employees = employees.filter(emp => emp.id !== id);
            renderEmployees();
        }
    };

    // Cancel button
    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Profile image upload handling
    profile.addEventListener('click', function(e) {
        e.stopPropagation();
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
    notifications.addEventListener('click', function(e) {
        e.stopPropagation();
        notificationBoard.style.display = notificationBoard.style.display === 'block' ? 'none' : 'block';
        profileBoard.style.display = 'none'; // Close profile board if open
    });

    // Profile board toggle
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

    // Your existing disabled items code
    const disabledItems = document.querySelectorAll('.sidebar-item.disabled');
    disabledItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            alert('This feature is not available yet.');
        });
    });

    // Initial render of employees
    renderEmployees();
});