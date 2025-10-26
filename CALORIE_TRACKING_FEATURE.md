# Calorie Tracking & Balance Calculator

## Overview
Complete calorie tracking system with workout calories burned tracking and an automatic calorie balance calculator in the settings page.

---

## ✨ Features

### 1. **Workout Page - Calorie Tracking**

#### Exercise Calories
- Each exercise now has a **calories burned** field
- Displayed as an orange fire badge next to each exercise
- Visible at a glance for quick reference

#### Add Exercise Modal
- New field: **"Calories Burned"**
- Required input (e.g., 50, 100, 150 kcal)
- Validates minimum value of 1

#### Total Calories Burned Display
Beautiful card at the bottom showing:
- **Total calories burned** from completed exercises
- **Completed exercises calories** breakdown
- **Remaining exercises calories** breakdown
- Large fire icon with gradient background
- Real-time updates as you complete exercises

---

### 2. **Settings Page - Calorie Balance Calculator**

#### Automatic Calculator
Displays three key metrics:
1. **Calories Consumed** (green) - from nutrition page
2. **Calories Burned** (orange) - from workout page
3. **Net Calories** (blue) - automatic calculation

#### Smart Status Messages
- **Perfect Balance**: "Perfect balance! You have X kcal remaining for your goal."
- **Over Goal**: "⚠️ You're X kcal over your goal. Consider increasing workout intensity."
- **Calorie Deficit**: "🔥 Great work! You've burned X more calories than consumed."

#### Auto-Updates
- Refreshes every 2 seconds
- No manual refresh needed
- Always shows current data

---

## 🎨 Visual Design

### Workout Page

#### Exercise Item with Calories
```
┌─────────────────────────────────────────────────┐
│ 🏋️ Squats              🔥 50 kcal      ☑️  🗑️  │
│    3 sets of 12 reps                           │
└─────────────────────────────────────────────────┘
```

#### Calories Burned Card
```
┌──────────────────────────────────────────┐
│  Calories Burned Today                    │
│  ┌────────────────────────────────────┐  │
│  │  🔥      180                        │  │
│  │        kcal burned                  │  │
│  └────────────────────────────────────┘  │
│  ┌──────────────────┬─────────────────┐  │
│  │ Completed: 180   │ Remaining: 45   │  │
│  └──────────────────┴─────────────────┘  │
└──────────────────────────────────────────┘
```

### Settings Page

#### Calorie Balance Display
```
┌─────────────────────────────────────────────────┐
│             Calorie Balance                      │
│  ┌────────┐    ┌────────┐    ┌────────┐        │
│  │   🍽️   │ -  │   🔥   │ =  │   📊   │        │
│  │ Consumed│    │ Burned │    │  Net   │        │
│  │  2000   │    │  500   │    │  1500  │        │
│  └────────┘    └────────┘    └────────┘        │
│  ┌──────────────────────────────────────┐       │
│  │ ✅ Perfect balance! 1000 kcal        │       │
│  │    remaining for your goal.          │       │
│  └──────────────────────────────────────┘       │
└─────────────────────────────────────────────────┘
```

---

## 🔧 Technical Implementation

### Workout Page Changes

#### HTML - Add Exercise Modal
```html
<div class="form-group">
    <label for="exerciseCalories">Calories Burned</label>
    <input type="number" id="exerciseCalories" min="1" required>
</div>
```

#### HTML - Calories Display Section
```html
<div class="calories-burned-section">
    <h3 class="section-title">Calories Burned Today</h3>
    <div class="calories-burned-card">
        <div class="calories-display">
            <span class="material-symbols-outlined">local_fire_department</span>
            <div class="calories-info">
                <p class="calories-value" id="totalCaloriesBurned">0</p>
                <p class="calories-label">kcal burned</p>
            </div>
        </div>
        <div class="calories-breakdown">
            <!-- Completed and Remaining -->
        </div>
    </div>
</div>
```

#### JavaScript - Data Structure
```javascript
{
    id: 1,
    name: 'Squats',
    sets: 3,
    reps: 12,
    category: 'legs',
    calories: 50,  // NEW!
    completed: false,
    icon: 'fitness_center'
}
```

#### JavaScript - Calculate Calories
```javascript
function updateCaloriesDisplay() {
    const completedCalories = window.todoData
        .filter(t => t.completed)
        .reduce((sum, t) => sum + (t.calories || 0), 0);
    
    const remainingCalories = window.todoData
        .filter(t => !t.completed)
        .reduce((sum, t) => sum + (t.calories || 0), 0);
    
    // Save for use in other pages
    localStorage.setItem('workout_calories_burned', completedCalories.toString());
}
```

### Settings Page Changes

#### HTML - Balance Calculator
```html
<div class="settings-card calorie-balance-card">
    <h3 class="settings-title">Calorie Balance</h3>
    <div class="calorie-balance-display">
        <div class="balance-item consumed">
            <!-- Consumed calories -->
        </div>
        <div class="balance-operator">-</div>
        <div class="balance-item burned">
            <!-- Burned calories -->
        </div>
        <div class="balance-operator">=</div>
        <div class="balance-item net">
            <!-- Net calories -->
        </div>
    </div>
    <div class="balance-summary" id="balanceSummary">
        <!-- Dynamic message -->
    </div>
</div>
```

