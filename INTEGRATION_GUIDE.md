# 🚀 Campus Memory + ML Integration Guide

## 📋 Overview

This project combines a **Next.js Campus Memory Platform** with **Python ML Models** to create an intelligent event recommendation and guidance system. The ML models analyze 100,000+ historical event feedback records to provide personalized recommendations and actionable advice to students.

---

## 🏗️ Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│   Next.js App   │ ◄─────► │  FastAPI Server │ ◄─────► │   ML Models     │
│   (Frontend)    │   API   │   (Backend)     │  .pkl   │   (Trained)     │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
        │                           │                           │
        │                           │                           │
        ▼                           ▼                           ▼
   TypeScript/                  Python/                    Scikit-learn/
   React/Tailwind              FastAPI                     XGBoost/Pandas
```

### Components:

1. **Frontend (Next.js + TypeScript)**
   - Campus Memory Platform UI
   - Event browsing and registration
   - ML-powered recommendations display
   - Student dashboards

2. **Backend (Python + FastAPI)**
   - REST API endpoints
   - ML model serving
   - Data management
   - CORS handling for Next.js

3. **ML Models (Python)**
   - Event Recommendation System
   - Event Guidance System
   - Trained on 100K+ feedback records
   - Predicts satisfaction & recommendations

---

## 📦 Project Structure

```
new ml/
├── backend_server.py           # FastAPI server (main backend)
├── recommendation_system.py    # ML recommendation model
├── event_guidance_system.py    # ML guidance system
├── event_management.py         # Event data management utilities
├── train_model.py             # Model training script
├── requirements.txt           # Python dependencies
├── *.pkl                      # Trained ML models
├── event_feedback_dataset.csv # Training data
│
└── CampusMemory/
    └── CampusMemory/
        ├── src/
        │   ├── app/
        │   │   ├── page.tsx           # Main landing page
        │   │   └── colleges/[id]/page.tsx  # College dashboards
        │   ├── components/
        │   │   ├── Events.tsx         # ✨ NEW: Events component
        │   │   ├── EnhancedCollegeDashboard.tsx
        │   │   └── ...
        │   └── lib/
        │       ├── api.ts             # ✨ NEW: API client
        │       ├── data.ts
        │       └── utils.ts
        ├── .env.local                 # ✨ NEW: Environment config
        └── package.json
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** (for backend and ML)
- **Node.js 18+** (for Next.js frontend)
- **pip** and **npm/yarn**

### Step 1: Setup Python Backend

```powershell
# Navigate to ML directory
cd "C:\Users\dell\OneDrive\Desktop\new ml"

# Create virtual environment (recommended)
python -m venv .venv
.venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Generate sample events data
python event_management.py

# Start the FastAPI server
python backend_server.py
```

The backend will be available at:
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs (Interactive Swagger UI)

### Step 2: Setup Next.js Frontend

```powershell
# Navigate to Next.js app
cd CampusMemory\CampusMemory

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at:
- **App**: http://localhost:3000

### Step 3: Verify Integration

1. Open http://localhost:8000/health - Should show `{"status": "healthy"}`
2. Open http://localhost:3000 - Campus Memory landing page
3. Browse to Events section to see ML recommendations

---

## 🔌 API Endpoints

### ML Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ml/recommend-events` | Get personalized event recommendations |
| POST | `/api/ml/event-guidance` | Get comprehensive guidance for an event |
| POST | `/api/ml/predict-event-outcome` | Predict satisfaction for specific event |

### Campus Data Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/colleges/{id}/problems` | Get problems for a college |
| POST | `/api/colleges/{id}/problems` | Report a problem |
| GET | `/api/colleges/{id}/wisdom` | Get wisdom tips |
| POST | `/api/colleges/{id}/wisdom` | Share wisdom |
| GET | `/api/colleges/{id}/alerts` | Get alerts |
| POST | `/api/colleges/{id}/alerts` | Create alert |
| GET | `/api/colleges/{id}/analytics` | Get analytics |

### Events Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get all available events |
| POST | `/api/events/{id}/register` | Register for event (returns ML guidance) |

---

## 💡 Key Features

### 1. ML-Powered Event Recommendations

Students receive personalized event recommendations based on:
- Branch/Major
- Year of study
- Skill level
- Gender
- Past participation patterns

**Example Output:**
```json
{
  "event_name": "Hacksetu",
  "recommendation_probability": 0.87,
  "predicted_satisfaction": 8.2,
  "why_recommended": [
    "Students like you rated this 8.5/10",
    "High success rate in your branch"
  ]
}
```

### 2. Event Guidance System

When students register for events, they receive:

- **Common Issues**: What problems previous attendees faced
- **Recommendations**: Actionable advice based on data
- **Success Tips**: Learn from high performers
- **Preparation Checklist**: What to bring and prepare
- **Realistic Expectations**: Data-driven insights

**Example Guidance:**
```
⚠️ Common Issues:
  • Poor Coordination (19.4% reported)
  • Technical Issues (19.1% reported)

💡 Recommendations:
  🔥 [High Priority] Team Formation
     Teams of 5 had highest satisfaction

🏆 Success Tips:
  1. 80% successful participants came with teams
  2. Prize winners averaged 8.6/10 learning outcome
```

### 3. Integrated Dashboard

The Next.js app provides:
- Browse all campus events
- See ML recommendations prominently
- View detailed event guidance
- One-click registration
- Filter events by type/level

---

## 🔧 Configuration

### Backend Configuration

Edit `backend_server.py` to modify:
- CORS origins (for different frontend URLs)
- Data storage location
- Event list defaults

### Frontend Configuration

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

---

## 📊 ML Model Details

