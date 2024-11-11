// Initial sample data
const initialEmployees = [
    {
        id: 1,
        name: 'Pat Black',
        gender: 'Male',
        email: 'pat.black@example.com'
    },
    {
        id: 2,
        name: 'Angel Jones',
        gender: 'Female',
        email: 'angel.jones@example.com'
    },
    {
        id: 3,
        name: 'Max Edwards',
        gender: 'Female',
        email: 'max.edwards@example.com'
    },
    {
        id: 4,
        name: 'Bruce Fox',
        gender: 'Male',
        email: 'bruce.fox@example.com'
    },
    {
        id: 5,
        name: 'Devon Fisher',
        gender: 'Male',
        email: 'devon.fisher@example.com'
    }
];

// Name persistence and data initialization
window.onload = function() {
    const storedName = sessionStorage.getItem('userName');
    if (storedName) {
        document.querySelector('.user-info .name').textContent = storedName;
        const avatarElement = document.querySelector('#userAvatar');
        if (avatarElement) {
            avatarElement.textContent = storedName.charAt(0).toUpperCase();
        }
    }

    // Initialize employees data if not exists
    if (!sessionStorage.getItem('employeesData')) {
        sessionStorage.setItem('employeesData', JSON.stringify(initialEmployees));
    }
    renderEmployeesTable();
};

// Render table function
function renderEmployeesTable(data) {
    const tableBody = document.querySelector('.list-body');
    const employeesData = data || JSON.parse(sessionStorage.getItem('employeesData') || '[]');
    const isMobile = window.innerWidth <= 768;
    
    if (employeesData.length === 0) {
        tableBody.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No employees found</p>
            </div>`;
        return;
    }

    if (isMobile) {
        tableBody.innerHTML = employeesData.map(employee => `
            <div class="list-row">
                <div class="employee-info">
                    <div class="employee-avatar">${employee.name.charAt(0)}</div>
                    <div class="employee-details">
                        <div class="employee-name">${employee.name}</div>
                        <div class="employee-gender">
                            <i class="fas ${employee.gender === 'Male' ? 'fa-mars' : 'fa-venus'}"></i>
                            ${employee.gender}
                        </div>
                        <div class="employee-email">
                            <i class="fas fa-envelope"></i>
                            ${employee.email}
                        </div>
                    </div>
                </div>
                <button class="message-btn" onclick="openNewMessage({
                    name: '${employee.name}',
                    email: '${employee.email}'
                })">
                    <i class="fas fa-paper-plane"></i>
                    Send Message
                </button>
            </div>
        `).join('');
    } else {
        // Original desktop table rendering
        tableBody.innerHTML = employeesData.map(employee => `
            <div class="list-row">
                <div class="cell">${employee.name}</div>
                <div class="cell">${employee.gender}</div>
                <div class="cell">${employee.email}</div>
                <div class="cell">
                    <button class="message-btn" onclick="openNewMessage({
                        name: '${employee.name}',
                        email: '${employee.email}'
                    })">Message</button>
                </div>
            </div>
        `).join('');
    }
}

// Add resize listener to handle layout changes
window.addEventListener('resize', () => {
    renderEmployeesTable();
});

// Message modal functionality
function openNewMessage(employee) {
    const modal = document.getElementById('messageModal');
    const recipientName = modal.querySelector('.recipient-name');
    const recipientEmail = modal.querySelector('.recipient-email');
    
    recipientName.textContent = employee.name;
    recipientEmail.textContent = employee.email;
    
    modal.style.display = 'flex';
}

function closeMessageModal() {
    const modal = document.getElementById('messageModal');
    modal.style.display = 'none';
    // Reset form
    document.getElementById('messageForm').reset();
}

// Search functionality
const searchInput = document.querySelector('.search-bar input');
const clearSearchBtn = document.querySelector('.clear-search');

searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    const employeesData = JSON.parse(sessionStorage.getItem('employeesData') || '[]');
    
    if (!searchTerm) {
        renderEmployeesTable();
        clearSearchBtn.style.display = 'none';
        return;
    }

    const filteredEmployees = employeesData.filter(employee => 
        employee.name.toLowerCase().includes(searchTerm) ||
        employee.email.toLowerCase().includes(searchTerm) ||
        employee.gender.toLowerCase().includes(searchTerm)
    );

    renderEmployeesTable(filteredEmployees);
    clearSearchBtn.style.display = 'flex';
});

// Clear search
clearSearchBtn.addEventListener('click', function() {
    searchInput.value = '';
    renderEmployeesTable();
    this.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('messageModal');
    if (event.target === modal) {
        closeMessageModal();
    }
});

// Handle message form submission
document.getElementById('messageForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        to: document.querySelector('.recipient-email').textContent,
        subject: this.querySelector('[name="subject"]').value,
        message: this.querySelector('[name="message"]').value,
        timestamp: new Date().toISOString()
    };
    
    // Store message in session storage
    const messages = JSON.parse(sessionStorage.getItem('sentMessages') || '[]');
    messages.push(formData);
    sessionStorage.setItem('sentMessages', JSON.stringify(messages));
    
    // Show success feedback
    const sendBtn = this.querySelector('.send-btn');
    const originalContent = sendBtn.innerHTML;
    sendBtn.innerHTML = '<i class="fas fa-check"></i> Sent';
    sendBtn.disabled = true;
    
    // Close modal after delay
    setTimeout(() => {
        closeMessageModal();
        // Reset button and form
        sendBtn.innerHTML = originalContent;
        sendBtn.disabled = false;
        this.reset();
    }, 1500);
});

// ESC key to close modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeMessageModal();
    }
});