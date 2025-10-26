// FitLife Application JavaScript
// Complete functionality for all pages

// Global app instance
let app = null;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

function initializeApp() {
    try {
        app = new FitLifeApp();
        window.app = app;
        console.log('FitLife app initialized successfully');
    } catch (error) {
        console.error('Error initializing FitLife app:', error);
        // Retry once after a short delay
        setTimeout(() => {
            try {
                app = new FitLifeApp();
                window.app = app;
                console.log('FitLife app initialized successfully on retry');
            } catch (retryError) {
                console.error('Failed to initialize FitLife app on retry:', retryError);
            }
        }, 100);
    }
}

// Navigation function
function navigateToPage(page) {
    window.location.href = page;
}

class FitLifeApp {
    constructor() {
        this.data = {
            workouts: this.safeParseJSON('fitlife_workouts') || [
                { id: 1, name: 'Squats', sets: 3, reps: 12, category: 'legs', completed: false, icon: 'fitness_center' },
                { id: 2, name: 'Push-ups', sets: 3, reps: 15, category: 'arms', completed: false, icon: 'exercise' },
                { id: 3, name: 'Crunches', sets: 3, reps: 20, category: 'core', completed: false, icon: 'self_improvement' },
                { id: 4, name: 'Pull-ups', sets: 3, reps: 10, category: 'arms', completed: false, icon: 'sports_gymnastics' },
                { id: 5, name: 'Lunges', sets: 3, reps: 15, category: 'legs', completed: false, icon: 'accessibility_new' }
            ],
            meals: this.safeParseJSON('fitlife_meals') || [
                { id: 1, food: 'Grilled Chicken Salad', portion: '1 bowl', calories: 350, timestamp: new Date().toISOString() },
                { id: 2, food: 'Greek Yogurt', portion: '1 cup', calories: 150, timestamp: new Date().toISOString() },
                { id: 3, food: 'Banana', portion: '1 medium', calories: 105, timestamp: new Date().toISOString() }
            ],
            notes: this.safeParseJSON('fitlife_notes') || [
                { id: 1, title: 'Morning Run', content: 'A quick run to start the day', category: 'workout', timestamp: new Date().toISOString() },
                { id: 2, title: 'Evening Yoga', content: 'Relaxing yoga session', category: 'workout', timestamp: new Date().toISOString() },
                { id: 3, title: 'Healthy Recipes', content: 'Collection of healthy recipes', category: 'nutrition', timestamp: new Date().toISOString() }
            ],
            settings: this.safeParseJSON('fitlife_settings') || {
                calorieGoal: 2500,
                units: 'metric',
                motivationalQuotes: true,
                theme: 'dark',
                accentColor: '#13ecc8',
                workoutReminders: true,
                nutritionReminders: true,
                progressUpdates: false,
                profile: { name: 'Alex Johnson', email: 'alex.j@example.com', age: 28, weight: 70, height: 175 }
            }
        };
        
        this.currentFilter = 'all';
        this.motivationalQuotes = [
            "Consistency is key. Small, daily efforts lead to significant results over time. Keep pushing!",
            "Your body can do it. It's your mind you need to convince.",
            "The groundwork for all happiness is good health.",
            "Success is the sum of small efforts repeated day in and day out.",
            "Take care of your body. It's the only place you have to live."
        ];
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    // Safe JSON parsing with error handling
    safeParseJSON(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.warn(`Error parsing localStorage item ${key}:`, error);
            return null;
        }
    }

    init() {
        this.updateActiveNavigation();
        this.initializePage();
        this.setupEventListeners();
        this.applySettings();
        this.setupProfileAvatarNavigation();
        this.loadProfileImageOnAllPages();
        this.setupThemeToggle();

        // Listen for settings updates from the SettingsManager so changes apply immediately
        window.addEventListener('fitlife_settings_updated', (e) => {
            try {
                this.data.settings = e.detail || this.data.settings;
                this.applySettings();
                // Update dashboard/nutrition UI that depends on settings
                if (document.getElementById('motivationText')) this.updateMotivationalTip();
                if (document.getElementById('totalCalories')) this.updateDashboardStats();
            } catch (err) {
                console.warn('Error handling settings update event', err);
            }
        });

        // Cross-tab sync: listen for localStorage changes so theme/color updates in one tab
        // propagate to other open tabs/windows automatically
        window.addEventListener('storage', (ev) => {
            try {
                if (!ev.key) return;
                if (ev.key === 'fitlife_settings') {
                    const newSettings = ev.newValue ? JSON.parse(ev.newValue) : null;
                    if (newSettings) {
                        this.data.settings = newSettings;
                        this.applySettings();
                        // Refresh dependent UI
                        if (document.getElementById('motivationText')) this.updateMotivationalTip();
                        if (document.getElementById('totalCalories')) this.updateDashboardStats();
                        this.updateThemeIcon();
                    }
                }
            } catch (err) {
                console.warn('Error handling storage event for fitlife_settings', err);
            }
        });
    }

    updateActiveNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if ((currentPage === 'index.html' && href === 'index.html') ||
                (currentPage.includes('workout') && href.includes('workout')) ||
                (currentPage.includes('nutrition') && href.includes('nutrition')) ||
                (currentPage.includes('note') && href.includes('note')) ||
                (currentPage.includes('settings') && href.includes('settings'))) {
                link.classList.add('active');
            }
        });
    }

    initializePage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        switch (currentPage) {
            case 'index.html':
                this.initDashboard();
                break;
            case 'workout.html':
                this.initWorkout();
                break;
            case 'nutrition.html':
                this.initNutrition();
                break;
            case 'note.html':
                this.initNotes();
                break;
            case 'settings.html':
                this.initSettings();
                break;
        }
    }

    // Dashboard Functions
    initDashboard() {
        this.updateDashboardStats();
        this.updateMotivationalTip();
    }

    updateDashboardStats() {
        // compute total calories from meals (Nutrition Summary)
        const totalCalories = this.data.meals.reduce((sum, meal) => sum + meal.calories, 0);
        const totalCaloriesEl = document.getElementById('totalCalories');
        if (totalCaloriesEl) totalCaloriesEl.textContent = totalCalories;

        // compute calories burned today from workout todos stored in localStorage
        let burned = 0;
        try {
            const stored = localStorage.getItem('workout_todos');
            if (stored) {
                const todos = JSON.parse(stored);
                burned = todos.reduce((sum, t) => sum + (t.completed ? (t.calories || 0) : 0), 0);
            }
        } catch (e) {
            console.warn('Error reading workout_todos for dashboard calories:', e);
        }

        const dashboardCaloriesEl = document.getElementById('dashboardCaloriesBurned');
        if (dashboardCaloriesEl) dashboardCaloriesEl.textContent = burned;
    }

    updateMotivationalTip() {
        const motivationCard = document.querySelector('.motivation-card');
        const motivationTextEl = document.getElementById('motivationText');

        // If the setting is disabled, hide the entire motivation card
        if (!this.data.settings.motivationalQuotes) {
            if (motivationCard) motivationCard.style.display = 'none';
            // Also clear text for accessibility
            if (motivationTextEl) motivationTextEl.textContent = '';
            return;
        }

        // If setting is enabled, ensure the card is visible and update the text
        if (motivationCard) motivationCard.style.display = '';
        if (motivationTextEl) {
            const randomQuote = this.motivationalQuotes[Math.floor(Math.random() * this.motivationalQuotes.length)];
            motivationTextEl.textContent = randomQuote;
        }
    }

    // Workout Functions
    initWorkout() {
        this.renderWorkouts();
        this.setupWorkoutFilters();
    }

    renderWorkouts(filter = 'all') {
        const workoutList = document.getElementById('workoutList');
        if (!workoutList) return;

        const filteredWorkouts = filter === 'all' 
            ? this.data.workouts 
            : this.data.workouts.filter(w => w.category === filter);

        workoutList.innerHTML = filteredWorkouts.map(workout => `
            <div class="workout-item ${workout.completed ? 'completed' : ''}" data-id="${workout.id}">
                <div class="workout-icon">
                    <span class="material-symbols-outlined">${workout.icon}</span>
                </div>
                <div class="workout-content">
                    <p class="workout-name">${workout.name}</p>
                    <p class="workout-details">${workout.sets} sets of ${workout.reps} reps</p>
                </div>
                <div class="workout-actions">
                    <input type="checkbox" class="workout-checkbox" ${workout.completed ? 'checked' : ''} 
                           data-workout-id="${workout.id}">
                    <button class="workout-menu" data-workout-id="${workout.id}" data-action="delete">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners after rendering
        this.setupWorkoutEventListeners();
    }

    setupWorkoutFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                const filter = e.target.dataset.filter;
                this.currentFilter = filter;
                this.renderWorkouts(filter);
            });
        });
    }

    setupWorkoutEventListeners() {
        const workoutList = document.getElementById('workoutList');
        if (!workoutList) return;

        // Use event delegation for better performance and deployment compatibility
        workoutList.addEventListener('change', (e) => {
            if (e.target.classList.contains('workout-checkbox')) {
                const workoutId = parseInt(e.target.dataset.workoutId);
                this.toggleWorkoutComplete(workoutId);
            }
        });

        workoutList.addEventListener('click', (e) => {
            if (e.target.closest('.workout-menu')) {
                const button = e.target.closest('.workout-menu');
                const workoutId = parseInt(button.dataset.workoutId);
                if (button.dataset.action === 'delete') {
                    this.deleteWorkout(workoutId);
                }
            }
        });

        // Re-apply settings when the page becomes visible again. This helps
        // with client-side routing (single-page apps) and when returning to a
        // background tab so the UI always reflects the latest settings.
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                try {
                    const stored = localStorage.getItem('fitlife_settings');
                    if (stored) {
                        const newSettings = JSON.parse(stored);
                        this.data.settings = newSettings;
                        this.applySettings();
                        if (document.getElementById('motivationText')) this.updateMotivationalTip();
                        if (document.getElementById('totalCalories')) this.updateDashboardStats();
                        this.updateThemeIcon();
                    }
                } catch (err) {
                    console.warn('Error applying settings on visibilitychange', err);
                }
            }
        });
    }

    toggleWorkoutComplete(id) {
        const workout = this.data.workouts.find(w => w.id === id);
        if (workout) {
            workout.completed = !workout.completed;
            this.saveData('workouts');
            this.renderWorkouts(this.currentFilter);
            
            // Update progress stats if the function exists
            if (typeof updateProgressStatsFromApp === 'function') {
                updateProgressStatsFromApp();
            }
        }
    }

    addWorkout(workoutData) {
        const newWorkout = {
            id: Date.now(),
            ...workoutData,
            completed: false,
            icon: this.getWorkoutIcon(workoutData.category)
        };
        this.data.workouts.push(newWorkout);
        this.saveData('workouts');
        this.renderWorkouts(this.currentFilter);
        
        // Update progress stats if the function exists
        if (typeof updateProgressStatsFromApp === 'function') {
            updateProgressStatsFromApp();
        }
    }

    deleteWorkout(id) {
        this.data.workouts = this.data.workouts.filter(w => w.id !== id);
        this.saveData('workouts');
        this.renderWorkouts(this.currentFilter);
        
        // Update progress stats if the function exists
        if (typeof updateProgressStatsFromApp === 'function') {
            updateProgressStatsFromApp();
        }
    }

    getWorkoutIcon(category) {
        const icons = { legs: 'directions_run', arms: 'fitness_center', core: 'self_improvement' };
        return icons[category] || 'exercise';
    }

    // Nutrition Functions
    initNutrition() {
        this.renderMeals();
        this.updateCalorieSummary();
    }

    renderMeals() {
        const mealsList = document.getElementById('mealsList');
        if (!mealsList) return;

        mealsList.innerHTML = this.data.meals.map(meal => `
            <div class="meal-item" data-id="${meal.id}">
                <div class="meal-info">
                    <p class="meal-name">${meal.food}</p>
                    <p class="meal-portion">${meal.portion}</p>
                </div>
                <div class="meal-calories">${meal.calories} kcal</div>
                <div class="meal-actions">
                    <button class="meal-action-btn" data-meal-id="${meal.id}" data-action="edit">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button class="meal-action-btn danger" data-meal-id="${meal.id}" data-action="delete">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners for meal actions
        this.setupMealEventListeners();
    }

    setupMealEventListeners() {
        const mealsList = document.getElementById('mealsList');
        if (!mealsList) return;

        mealsList.addEventListener('click', (e) => {
            if (e.target.closest('.meal-action-btn')) {
                const button = e.target.closest('.meal-action-btn');
                const mealId = parseInt(button.dataset.mealId);
                const action = button.dataset.action;
                
                if (action === 'edit') {
                    this.editMeal(mealId);
                } else if (action === 'delete') {
                    this.deleteMeal(mealId);
                }
            }
        });
    }

    updateCalorieSummary() {
        const currentCalories = this.data.meals.reduce((sum, meal) => sum + meal.calories, 0);
        const goalCalories = this.data.settings.calorieGoal;
        const percentage = Math.min((currentCalories / goalCalories) * 100, 100);

        const currentCaloriesEl = document.getElementById('currentCalories');
        const goalCaloriesEl = document.getElementById('goalCalories');
        const progressFillEl = document.getElementById('progressFill');
        const progressPercentageEl = document.getElementById('progressPercentage');
        const summaryDescriptionEl = document.getElementById('summaryDescription');

        if (currentCaloriesEl) currentCaloriesEl.textContent = currentCalories;
        if (goalCaloriesEl) goalCaloriesEl.textContent = goalCalories;
        if (progressFillEl) progressFillEl.style.width = `${percentage}%`;
        if (progressPercentageEl) progressPercentageEl.textContent = `${Math.round(percentage)}%`;
        if (summaryDescriptionEl) {
            summaryDescriptionEl.textContent = `You've consumed ${Math.round(percentage)}% of your daily calorie goal.`;
        }
    }

    addMeal(mealData) {
        const newMeal = { id: Date.now(), ...mealData, timestamp: new Date().toISOString() };
        this.data.meals.push(newMeal);
        this.saveData('meals');
        this.renderMeals();
        this.updateCalorieSummary();
    }

    editMeal(id) {
        const meal = this.data.meals.find(m => m.id === id);
        if (meal) {
            document.getElementById('foodInput').value = meal.food;
            document.getElementById('portionInput').value = meal.portion;
            document.getElementById('caloriesInput').value = meal.calories;
            this.deleteMeal(id);
        }
    }

    deleteMeal(id) {
        this.data.meals = this.data.meals.filter(m => m.id !== id);
        this.saveData('meals');
        this.renderMeals();
        this.updateCalorieSummary();
    }

    // Notes Functions
    initNotes() {
        this.renderNotes();
    }

    renderNotes() {
        const notesGrid = document.getElementById('notesGrid');
        if (!notesGrid) return;

        notesGrid.innerHTML = this.data.notes.map(note => `
            <div class="note-card" data-id="${note.id}">
                <div class="note-content">
                    <h3 class="note-title">${note.title}</h3>
                    <p class="note-description">${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}</p>
                    <p class="note-category">${note.category}</p>
                </div>
                <div class="note-actions">
                    <button class="note-action-btn" data-note-id="${note.id}" data-action="edit">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button class="note-action-btn" data-note-id="${note.id}" data-action="delete">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners for note actions
        this.setupNoteEventListeners();
    }

    setupNoteEventListeners() {
        const notesGrid = document.getElementById('notesGrid');
        if (!notesGrid) return;

        notesGrid.addEventListener('click', (e) => {
            if (e.target.closest('.note-action-btn')) {
                const button = e.target.closest('.note-action-btn');
                const noteId = parseInt(button.dataset.noteId);
                const action = button.dataset.action;
                
                if (action === 'edit') {
                    this.editNote(noteId);
                } else if (action === 'delete') {
                    this.deleteNote(noteId);
                }
            }
        });
    }

    addNote(noteData) {
        const newNote = { id: Date.now(), ...noteData, timestamp: new Date().toISOString() };
        this.data.notes.push(newNote);
        this.saveData('notes');
        this.renderNotes();
    }

    editNote(id) {
        const note = this.data.notes.find(n => n.id === id);
        if (note) {
            document.getElementById('noteTitle').value = note.title;
            document.getElementById('noteContent').value = note.content;
            document.getElementById('noteCategory').value = note.category;
            document.getElementById('modalTitle').textContent = 'Edit Note';
            document.getElementById('saveNoteBtn').textContent = 'Update Note';
            document.getElementById('noteModal').classList.add('active');
            document.getElementById('noteForm').dataset.editId = id;
        }
    }

    deleteNote(id) {
        if (confirm('Are you sure you want to delete this note?')) {
            this.data.notes = this.data.notes.filter(n => n.id !== id);
            this.saveData('notes');
            this.renderNotes();
        }
    }

    // Settings Functions
    initSettings() {
        this.loadSettingsValues();
        this.setupSettingsListeners();
    }

    loadSettingsValues() {
        const settings = this.data.settings;
        
        // If settings page has a dedicated read-only goal display, populate it
        const settingsGoalDisplay = document.getElementById('settingsGoalDisplay');
        if (settingsGoalDisplay) {
            settingsGoalDisplay.textContent = settings.calorieGoal;
        }
        
        if (document.getElementById('motivationalQuotes')) {
            document.getElementById('motivationalQuotes').checked = settings.motivationalQuotes;
        }
        
        if (document.getElementById('workoutReminders')) {
            document.getElementById('workoutReminders').checked = settings.workoutReminders;
            document.getElementById('nutritionReminders').checked = settings.nutritionReminders;
            document.getElementById('progressUpdates').checked = settings.progressUpdates;
        }

        if (document.getElementById('userName')) {
            document.getElementById('userName').value = settings.profile.name;
            document.getElementById('userEmail').value = settings.profile.email;
            document.getElementById('userAge').value = settings.profile.age;
            document.getElementById('userWeight').value = settings.profile.weight;
            document.getElementById('userHeight').value = settings.profile.height;
        }

        document.querySelectorAll(`[data-unit="${settings.units}"]`).forEach(btn => btn.classList.add('active'));
        document.querySelectorAll(`[data-theme="${settings.theme}"]`).forEach(btn => btn.classList.add('active'));
        document.querySelectorAll(`[data-color="${settings.accentColor}"]`).forEach(btn => btn.classList.add('active'));
    }

    setupSettingsListeners() {
        // Calorie goal editing is now handled only on the Nutrition page (single source of truth).
        // If legacy inputs exist on this settings page, keep them read-only and do not update settings.
        const calorieGoal = document.getElementById('calorieGoal');
        const calorieRange = document.getElementById('calorieRange');
        if (calorieGoal) {
            calorieGoal.setAttribute('readonly', 'true');
            calorieGoal.addEventListener('input', (e) => {
                // ignore edits here; direct users to Nutrition page
                e.target.value = this.data.settings.calorieGoal;
            });
        }
        if (calorieRange) {
            calorieRange.setAttribute('disabled', 'true');
            calorieRange.addEventListener('input', (e) => {
                e.target.value = this.data.settings.calorieGoal;
            });
        }

        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.updateSetting(e.target.id, e.target.checked);
            });
        });

        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const parent = e.target.parentElement;
                parent.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                if (e.target.dataset.unit) {
                    this.updateSetting('units', e.target.dataset.unit);
                } else if (e.target.dataset.theme) {
                    this.updateSetting('theme', e.target.dataset.theme);
                    this.applyTheme(e.target.dataset.theme);
                }
            });
        });

        document.querySelectorAll('.color-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.color-option').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                const color = e.target.dataset.color;
                this.updateSetting('accentColor', color);
                this.applyAccentColor(color);
            });
        });

        document.querySelectorAll('#userName, #userEmail, #userAge, #userWeight, #userHeight').forEach(input => {
            input.addEventListener('change', (e) => {
                const field = e.target.id.replace('user', '').toLowerCase();
                let value = e.target.value;
                if (['age', 'weight', 'height'].includes(field)) {
                    value = parseFloat(value);
                }
                this.updateProfileSetting(field, value);
            });
        });

        const exportDataBtn = document.getElementById('exportDataBtn');
        const importDataBtn = document.getElementById('importDataBtn');
        const importFile = document.getElementById('importFile');
        const resetDataBtn = document.getElementById('resetDataBtn');

        if (exportDataBtn) exportDataBtn.addEventListener('click', () => this.exportData());
        if (importDataBtn && importFile) {
            importDataBtn.addEventListener('click', () => importFile.click());
            importFile.addEventListener('change', (e) => {
                if (e.target.files[0]) this.importData(e.target.files[0]);
            });
        }
        if (resetDataBtn) resetDataBtn.addEventListener('click', () => this.resetAllData());
    }

    updateSetting(key, value) {
        this.data.settings[key] = value;
        this.saveData('settings');
    }

    updateProfileSetting(key, value) {
        this.data.settings.profile[key] = value;
        this.saveData('settings');
    }

    applySettings() {
        // Ensure theme and accent color are applied consistently
        this.applyTheme(this.data.settings.theme);
        this.applyAccentColor(this.data.settings.accentColor);
    }

    applyTheme(theme) {
        try {
            document.body.setAttribute('data-theme', theme);
            document.documentElement.setAttribute('data-theme', theme);
        } catch (e) {
            console.warn('Could not apply theme attribute', e);
        }
    }

    applyAccentColor(color) {
        try {
            // Apply to both primary and accent variables for broad coverage
            document.documentElement.style.setProperty('--primary-color', color);
            document.documentElement.style.setProperty('--accent-color', color);
            // Compute and set primary RGB for rgba tints
            const rgb = FitLifeApp.hexToRgb(color);
            if (rgb) {
                document.documentElement.style.setProperty('--primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
            }
        } catch (e) {
            console.warn('Could not apply accent color', e);
        }
    }

    // Helper to convert hex to rgb
    static hexToRgb(hex) {
        if (!hex) return null;
        const cleaned = hex.replace('#', '').trim();
        if (cleaned.length === 3) {
            const r = parseInt(cleaned[0] + cleaned[0], 16);
            const g = parseInt(cleaned[1] + cleaned[1], 16);
            const b = parseInt(cleaned[2] + cleaned[2], 16);
            return { r, g, b };
        } else if (cleaned.length === 6) {
            const r = parseInt(cleaned.substring(0, 2), 16);
            const g = parseInt(cleaned.substring(2, 4), 16);
            const b = parseInt(cleaned.substring(4, 6), 16);
            return { r, g, b };
        }
        return null;
    }

    exportData() {
        const dataToExport = {
            workouts: this.data.workouts,
            meals: this.data.meals,
            notes: this.data.notes,
            settings: this.data.settings,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(dataToExport, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `fitlife-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        alert('Data exported successfully!');
    }

    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                if (importedData.workouts) this.data.workouts = importedData.workouts;
                if (importedData.meals) this.data.meals = importedData.meals;
                if (importedData.notes) this.data.notes = importedData.notes;
                if (importedData.settings) this.data.settings = importedData.settings;
                
                this.saveAllData();
                alert('Data imported successfully!');
                setTimeout(() => location.reload(), 1000);
            } catch (error) {
                alert('Error importing data. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }

    resetAllData() {
        if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
            localStorage.clear();
            alert('All data has been reset!');
            setTimeout(() => location.reload(), 1000);
        }
    }

    // Modal Functions
    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    hideModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Global navigation function
        window.navigateToPage = (page) => {
            window.location.href = page;
        };

        // Handle navigation cards with data-navigate attributes
        document.addEventListener('click', (e) => {
            const navCard = e.target.closest('[data-navigate]');
            if (navCard) {
                const page = navCard.dataset.navigate;
                window.location.href = page;
                return;
            }
        });

        // Modal close handlers
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                modal.classList.remove('active');
            });
        });

        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });

        this.setupPageSpecificListeners();
    }

    setupPageSpecificListeners() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        if (currentPage === 'workout.html') {
            const addExerciseBtn = document.getElementById('addExerciseBtn');
            const exerciseForm = document.getElementById('addExerciseForm');

            if (addExerciseBtn) {
                addExerciseBtn.addEventListener('click', () => this.showModal('addExerciseModal'));
            }

            if (exerciseForm) {
                exerciseForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const workoutData = {
                        name: document.getElementById('exerciseName').value,
                        sets: parseInt(document.getElementById('exerciseSets').value),
                        reps: parseInt(document.getElementById('exerciseReps').value),
                        category: document.getElementById('exerciseCategory').value
                    };
                    
                    this.addWorkout(workoutData);
                    this.hideModal('addExerciseModal');
                    e.target.reset();
                });
            }
        }

        if (currentPage === 'nutrition.html') {
            const mealForm = document.getElementById('mealForm');
            if (mealForm) {
                mealForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const mealData = {
                        food: document.getElementById('foodInput').value,
                        portion: document.getElementById('portionInput').value,
                        calories: parseInt(document.getElementById('caloriesInput').value)
                    };
                    
                    this.addMeal(mealData);
                    e.target.reset();
                });
            }
        }

        if (currentPage === 'note.html') {
            const newNoteBtn = document.getElementById('newNoteBtn');
            const noteForm = document.getElementById('noteForm');

            if (newNoteBtn) {
                newNoteBtn.addEventListener('click', () => {
                    document.getElementById('modalTitle').textContent = 'Add New Note';
                    document.getElementById('saveNoteBtn').textContent = 'Save Note';
                    document.getElementById('noteForm').removeAttribute('data-edit-id');
                    this.showModal('noteModal');
                });
            }

            if (noteForm) {
                noteForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const noteData = {
                        title: document.getElementById('noteTitle').value,
                        content: document.getElementById('noteContent').value,
                        category: document.getElementById('noteCategory').value
                    };
                    
                    const editId = e.target.dataset.editId;
                    if (editId) {
                        const note = this.data.notes.find(n => n.id === parseInt(editId));
                        if (note) {
                            Object.assign(note, noteData);
                            this.saveData('notes');
                            this.renderNotes();
                        }
                    } else {
                        this.addNote(noteData);
                    }
                    
                    this.hideModal('noteModal');
                    e.target.reset();
                });
            }
        }
    }

    // Data Management
    saveData(type) {
        try {
            localStorage.setItem(`fitlife_${type}`, JSON.stringify(this.data[type]));
        } catch (error) {
            console.error(`Error saving ${type} data:`, error);
            // Fallback: alert user that data couldn't be saved
            if (typeof alert !== 'undefined') {
                alert('Unable to save data. Your browser may have disabled localStorage or storage is full.');
            }
        }
    }

    saveAllData() {
        try {
            Object.keys(this.data).forEach(key => {
                localStorage.setItem(`fitlife_${key}`, JSON.stringify(this.data[key]));
            });
        } catch (error) {
            console.error('Error saving all data:', error);
            if (typeof alert !== 'undefined') {
                alert('Unable to save data. Your browser may have disabled localStorage or storage is full.');
            }
        }
    }

    // Setup profile avatar navigation (all pages)
    setupProfileAvatarNavigation() {
        const profileAvatars = document.querySelectorAll('.profile-avatar');
        profileAvatars.forEach(avatar => {
            avatar.addEventListener('click', () => {
                window.location.href = 'settings.html#profile';
            });
            avatar.style.cursor = 'pointer';
        });
    }

    // Load profile image on all pages
    loadProfileImageOnAllPages() {
        const savedImage = localStorage.getItem('fitlife_profile_image');
        if (savedImage) {
            const profileAvatars = document.querySelectorAll('.profile-avatar');
            profileAvatars.forEach(avatar => {
                avatar.style.backgroundImage = `url(${savedImage})`;
                avatar.style.backgroundSize = 'cover';
                avatar.style.backgroundPosition = 'center';
            });
        }
    }

    // Setup theme toggle functionality
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        // Update icon based on current theme
        this.updateThemeIcon();

        // Add click event listener
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    // Toggle between light and dark theme
    toggleTheme() {
        const currentTheme = this.data.settings.theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Add rotation animation
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.classList.add('rotating');
            setTimeout(() => {
                themeToggle.classList.remove('rotating');
            }, 500);
        }

        // Update theme
        this.data.settings.theme = newTheme;
        this.saveData('settings');

        // Notify other parts of the app immediately
        try {
            window.dispatchEvent(new CustomEvent('fitlife_settings_updated', { detail: this.data.settings }));
        } catch (e) {
            console.warn('Could not dispatch settings update event', e);
        }

        // Also write a timestamp to localStorage to trigger storage events in other tabs
        try {
            localStorage.setItem('fitlife_settings', JSON.stringify(this.data.settings));
            localStorage.setItem('fitlife_settings_last_update', Date.now().toString());
        } catch (e) {
            console.warn('Could not write settings to localStorage during theme toggle', e);
        }

        this.applyTheme(newTheme);
        this.updateThemeIcon();
    }

    // Update theme icon based on current theme
    updateThemeIcon() {
        const themeIcon = document.querySelector('.theme-icon');
        if (!themeIcon) return;

        const currentTheme = this.data.settings.theme || 'dark';
        themeIcon.textContent = currentTheme === 'dark' ? 'light_mode' : 'dark_mode';
    }
}