### Trained Models

1. **Recommendation Model** (`recommendation_model.pkl`)
   - Type: Random Forest / XGBoost Classifier
   - Predicts: Will student recommend event? (Yes/No)
   - Accuracy: ~87-92%

2. **Satisfaction Model** (`satisfaction_model.pkl`)
   - Type: Random Forest Regressor
   - Predicts: Overall satisfaction score (1-10)
   - R² Score: ~0.85

### Training Data

- **Dataset**: `event_feedback_dataset.csv`
- **Records**: 100,000 feedback entries
- **Features**: 27 features including:
  - Student profile (branch, year, skill level)
  - Event details (type, level, duration)
  - Past ratings (venue, food, content, etc.)
  - Engagement metrics

### Retraining Models

To retrain with new data:

```powershell
# Update event_feedback_dataset.csv with new records
python train_model.py

# This will regenerate all .pkl files
```

---

## 🎨 Frontend Integration Points

### Adding Events Component to Page

```tsx
import Events from "@/components/Events";

export default function EventsPage() {
  const [currentStudent, setCurrentStudent] = useState(null);
  
  return (
    <Events 
      currentStudent={currentStudent}
      onLogin={() => setShowLoginModal(true)}
    />
  );
}
```

### Using API Client

```tsx
import { campusAPI } from "@/lib/api";

// Get recommendations
const recommendations = await campusAPI.getEventRecommendations({
  branch: "CSE",
  year: 2,
  gender: "Male",
  skill_level: "Intermediate"
}, 5);

// Get guidance
const guidance = await campusAPI.getEventGuidance(
  studentProfile,
  "Hacksetu"
);

// Register for event
await campusAPI.registerForEvent("evt1", studentProfile);
```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Models not loading
```
Solution: Ensure all .pkl files are in the same directory as backend_server.py
Run: python train_model.py (to regenerate models)
```

**Problem**: CORS errors
```
Solution: Check CORS origins in backend_server.py
Ensure frontend URL is in allow_origins list
```

### Frontend Issues

**Problem**: API connection failed
```
Solution: 
1. Check if backend is running (http://localhost:8000/health)
2. Verify NEXT_PUBLIC_API_URL in .env.local
3. Restart Next.js dev server after changing .env
```

**Problem**: Events not showing
```
Solution:
1. Run: python event_management.py (to create events)
2. Check backend logs for errors
3. Open browser console for error messages
```

---

## 🚀 Deployment

### Backend Deployment (Python)

**Option 1: Docker**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "backend_server:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Option 2: Render/Railway**
- Push code to GitHub
- Connect to Render/Railway
- Set start command: `uvicorn backend_server:app --host 0.0.0.0 --port $PORT`

### Frontend Deployment (Next.js)

**Vercel (Recommended)**
```powershell
cd CampusMemory\CampusMemory
npm install -g vercel
vercel

# Set environment variable in Vercel dashboard:
# NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

**Alternative**: Netlify, Railway, or any Node.js host

---

## 📈 Future Enhancements

### Planned Features

1. **Real-time Feedback Collection**
   - Students can submit feedback after events
   - Automatically updates ML models
   - Live satisfaction tracking

2. **Advanced Analytics Dashboard**
   - Event success predictions
   - Trend analysis over time
   - Department-wise insights

3. **Notification System**
   - Event reminders
   - ML-based suggestions
   - Issue alerts

4. **Database Integration**
   - Replace JSON files with PostgreSQL/MongoDB
   - Better scalability
   - Advanced queries

5. **Authentication & Authorization**
   - JWT-based auth
   - Role-based access
   - OAuth integration

---

## 📝 Usage Examples

### Example 1: Student Gets Recommendations

```python
# Backend (Python)
POST /api/ml/recommend-events
{
  "branch": "CSE",
  "year": 3,
  "gender": "Female",
  "skill_level": "Advanced"
}

# Response
{
  "recommendations": [
    {
      "event_name": "Smart India Hackathon",
      "recommendation_probability": 0.92,
      "predicted_satisfaction": 8.7,
      "why_recommended": [
        "Perfect match for Advanced CSE students",
        "92% of similar students recommended this"
      ]
    }
  ]
}
```

### Example 2: Student Registers for Event

```python
# Backend (Python)
POST /api/events/evt1/register
{
  "branch": "ECE",
  "year": 2,
  "gender": "Male",
  "skill_level": "Intermediate"
}

# Response includes guidance
{
  "status": "success",
  "message": "Successfully registered for Hacksetu",
  "guidance": {
    "common_issues": [...],
    "recommendations": [...],
    "success_tips": [...]
  }
}
```

---

## 🤝 Contributing

### Adding New Features

1. **Backend**: Add endpoints to `backend_server.py`
2. **API Client**: Update `src/lib/api.ts` with new methods
3. **Frontend**: Create/update components in `src/components/`

### Improving ML Models

1. Collect more feedback data
2. Add new features to `train_model.py`
3. Experiment with different algorithms
4. Update `recommendation_system.py` with improvements

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation at http://localhost:8000/docs
3. Inspect browser console and backend logs
4. Ensure all dependencies are installed

---

## 📄 License

This project combines:
- **ML Models**: Custom trained models
- **Campus Memory Platform**: Original project
- **Integration**: Combined system

---

## ✅ Checklist for First Run

- [ ] Python 3.8+ installed
- [ ] Node.js 18+ installed
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] ML models exist (*.pkl files)
- [ ] Sample events created (`python event_management.py`)
- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] `.env.local` configured
- [ ] API health check passes

---

**🎉 You're ready to go! Start the backend and frontend servers to see the integrated system in action.**
