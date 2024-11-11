document.addEventListener('DOMContentLoaded', function() {
    // Initialize calendar
    const currentDate = new Date();
    const calendar = {
        currentMonth: currentDate.getMonth(),
        currentYear: currentDate.getFullYear(),
        months: [
            'January', 'February', 'March', 'April',
            'May', 'June', 'July', 'August',
            'September', 'October', 'November', 'December'
        ]
    };

    // Month Navigation
    const prevMonthBtn = document.querySelector('.prev-month');
    const nextMonthBtn = document.querySelector('.next-month');
    const monthTitle = document.querySelector('.month-navigation h1');

    prevMonthBtn?.addEventListener('click', () => {
        navigateMonth(-1);
    });

    nextMonthBtn?.addEventListener('click', () => {
        navigateMonth(1);
    });

    function navigateMonth(direction) {
        calendar.currentMonth += direction;
        
        if (calendar.currentMonth > 11) {
            calendar.currentMonth = 0;
            calendar.currentYear++;
        } else if (calendar.currentMonth < 0) {
            calendar.currentMonth = 11;
            calendar.currentYear--;
        }

        updateCalendar();
    }

    function updateCalendar() {
        // Update month/year display
        monthTitle.textContent = `${calendar.months[calendar.currentMonth]} ${calendar.currentYear}`;

        // Here you would typically update the calendar grid
        // For this version, we're keeping it static as per requirements
    }

    // Search functionality
    const searchInput = document.querySelector('.search-container input');
    searchInput?.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        searchEvents(searchTerm);
    });

    function searchEvents(searchTerm) {
        const events = document.querySelectorAll('.event');
        events.forEach(event => {
            const eventText = event.textContent.toLowerCase();
            const eventDay = event.closest('.calendar-day');
            
            if (eventText.includes(searchTerm)) {
                eventDay.style.display = '';
                // Highlight the matching event
                event.style.boxShadow = '0 0 0 2px #feb800';
            } else {
                // Don't hide the day, just remove highlight
                event.style.boxShadow = 'none';
            }
        });
    }

    // Highlight current day
    function highlightToday() {
        const today = new Date();
        const todayDate = today.getDate();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        if (calendar.currentMonth === currentMonth && calendar.currentYear === currentYear) {
            const allDays = document.querySelectorAll('.calendar-day');
            allDays.forEach(day => {
                const dayNumber = parseInt(day.querySelector('span')?.textContent);
                if (dayNumber === todayDate) {
                    day.classList.add('today');
                }
            });
        }
    }

    // Event hover effects
    const events = document.querySelectorAll('.event');
    events.forEach(event => {
        event.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'transform 0.2s ease';
        });

        event.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Initialize tooltips for events when they're truncated
    function initializeEventTooltips() {
        const events = document.querySelectorAll('.event');
        events.forEach(event => {
            const eventText = event.querySelector('span');
            if (eventText && eventText.scrollWidth > eventText.clientWidth) {
                event.title = eventText.textContent;
            }
        });
    }

    // User session handling
    function initializeUserSession() {
        const storedName = sessionStorage.getItem('userName');
        if (storedName) {
            document.querySelector('.user-info .name').textContent = storedName;
            const avatarElement = document.querySelector('#userAvatar');
            if (avatarElement) {
                avatarElement.textContent = storedName.charAt(0).toUpperCase();
            }
        }
    }

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            initializeEventTooltips();
        }, 250);
    });

    // Initialize everything
    updateCalendar();
    highlightToday();
    initializeEventTooltips();
    initializeUserSession();
});