# 🚀 API Quick Reference Guide

Base URL: `http://localhost:8001`

---

## 📋 Event Management

### Create Event (Manual)
```bash
POST /events?coordinator_id={coordinator_id}
Content-Type: application/json

{
  "title": "Tech Fest 2026",
  "category": "Technical",
  "date": "2026-03-15",
  "time": "10:00 AM",
  "location": "Main Auditorium",
  "organizer": "Tech Society",
  "registrationDeadline": "2026-03-10",
  "school": "Amity School of Computer Science",
  "description": "Annual technical festival"
}
```

### Create Event from Poster (AI Analysis)
```bash
POST /events/from-poster
Content-Type: multipart/form-data

file: [poster image file]
coordinator_id: COORD001
```

### List Events
```bash
GET /events?school={school}&category={category}&start_date={date}&end_date={date}&limit=50
```

### Get Event Details
```bash
GET /events/{event_id}
```

### Update Event
```bash
PUT /events/{event_id}
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description"
}
```

### Delete Event
```bash
DELETE /events/{event_id}
```

---

## 👥 Sub-User Management

### Add Sub-User to Event
```bash
POST /events/{event_id}/subusers
Content-Type: application/json

{
  "name": "John Doe",
  "role": "Staff",
  "universityId": "A12345",
  "email": "john@amity.edu",
  "permissions": {
    "viewAttendees": true,
    "markAttendance": true,
    "updateSchedule": false,
    "manageRegistrations": false
  }
}
```

### List Event Sub-Users
```bash
GET /events/{event_id}/subusers
```

### Update Sub-User Permissions
```bash
PUT /subusers/{user_id}
Content-Type: application/json

{
  "viewAttendees": true,
  "markAttendance": true,
  "updateSchedule": true,
  "manageRegistrations": true
}
```

### Remove Sub-User from Event
```bash
DELETE /subusers/{user_id}?event_id={event_id}
```

---

## 🤖 AI Poster Analysis

### Analyze Poster
```bash
POST /analyze/poster
Content-Type: multipart/form-data

file: [poster image file]
```

**Response:**
```json
{
  "success": true,
  "extractedData": {
    "title": "Tech Fest 2026",
    "category": "Technical",
    "school": "Amity School of Computer Science",
    "date": "March 15, 2026",
    "time": "10:00 AM",
    "location": "Main Auditorium",
    "organizer": "Tech Society",
    "registrationDeadline": "March 10, 2026"
  },
  "confidence": {
    "category": 0.92,
    "school": 0.88,
    "overall": 0.90
  },
  "rawText": "...",
  "needsReview": false
}
```

---

## ✅ Attendance Tracking

### Mark Attendance (Manual)
```bash
POST /events/{event_id}/attendance
Content-Type: application/json

{
  "records": [
    {
      "studentId": "A12345",
      "studentName": "John Doe",
      "status": "present"
    },
    {
      "studentId": "A12346",
      "studentName": "Jane Smith",
      "status": "present"
    }
  ],
  "markedBy": "COORD001"
}
```

### Mark Attendance (Bulk CSV)
```bash
POST /events/{event_id}/attendance/bulk-csv
Content-Type: multipart/form-data

file: [CSV file with columns: studentId, studentName]
marked_by: COORD001
```

**CSV Format:**
```csv
studentId,studentName,status
A12345,John Doe,present
A12346,Jane Smith,present
A12347,Bob Johnson,present
```

### Get Event Attendance
```bash
GET /events/{event_id}/attendance
```

### Get Student Attendance History
```bash
GET /students/{student_id}/attendance
```

### Generate QR Code for Check-in
```bash
POST /events/{event_id}/qr
```

**Response:**
```json
{
  "eventId": "evt123",
  "checkinUrl": "https://campus-memory.app/checkin/evt123",
  "qrCodeBase64": "data:image/png;base64,..."
}
```

---

## 🎓 OD (Official Duty) Management

### Grant OD (Teacher Only)
```bash
PATCH /attendance/{attendance_id}/od
Content-Type: application/json

{
  "teacherId": "TEACHER001",
  "reason": "Event participation"
}
```

---

## 📊 Dashboards

### Coordinator Dashboard
```bash
GET /dashboard/coordinator/{coordinator_id}
```

**Response:**
```json
{
  "totalEvents": 25,
  "upcomingEvents": 8,
  "pastEvents": 17,
  "categoryDistribution": {
    "Technical": 10,
    "Cultural": 8,
    "Workshop": 7
  },
  "schoolDistribution": {
    "Amity School of Computer Science": 12,
    "Amity School of Business": 8,
    "Amity School of Engineering & Technology": 5
  },
  "recentEvents": [...]
}
```

