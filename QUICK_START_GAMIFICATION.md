# 🚀 Quick Start Guide - See Gamification & Opportunity Predictor in Action

## Why Can't I See the Features?

The features are **conditional** and require:

1. **Gamification (Points & Leaderboard)**:
   - ✅ You need to be **logged in**
   - ✅ You need to have **earned points** (by registering for events)
   - ✅ Other students need points too (for leaderboard rankings)

2. **Missed Opportunity Predictor**:
   - ✅ You need to be **logged in**
   - ✅ Your profile needs **interests defined** (e.g., AI, Web Dev, etc.)
   - ✅ Events need **registration deadlines** set (24-48 hours away)
   - ✅ Events need to **match your interests** (>= 70%)

---

## 🎯 Option 1: Quick Demo (Recommended)

### Step 1: Open Browser Console
- Press `F12` or `Ctrl+Shift+I` (Windows/Linux)
- Or `Cmd+Option+I` (Mac)
- Click the **Console** tab

### Step 2: Run Demo Initializer

Paste this into the console and press Enter:

```javascript
// Import the demo initializer
import('/src/lib/gamification/demoInitializer.ts').then(demo => {
  demo.quickTest();
});
```

**OR** use this simpler approach (copy all lines):

```javascript
// Initialize 5 demo students with points
const students = [
  { id: 'student-001', name: 'Alice Johnson', points: 320 },
  { id: 'student-002', name: 'Bob Smith', points: 180 },
  { id: 'student-003', name: 'Charlie Davis', points: 95 },
  { id: 'student-004', name: 'Diana Prince', points: 450 },
  { id: 'student-005', name: 'Eve Wilson', points: 60 },
];

students.forEach(s => {
  localStorage.setItem(`studentPoints_${s.id}`, JSON.stringify({
    studentId: s.id,
    studentName: s.name,
    totalPoints: s.points,
    eventHistory: [{ eventId: 'demo-1', eventName: 'Demo Event', eventType: 'hackathon', points: 20, date: new Date().toISOString() }]
  }));
});

// Add interests to current user
const user = JSON.parse(localStorage.getItem('campusMemoryCurrentUser') || '{}');
if (user.id) {
  user.interests = ['AI', 'Machine Learning', 'Web Development'];
  user.branch = 'Computer Science';
  localStorage.setItem('campusMemoryCurrentUser', JSON.stringify(user));
  
  // Award points to current user
  localStorage.setItem(`studentPoints_${user.id}`, JSON.stringify({
    studentId: user.id,
    studentName: user.name,
    totalPoints: 50,
    eventHistory: [{ eventId: 'demo-1', eventName: 'Demo Hackathon', eventType: 'hackathon', points: 20, date: new Date().toISOString() }]
  }));
}

console.log('✅ Demo data initialized! Refresh page to see changes.');
```

### Step 3: Refresh the Page
Press `Ctrl+R` or `F5` to reload

### Step 4: See the Features!

**On Events Page:**
- ✅ Header shows **Your Points** and **Current Badge**
- ✅ If events are closing soon + match interests, **Missed Opportunity Alerts** appear

**On College Dashboard → Leaderboard Tab:**
- ✅ See rankings of all students
- ✅ Your rank highlighted with cyan border
- ✅ Top 3 have special icons (👑 🥈 🥉)
- ✅ Badge tiers displayed

---

## 🎮 Option 2: Earn Points Naturally

### Step 1: Login
1. Go to Events page
2. Click login button
3. Create account or login

### Step 2: Register for Events
1. Browse events
2. Click on any event card
3. Click **"Register"** button
4. You'll earn points automatically!

**Point Values:**
- Workshop: **10 points**
- Hackathon: **20 points**
- Seminar: **5 points**
- Competition: **25 points**

### Step 3: Check Your Progress
- **Events Header**: See your total points and current badge
- **College Dashboard → Leaderboard**: See your ranking

### Step 4: Unlock Badges
Keep participating to unlock:
- 🥉 **Bronze Explorer** - 50 points
- 🥈 **Silver Achiever** - 150 points
- 🥇 **Gold Champion** - 300 points
- 💎 **Platinum Legend** - 500 points
- 👑 **Diamond Elite** - 1000 points

---

## 🎯 See Missed Opportunity Alerts

### Option A: Use Demo Events (Quick)

Run this in console to create a closing event:

```javascript
// Create an event closing in 36 hours
const closingEvent = {
  id: 'demo-closing-1',
  name: 'AI/ML Workshop',
  type: 'workshop',
  category: 'AI',
  department: 'Computer Science',
  date: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
  registration_deadline: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
  description: 'Learn AI and Machine Learning fundamentals'
};

// This would need to be added to your campus_data/events.json
console.log('Add this event to campus_data/events.json:', JSON.stringify(closingEvent, null, 2));
```

### Option B: Manual Setup

1. **Edit Event Data**: Add registration deadlines to events in `campus_data/events.json`
   ```json
   {
     "id": "event-1",
     "name": "Tech Workshop",
     "type": "workshop",
     "registration_deadline": "2026-02-26T18:00:00Z",  // 36 hours from now
     "date": "2026-02-28T10:00:00Z"
   }
   ```

2. **Add Student Interests**: Update your profile
   ```javascript
   const user = JSON.parse(localStorage.getItem('campusMemoryCurrentUser'));
   user.interests = ['AI', 'Machine Learning', 'Web Development', 'Hackathons'];
   localStorage.setItem('campusMemoryCurrentUser', JSON.stringify(user));
   ```

3. **Refresh Page**: Alerts will appear if match >= 70% and deadline is 24-48h away

