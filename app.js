// ============================================
// PROGRESSOS - Personal Productivity OS
// Main Application Logic
// ============================================

class ProductivityOS {
    constructor() {
        this.data = this.loadData();
        this.currentDate = new Date().toISOString().split('T')[0];
        this.initializeData();
        this.init();
    }

    // ============================================
    // Data Management
    // ============================================

    loadData() {
        const stored = localStorage.getItem('progressOS');
        return stored ? JSON.parse(stored) : {};
    }

    saveData() {
        localStorage.setItem('progressOS', JSON.stringify(this.data));
    }

    initializeData() {
        if (!this.data.tasks) this.data.tasks = {};
        if (!this.data.goals) this.data.goals = [];
        if (!this.data.courses) this.data.courses = [];
        if (!this.data.notes) this.data.notes = {};
        if (!this.data.tomorrow) this.data.tomorrow = '';
        if (!this.data.points) this.data.points = 0;
        if (!this.data.badges) this.data.badges = {};
        if (!this.data.streak) this.data.streak = 0;
        if (!this.data.lastActiveDate) this.data.lastActiveDate = this.currentDate;
        this.saveData();
    }

    // ============================================
    // Initialization & Event Listeners
    // ============================================

    init() {
        this.setupTheme();
        this.setupNavigation();
        this.setupDateDisplays();
        this.setupTaskHandlers();
        this.setupGoalHandlers();
        this.setupCourseHandlers();
        this.setupNoteHandlers();
        this.setupQuoteSection();
        this.setupPlanningHandlers();
        this.setupMiscHandlers();
        this.updateAllUI();
        this.checkStreakStatus();
    }