### Teacher Dashboard
```bash
GET /dashboard/teacher/{teacher_id}
```

**Response:**
```json
{
  "school": "Amity School of Computer Science",
  "totalEvents": 15,
  "totalAttendance": 450,
  "odGrantedCount": 75,
  "events": [...]
}
```

### Student Dashboard
```bash
GET /dashboard/student/{student_id}
```

**Response:**
```json
{
  "studentId": "A12345",
  "totalEventsAttended": 12,
  "presentCount": 10,
  "odGrantedCount": 2,
  "attendedEvents": [...]
}
```

---

## 📈 Reporting

### Export Attendance Report
```bash
POST /reports/export?format=csv
Content-Type: application/json

{
  "startDate": "2026-01-01",
  "endDate": "2026-12-31",
  "school": "Amity School of Computer Science",
  "category": "Technical",
  "eventId": "evt123"
}
```

**Formats:** `csv` or `pdf`

---

## 📚 Reference Data

### Get List of Schools
```bash
GET /schools
```

**Response:**
```json
{
  "schools": [
    "Amity School of Engineering & Technology",
    "Amity School of Business",
    "Amity School of Communication",
    "Amity School of Computer Science",
    "Amity School of Architecture & Planning",
    "Amity School of Fine Arts",
    "Amity School of Law",
    "Amity School of Applied Sciences",
    "Amity School of Biotechnology",
    "Amity School of Hospitality",
    "Amity School of Liberal Arts",
    "Amity School of Design"
  ]
}
```

### Get List of Categories
```bash
GET /categories
```

**Response:**
```json
{
  "categories": [
    "Technical",
    "Workshop",
    "Cultural",
    "Sports",
    "Career",
    "Awareness",
    "Webinar"
  ]
}
```

---

## 🔍 System Health

### Health Check
```bash
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "firebase": true,
  "timestamp": "2026-02-20T10:30:00Z"
}
```

### API Information
```bash
GET /
```

**Response:**
```json
{
  "message": "Campus Event Management API",
  "version": "2.0.0",
  "phases": [
    "Event CRUD",
    "AI Poster Analysis",
    "Attendance & OD",
    "Reporting",
    "Deployment"
  ],
  "status": "operational"
}
```

---

## 📖 Interactive Documentation

### Swagger UI
```
http://localhost:8001/docs
```

### ReDoc
```
http://localhost:8001/redoc
```

### OpenAPI JSON
```
http://localhost:8001/openapi.json
```

---

## 🔐 Authentication Notes

**Current Implementation:**
- Uses query parameters for user IDs (e.g., `?coordinator_id=COORD001`)
- For production, implement proper JWT/OAuth authentication
- Firebase Authentication can be integrated

**User Roles:**
- `coordinator` - Full access to events and sub-users
- `subuser` - Limited access based on permissions
- `teacher` - Can view school events and grant OD
- `student` - Can view their own attendance

---

## ⚡ Quick Testing Commands

```bash
# 1. Check if API is running
curl http://localhost:8001/health

# 2. Get schools list
curl http://localhost:8001/schools

# 3. Get categories
curl http://localhost:8001/categories

# 4. Create a test event
curl -X POST "http://localhost:8001/events?coordinator_id=TEST001" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Event","category":"Technical","date":"2026-03-15","time":"10:00","location":"Test Hall","organizer":"Test Org","registrationDeadline":"2026-03-10","school":"Amity School of Computer Science","description":"Test"}'

# 5. List all events
curl http://localhost:8001/events

# 6. Get coordinator dashboard
curl http://localhost:8001/dashboard/coordinator/TEST001
```

---

## 🐛 Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid school. Must be one of 12 Amity schools"
}
```

### 404 Not Found
```json
{
  "detail": "Event not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Firebase not initialized. Please configure firebase-credentials.json"
}
```

---

## 📝 Notes

- All dates should be in ISO format: `YYYY-MM-DD`
- All timestamps are in ISO 8601 format
- Image uploads limited to 10MB
- Supported image formats: JPEG, PNG
- CSV files should have headers: `studentId,studentName,status`

---

**For complete documentation, see:**
- `EVENT_MANAGEMENT_README.md` - Full system guide
- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `IMPLEMENTATION_SUMMARY.md` - What was built

**Interactive API docs:** `http://localhost:8001/docs`
