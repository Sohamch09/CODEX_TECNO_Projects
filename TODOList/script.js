        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        let currentGrouping = 'status';
        let currentFilter = 'all';
        
        // DOM elements
        const taskForm = document.getElementById('task-form');
        const taskTitle = document.getElementById('task-title');
        const taskDescription = document.getElementById('task-description');
        const taskDate = document.getElementById('task-date');
        const taskPriority = document.getElementById('task-priority');
        const pendingTasksList = document.getElementById('pending-tasks');
        const completedTasksList = document.getElementById('completed-tasks');
        const totalTasksEl = document.getElementById('total-tasks');
        const pendingCountEl = document.getElementById('pending-count');
        const completedCountEl = document.getElementById('completed-count');
        const overdueCountEl = document.getElementById('overdue-count');
        const priorityFilter = document.getElementById('priority-filter');
        
        
        document.querySelectorAll('.group-btn').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.group-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                currentGrouping = button.dataset.group;
                renderTasks();
            });
        });
        
        
        priorityFilter.addEventListener('change', () => {
            currentFilter = priorityFilter.value;
            renderTasks();
        });
        

        function init() {
            renderTasks();
            updateStats
            taskForm.addEventListener('submit', addTask);
        }
        
        
        function addTask(e) {
            e.preventDefault();
            
            const title = taskTitle.value.trim();
            if (title === '') return;
            
            const newTask = {
                id: Date.now(),
                title: title,
                description: taskDescription.value.trim(),
                dueDate: taskDate.value,
                priority: taskPriority.value,
                completed: false,
                addedAt: new Date().toISOString(),
                completedAt: null
            };
            
            tasks.push(newTask);
            saveTasks();
            renderTasks();
            updateStats();
            

            taskForm.reset();
            taskTitle.focus();
        }
        
        
        function toggleTaskCompletion(id) {
            tasks = tasks.map(task => {
                if (task.id === id) {
                    task.completed = !task.completed;
                    task.completedAt = task.completed ? new Date().toISOString() : null;
                }
                return task;
            });
            
            saveTasks();
            renderTasks();
            updateStats();
        }
        
        
        function editTask(id) {
            const task = tasks.find(task => task.id === id);
            const title = prompt('Edit task title:', task.title);
            if (title === null || title.trim() === '') return;
            
            const description = prompt('Edit task description:', task.description || '');
            const dueDate = prompt('Edit due date (YYYY-MM-DD):', task.dueDate || '');
            const priority = prompt('Edit priority (high, medium, low):', task.priority || 'medium');
            
            if (title !== null && title.trim() !== '') {
                task.title = title.trim();
                task.description = description ? description.trim() : '';
                task.dueDate = dueDate || null;
                task.priority = ['high', 'medium', 'low'].includes(priority) ? priority : 'medium';
                
                saveTasks();
                renderTasks();
            }
        }
        
        
        function deleteTask(id) {
            if (confirm('Are you sure you want to delete this task?')) {
                tasks = tasks.filter(task => task.id !== id);
                saveTasks();
                renderTasks();
                updateStats();
            }
        }
        
        
        function saveTasks() {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
        
        
        function formatDate(dateString) {
            if (!dateString) return 'No due date';
            
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
        
        
        function formatDateTime(dateString) {
            const date = new Date(dateString);
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        
        
        function updateStats() {
            const total = tasks.length;
            const pending = tasks.filter(task => !task.completed).length;
            const completed = tasks.filter(task => task.completed).length;
            const overdue = tasks.filter(task => 
                !task.completed && 
                task.dueDate && 
                new Date(task.dueDate) < new Date()
            ).length;
            
            totalTasksEl.textContent = total;
            pendingCountEl.textContent = pending;
            completedCountEl.textContent = completed;
            overdueCountEl.textContent = overdue;
        }
        
        
        function getPriorityLabel(priority) {
            switch(priority) {
                case 'high': return 'High Priority';
                case 'medium': return 'Medium Priority';
                case 'low': return 'Low Priority';
                default: return 'Priority';
            }
        }
        
        
        function getPriorityIcon(priority) {
            switch(priority) {
                case 'high': return 'fa-solid fa-triangle-exclamation';
                case 'medium': return 'fa-solid fa-circle-exclamation';
                case 'low': return 'fa-solid fa-arrow-down';
                default: return 'fa-solid fa-circle';
            }
        }
        
        
        function renderTasks() {
            pendingTasksList.innerHTML = '';
            completedTasksList.innerHTML = '';
            
            
            let filteredTasks = [...tasks];
            if (currentFilter !== 'all') {
                filteredTasks = filteredTasks.filter(task => task.priority === currentFilter);
            }
            
            const pendingTasks = filteredTasks.filter(task => !task.completed);
            const completedTasks = filteredTasks.filter(task => task.completed);
            
            
            if (pendingTasks.length === 0) {
                pendingTasksList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <p>No pending tasks. Add a new task above!</p>
                    </div>
                `;
            } else {
                if (currentGrouping === 'status') {
                    
                    const groupEl = document.createElement('div');
                    groupEl.className = 'task-group';
                    groupEl.innerHTML = `
                        <div class="group-header">
                            <i class="fas fa-list"></i>
                            <h3>Pending Tasks</h3>
                        </div>
                    `;
                    
                    const listEl = document.createElement('div');
                    pendingTasks.forEach(task => {
                        const taskEl = createTaskElement(task);
                        listEl.appendChild(taskEl);
                    });
                    
                    groupEl.appendChild(listEl);
                    pendingTasksList.appendChild(groupEl);
                } else if (currentGrouping === 'priority') {
                    
                    const groups = {
                        high: [],
                        medium: [],
                        low: []
                    };
                    
                    pendingTasks.forEach(task => {
                        groups[task.priority].push(task);
                    });
                    
                    
                    ['high', 'medium', 'low'].forEach(priority => {
                        if (groups[priority].length > 0) {
                            const groupEl = document.createElement('div');
                            groupEl.className = 'task-group';
                            groupEl.innerHTML = `
                                <div class="group-header">
                                    <i class="${getPriorityIcon(priority)}"></i>
                                    <h3>${getPriorityLabel(priority)}</h3>
                                </div>
                            `;
                            
                            const listEl = document.createElement('div');
                            groups[priority].forEach(task => {
                                const taskEl = createTaskElement(task);
                                listEl.appendChild(taskEl);
                            });
                            
                            groupEl.appendChild(listEl);
                            pendingTasksList.appendChild(groupEl);
                        }
                    });
                } else if (currentGrouping === 'date') {
                    // Group by date
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    tomorrow.setHours(0, 0, 0, 0);
                    
                    const nextWeek = new Date();
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    nextWeek.setHours(0, 0, 0, 0);
                    
                    const groups = {
                        overdue: [],
                        today: [],
                        tomorrow: [],
                        week: [],
                        later: [],
                        noDate: []
                    };
                    
                    pendingTasks.forEach(task => {
                        if (!task.dueDate) {
                            groups.noDate.push(task);
                            return;
                        }
                        
                        const dueDate = new Date(task.dueDate);
                        dueDate.setHours(0, 0, 0, 0);
                        
                        if (dueDate < today) {
                            groups.overdue.push(task);
                        } else if (dueDate.getTime() === today.getTime()) {
                            groups.today.push(task);
                        } else if (dueDate.getTime() === tomorrow.getTime()) {
                            groups.tomorrow.push(task);
                        } else if (dueDate < nextWeek) {
                            groups.week.push(task);
                        } else {
                            groups.later.push(task);
                        }
                    });
                    
                    
                    const groupOrder = ['overdue', 'today', 'tomorrow', 'week', 'later', 'noDate'];
                    const groupLabels = {
                        overdue: 'Overdue',
                        today: 'Today',
                        tomorrow: 'Tomorrow',
                        week: 'This Week',
                        later: 'Later',
                        noDate: 'No Due Date'
                    };
                    
                    groupOrder.forEach(groupKey => {
                        if (groups[groupKey].length > 0) {
                            const groupEl = document.createElement('div');
                            groupEl.className = 'task-group';
                            groupEl.innerHTML = `
                                <div class="group-header">
                                    <i class="fas fa-calendar"></i>
                                    <h3>${groupLabels[groupKey]}</h3>
                                </div>
                            `;
                            
                            const listEl = document.createElement('div');
                            groups[groupKey].forEach(task => {
                                const taskEl = createTaskElement(task);
                                listEl.appendChild(taskEl);
                            });
                            
                            groupEl.appendChild(listEl);
                            pendingTasksList.appendChild(groupEl);
                        }
                    });
                }
            }
            
            
            if (completedTasks.length === 0) {
                completedTasksList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-check-circle"></i>
                        <p>No completed tasks yet. Complete some tasks!</p>
                    </div>
                `;
            } else {
                completedTasks.forEach(task => {
                    const taskEl = createTaskElement(task);
                    completedTasksList.appendChild(taskEl);
                });
            }
        }
        
        
        function createTaskElement(task) {
            const taskEl = document.createElement('div');
            const isOverdue = !task.completed && task.dueDate && new Date(task.dueDate) < new Date();
            
            taskEl.className = `task-item ${task.completed ? 'completed' : ''} priority-${task.priority} ${isOverdue ? 'overdue' : ''}`;
            
            taskEl.innerHTML = `
                <div class="task-header">
                    <div class="task-title">${task.title}</div>
                    <div class="task-priority">
                        <i class="${getPriorityIcon(task.priority)}"></i>
                    </div>
                </div>
                
                ${task.description ? `<div class="task-text">${task.description}</div>` : ''}
                
                <div class="task-meta">
                    <span><i class="fas fa-plus"></i> Added: ${formatDateTime(task.addedAt)}</span>
                    ${task.dueDate ? `<span><i class="fas fa-calendar-day"></i> Due: ${formatDate(task.dueDate)} ${isOverdue ? '<span style="color:#e67700">(Overdue)</span>' : ''}</span>` : ''}
                    ${task.completed ? `<span><i class="fas fa-check"></i> Completed: ${formatDateTime(task.completedAt)}</span>` : ''}
                </div>
                <div class="task-actions">
                    <button class="task-btn edit-btn" onclick="editTask(${task.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="task-btn delete-btn" onclick="deleteTask(${task.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    ${task.completed ? 
                        `<button class="task-btn undo-btn" onclick="toggleTaskCompletion(${task.id})">
                            <i class="fas fa-undo"></i> Undo
                        </button>` : 
                        `<button class="task-btn complete-btn" onclick="toggleTaskCompletion(${task.id})">
                            <i class="fas fa-check"></i> Complete
                        </button>`
                    }
                </div>
            `;
            
            return taskEl;
        }
        
        
        window.onload = init;
        
        
        window.toggleTaskCompletion = toggleTaskCompletion;
        window.editTask = editTask;
        window.deleteTask = deleteTask;