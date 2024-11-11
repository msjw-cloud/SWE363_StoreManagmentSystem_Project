document.addEventListener('DOMContentLoaded', function() {
    // Initialize sidebar state for mobile
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
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