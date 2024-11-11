document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const toggleIcon = sidebarToggle.querySelector('i');
    const isMobile = () => window.innerWidth <= 1024;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    // Initialize sidebar state
    function initializeSidebar() {
        const storedState = localStorage.getItem('sidebarState');
        
        // Disable transitions temporarily
        sidebar.style.transition = 'none';
        mainContent.style.transition = 'none';
        
        if (isMobile()) {
            // Mobile initialization
            sidebar.classList.add('mobile');
            mainContent.style.marginLeft = '0';
            moveToggleButton();
        } else {
            // Desktop initialization
            sidebar.classList.remove('mobile');
            if (storedState === null) {
                // First time load - sidebar should be open
                sidebar.classList.remove('collapsed');
                mainContent.classList.remove('expanded');
                toggleIcon.classList.replace('fa-chevron-right', 'fa-chevron-left');
            } else if (storedState === 'collapsed') {
                // Subsequent loads - respect stored state
                sidebar.classList.add('collapsed');
                mainContent.classList.add('expanded');
                toggleIcon.classList.replace('fa-chevron-left', 'fa-chevron-right');
            } else {
                sidebar.classList.remove('collapsed');
                mainContent.classList.remove('expanded');
                toggleIcon.classList.replace('fa-chevron-right', 'fa-chevron-left');
            }
            restoreToggleButton();
        }

        // Re-enable transitions after a brief delay
        requestAnimationFrame(() => {
            sidebar.style.transition = '';
            mainContent.style.transition = '';
        });
    }

    // Toggle handler
    sidebarToggle.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (isMobile()) {
            // Mobile toggle
            sidebar.classList.toggle('expanded');
            overlay.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('expanded') ? 'hidden' : '';
        } else {
            // Desktop toggle
            const willCollapse = !sidebar.classList.contains('collapsed');
            sidebar.classList.toggle('collapsed', willCollapse);
            mainContent.classList.toggle('expanded', willCollapse);
            
            if (willCollapse) {
                toggleIcon.classList.replace('fa-chevron-left', 'fa-chevron-right');
            } else {
                toggleIcon.classList.replace('fa-chevron-right', 'fa-chevron-left');
            }
            
            localStorage.setItem('sidebarState', willCollapse ? 'collapsed' : 'expanded');
        }
    });

    // Helper functions
    function moveToggleButton() {
        const header = document.querySelector('header .left-section');
        const userInfo = document.querySelector('.user-info');
        if (header && userInfo) {
            sidebarToggle.classList.add('mobile-toggle');
            header.insertBefore(sidebarToggle, userInfo);
        }
    }

    function restoreToggleButton() {
        sidebarToggle.classList.remove('mobile-toggle');
        if (sidebar) {
            sidebar.appendChild(sidebarToggle);
        }
    }

    // Close sidebar when clicking overlay
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('expanded');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(initializeSidebar, 250);
    });

    // Initialize on load
    initializeSidebar();
}); 