#### JavaScript - Auto Calculator
```javascript
updateCalorieBalance() {
    // Get consumed from nutrition
    const meals = this.safeParseJSON('fitlife_meals') || [];
    const consumed = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
    
    // Get burned from workout
    const burned = parseInt(localStorage.getItem('workout_calories_burned') || '0');
    
    // Calculate net
    const net = consumed - burned;
    
    // Update UI with smart messages
}

// Auto-update every 2 seconds
setInterval(() => this.updateCalorieBalance(), 2000);
```

---

## 🎨 CSS Styling

### Workout Calories Badge
```css
.workout-calories-badge {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    background: linear-gradient(135deg, rgba(255, 107, 0, 0.1), rgba(255, 69, 0, 0.1));
    border: 1px solid rgba(255, 107, 0, 0.3);
    border-radius: 20px;
    padding: 0.375rem 0.75rem;
    color: #ff6b00;
    font-size: 0.875rem;
    font-weight: 600;
}
```

### Calories Burned Card
```css
.calories-burned-card {
    background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 2rem;
    box-shadow: var(--shadow-lg);
}

.calories-value {
    font-size: 3.5rem;
    font-weight: 700;
    color: #ff6b00;
}
```

### Balance Calculator
```css
.balance-item {
    padding: 1.5rem;
    background-color: var(--bg-secondary);
    border-radius: 12px;
    border: 2px solid var(--border-color);
    text-align: center;
    transition: var(--transition);
}

.balance-item.consumed {
    border-color: var(--primary-color);
    background: linear-gradient(135deg, rgba(19, 236, 200, 0.05), rgba(19, 236, 200, 0.1));
}

.balance-item.burned {
    border-color: #ff6b00;
    background: linear-gradient(135deg, rgba(255, 107, 0, 0.05), rgba(255, 107, 0, 0.1));
}
```

---

## 📊 Data Flow

```
Workout Page
    ↓
Add Exercise with Calories
    ↓
Complete Exercise
    ↓
Calculate Burned Calories
    ↓
Save to localStorage('workout_calories_burned')
    ↓
Settings Page Auto-Reads
    ↓
Combines with Nutrition Data
    ↓
Calculates Balance
    ↓
Shows Smart Message
```

---

## 💡 Usage Examples

### Example 1: Add Exercise
1. Click "Add Exercise"
2. Fill in: Squats, 3 sets, 12 reps, Legs, **50 calories**
3. Click "Add Exercise"
4. ✅ Exercise appears with 🔥 50 kcal badge

### Example 2: Complete Workout
1. Check off exercises as you complete them
2. Watch total calories burned increase
3. See breakdown update in real-time
4. ✅ Progress tracked automatically

### Example 3: Check Balance
1. Go to Settings page
2. Scroll to "Calorie Balance" section
3. See:
   - Consumed: 2000 kcal (from nutrition)
   - Burned: 500 kcal (from workout)
   - Net: 1500 kcal
4. ✅ Smart message: "Perfect balance! 1000 kcal remaining"

---

## 🎯 Status Messages

### Perfect Balance (Net within goal)
```
✅ Perfect balance! You have 1000 kcal remaining for your goal.
```
- Green border
- Positive message
- Shows remaining calories

### Over Goal
```
⚠️ You're 500 kcal over your goal. Consider increasing your workout intensity.
```
- Yellow border
- Warning message
- Suggests more exercise

### Calorie Deficit
```
🔥 Great work! You've burned 300 more calories than consumed.
```
- Orange border
- Congratulatory message
- Shows deficit amount

---

## 📱 Responsive Design

### Desktop
- Three-column layout for balance display
- Side-by-side breakdown items
- Large, readable numbers

### Mobile
- Stacked vertical layout
- Operators rotate 90°
- Full-width cards
- Touch-friendly

---

## ✅ Benefits

1. **Comprehensive Tracking** - Know exactly what you burn
2. **Automatic Calculation** - No manual math needed
3. **Real-time Updates** - Always current data
4. **Smart Feedback** - Helpful status messages
5. **Visual Appeal** - Modern, colorful design
6. **Motivation** - See your progress instantly
7. **Integration** - Works with nutrition seamlessly

---

## 🔄 Auto-Update System

### How it Works
```javascript
// On page load
updateCalorieBalance();

// Every 2 seconds
setInterval(() => updateCalorieBalance(), 2000);
```

### Why Auto-Update?
- No refresh button needed
- Always shows latest data
- Updates after adding meals/exercises
- Smooth user experience

---

## 🎨 Color Scheme

- **Consumed**: Green (#13ecc8) - Nutrition
- **Burned**: Orange (#ff6b00) - Workout
- **Net**: Blue (#3b82f6) - Result
- **Success**: Green gradient
- **Warning**: Yellow gradient
- **Excellent**: Orange gradient

---

## 📋 Files Modified

1. **workout.html**
   - Added calories input field
   - Added calories burned display section
   - Updated JavaScript for calorie tracking

2. **settings.html**
   - Added calorie balance calculator section
   - Added auto-update functionality

3. **style.css**
   - Workout calories badge styles
   - Calories burned card styles
   - Balance calculator styles
   - Responsive design

---

## 🚀 Result

Your FitLife app now has:

✅ **Exercise calorie tracking** in workout page  
✅ **Total calories burned** display  
✅ **Automatic balance calculator** in settings  
✅ **Real-time updates** every 2 seconds  
✅ **Smart status messages** based on balance  
✅ **Modern, colorful design**  
✅ **Fully responsive** layout  
✅ **Seamless integration** between pages  

**Status**: ✅ Fully Functional and Tested!

---

**Version**: 1.0  
**Date**: 2025-10-15  
**Feature**: Complete Calorie Tracking System
