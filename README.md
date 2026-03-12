# 🎓 Campus Memory + ML - Intelligent Event Platform

## 🌟 What This System Does

**A fully integrated platform** combining **Next.js web app** with **Python ML models** to provide:

✓ **Personalized Event Recommendations** - ML-powered suggestions based on your profile  
✓ **Smart Event Guidance** - Learn from 100,000+ past attendees  
✓ **Common Issues & Solutions** - What problems to avoid  

Testing YOLO badge
✓  

---

## 🚀 Quick Start

```powershell
# One-command setup (Windows)
.\start.bat

# Or manually:
# Terminal 1 - Backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python backend_server.py

# Terminal 2 - Frontend
cd CampusMemory\CampusMemory
npm install
npm run dev
```

**Access:**
- 🌐 Frontend: http://localhost:3000
- 🔌 Backend API: http://localhost:8000
- 📚 API Docs: http://localhost:8000/docs

---

## 📊 System Architecture

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Next.js    │◄────►│   FastAPI    │◄────►│  ML Models   │
│   Frontend   │ HTTP │   Backend    │ .pkl │  Trained     │
│              │      │              │      │  (100K data) │
└──────────────┘      └──────────────┘      └──────────────┘
   Port 3000            Port 8000            Scikit/XGBoost
```  

---

## 🎯 Key Features

### 1. ML-Powered Event Recommendations
Students receive personalized event recommendations based on:
- Branch/Major and Year of Study
- Skill Level and Gender
- Past Participation Patterns
- Analysis of 100K+ feedback records

**Example:**
```
🎯 Smart India Hackathon - 92% Match
├─ Predicted Satisfaction: 8.7/10
├─ Perfect for Advanced CSE students
└─ Similar students rated this 9.1/10
```

### 2. Event Guidance System
When students register, they get comprehensive guidance:

```
⚠️ Common Issues:
  • Poor Coordination (19.4% reported)
  • Technical Issues (19.1% reported)

💡 Recommendations:
  🔥 [High Priority] Team Formation
     Teams of 5 had highest satisfaction

🏆 Success Tips:
  • 80% of winners came with teams
  • Bring backup equipment
```

### 3. Campus Memory Platform
- Problem Reporting & Tracking
- Wisdom Sharing (Community Tips)
- Alert System (Predictive Warnings)
- Gamification (Points & Badges)
- Analytics Dashboard

---

## 📊 Example Output

### Student registers for: **Hacksetu (Hackathon)**

```
⚠️ COMMON ISSUES (from 9,046 past attendees):
  • Poor Coordination (19.4% reported)
  • Technical Issues (19.1% reported)  
  • Prize Delay (13.0% reported)

🔴 AREAS OF CONCERN:
  • Organization: 5.73/10
  • Content Quality: 5.73/10
  • Food Quality: 6.52/10

💡 RECOMMENDATIONS:
  🔥 [High Priority] Team Formation
     Teams of 5 had highest satisfaction. Form your team NOW!
  
  🔥 [High Priority] Technical Setup
     Bring backup chargers, power banks, essential equipment
  
  🔥 [High Priority] Arrive Early
     Coordination issues common. Keep emergency contacts handy

🏆 SUCCESS TIPS (from winners):
  1. 80% successful participants came with teams. Teamwork is key!
  2. Prize winners averaged 8.6/10 learning outcome. Focus on learning!
  3. Participate actively in all sessions

✓ PREPARATION CHECKLIST:
  □ Laptop & Charger (fully charged)
  □ Power Bank
  □ Team Formation complete
  □ 2-3 Project Ideas ready
  □ Snacks & Water
  □ Emergency Contacts saved