---

## 📍 Where to Find Features

### 1. Events Page (`/events/auth`)

**Header Section:**
```
┌─────────────────────────────────────────┐
│  Trophy Icon | Your Points: 50          │
│  Award Icon  | Current Badge: Bronze    │
└─────────────────────────────────────────┘
```

**Missed Opportunity Alerts** (if applicable):
```
┌─────────────────────────────────────────┐
│ ⚡ Closing Soon - High Match Events     │
│                                         │
│  URGENT: AI Workshop                    │
│  Match: 85% | 24h remaining             │
│  [View Details] [Maybe Later]           │
└─────────────────────────────────────────┘
```

**Event Cards** with AI Badges:
```
┌──────────────────────┐
│ [AI Recommended 85%] │ ← Purple badge
│                      │
│  Event Image         │
│  Event Name          │
│  Event Details       │
└──────────────────────┘
```

### 2. College Dashboard (`/colleges/amity-university`)

**Navigation Tabs:**
```
[Problems] [Wisdom Tips] [AI Alerts] [Leaderboard] ← New tab!
```

**Leaderboard Content:**
```
┌─────────────────────────────────────────────────┐
│              Campus Leaderboard                 │
├────┬──────────────┬────────┬────────┬──────────┤
│ #  │ Student      │ Badge  │ Events │ Points   │
├────┼──────────────┼────────┼────────┼──────────┤
│ 👑 │ Diana Prince │ 💎 Plat│   12   │   450    │
│ 🥈 │ Alice J.     │ 🥇 Gold│   10   │   320    │
│ 🥉 │ Bob Smith    │ 🥈 Silv│    7   │   180    │
│ #4 │ Charlie D.   │ 🥉 Brnz│    4   │    95    │
└────┴──────────────┴────────┴────────┴──────────┘
```

---

## 🔍 Troubleshooting

### "I ran the console script but don't see anything"

**Solution**: Refresh the page (`Ctrl+R` or `F5`)

### "Points show 0 even after console script"

**Check**:
1. Open Developer Tools → Application → Local Storage
2. Look for keys starting with `studentPoints_`
3. Verify data is there
4. Make sure you're logged in

**Fix**:
```javascript
// Check if data exists
console.log('Student Points:', localStorage.getItem('studentPoints_student-001'));

// Force refresh
location.reload();
```

### "Leaderboard tab is empty"

**Solution**: Initialize demo data first (see Option 1 above), then:
1. Go to College Dashboard
2. Click **"Leaderboard"** tab (4th tab)
3. Click **"Refresh Leaderboard"** button at bottom

### "No missed opportunity alerts"

**Requirements**:
1. ✅ Logged in
2. ✅ Student has interests defined
3. ✅ Event deadline is 24-48 hours away
4. ✅ Event matches interests >= 70%

**Quick Test**:
```javascript
// 1. Add interests
const user = JSON.parse(localStorage.getItem('campusMemoryCurrentUser'));
user.interests = ['AI', 'Hackathon', 'Workshop'];
localStorage.setItem('campusMemoryCurrentUser', JSON.stringify(user));

// 2. Events need registration_deadline field in campus_data/events.json
// The system automatically detects closing events that match your interests
```

### "Features disappeared after refresh"

**Cause**: LocalStorage data cleared

**Solution**: Re-run the demo initialization script

---

## 🎨 Visual Examples

### Gamification Status (Events Header)
```
╔══════════════════════════════════════════╗
║  🏆 Your Points                          ║
║     50                                   ║
║                                          ║
║  🏅 Current Badge                        ║
║     🥉 Bronze Explorer                   ║
╚══════════════════════════════════════════╝
```

### Missed Opportunity Alert
```
╔══════════════════════════════════════════╗
║  ⚡ URGENT - 24h remaining               ║
║                                          ║
║  AI/ML Workshop                          ║
║  Type: Workshop                          ║
║                                          ║
║  AI Match Score                          ║
║  █████████░░░ 85%                        ║
║                                          ║
║  🎯 This event is highly recommended!   ║
║                                          ║
║  [View Event Details] [Maybe Later]     ║
╚══════════════════════════════════════════╝
```

### Leaderboard Ranking
```
Rank  Student         Badge          Points
───────────────────────────────────────────
👑    Diana Prince    💎 Platinum     450
🥈    Alice Johnson   🥇 Gold         320
🥉    Bob Smith       🥈 Silver       180
#4    Charlie Davis   🥉 Bronze        95
#5    YOU ←──────────────────────────  50
```

---

## 🎉 Success Checklist

After running demo initialization, you should see:

- [ ] **Events page header** shows points and badge
- [ ] **Leaderboard tab** in College Dashboard
- [ ] **Rankings** with other students
- [ ] **Your rank** highlighted in cyan
- [ ] **Top 3** have special crown/medal icons
- [ ] **Badge icons** displayed (🥉 🥈 🥇 💎 👑)

If you see all of these, **congratulations!** The gamification system is working! 🎊

---

## 💡 Next Steps

1. **Earn More Points**: Register for real events
2. **Climb the Leaderboard**: Out-participate your peers
3. **Unlock Badges**: Reach 50, 150, 300, 500, 1000 points
4. **Check Alerts**: Look for high-match events closing soon

---

## 📞 Still Having Issues?

1. **Check Console for Errors**: Press F12, look at Console tab
2. **Verify LocalStorage**: Application tab → Local Storage
3. **Clear Cache**: Sometimes helps with rendering issues
4. **Re-run Build**: `npm run build` to ensure latest code

---

**Built with ❤️ - Enjoy your gamified event experience!** 🚀
