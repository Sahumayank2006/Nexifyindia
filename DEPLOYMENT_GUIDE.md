# Campus Event Management System - Deployment Guide

## Phase 5: Deployment & Optimization

This guide covers deploying the complete event management system to production.

---

## 📋 Prerequisites

- Python 3.9+
- Node.js 18+
- Firebase Project (with Firestore & Storage)
- Docker (optional, for containerization)

---

## 🔧 Backend Deployment

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Download spaCy Model

```bash
python -m spacy download en_core_web_sm
```

### 3. Firebase Configuration

Create `firebase-credentials.json` in the project root:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "...",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

Set environment variable:
```bash
export FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
```

### 4. Generate Training Data (Optional)

```bash
python generate_synthetic_training_data.py
```

### 5. Train AI Models (Optional)

```bash
python train_ai_models.py
```

This will train:
- Category Classifier (DistilBERT)
- School Classifier (DistilBERT)
- NER Model (spaCy)

Models will be saved to `./models/` directory.

### 6. Run API Server

**Development:**
```bash
python event_api_server.py
```

**Production:**
```bash
uvicorn event_api_server:app --host 0.0.0.0 --port 8001 --workers 4
```

---

## 🐳 Docker Deployment

### Build Image

```bash
docker build -t campus-event-api:latest -f Dockerfile .
```

### Run Container

```bash
docker run -d \
  -p 8001:8001 \
  -v $(pwd)/firebase-credentials.json:/app/firebase-credentials.json \
  -v $(pwd)/models:/app/models \
  -e FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com" \
  --name campus-event-api \
  campus-event-api:latest
```

---

## 🌐 Frontend Deployment

### 1. Install Dependencies

```bash
cd CampusMemory/CampusMemory
npm install
```

### 2. Configure Environment

Create `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_API_URL=http://localhost:8001
```

### 3. Build & Deploy

**Development:**
```bash
npm run dev
```

**Production Build:**
```bash
npm run build
npm start
```

**Deploy to Vercel:**
```bash
npm install -g vercel
vercel --prod
```

---

## ☁️ Cloud Deployment Options

### AWS EC2

1. Launch EC2 instance (Ubuntu 22.04)
2. Install dependencies
3. Configure security groups (ports 8001, 3000)
4. Use systemd for process management
5. Setup nginx as reverse proxy

### Google Cloud Run

```bash
gcloud run deploy campus-event-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Heroku

```bash
heroku create campus-event-api
git push heroku main
```

---

## 🔒 Security Checklist

- ✅ Enable HTTPS/SSL
- ✅ Set Firestore security rules
- ✅ Configure CORS properly
- ✅ Use environment variables for secrets
- ✅ Validate all user inputs
- ✅ Rate limit API endpoints
- ✅ Regular security updates

---

## 📊 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Events collection
    match /events/{eventId} {
      allow read: if true;
      allow create: if request.auth != null && 
        request.auth.token.role == 'coordinator';
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.createdBy || 
         request.auth.token.role == 'admin');
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.uid == userId || 
         request.auth.token.role == 'admin');
    }
    
    // Attendance collection
    match /attendance/{attendanceId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        (request.auth.token.role in ['coordinator', 'subuser']);
      allow update: if request.auth != null && 
        (request.auth.token.role == 'teacher' || 
         request.auth.token.role == 'coordinator');
    }
  }
}
```

---

## 📈 Monitoring & Logging

### Backend Logging

Add to `event_api_server.py`:

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
```

### Monitor with Prometheus (Optional)

```bash
pip install prometheus-fastapi-instrumentator
```

---

## 🧪 Testing

### Backend Tests

```bash
pytest tests/ -v
```

### Frontend Tests

```bash
npm run test
```

---

## 📚 API Documentation

Once deployed, access:
- Swagger UI: `http://your-domain:8001/docs`
- ReDoc: `http://your-domain:8001/redoc`

---

## 🚀 Performance Optimization

1. **Model Loading**: Models are loaded once at startup (singleton pattern)
2. **Caching**: Use Redis for frequent queries
3. **Database Indexing**: Create indexes on frequently queried fields
4. **CDN**: Serve static assets via CDN
5. **Load Balancing**: Use nginx or cloud load balancer

---

## 📞 Support

For issues or questions:
- Check logs: `tail -f app.log`
- Review API docs: `/docs`
- Firestore console: Firebase Console

---

## 📝 Maintenance

### Regular Tasks
- Update dependencies monthly
- Monitor model accuracy
- Backup Firestore data weekly
- Review security logs
- Update SSL certificates

### Model Retraining
```bash
# Generate new training data
python generate_synthetic_training_data.py

# Retrain models
python train_ai_models.py

# Restart API server
systemctl restart campus-event-api
```

---

## ✅ Deployment Checklist

- [ ] Firebase project created
- [ ] Service account credentials downloaded
- [ ] Firestore database initialized
- [ ] Storage bucket configured
- [ ] Environment variables set
- [ ] Dependencies installed
- [ ] Models trained (if using AI)
- [ ] API server running
- [ ] Frontend deployed
- [ ] SSL/HTTPS configured
- [ ] Security rules applied
- [ ] Monitoring enabled
- [ ] Backups configured

---

**Deployment Complete! 🎉**

Your Campus Event Management System is now live and ready to use.