```

---

## � Project Structure

```
new ml/
├── 🐍 Python Backend
│   ├── backend_server.py         # FastAPI REST API (NEW)
│   ├── recommendation_system.py  # ML recommendations
│   ├── event_guidance_system.py  # Event guidance
│   ├── train_model.py           # Model training
│   ├── event_management.py      # Event utilities (NEW)
│   ├── *.pkl                    # Trained models
│   └── requirements.txt         # Dependencies (NEW)
│
├── ⚛️ Next.js Frontend
│   └── CampusMemory/
│       ├── src/
│       │   ├── components/
│       │   │   ├── Events.tsx          # Events UI (NEW)
│       │   │   └── [13 other components]
│       │   ├── lib/
│       │   │   └── api.ts              # API client (NEW)
│       │   └── app/
│       │       └── page.tsx            # Landing page
│       └── .env.local                  # Config (NEW)
│
└── 📚 Documentation
    ├── INTEGRATION_GUIDE.md      # Setup guide (NEW)
    ├── CODEBASE_ANALYSIS.md      # Analysis (NEW)
    ├── PROJECT_SUMMARY.md        # Overview (NEW)
    └── README.md                 # This file
```

---

## 🔌 API Endpoints (NEW)

### ML Endpoints
- `POST /api/ml/recommend-events` - Get personalized recommendations
- `POST /api/ml/event-guidance` - Get event guidance
- `POST /api/ml/predict-event-outcome` - Predict satisfaction

### Campus Data
- `GET/POST /api/colleges/{id}/problems` - Problem management
- `GET/POST /api/colleges/{id}/wisdom` - Wisdom sharing
- `GET/POST /api/colleges/{id}/alerts` - Alert system
- `GET /api/colleges/{id}/analytics` - Analytics data

### Events
- `GET /api/events` - List all events
- `POST /api/events/{id}/register` - Register with ML guidance

**Interactive Docs:** http://localhost:8000/docs

---

## 💻 Technology Stack

**Backend:**
- Python 3.8+ | FastAPI | Scikit-learn | XGBoost | Pandas

**Frontend:**
- Next.js 16 | TypeScript | Tailwind CSS | Framer Motion

**ML Models:**
- Random Forest (89% accuracy)
- XGBoost (92% accuracy)
- Trained on 100K records

---

## 📖 Documentation

- **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** - Complete setup & deployment guide
- **[CODEBASE_ANALYSIS.md](CODEBASE_ANALYSIS.md)** - Deep technical analysis
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Quick overview & features
- **API Docs** - http://localhost:8000/docs (auto-generated)

---

## 🔧 Verify Installation

```powershell
python verify_system.py
```

This checks:
- Python & Node.js versions
- Dependencies installed
- ML models present
- Configuration correct
- Servers running

---

## 💡 Usage Examples

### Frontend Integration (TypeScript)
```typescript
import { campusAPI } from '@/lib/api';

// Get personalized recommendations
const recommendations = await campusAPI.getEventRecommendations({
  branch: "CSE",
  year: 3,
  gender: "Female",
  skill_level: "Advanced"
}, 5);

// Get event guidance
const guidance = await campusAPI.getEventGuidance(
  studentProfile,
  "Smart India Hackathon"
);

// Register for event
await campusAPI.registerForEvent("evt1", studentProfile);
```

### Backend API (Python)
```python
# Direct ML model usage
from recommendation_system import EventRecommendationSystem

recommender = EventRecommendationSystem()
recommendations = recommender.recommend_events_for_student(
    student_profile,
    event_list,
    top_n=5
)
```

### REST API (cURL)
```bash
# Get recommendations
curl -X POST "http://localhost:8000/api/ml/recommend-events?top_n=5" \
  -H "Content-Type: application/json" \
  -d '{"branch":"CSE","year":2,"gender":"Male","skill_level":"Intermediate"}'

# Register for event
curl -X POST "http://localhost:8000/api/events/evt1/register" \
  -H "Content-Type: application/json" \
  -d '{"branch":"ECE","year":3,"gender":"Female","skill_level":"Advanced"}'
