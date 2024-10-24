document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const darkModeToggle = document.getElementById('darkModeToggle');
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDate');
    const prioritySelect = document.getElementById('prioritySelect');
    const categorySelect = document.getElementById('categorySelect');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const searchBar = document.getElementById('searchBar');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sortPriorityBtn = document.querySelector('[data-sort="priority"]');
    const sortDueDateBtn = document.querySelector('[data-sort="dueDate"]');
    const taskList = document.getElementById('taskList');

    let tasks = [];
    let filterStatus = 'all';
    let sortBy = null;  // Track sorting criteria

    // Toggle Dark Mode
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    // Add task
    addTaskBtn.addEventListener('click', () => {
        const taskTitle = taskInput.value.trim();
        const dueDate = dueDateInput.value;
        const priority = prioritySelect.value;
        const category = categorySelect.value;

        if (taskTitle) {
            const task = {
                id: Date.now(),
                title: taskTitle,
                dueDate: dueDate,
                priority: priority,
                category: category,
                completed: false,
            };
            tasks.push(task);
            taskInput.value = '';
            renderTasks();
        }
    });

    // Search tasks
    searchBar.addEventListener('input', () => {
        renderTasks();
    });

    // Filter tasks
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterStatus = btn.getAttribute('data-filter');
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTasks();
        });
    });

    // Sort by Priority
    sortPriorityBtn.addEventListener('click', () => {
        sortBy = 'priority';
        renderTasks();
    });

    // Sort by Due Date
    sortDueDateBtn.addEventListener('click', () => {
        sortBy = 'dueDate';
        renderTasks();
    });

    // Render tasks
    function renderTasks() {
        taskList.innerHTML = '';

        // Filter tasks based on status (all, active, completed)
        let filteredTasks = tasks.filter(task => {
            if (filterStatus === 'active') return !task.completed;
            if (filterStatus === 'completed') return task.completed;
            return true;
        });

        // Search filtering
        filteredTasks = filteredTasks.filter(task => 
            task.title.toLowerCase().includes(searchBar.value.toLowerCase())
        );

        // Sort tasks by selected criteria (priority or due date)
        if (sortBy === 'priority') {
            const priorityMap = { low: 1, medium: 2, high: 3 };
            filteredTasks.sort((a, b) => priorityMap[b.priority] - priorityMap[a.priority]);
        } else if (sortBy === 'dueDate') {
            filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        }

        // Render each task
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.classList.toggle('completed', task.completed);
            li.innerHTML = `
                <span>${task.title} - ${task.dueDate} - ${task.priority} - ${task.category}</span>
                <div>
                    <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;

            // Complete task button
            li.querySelector('.complete-btn').addEventListener('click', () => {
                task.completed = !task.completed;
                renderTasks();
            });

            // Delete task button
            li.querySelector('.delete-btn').addEventListener('click', () => {
                tasks = tasks.filter(t => t.id !== task.id);
                renderTasks();
            });

            taskList.appendChild(li);
        });
    }
});
