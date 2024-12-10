document.addEventListener('DOMContentLoaded', function() {
    // Initialize sidebar state for mobile
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../LogPage/logPage.html';
        return;
    }
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const logoutButton = document.querySelector('.right-section');
    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('token');
        sessionStorage.removeItem('userName');
        window.location.href = '../LogPage/logPage.html';
    });


    function checkMobileView() {
        if (window.innerWidth <= 1024) {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
        }
    }

    // Check on load
    checkMobileView();

    // Check on resize
    window.addEventListener('resize', checkMobileView);

    // Make checkboxes interactive
    const checkboxes = document.querySelectorAll('.checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function() {
            this.classList.toggle('checked');
            
            const taskItem = this.closest('.task-item');
            if (this.classList.contains('checked')) {
                taskItem.style.opacity = '0.7';
            } else {
                taskItem.style.opacity = '1';
            }
        });
    });

    // Fetch dashboard stats
async function fetchDashboardStats() {
    try {
        const response = await fetch('http://localhost:5000/api/statistics/dashboard', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        updateDashboardUI(data);
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
    }
}

function updateDashboardUI(stats) {
    // Update task counts
    document.querySelector('.category-card:nth-child(1) .task-count').textContent = 
        stats.tasks.pending;

    // Update orders/deliveries
    document.querySelector('.category-card:nth-child(2) .task-count').textContent = 
        stats.orders.monthly;

    // Update inventory
    document.querySelector('.category-card:nth-child(3) .task-count').textContent = 
        stats.products.lowStock;

    // You can add more stats as needed
}

// Call this after authentication check
fetchDashboardStats();

    // Widget interactions
    const widgets = document.querySelectorAll('.widget');
    widgets.forEach(widget => {
        if (widget.hasAttribute('onclick')) {
            widget.addEventListener('mouseenter', function() {
                if (window.innerWidth > 1024) { // Only apply hover effect on desktop
                    this.style.transform = 'translateY(-2px)';
                }
            });

            widget.addEventListener('mouseleave', function() {
                if (window.innerWidth > 1024) {
                    this.style.transform = 'translateY(0)';
                }
            });
        }
    });

    // Handle window resize for responsive adjustments
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            adjustLayout();
        }, 250);
    });

    // Initial layout adjustment
    adjustLayout();
});

// Function to adjust layout based on screen size
function adjustLayout() {
    const content = document.querySelector('.content');
    const widgets = document.querySelector('.widgets');
    const tasks = document.querySelector('.tasks');
    const purchases = document.querySelector('.purchases');

    if (window.innerWidth <= 1024) {
        // Stack widgets vertically
        widgets.style.flexDirection = 'column';
        
        // Adjust content sections
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.style.gap = '20px';

        // Full width for sections
        tasks.style.width = '100%';
        purchases.style.width = '100%';
    } else {
        // Reset to desktop layout
        widgets.style.flexDirection = 'row';
        content.style.display = 'grid';
        tasks.style.width = '';
        purchases.style.width = '';
    }
}

document.querySelector('.logout-button')?.addEventListener('click', function() {
    window.location.href = 'logPage.html';
});

async function initializePage() {
    try {
        const userProfile = await getUserProfile();
        // Update UI with user info
        document.querySelector('.user-info .name').textContent = userProfile.name;
        const avatarElement = document.querySelector('#userAvatar');
        if (avatarElement) {
            avatarElement.textContent = userProfile.name.charAt(0).toUpperCase();
        }
    } catch (error) {
        console.error('Failed to load user profile:', error);
    }
}