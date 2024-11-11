document.addEventListener('DOMContentLoaded', function() {
    const categoryCards = document.querySelectorAll('.category-card');
    const taskItems = document.querySelectorAll('.task-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const typeTabs = document.querySelectorAll('.type-tab');
    const checkboxes = document.querySelectorAll('.checkbox');
    
    // Initialize counters
    updateTaskCounters();

    // Checkbox functionality
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function() {
            const taskItem = this.closest('.task-item');
            const wasChecked = this.classList.contains('checked');
            
            this.classList.toggle('checked');
            
            // Update task status
            if (!wasChecked) {
                taskItem.setAttribute('data-status', 'completed');
                taskItem.style.opacity = '0.7';
            } else {
                taskItem.setAttribute('data-status', 'pending');
                taskItem.style.opacity = '1';
            }
            
            // Update counters after status change
            updateTaskCounters();
        });
    });

    // Category cards click handler
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const wasActive = this.classList.contains('active');
            
            // Remove active class from all cards
            categoryCards.forEach(c => c.classList.remove('active'));
            
            // Remove active class from all filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            if (!wasActive) {
                // If card wasn't active before, activate it and filter
                this.classList.add('active');
                const status = this.querySelector('h3').textContent.toLowerCase();
                filterTasks(status);
            } else {
                // If card was already active, show all tasks
                showAllTasks();
            }
        });
    });

    // Time filter buttons click handler
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from category cards
            categoryCards.forEach(card => card.classList.remove('active'));
            
            // Toggle active class on filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.textContent.toLowerCase();
            filterTasksByTime(filter);
        });
    });

    // Task type tabs click handler
    typeTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            typeTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Show corresponding section
            const type = this.getAttribute('data-type');
            document.querySelectorAll('.task-section').forEach(section => {
                section.classList.remove('active');
                if (section.classList.contains(type + '-tasks')) {
                    section.classList.add('active');
                }
            });

            // Reset filters
            showAllTasks();
            categoryCards.forEach(card => card.classList.remove('active'));
            filterButtons.forEach(btn => {
                if (btn.textContent.toLowerCase() === 'all') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        });
    });

    // Function to show all tasks
    function showAllTasks() {
        taskItems.forEach(task => {
            task.style.display = '';
        });
    }

    // Function to filter tasks by status
    function filterTasks(status) {
        taskItems.forEach(task => {
            if (status === 'all' || task.getAttribute('data-status') === status) {
                task.style.display = '';
            } else {
                task.style.display = 'none';
            }
        });
    }

    // Function to filter tasks by time
    function filterTasksByTime(timeFrame) {
        // Show all tasks if "All" is selected
        if (timeFrame === 'all') {
            showAllTasks();
            return;
        }

        const today = new Date();
        taskItems.forEach(task => {
            // Get the task's due date from the task content
            const dueDateText = task.querySelector('.due-date').textContent;
            let show = false;

            switch (timeFrame) {
                case 'today':
                    show = dueDateText.toLowerCase().includes('today');
                    break;
                case 'this week':
                    // Check if due date is within current week
                    show = dueDateText.toLowerCase().includes('today') || 
                           dueDateText.toLowerCase().includes('tomorrow') ||
                           dueDateText.toLowerCase().includes('this week');
                    break;
                case 'this month':
                    // Check if due date is within current month
                    show = dueDateText.toLowerCase().includes('today') || 
                           dueDateText.toLowerCase().includes('tomorrow') ||
                           dueDateText.toLowerCase().includes('this week') ||
                           dueDateText.toLowerCase().includes('this month');
                    break;
            }

            task.style.display = show ? '' : 'none';
        });

        // Reset category cards active state
        categoryCards.forEach(card => card.classList.remove('active'));
    }

    // Helper functions for date comparison
    function isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }

    function isThisWeek(date) {
        const today = new Date();
        const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
        const lastDay = new Date(firstDay);
        lastDay.setDate(lastDay.getDate() + 6);

        return date >= firstDay && date <= lastDay;
    }

    function isSameMonth(date1, date2) {
        return date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }

    // Function to update task counters
    function updateTaskCounters() {
        const counts = {
            'pending': 0,
            'in progress': 0,
            'completed': 0
        };

        taskItems.forEach(task => {
            const status = task.getAttribute('data-status');
            if (counts.hasOwnProperty(status)) {
                counts[status]++;
            }
        });

        document.querySelector('.category-card:nth-child(1) .task-count').textContent = counts['pending'];
        document.querySelector('.category-card:nth-child(2) .task-count').textContent = counts['in progress'];
        document.querySelector('.category-card:nth-child(3) .task-count').textContent = counts['completed'];
    }

    // Update the status update button handler
    document.querySelectorAll('.status-update-btn').forEach(button => {
        button.addEventListener('click', function() {
            const taskItem = this.closest('.delivery-task-item');
            const currentStatus = taskItem.getAttribute('data-status');
            const nextStatus = this.getAttribute('data-next-status');
            
            // Update status
            taskItem.setAttribute('data-status', nextStatus);
            
            // Update status timeline
            const statusSteps = taskItem.querySelectorAll('.status-step');
            let foundCurrent = false;
            
            statusSteps.forEach(step => {
                const stepStatus = step.getAttribute('data-status');
                
                if (stepStatus === currentStatus) {
                    foundCurrent = true;
                    step.classList.remove('active');
                    step.classList.add('completed');
                }
                
                if (stepStatus === nextStatus) {
                    step.classList.add('active');
                }
            });
            
            // Update button text and data for next status
            if (nextStatus === 'processing') {
                this.textContent = 'Start Shipping';
                this.setAttribute('data-next-status', 'shipping');
            } else if (nextStatus === 'shipping') {
                this.textContent = 'Mark as Delivered';
                this.setAttribute('data-next-status', 'delivered');
            } else if (nextStatus === 'delivered') {
                this.style.display = 'none'; // Hide button when delivery is complete
            }
        });
    });
});