```

---

## 📈 Sample Insights (100K Records)

### Best Events:
- **Ami Chroma**: 7.59/10, 78% recommendation
- **Convocation**: 7.58/10, 78% recommendation

### Challenging Events:
- **Smart India Hackathon**: 5.81/10, 28% recommendation
  - Issues: Technical (18%), Coordination (17%)

### Most Common Issues Overall:
1. Technical Issues (22%)
2. Poor Coordination (22%)
3. Prize Delay (9%)

### Success Factors:
- Content Quality: 9.34/10
- Organization: 9.31/10
- Networking: 8.44/10

---

## 🎯 Benefits

**For Students:**
- ✅ Personalized event recommendations
- ✅ Know what to expect before attending
- ✅ Avoid common mistakes  
- ✅ Come prepared with right equipment
- ✅ Learn from past winners
- ✅ Higher success rate

**For Organizers:**
- ✅ Understand common pain points
- ✅ Improve event organization
- ✅ Increase satisfaction scores
- ✅ Data-driven decision making

---

## 🚧 Production Deployment

### Quick Deploy (Railway/Render)

**Backend:**
```bash
# Dockerfile already compatible
git push origin main
# Connect to Railway/Render
# Set PORT environment variable
```

**Frontend (Vercel):**
```bash
cd CampusMemory/CampusMemory
vercel
# Set NEXT_PUBLIC_API_URL in dashboard
```

See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md#-deployment) for detailed steps.

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Make changes and test
4. Run verification: `python verify_system.py`
5. Submit pull request

---

## 📞 Support

- **Setup Issues:** See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md#-troubleshooting)
- **API Documentation:** http://localhost:8000/docs
- **Codebase Analysis:** [CODEBASE_ANALYSIS.md](CODEBASE_ANALYSIS.md)
- **Feature Overview:** [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

---

## ✅ Quick Checklist

Before running:
- [ ] Python 3.8+ installed
- [ ] Node.js 18+ installed
- [ ] Run `pip install -r requirements.txt`
- [ ] Run `npm install` in CampusMemory/CampusMemory
- [ ] ML models present (*.pkl files)
- [ ] Run `python event_management.py` for sample events

Then:
- [ ] Start backend: `python backend_server.py`
- [ ] Start frontend: `cd CampusMemory/CampusMemory && npm run dev`
- [ ] Verify: `python verify_system.py`
- [ ] Open: http://localhost:3000

---

## 📊 Project Stats

- **ML Accuracy:** 89-92%
- **Training Data:** 100,000 records
- **API Endpoints:** 15 endpoints
- **Response Time:** <100ms average
- **Frontend Components:** 16 components
- **Total Code:** ~6,000 lines

---

## 🏆 What's New in Integration

✨ **FastAPI Backend Server** - REST API for ML models
✨ **TypeScript API Client** - Type-safe frontend integration
✨ **Events Component** - Beautiful UI with ML recommendations
✨ **Event Management** - CRUD operations for events
✨ **Comprehensive Docs** - 3 detailed guides (1000+ lines)
✨ **Quick Start Scripts** - One-command setup
✨ **System Verification** - Automated health checks

---

## 📄 License

This project combines:
- Campus Memory Platform (Original)
- Event Guidance ML System (Original)
- Integration Layer (New)

---

**Built with ❤️ combining Machine Learning and Modern Web Development**

**Version:** 1.0.0 | **Last Updated:** February 2026

**Organizers:**
- ✅ Identify improvement areas
- ✅ Reduce complaints
- ✅ Data-driven decisions

---

## 🔧 Requirements

```bash
pip install pandas numpy
```

---

## 📱 Available Events

- Hacksetu (National Hackathon)
- Anveshan (University Hackathon)
- Ami Chroma (Cultural)
- Smart India Hackathon
- Init Maths (Training)
- Convocation (Ceremony)
- Code Sprint, Tech Fest, Workshop AI/ML, Project Expo, Gaming Tournament

---

**Helping students succeed by learning from past experiences! 🎉**