    setupTheme() {
        const toggle = document.getElementById('themeToggle');
        const saved = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', saved);
        this.updateThemeIcon();

        toggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const newTheme = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon();
        });
    }

    updateThemeIcon() {
        const icon = document.querySelector('.theme-icon');
        const theme = document.documentElement.getAttribute('data-theme');
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    setupNavigation() {
        const navBtns = document.querySelectorAll('.nav-btn');
        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const section = btn.dataset.section;
                this.showSection(section);
            });
        });
    }

    showSection(section) {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(section).classList.add('active');
        if (section === 'analytics') this.updateAnalytics();
        if (section === 'planning') this.updatePlanning();
    }

    setupDateDisplays() {
        const dateDisplays = document.querySelectorAll('.date-display');
        const today = new Date();
        const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
        const dateString = today.toLocaleDateString('en-US', options);
        dateDisplays.forEach(d => d.textContent = dateString);
    }

    setupMiscHandlers() {
        document.querySelector('.reset-btn').addEventListener('click', () => {
            if (confirm('Are you sure? This will delete all data permanently.')) {
                localStorage.clear();
                location.reload();
            }
        });
    }

    // ============================================
    // Task Management
    // ============================================

    setupTaskHandlers() {
        const addBtn = document.getElementById('addTaskBtn');
        const nameInput = document.getElementById('taskName');
        const timeInput = document.getElementById('taskTime');
        const prioritySelect = document.getElementById('taskPriority');

        addBtn.addEventListener('click', () => this.addTask());
        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        this.renderTasks();
    }

    addTask() {
        const name = document.getElementById('taskName').value.trim();
        const time = parseFloat(document.getElementById('taskTime').value);
        const priority = document.getElementById('taskPriority').value;

        if (!name || !time || time <= 0) {
            alert('Please fill all fields correctly');
            return;
        }

        if (!this.data.tasks[this.currentDate]) {
            this.data.tasks[this.currentDate] = [];
        }

        const task = {
            id: Date.now(),
            name,
            time,
            priority,
            completed: false,
            rating: 0,
            addedAt: new Date().getTime()
        };

        this.data.tasks[this.currentDate].push(task);
        this.saveData();

        document.getElementById('taskName').value = '';
        document.getElementById('taskTime').value = '';
        document.getElementById('taskPriority').value = 'medium';

        this.renderTasks();
        this.updateAllUI();
    }

    renderTasks() {
        const list = document.getElementById('taskList');
        const tasks = this.data.tasks[this.currentDate] || [];

        if (tasks.length === 0) {
            list.innerHTML = '<p class="empty-state">No tasks yet. Add one to get started!</p>';
            return;
        }

        list.innerHTML = tasks.map(task => `
            <div class="task-item ${task.priority} ${task.completed ? 'completed' : ''}">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}
                    data-task-id="${task.id}" data-toggle="task-completion">
                <span class="task-name">${this.escapeHtml(task.name)}</span>
                <div class="task-time">${task.time}h</div>
                <div class="task-rate">
                    ${['👎', '👌', '👍'].map((emoji, idx) => `
                        <button class="rate-btn ${task.rating === idx - 1 ? 'active' : ''}"
                            data-task-id="${task.id}" data-rating="${idx - 1}" 
                            data-action="rate-task">${emoji}</button>
                    `).join('')}
                </div>
                <button class="task-delete" data-task-id="${task.id}" data-action="delete-task">🗑️</button>
            </div>
        `).join('');

        // Event listeners
        list.querySelectorAll('[data-toggle="task-completion"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.toggleTaskCompletion(parseInt(e.target.dataset.taskId)));
        });

        list.querySelectorAll('[data-action="rate-task"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = parseInt(e.target.dataset.taskId);
                const rating = parseInt(e.target.dataset.rating);
                this.rateTask(taskId, rating);
            });
        });

        list.querySelectorAll('[data-action="delete-task"]').forEach(btn => {
            btn.addEventListener('click', (e) => this.deleteTask(parseInt(e.target.dataset.taskId)));
        });
    }

    toggleTaskCompletion(taskId) {
        const tasks = this.data.tasks[this.currentDate];
        const task = tasks.find(t => t.id === taskId);
        task.completed = !task.completed;
        this.saveData();
        this.renderTasks();
        this.updateAllUI();
        this.awardPoints(task.completed ? 10 : -10);
    }

    rateTask(taskId, rating) {
        const tasks = this.data.tasks[this.currentDate];
        const task = tasks.find(t => t.id === taskId);
        task.rating = rating;
        this.saveData();
        this.renderTasks();
        this.updateAllUI();
    }

    deleteTask(taskId) {
        this.data.tasks[this.currentDate] = this.data.tasks[this.currentDate].filter(t => t.id !== taskId);
        this.saveData();
        this.renderTasks();
        this.updateAllUI();
    }

    // ============================================
    // Note Management
    // ============================================

    setupNoteHandlers() {
        const saveBtn = document.getElementById('saveNotesBtn');
        saveBtn.addEventListener('click', () => this.saveNotes());

        const moodBtns = document.querySelectorAll('.mood-btn');
        moodBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                moodBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        this.loadNotes();
    }

    saveNotes() {
        const learning = document.getElementById('learningNotes').value;
        const missed = document.getElementById('missedNotes').value;
        const mood = document.querySelector('.mood-btn.active');

        const notes = {
            learning,
            missed,
            mood: mood ? mood.dataset.mood : '😐',
            savedAt: new Date().getTime()
        };

        this.data.notes[this.currentDate] = notes;
        this.saveData();
        alert('Reflection saved!');
        this.awardPoints(5);
    }

    loadNotes() {
        const notes = this.data.notes[this.currentDate];
        if (notes) {
            document.getElementById('learningNotes').value = notes.learning || '';
            document.getElementById('missedNotes').value = notes.missed || '';
            const moodBtn = document.querySelector(`.mood-btn[data-mood="${notes.mood}"]`);
            if (moodBtn) moodBtn.classList.add('active');
        }
    }

    // ============================================
    // Goal Management
    // ============================================

    setupGoalHandlers() {
        document.getElementById('addGoalBtn').addEventListener('click', () => this.addGoal());
        this.renderGoals();
    }

    addGoal() {
        const name = document.getElementById('goalName').value.trim();
        const category = document.getElementById('goalCategory').value;
        const priority = document.getElementById('goalPriority').value;
        const hours = parseFloat(document.getElementById('goalHours').value);
        const deadline = document.getElementById('goalDeadline').value;

        if (!name || !hours || !deadline) {
            alert('Please fill all fields');
            return;
        }

        const goal = {
            id: Date.now(),
            name,
            category,
            priority,
            estimatedHours: hours,
            spentHours: 0,
            deadline,
            createdAt: new Date().getTime()
        };

        this.data.goals.push(goal);
        this.saveData();

        document.getElementById('goalName').value = '';
        document.getElementById('goalHours').value = '';
        document.getElementById('goalDeadline').value = '';

        this.renderGoals();
        this.updateAllUI();
    }

    renderGoals() {
        const list = document.getElementById('goalsList');
        if (this.data.goals.length === 0) {
            list.innerHTML = '<p class="empty-state">No goals yet. Start building your future!</p>';
            return;
        }

        list.innerHTML = this.data.goals.map(goal => {
            const progress = (goal.spentHours / goal.estimatedHours) * 100;
            const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
            const color = daysLeft < 0 ? '#ef4444' : daysLeft < 7 ? '#f59e0b' : '#10b981';

            return `
                <div class="goal-card">
                    <div class="goal-header">
                        <h4 class="goal-title">${this.escapeHtml(goal.name)}</h4>
                        <div class="goal-meta">
                            <span class="badge badge-category">${goal.category}</span>
                            <span class="badge badge-priority ${goal.priority}">${goal.priority}</span>
                        </div>
                    </div>
                    <div class="progress-section">
                        <div class="progress-info">
                            <span>${goal.spentHours.toFixed(1)}h / ${goal.estimatedHours}h</span>
                            <span>${Math.round(progress)}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                    </div>
                    <div class="deadline-info">
                        Deadline: ${new Date(goal.deadline).toLocaleDateString()} 
                        <span style="color: ${color}">(${daysLeft > 0 ? daysLeft + ' days left' : 'Overdue'})</span>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <input type="number" placeholder="Add hours" step="0.25" min="0" 
                            class="form-input small" data-goal-id="${goal.id}" data-action="goal-hours">
                        <button class="btn-secondary" data-goal-id="${goal.id}" data-action="add-goal-hours"
                            style="padding: 10px 16px;">+ Add</button>
                        <button class="btn-secondary" data-goal-id="${goal.id}" data-action="delete-goal"
                            style="padding: 10px 16px; background-color: rgba(239, 68, 68, 0.1); color: #ef4444;">Delete</button>
                    </div>
                </div>
            `;
        }).join('');

        list.querySelectorAll('[data-action="add-goal-hours"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const goalId = parseInt(e.target.dataset.goalId);
                const input = list.querySelector(`[data-goal-id="${goalId}"][data-action="goal-hours"]`);
                const hours = parseFloat(input.value);
                if (hours > 0) this.addGoalHours(goalId, hours);
                input.value = '';
            });
        });

        list.querySelectorAll('[data-action="delete-goal"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const goalId = parseInt(e.target.dataset.goalId);
                this.deleteGoal(goalId);
            });
        });
    }

    addGoalHours(goalId, hours) {
        const goal = this.data.goals.find(g => g.id === goalId);
        goal.spentHours += hours;
        this.saveData();
        this.renderGoals();
        this.updateAllUI();
        this.awardPoints(Math.round(hours * 10));
    }

    deleteGoal(goalId) {
        this.data.goals = this.data.goals.filter(g => g.id !== goalId);
        this.saveData();
        this.renderGoals();
    }

    // ============================================
    // Course Management
    // ============================================

    setupCourseHandlers() {
        document.getElementById('addCourseBtn').addEventListener('click', () => this.addCourse());
        this.renderCourses();
    }

    addCourse() {
        const name = document.getElementById('courseName').value.trim();
        const lessons = parseInt(document.getElementById('courseTotalLessons').value);

        if (!name || !lessons || lessons <= 0) {
            alert('Please fill all fields correctly');
            return;
        }

        const course = {
            id: Date.now(),
            name,
            totalLessons: lessons,
            completedLessons: 0,
            createdAt: new Date().getTime()
        };

        this.data.courses.push(course);
        this.saveData();

        document.getElementById('courseName').value = '';
        document.getElementById('courseTotalLessons').value = '';

        this.renderCourses();
        this.updateAllUI();
    }

    renderCourses() {
        const list = document.getElementById('coursesList');
        if (this.data.courses.length === 0) {
            list.innerHTML = '<p class="empty-state">No courses yet. Start learning!</p>';
            return;
        }

        list.innerHTML = this.data.courses.map(course => {
            const progress = (course.completedLessons / course.totalLessons) * 100;

            return `
                <div class="course-card">
                    <div class="goal-header">
                        <h4 class="goal-title">${this.escapeHtml(course.name)}</h4>
                    </div>
                    <div class="progress-section">
                        <div class="progress-info">
                            <span>${course.completedLessons} / ${course.totalLessons} lessons</span>
                            <span>${Math.round(progress)}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 8px; margin-top: 12px;">
                        <button class="btn-secondary" data-course-id="${course.id}" data-action="complete-lesson"
                            ${course.completedLessons >= course.totalLessons ? 'disabled' : ''}>
                            ✓ Complete Lesson
                        </button>
                        <button class="btn-secondary" data-course-id="${course.id}" data-action="delete-course"
                            style="background-color: rgba(239, 68, 68, 0.1); color: #ef4444;">Delete</button>
                    </div>
                </div>
            `;
        }).join('');

        list.querySelectorAll('[data-action="complete-lesson"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const courseId = parseInt(e.target.dataset.courseId);
                this.completeLessonInCourse(courseId);
            });
        });

        list.querySelectorAll('[data-action="delete-course"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const courseId = parseInt(e.target.dataset.courseId);
                this.deleteCourse(courseId);
            });
        });
    }

    completeLessonInCourse(courseId) {
        const course = this.data.courses.find(c => c.id === courseId);
        if (course.completedLessons < course.totalLessons) {
            course.completedLessons++;
            this.saveData();
            this.renderCourses();
            this.updateAllUI();
            this.awardPoints(15);
        }
    }

    deleteCourse(courseId) {
        this.data.courses = this.data.courses.filter(c => c.id !== courseId);
        this.saveData();
        this.renderCourses();
    }

    // ============================================
    // Planning Management
    // ============================================

    setupPlanningHandlers() {
        document.getElementById('saveTomorrowBtn').addEventListener('click', () => {
            this.data.tomorrow = document.getElementById('tomorrowInput').value;
            this.saveData();
            alert('Tomorrow\'s goals saved!');
            this.awardPoints(3);
        });

        this.updatePlanning();
    }

    updatePlanning() {
        const input = document.getElementById('tomorrowInput');
        input.value = this.data.tomorrow || '';

        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));

        const weekOverview = document.getElementById('weekOverview');
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const dayElements = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            const tasks = this.data.tasks[dateStr] || [];

            dayElements.push(`
                <div class="overview-day">
                    <div class="overview-day-name">${days[i]}</div>
                    <div class="overview-day-tasks">${tasks.length}</div>
                </div>
            `);
        }

        weekOverview.innerHTML = dayElements.join('');
    }

    // ============================================
    // Quote System
    // ============================================

    setupQuoteSection() {
        const quotes = [
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
            { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
            { text: "It is never too late to be what you might have been.", author: "George Eliot" },
            { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
            { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
            { text: "Excellence is not a destination; it is a continuous journey that never ends.", author: "Brian Tracy" },
            { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
            { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
            { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
            { text: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
            { text: "You learn more from failure than from success.", author: "Unknown" },
            { text: "It's not whether you get knocked down, it's whether you get up.", author: "Vince Lombardi" },
            { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" }
        ];

        const displayNewQuote = () => {
            const quote = quotes[Math.floor(Math.random() * quotes.length)];
            document.getElementById('quoteText').textContent = `"${quote.text}"`;
            document.getElementById('quoteAuthor').textContent = `— ${quote.author}`;
        };

        displayNewQuote();
        document.getElementById('quoteRefresh').addEventListener('click', displayNewQuote);
    }

    // ============================================
    // UI Updates
    // ============================================

    updateAllUI() {
        this.updateDashboard();
        this.updateStreakCounter();
        this.updateBadges();
        this.updateWeeklyProgress();
    }

    updateDashboard() {
        // Today's stats
        const todayTasks = this.data.tasks[this.currentDate] || [];
        const todayHours = todayTasks.reduce((sum, t) => sum + (t.completed ? t.time : 0), 0);
        document.getElementById('todayHours').textContent = todayHours.toFixed(1) + 'h';

        // Comparison with yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        const yesterdayTasks = this.data.tasks[yesterdayStr] || [];
        const yesterdayHours = yesterdayTasks.reduce((sum, t) => sum + (t.completed ? t.time : 0), 0);
        
        document.getElementById('yesterdayHours').textContent = yesterdayHours.toFixed(1) + 'h';
        document.getElementById('yesterdayTasks').textContent = yesterdayTasks.length + ' tasks';
        document.getElementById('todayComparison').textContent = todayHours.toFixed(1) + 'h';
        document.getElementById('todayTasksCount').textContent = todayTasks.length + ' tasks';

        // Productivity score
        const score = this.calculateProductivityScore();
        document.getElementById('scoreValue').textContent = score;

        // Level and points
        const level = Math.floor(this.data.points / 100) + 1;
        document.getElementById('levelValue').textContent = level;
        document.getElementById('totalPoints').textContent = this.data.points;
    }

    calculateProductivityScore() {
        const today = this.data.tasks[this.currentDate] || [];
        const completed = today.filter(t => t.completed).length;
        const total = today.length;
        if (total === 0) return 0;
        const completionRate = (completed / total) * 100;
        const avgRating = today.reduce((sum, t) => sum + (t.rating || 0), 0) / total;
        const score = (completionRate * 0.6) + ((avgRating + 1) * 20 * 0.4);
        return Math.min(100, Math.round(score));
    }

    updateStreakCounter() {
        let streak = 0;
        let checkDate = new Date();
        
        while (true) {
            const dateStr = checkDate.toISOString().split('T')[0];
            const tasks = this.data.tasks[dateStr] || [];
            const completed = tasks.filter(t => t.completed).length;
            
            if (completed === 0 || tasks.length === 0) break;
            
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        }

        this.data.streak = streak;
        document.getElementById('streakCount').textContent = streak;
    }

    updateWeeklyProgress() {
        const weekdays = document.querySelectorAll('.weekday');
        const today = new Date();
        let maxHours = 0;

        const weekData = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - today.getDay() + i + 1);
            const dateStr = date.toISOString().split('T')[0];
            const tasks = this.data.tasks[dateStr] || [];
            const hours = tasks.reduce((sum, t) => sum + (t.completed ? t.time : 0), 0);
            weekData.push(hours);
            maxHours = Math.max(maxHours, hours);
        }

        if (maxHours === 0) maxHours = 1;

        weekdays.forEach((el, idx) => {
            const fill = el.querySelector('.day-fill');
            const hoursEl = el.querySelector('.day-hours');
            const height = (weekData[idx] / maxHours) * 100;
            fill.style.height = height + '%';
            hoursEl.textContent = weekData[idx].toFixed(1) + 'h';
        });
    }

    updateBadges() {
        const badges = [
            { id: 'first_task', name: '🎯 First Step', description: 'Complete your first task', condition: () => {
                const tasks = Object.values(this.data.tasks).flat();
                return tasks.some(t => t.completed);
            }},
            { id: 'streak_3', name: '🔥 On Fire', description: '3-day streak', condition: () => this.data.streak >= 3 },
            { id: 'streak_7', name: '🌟 Week Warrior', description: '7-day streak', condition: () => this.data.streak >= 7 },
            { id: 'points_100', name: '💯 Centennial', description: '100 points earned', condition: () => this.data.points >= 100 },
            { id: 'goal_complete', name: '🏆 Goal Getter', description: 'Complete a goal', condition: () => {
                return this.data.goals.some(g => g.spentHours >= g.estimatedHours);
            }},
            { id: 'course_complete', name: '📚 Scholar', description: 'Complete a course', condition: () => {
                return this.data.courses.some(c => c.completedLessons >= c.totalLessons);
            }},
            { id: 'all_tasks', name: '💪 Perfectionist', description: 'Complete all today\'s tasks', condition: () => {
                const today = this.data.tasks[this.currentDate] || [];
                return today.length > 0 && today.every(t => t.completed);
            }},
            { id: 'early_bird', name: '🌅 Early Bird', description: 'Log 5+ hours before noon', condition: () => false },
        ];

        const badgesGrid = document.getElementById('badgesGrid');
        badgesGrid.innerHTML = badges.map(badge => {
            const unlocked = badge.condition();
            this.data.badges[badge.id] = unlocked;

            return `
                <div class="achievement-badge ${unlocked ? 'unlocked' : ''}" title="${badge.description}">
                    <div class="badge-icon">${badge.name.split(' ')[0]}</div>
                    <div class="badge-name">${badge.name.split(' ').slice(1).join(' ')}</div>
                </div>
            `;
        }).join('');

        this.saveData();
    }

    // ============================================
    // Analytics
    // ============================================

    updateAnalytics() {
        this.updatePriorityDistribution();
        this.updateMonthlyStats();
        this.updateTimeDistribution();
    }

    updatePriorityDistribution() {
        const allTasks = Object.values(this.data.tasks).flat();
        const counts = { high: 0, medium: 0, low: 0 };
        const hours = { high: 0, medium: 0, low: 0 };

        allTasks.forEach(task => {
            counts[task.priority]++;
            if (task.completed) hours[task.priority] += task.time;
        });

        const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

        ['high', 'medium', 'low'].forEach(priority => {
            const percent = (counts[priority] / total) * 100;
            const fill = document.querySelector(`.priority-bar-fill.${priority}`);
            if (fill) fill.style.width = percent + '%';
            const count = document.getElementById(priority + 'Count');
            if (count) count.textContent = counts[priority];
        });
    }

    updateMonthlyStats() {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        let totalHours = 0;
        let dayCount = 0;
        let maxHours = 0;
        let maxDay = '';
        const priorityCounts = {};

        for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            const tasks = this.data.tasks[dateStr] || [];
            const hours = tasks.reduce((sum, t) => sum + (t.completed ? t.time : 0), 0);

            if (hours > 0) dayCount++;
            totalHours += hours;

            if (hours > maxHours) {
                maxHours = hours;
                maxDay = dateStr;
            }

            tasks.forEach(t => {
                priorityCounts[t.priority] = (priorityCounts[t.priority] || 0) + 1;
            });
        }

        const avgPerDay = dayCount > 0 ? (totalHours / dayCount).toFixed(1) : 0;
        const mostCommon = Object.keys(priorityCounts).sort((a, b) => priorityCounts[b] - priorityCounts[a])[0] || 'N/A';

        document.getElementById('monthlyHours').textContent = totalHours.toFixed(1) + 'h';
        document.getElementById('avgPerDay').textContent = avgPerDay + 'h';
        document.getElementById('mostProductive').textContent = maxDay ? new Date(maxDay).toLocaleDateString() : '-';
        document.getElementById('commonPriority').textContent = mostCommon.charAt(0).toUpperCase() + mostCommon.slice(1);
    }

    updateTimeDistribution() {
        const allTasks = Object.values(this.data.tasks).flat().filter(t => t.completed);
        const priorityHours = { high: 0, medium: 0, low: 0 };

        allTasks.forEach(task => {
            priorityHours[task.priority] += task.time;
        });

        const total = Object.values(priorityHours).reduce((a, b) => a + b, 0) || 1;
        const percentages = {
            high: (priorityHours.high / total) * 100,
            medium: (priorityHours.medium / total) * 100,
            low: (priorityHours.low / total) * 100
        };

        const colors = {
            high: '#dc2626',
            medium: '#f59e0b',
            low: '#10b981'
        };

        const pie = document.getElementById('pieChart');
        const stops = [];
        let current = 0;

        ['high', 'medium', 'low'].forEach(priority => {
            const percent = percentages[priority];
            const deg = (percent / 100) * 360;
            stops.push(`${colors[priority]} ${current}deg ${current + deg}deg`);
            current += deg;
        });

        pie.style.background = `conic-gradient(${stops.join(',')})`;

        const legend = document.getElementById('chartLegend');
        legend.innerHTML = ['high', 'medium', 'low'].map(priority => `
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${colors[priority]}"></div>
                <span>${priority.charAt(0).toUpperCase() + priority.slice(1)}: ${percentages[priority].toFixed(0)}%</span>
            </div>
        `).join('');
    }

    // ============================================
    // Gamification
    // ============================================

    awardPoints(amount) {
        this.data.points += amount;
        this.saveData();
        this.updateAllUI();
    }

    // ============================================
    // Utility Functions
    // ============================================

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    checkStreakStatus() {
        const today = this.currentDate;
        const lastActive = this.data.lastActiveDate;

        if (lastActive !== today) {
            if (lastActive === this.getYesterday()) {
                // Streak continues if user was active yesterday
            } else {
                this.data.streak = 0;
            }
            this.data.lastActiveDate = today;
            this.saveData();
        }
    }

    getYesterday() {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        return date.toISOString().split('T')[0];
    }
}

// ============================================
// Initialize App on Load
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    new ProductivityOS();
});
