# SelfOS - Personal Productivity & Discipline System

A minimalist, full-featured productivity tracking web application built with vanilla HTML, CSS, and JavaScript. Track daily tasks, manage goals, monitor learning progress, and visualize your productivity journey with real-time analytics and gamification.

**Live Demo:** [myselfos.netlify.app](https://myselfos.netlify.app)

## ✨ Features

### Core Functionality
- **Daily Task Tracking** - Add tasks with time estimates, priorities, and completion tracking
- **Task Quality Rating** - Rate task quality with emoji feedback (👎 👌 👍)
- **Daily Reflection** - Journal your learnings and areas for improvement with mood tracking
- **Goal Management** - Create goals with categories, deadlines, and visual progress bars
- **Course Progress** - Track learning courses lesson-by-lesson
- **Analytics Dashboard** - Pie charts, weekly progress, monthly statistics, and priority analysis

### Gamification
- **Points System** - Earn points for tasks, lessons, reflections (+10, +15, +5 respectively)
- **8 Achievement Badges** - Unlock badges for milestones (First Step, On Fire, Week Warrior, etc.)
- **Streak Counter** - Track consecutive productive days
- **Level System** - Advance through levels (100 points = 1 level)
- **Productivity Score** - Real-time 0-100 score based on completion and quality

### User Experience
- **Dark/Light Mode** - Toggle between themes with persistent preference
- **Fully Responsive** - Works perfectly on desktop, tablet, and mobile
- **Full Data Persistence** - All data saved locally in browser (localStorage)
- **Visible Reflections** - See your daily reflections immediately after saving
- **Planning History** - Browse your past 10 days of reflections and planning
- **Motivational Quotes** - 15+ rotating quotes for daily inspiration

## 🚀 Getting Started

### Try It Online
Visit [myselfos.netlify.app](https://myselfos.netlify.app) - No installation needed!

### Run Locally
1. Clone the repository
```bash
git clone https://github.com/seam-sikder-nahid/SelfOS.git
cd SelfOS
```

2. Open `index.html` in your browser
```bash
# On macOS
open index.html

# On Windows
start index.html

# Or drag index.html to your browser
```

That's it! Data saves automatically to your browser.

## 📁 Project Structure

```
SelfOS/
├── index.html          # HTML structure (6 main sections)
├── styles.css          # Styling with dark/light themes
├── app.js              # Core JavaScript logic
└── README.md           # This file
```

**Total Size:** ~90 KB (lightning-fast load time)

## 🎮 How to Use

### Daily Workflow
1. **Morning** - Go to Dashboard for motivation
2. **Throughout Day** - Add tasks to "Daily Tasks" and complete them
3. **Evening** - Write daily reflection and plan tomorrow's goals
4. **Weekly** - Review analytics and past reflections

### Main Sections
- **Dashboard** - Quick stats, streak, score, quotes, weekly progress
- **Daily Tasks** - Task management, reflection journaling, mood tracking
- **Goals** - Create and track long-term goals with progress bars
- **Courses** - Track learning courses by lessons
- **Analytics** - Charts, statistics, and productivity insights
- **Planning** - Plan tomorrow's goals and review weekly planning

## 💾 Data Storage

- **100% Local** - All data stored in browser's localStorage
- **No Servers** - Nothing sent to external servers (completely private)
- **Automatic Save** - Data saves instantly as you work
- **Survives Reload** - Data persists after page refresh
- **Manual Backup** - Export data anytime from browser DevTools

## 🌐 Deployment

Already deployed on **Netlify**:
- **Live URL:** [myselfos.netlify.app](https://myselfos.netlify.app)
- **Auto-deployed** from this GitHub repository

To deploy your own version:
1. Fork this repository
2. Go to [netlify.com](https://netlify.com)
3. Connect your GitHub account
4. Select this repo
5. Deploy! (automatic on every push)

## 🎨 Customization

### Change Theme Colors
Edit `styles.css` line 8-15:
```css
:root {
    --accent-primary: #2563eb;      /* Change primary color */
    --accent-secondary: #10b981;    /* Change secondary color */
    --priority-high: #dc2626;       /* Change high priority color */
}
```

### Add More Quotes
Edit `app.js` around line 830:
```javascript
const quotes = [
    { text: "Your quote here", author: "Author Name" },
    // Add more...
];
```

### Add More Badges
Edit `updateBadges()` method in `app.js` to add custom achievement badges.

## 📊 Gamification Details

### Points Breakdown
- Complete a task: **+10 points**
- Add goal hours: **+10 points/hour**
- Complete lesson: **+15 points**
- Save reflection: **+5 points**

### Badges (8 Total)
- 🎯 **First Step** - Complete your first task
- 🔥 **On Fire** - 3-day streak
- 🌟 **Week Warrior** - 7-day streak
- 💯 **Centennial** - 100 points earned
- 🏆 **Goal Getter** - Complete a full goal
- 📚 **Scholar** - Complete a full course
- 💪 **Perfectionist** - Complete all today's tasks
- 🌅 **Early Bird** - Log 5+ hours before noon

## 🔒 Privacy & Security

✅ **Complete Privacy** - All data stays on your device  
✅ **No Tracking** - No analytics or telemetry  
✅ **No Ads** - Completely ad-free  
✅ **Open Source** - Code is transparent and auditable  

## 🛠️ Technology

- **HTML5** - Semantic markup
- **CSS3** - Grid, Flexbox, CSS Variables, Dark Mode
- **Vanilla JavaScript** - No frameworks or dependencies
- **localStorage** - Browser-based persistence
- **Zero Backend** - Pure frontend application

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (all modern)

## 📝 Key Changes (v2.0)

- ✨ Added visible reflection display with 10-day history
- ✨ Added visible planning display with browsable history
- 🎨 Enhanced card-based UI for reflections and goals
- 🔧 Improved data organization by dates
- 📚 Complete documentation with guides

## 📖 Documentation

Comprehensive guides included:
- **UPDATE_GUIDE.md** - Feature explanation
- **BEFORE_AFTER.md** - Visual comparison
- **QUICK_REFERENCE.md** - Usage guide
- **CHANGELOG.md** - Technical details

## 🤝 Contributing

Contributions welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Issues & Feedback

Found a bug or have a suggestion? [Open an issue](https://github.com/seam-sikder-nahid/SelfOS/issues)

## 📄 License

This project is open source and available under the MIT License - feel free to use, modify, and distribute.

## 🙏 Credits

Built with ❤️ for personal growth, discipline, and productivity.

Inspired by the philosophy that **tracking creates awareness**, **consistency builds discipline**, and **gamification sustains motivation**.

## 🚀 Quick Stats

- **Zero Dependencies** - Pure vanilla JavaScript
- **No Backend** - Works completely offline
- **90 KB Total** - Lightning-fast load time
- **100% Private** - All data local to your browser
- **Fully Responsive** - Works on all devices
- **Dark Mode** - Beautiful in both themes

## 🎯 What Users Say

> "Finally a productivity app where I can actually see my progress!" ✨

> "Love that all my data stays private on my device." 🔒

> "The gamification system keeps me motivated!" 🏆

---

**Start your journey to better productivity and discipline today!**

Visit: [myselfos.netlify.app](https://myselfos.netlify.app)

GitHub: [github.com/seam-sikder-nahid/SelfOS](https://github.com/seam-sikder-nahid/SelfOS)
