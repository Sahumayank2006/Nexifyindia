"""
Campus Event Management System - Main API Server
Complete event management with AI-powered poster analysis, attendance tracking, and OD management.
Phases 1-5 Implementation
"""

from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import firebase_admin
from firebase_admin import credentials, firestore, storage
import io
import csv
import qrcode
import base64
from enum import Enum
import os

# Initialize FastAPI app
app = FastAPI(
    title="Campus Event Management API",
    description="AI-Powered Event Management System with Sub-user Management, Attendance Tracking, and OD Processing",
    version="2.0.0"
)

# CORS middleware - Allow all origins in development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=False,  # Must be False when allow_origins is ["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase Admin SDK (use environment variables or config file)
try:
    if not firebase_admin._apps:
        # Initialize with service account (create firebase-credentials.json)
        cred = credentials.Certificate("firebase-credentials.json")
        firebase_admin.initialize_app(cred, {
            'storageBucket': 'campus-memory.firebasestorage.app'
        })
    db = firestore.client()
    bucket = storage.bucket()
    print("✅ Firebase Admin SDK initialized successfully!")
except Exception as e:
    print(f"⚠️ Warning: Firebase initialization: {e}")
    print("📝 Create firebase-credentials.json with your service account key")
    db = None
    bucket = None

# ========================
# ENUMS AND CONSTANTS
# ========================

class EventCategory(str, Enum):
    TECHNICAL = "Technical"
    WORKSHOP = "Workshop"
    CULTURAL = "Cultural"
    SPORTS = "Sports"
    CAREER = "Career"
    AWARENESS = "Awareness"
    WEBINAR = "Webinar"

class UserRole(str, Enum):
    COORDINATOR = "coordinator"
    SUBUSER = "subuser"
    TEACHER = "teacher"
    STUDENT = "student"

class SubUserRole(str, Enum):
    STAFF = "Staff"
    VOLUNTEER = "Volunteer"
    VENDOR = "Vendor"

class AttendanceStatus(str, Enum):
    PRESENT = "present"
    ABSENT = "absent"
    OD_GRANTED = "od_granted"

# Amity Schools (12 schools)
AMITY_SCHOOLS = [
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

# ========================
# PYDANTIC MODELS
# ========================

# --- Phase 1: Event & Sub-User Models ---

class EventCreate(BaseModel):
    title: str = Field(..., min_length=3)
    category: EventCategory
    date: str  # ISO format
    time: str
    location: str
    organizer: str
    registrationDeadline: str
    school: str
    description: Optional[str] = ""
    posterUrl: Optional[str] = None
    rawText: Optional[str] = None
    maxTeamSize: Optional[int] = 5
    minTeamSize: Optional[int] = 1

class EventUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[EventCategory] = None
    date: Optional[str] = None
    time: Optional[str] = None
    location: Optional[str] = None
    organizer: Optional[str] = None
    registrationDeadline: Optional[str] = None
    school: Optional[str] = None
    description: Optional[str] = None
    posterUrl: Optional[str] = None
    maxTeamSize: Optional[int] = None
    minTeamSize: Optional[int] = None

class EventResponse(BaseModel):
    eventId: str
    title: str
    category: str
    date: str
    time: str
    location: str
    organizer: str
    registrationDeadline: str
    school: str
    description: str
    posterUrl: Optional[str]
    rawText: Optional[str]
    createdBy: str
    maxTeamSize: Optional[int] = 5
    minTeamSize: Optional[int] = 1
    createdAt: str
    subUsers: List[str]

class SubUserPermissions(BaseModel):
    viewAttendees: bool = False
    markAttendance: bool = False
    updateSchedule: bool = False
    manageRegistrations: bool = False

class SubUserCreate(BaseModel):
    name: str
    role: SubUserRole
    universityId: str
    email: Optional[str] = None
    permissions: SubUserPermissions

class SubUserResponse(BaseModel):
    userId: str
    name: str
    role: str
    universityId: str
    email: Optional[str]
    permissions: Dict[str, bool]
    credentials: Optional[str] = None  # Generated credential
    assignedEvents: List[str]

# --- Phase 2: AI Poster Analysis Models ---

class PosterAnalysisResult(BaseModel):
    extractedData: Dict[str, Any]
    confidence: Dict[str, float]
    rawText: str
    needsReview: bool

# --- Phase 3: Attendance & OD Models ---

class AttendanceRecord(BaseModel):
    studentId: str
    studentName: str
    status: AttendanceStatus = AttendanceStatus.PRESENT

class AttendanceCreate(BaseModel):
    records: List[AttendanceRecord]
    markedBy: str

class AttendanceResponse(BaseModel):
    attendanceId: str
    eventId: str
    studentId: str
    studentName: str
    status: str
    markedBy: str
    timestamp: str
    odGranted: bool
    odGrantedBy: Optional[str]
    odGrantedAt: Optional[str]

class ODGrant(BaseModel):
    teacherId: str
    reason: Optional[str] = None

# --- OD Request Models ---

class ODStudent(BaseModel):
    id: str
    name: str
    className: str
    rollNumber: str

class ODRequestCreate(BaseModel):
    eventName: str
    eventDate: str
    students: List[ODStudent]
    subjects: List[str]
    reason: str
    duration: str

# --- Event Registration Models ---

class TeamMember(BaseModel):
    name: str
    studentId: str
    email: str
    phone: str

class EventRegistrationCreate(BaseModel):
    eventId: str
    eventTitle: str
    studentId: str
    studentName: str
    studentEmail: str
    studentPhone: str
    isTeamEvent: bool
    teamName: Optional[str] = None
    teamMembers: List[TeamMember] = []

# --- Phase 4: Reporting Models ---

class ReportFilter(BaseModel):
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    school: Optional[str] = None
    category: Optional[str] = None
    eventId: Optional[str] = None

# ========================
# UTILITY FUNCTIONS
# ========================

def generate_credentials(name: str, role: str) -> str:
    """Generate unique credentials for sub-users"""
    import secrets
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    random_part = secrets.token_hex(4)
    username = f"{role[:3].upper()}{timestamp}{random_part}"
    password = secrets.token_urlsafe(12)
    return f"{username}:{password}"

def validate_firebase():
    """Check if Firebase is initialized - returns False if using mock data"""
    return db is not None

# Mock data store for development without Firebase
MOCK_EVENTS = [
    {
        "eventId": "EVT001",
        "title": "Tech Talk: AI in Education",
        "category": "Technical",
        "date": "2026-03-15",
        "time": "14:00",
        "location": "Auditorium A",
        "organizer": "CS Department",
        "registrationDeadline": "2026-03-10",
        "school": "School of Engineering",
        "description": "Exploring the role of AI in modern education",
        "posterUrl": None,
        "rawText": None,
        "coordinatorId": "COORD001",
        "createdBy": "COORD001",
        "createdAt": "2026-02-15T10:00:00Z",
        "subUsers": []
    },
    {
        "eventId": "EVT002",
        "title": "Cultural Fest 2026",
        "category": "Cultural",
        "date": "2026-03-20",
        "time": "10:00",
        "location": "Main Ground",
        "organizer": "Cultural Committee",
        "registrationDeadline": "2026-03-15",
        "school": "Student Affairs",
        "description": "Annual cultural celebration",
        "posterUrl": None,
        "rawText": None,
        "coordinatorId": "COORD001",
        "createdBy": "COORD001",
        "createdAt": "2026-02-16T10:00:00Z",
        "subUsers": []
    },
    {
        "eventId": "EVT003",
        "title": "Career Fair",
        "category": "Career",
        "date": "2026-04-05",
        "time": "09:00",
        "location": "Convention Center",
        "organizer": "Placement Cell",
        "registrationDeadline": "2026-04-01",
        "school": "School of Management",
        "description": "Meet top recruiters",
        "posterUrl": None,
        "rawText": None,
        "coordinatorId": "COORD002",
        "createdBy": "COORD002",
        "createdAt": "2026-02-17T10:00:00Z",
        "subUsers": []
    }
]

MOCK_ATTENDANCE = []
MOCK_STUDENTS_DATA = {}

# ========================
# PHASE 1: EVENT CRUD ENDPOINTS
# ========================

@app.get("/")
async def root():
    return {
        "message": "Campus Event Management API",
        "version": "2.0.0",
        "phases": ["Event CRUD", "AI Poster Analysis", "Attendance & OD", "Reporting", "Deployment"],
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "firebase": db is not None,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/events", response_model=EventResponse)
async def create_event(event: EventCreate, coordinator_id: str = Query(...)):
    """Create a new event"""
    validate_firebase()
    
    # Validate school
    if event.school not in AMITY_SCHOOLS:
        raise HTTPException(status_code=400, detail=f"Invalid school. Must be one of {len(AMITY_SCHOOLS)} Amity schools")
    
    # Create event document
    event_data = {
        "title": event.title,
        "category": event.category.value,
        "date": event.date,
        "time": event.time,
        "location": event.location,
        "organizer": event.organizer,
        "registrationDeadline": event.registrationDeadline,
        "school": event.school,
        "description": event.description,
        "posterUrl": event.posterUrl,
        "rawText": event.rawText,
        "createdBy": coordinator_id,
        "createdAt": datetime.now().isoformat(),
        "subUsers": [],
        "maxTeamSize": event.maxTeamSize,
        "minTeamSize": event.minTeamSize
    }
    
    # Add to Firestore
    event_ref = db.collection('events').document()
    event_ref.set(event_data)
    
    return EventResponse(eventId=event_ref.id, **event_data)

@app.get("/events", response_model=List[EventResponse])
async def list_events(
    school: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    limit: int = Query(50, le=200)
):
    """List events with optional filters"""
    
    # Use mock data if Firebase is not available
    if not validate_firebase():
        events = MOCK_EVENTS.copy()
        
        # Apply filters
        if school:
            events = [e for e in events if e.get('school') == school]
        if category:
            events = [e for e in events if e.get('category') == category]
        if start_date:
            events = [e for e in events if e.get('date', '') >= start_date]
        if end_date:
            events = [e for e in events if e.get('date', '') <= end_date]
        
        return [EventResponse(**event) for event in events[:limit]]
    
    # Firebase path
    query = db.collection('events')
    
    # Apply filters
    if school:
        query = query.where('school', '==', school)
    if category:
        query = query.where('category', '==', category)
    
    # Execute query
    events_ref = query.limit(limit).stream()
    
    events = []
    for doc in events_ref:
        event_data = doc.to_dict()
        event_data['eventId'] = doc.id
        
        # Filter by date range if provided
        if start_date and event_data.get('date', '') < start_date:
            continue
        if end_date and event_data.get('date', '') > end_date:
            continue
            
        events.append(EventResponse(**event_data))
    
    return events

@app.get("/events/{event_id}", response_model=EventResponse)
async def get_event(event_id: str):
    """Get event details"""
    validate_firebase()
    
    event_ref = db.collection('events').document(event_id)
    event_doc = event_ref.get()
    
    if not event_doc.exists:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event_data = event_doc.to_dict()
    event_data['eventId'] = event_id
    
    return EventResponse(**event_data)

@app.put("/events/{event_id}", response_model=EventResponse)
async def update_event(event_id: str, event_update: EventUpdate):
    """Update event details"""
    validate_firebase()
    
    event_ref = db.collection('events').document(event_id)
    event_doc = event_ref.get()
    
    if not event_doc.exists:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Prepare update data
    update_data = {k: v for k, v in event_update.dict(exclude_unset=True).items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    # Update Firestore
    event_ref.update(update_data)
    
    # Get updated document
    updated_doc = event_ref.get()
    updated_data = updated_doc.to_dict()
    updated_data['eventId'] = event_id
    
    return EventResponse(**updated_data)

@app.delete("/events/{event_id}")
async def delete_event(event_id: str):
    """Delete an event"""
    validate_firebase()
    
    event_ref = db.collection('events').document(event_id)
    event_doc = event_ref.get()
    
    if not event_doc.exists:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Delete event
    event_ref.delete()
    
    # Also delete related attendance records
    attendance_query = db.collection('attendance').where('eventId', '==', event_id)
    for doc in attendance_query.stream():
        doc.reference.delete()
    
    return {"message": "Event deleted successfully", "eventId": event_id}

# ========================
# PHASE 1: SUB-USER MANAGEMENT
# ========================

@app.post("/events/{event_id}/subusers", response_model=SubUserResponse)
async def add_subuser_to_event(event_id: str, subuser: SubUserCreate):
    """Add a sub-user to an event"""
    validate_firebase()
    
    # Verify event exists
    event_ref = db.collection('events').document(event_id)
    event_doc = event_ref.get()
    
    if not event_doc.exists:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Generate credentials
    credentials = generate_credentials(subuser.name, subuser.role.value)
    
    # Create or update user document
    user_ref = db.collection('users').document(subuser.universityId)
    user_doc = user_ref.get()
    
    if user_doc.exists:
        # Update existing user
        user_data = user_doc.to_dict()
        assigned_events = user_data.get('assignedEvents', [])
        if event_id not in assigned_events:
            assigned_events.append(event_id)
        user_ref.update({'assignedEvents': assigned_events})
    else:
        # Create new user
        user_data = {
            "name": subuser.name,
            "role": UserRole.SUBUSER.value,
            "subrole": subuser.role.value,
            "universityId": subuser.universityId,
            "email": subuser.email,
            "permissions": subuser.permissions.dict(),
            "credentials": credentials,
            "assignedEvents": [event_id],
            "createdAt": datetime.now().isoformat()
        }
        user_ref.set(user_data)
    
    # Add subuser to event
    event_data = event_doc.to_dict()
    sub_users = event_data.get('subUsers', [])
    if subuser.universityId not in sub_users:
        sub_users.append(subuser.universityId)
        event_ref.update({'subUsers': sub_users})
    
    # Get updated user data
    updated_user = user_ref.get().to_dict()
    
    return SubUserResponse(
        userId=subuser.universityId,
        name=updated_user['name'],
        role=updated_user.get('subrole', 'subuser'),
        universityId=subuser.universityId,
        email=updated_user.get('email'),
        permissions=updated_user.get('permissions', {}),
        credentials=credentials,  # Only shown once
        assignedEvents=updated_user.get('assignedEvents', [])
    )

@app.get("/events/{event_id}/subusers", response_model=List[SubUserResponse])
async def list_event_subusers(event_id: str):
    """List all sub-users assigned to an event"""
    validate_firebase()
    
    # Get event
    event_ref = db.collection('events').document(event_id)
    event_doc = event_ref.get()
    
    if not event_doc.exists:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event_data = event_doc.to_dict()
    sub_user_ids = event_data.get('subUsers', [])
    
    # Get sub-user details
    sub_users = []
    for user_id in sub_user_ids:
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        
        if user_doc.exists:
            user_data = user_doc.to_dict()
            sub_users.append(SubUserResponse(
                userId=user_id,
                name=user_data.get('name', ''),
                role=user_data.get('subrole', 'subuser'),
                universityId=user_id,
                email=user_data.get('email'),
                permissions=user_data.get('permissions', {}),
                credentials=None,  # Don't expose credentials after creation
                assignedEvents=user_data.get('assignedEvents', [])
            ))
    
    return sub_users

@app.put("/subusers/{user_id}")
async def update_subuser(user_id: str, permissions: SubUserPermissions):
    """Update sub-user permissions"""
    validate_firebase()
    
    user_ref = db.collection('users').document(user_id)
    user_doc = user_ref.get()
    
    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="Sub-user not found")
    
    user_ref.update({'permissions': permissions.dict()})
    
    return {"message": "Sub-user updated successfully", "userId": user_id}

@app.delete("/subusers/{user_id}")
async def remove_subuser(user_id: str, event_id: str = Query(...)):
    """Remove sub-user from an event"""
    validate_firebase()
    
    # Remove from event's subUsers list
    event_ref = db.collection('events').document(event_id)
    event_doc = event_ref.get()
    
    if event_doc.exists:
        event_data = event_doc.to_dict()
        sub_users = event_data.get('subUsers', [])
        if user_id in sub_users:
            sub_users.remove(user_id)
            event_ref.update({'subUsers': sub_users})
    
    # Remove event from user's assignedEvents
    user_ref = db.collection('users').document(user_id)
    user_doc = user_ref.get()
    
    if user_doc.exists:
        user_data = user_doc.to_dict()
        assigned_events = user_data.get('assignedEvents', [])
        if event_id in assigned_events:
            assigned_events.remove(event_id)
            user_ref.update({'assignedEvents': assigned_events})
    
    return {"message": "Sub-user removed from event", "userId": user_id, "eventId": event_id}

# ========================
# REFERENCE DATA ENDPOINTS
# ========================

@app.get("/schools")
async def get_schools():
    """Get list of Amity schools"""
    return {"schools": AMITY_SCHOOLS}

@app.get("/categories")
async def get_categories():
    """Get list of event categories"""
    return {"categories": [cat.value for cat in EventCategory]}

# ========================
# PHASE 2: AI POSTER ANALYSIS
# ========================

# Import AI pipeline
ai_pipeline = None
ai_pipeline_error = None

try:
    from poster_analysis_ai import get_analysis_pipeline
    ai_pipeline = get_analysis_pipeline()
    print("✅ AI Poster Analysis Pipeline loaded!")
except Exception as e:
    print(f"⚠️ AI Pipeline loading with fallback methods: {e}")
    ai_pipeline_error = str(e)
    # Try to import anyway - it has fallback methods
    try:
        from poster_analysis_ai import PosterAnalysisPipeline
        ai_pipeline = PosterAnalysisPipeline()
        print("✅ AI Pipeline loaded with rule-based fallback methods")
    except Exception as e2:
        print(f"❌ Could not load AI Pipeline at all: {e2}")
        ai_pipeline = None

@app.post("/analyze/poster")
async def analyze_poster(file: UploadFile = File(...)):
    """
    Analyze poster image and extract event data using AI
    Returns structured JSON with extracted fields and confidence scores
    """
    if not ai_pipeline:
        raise HTTPException(
            status_code=503,
            detail={
                "error": "AI analysis service not available",
                "message": "Install required packages: pip install paddleocr transformers spacy python-dateutil",
                "details": ai_pipeline_error or "poster_analysis_ai module not found"
            }
        )
    
    # Validate file type
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image (JPEG/PNG)")
    
    # Check file size (max 10MB)
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image size must be less than 10MB")
    
    # Save temporarily
    import tempfile
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1] if file.filename else '.jpg') as tmp:
        tmp.write(content)
        tmp_path = tmp.name
    
    try:
        # Analyze poster
        result = ai_pipeline.analyze_poster(tmp_path)
        
        return {
            "success": result.get("success", False),
            "extractedData": result.get("extractedData", {}),
            "confidence": result.get("confidence", {}),
            "rawText": result.get("rawText", ""),
            "needsReview": result.get("needsReview", True),
            "message": "Analysis complete. Please review and edit the extracted data before saving.",
            "suggestions": result.get("suggestions", [])
        }
    
    except Exception as e:
        # Return error but allow frontend to handle it
        import traceback
        error_details = traceback.format_exc()
        print(f"❌ Error analyzing poster: {error_details}")
        
        return {
            "success": False,
            "error": str(e),
            "message": "Failed to analyze poster. Please fill manually.",
            "extractedData": {},
            "confidence": {},
            "rawText": ""
        }
    
    finally:
        # Clean up temp file
        try:
            os.unlink(tmp_path)
        except:
            pass

@app.post("/events/from-poster")
async def create_event_from_poster(
    file: UploadFile = File(...),
    coordinator_id: str = Form(...)
):
    """
    Upload poster, analyze it, and create event with extracted data
    """
    validate_firebase()
    
    # Analyze poster first
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image size must be less than 10MB")
    
    # Upload to Firebase Storage
    import tempfile
    import os
    from datetime import datetime
    
    # Save temporarily for analysis
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
        tmp.write(content)
        tmp_path = tmp.name
    
    try:
        # Analyze poster
        if ai_pipeline:
            analysis_result = ai_pipeline.analyze_poster(tmp_path)
            extracted = analysis_result.get("extractedData", {})
            raw_text = analysis_result.get("rawText", "")
        else:
            # Fallback: create empty event
            extracted = {}
            raw_text = ""
        
        # Upload to Firebase Storage
        if bucket:
            blob_name = f"posters/{datetime.now().strftime('%Y%m%d_%H%M%S')}_{file.filename}"
            blob = bucket.blob(blob_name)
            blob.upload_from_filename(tmp_path)
            blob.make_public()
            poster_url = blob.public_url
        else:
            poster_url = None
        
        # Create event with extracted data
        event_data = {
            "title": extracted.get("title", "Untitled Event"),
            "category": extracted.get("category", "Technical"),
            "date": extracted.get("date", ""),
            "time": extracted.get("time", ""),
            "location": extracted.get("location", ""),
            "organizer": extracted.get("organizer", ""),
            "registrationDeadline": extracted.get("registrationDeadline", ""),
            "school": extracted.get("school", AMITY_SCHOOLS[0]),
            "description": extracted.get("description", ""),
            "posterUrl": poster_url,
            "rawText": raw_text,
            "createdBy": coordinator_id,
            "createdAt": datetime.now().isoformat(),
            "subUsers": []
        }
        
        # Add to Firestore
        event_ref = db.collection('events').document()
        event_ref.set(event_data)
        
        return {
            "eventId": event_ref.id,
            "extractedData": event_data,
            "needsReview": analysis_result.get("needsReview", True) if ai_pipeline else True,
            "message": "Event created from poster. Please review and edit if needed."
        }
    
    finally:
        try:
            os.unlink(tmp_path)
        except:
            pass

# ========================
# PHASE 3: ATTENDANCE TRACKING
# ========================

@app.post("/events/{event_id}/attendance")
async def mark_attendance(
    event_id: str,
    attendance_data: AttendanceCreate
):
    """Mark attendance for students (manual, bulk, or QR scan)"""
    validate_firebase()
    
    # Verify event exists
    event_ref = db.collection('events').document(event_id)
    event_doc = event_ref.get()
    
    if not event_doc.exists:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Create attendance records
    created_records = []
    
    for record in attendance_data.records:
        attendance_doc = {
            "eventId": event_id,
            "studentId": record.studentId,
            "studentName": record.studentName,
            "status": record.status.value,
            "markedBy": attendance_data.markedBy,
            "timestamp": datetime.now().isoformat(),
            "odGranted": False,
            "odGrantedBy": None,
            "odGrantedAt": None
        }
        
        # Add to Firestore
        att_ref = db.collection('attendance').document()
        att_ref.set(attendance_doc)
        
        attendance_doc['attendanceId'] = att_ref.id
        created_records.append(AttendanceResponse(**attendance_doc))
    
    return {
        "message": f"Marked attendance for {len(created_records)} students",
        "records": created_records
    }

@app.post("/events/{event_id}/attendance/bulk-csv")
async def bulk_upload_attendance(
    event_id: str,
    file: UploadFile = File(...),
    marked_by: str = Form(...)
):
    """Bulk upload attendance from CSV file"""
    validate_firebase()
    
    # Verify event
    event_ref = db.collection('events').document(event_id)
    if not event_ref.get().exists:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Read CSV
    content = await file.read()
    csv_text = content.decode('utf-8')
    
    import csv
    from io import StringIO
    
    reader = csv.DictReader(StringIO(csv_text))
    
    records = []
    for row in reader:
        if 'studentId' in row and 'studentName' in row:
            attendance_doc = {
                "eventId": event_id,
                "studentId": row['studentId'],
                "studentName": row['studentName'],
                "status": row.get('status', 'present'),
                "markedBy": marked_by,
                "timestamp": datetime.now().isoformat(),
                "odGranted": False,
                "odGrantedBy": None,
                "odGrantedAt": None
            }
            
            att_ref = db.collection('attendance').document()
            att_ref.set(attendance_doc)
            records.append(att_ref.id)
    
    return {
        "message": f"Bulk upload successful. {len(records)} records created.",
        "count": len(records)
    }

@app.get("/events/{event_id}/attendance")
async def get_event_attendance(event_id: str):
    """Get all attendance records for an event"""
    
    # Use mock data if Firebase is not available
    if not validate_firebase():
        records = [rec for rec in MOCK_ATTENDANCE if rec.get('eventId') == event_id]
        return {
            "eventId": event_id,
            "totalRecords": len(records),
            "records": records
        }
    
    # Query attendance
    attendance_query = db.collection('attendance').where('eventId', '==', event_id)
    attendance_docs = attendance_query.stream()
    
    records = []
    for doc in attendance_docs:
        data = doc.to_dict()
        data['attendanceId'] = doc.id
        records.append(AttendanceResponse(**data))
    
    return {
        "eventId": event_id,
        "totalRecords": len(records),
        "records": records
    }

@app.get("/students/{student_id}/attendance")
async def get_student_attendance(student_id: str):
    """Get attendance history for a specific student"""
    validate_firebase()
    
    # Query attendance
    attendance_query = db.collection('attendance').where('studentId', '==', student_id)
    attendance_docs = attendance_query.stream()
    
    records = []
    for doc in attendance_docs:
        data = doc.to_dict()
        data['attendanceId'] = doc.id
        records.append(AttendanceResponse(**data))
    
    return {
        "studentId": student_id,
        "totalEvents": len(records),
        "records": records
    }

@app.patch("/attendance/{attendance_id}/od")
async def grant_od(attendance_id: str, od_data: ODGrant):
    """Grant Official Duty (OD) for an attendance record (Teacher only)"""
    validate_firebase()
    
    # Get attendance record
    att_ref = db.collection('attendance').document(attendance_id)
    att_doc = att_ref.get()
    
    if not att_doc.exists:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    
    # Verify teacher role (in production, check from auth token)
    teacher_ref = db.collection('users').document(od_data.teacherId)
    teacher_doc = teacher_ref.get()
    
    if teacher_doc.exists:
        teacher_data = teacher_doc.to_dict()
        if teacher_data.get('role') != 'teacher':
            raise HTTPException(status_code=403, detail="Only teachers can grant OD")
    
    # Update attendance record
    att_ref.update({
        'status': AttendanceStatus.OD_GRANTED.value,
        'odGranted': True,
        'odGrantedBy': od_data.teacherId,
        'odGrantedAt': datetime.now().isoformat()
    })
    
    # Get updated record
    updated_doc = att_ref.get()
    updated_data = updated_doc.to_dict()
    updated_data['attendanceId'] = attendance_id
    
    return {
        "message": "OD granted successfully",
        "attendance": AttendanceResponse(**updated_data)
    }

@app.post("/events/{event_id}/qr")
async def generate_qr_code(event_id: str):
    """Generate QR code for event check-in"""
    validate_firebase()
    
    # Verify event
    event_ref = db.collection('events').document(event_id)
    event_doc = event_ref.get()
    
    if not event_doc.exists:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Generate QR code data (URL for check-in)
    checkin_url = f"https://campus-memory.app/checkin/{event_id}"
    
    # Create QR code
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(checkin_url)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Convert to base64
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    
    return {
        "eventId": event_id,
        "checkinUrl": checkin_url,
        "qrCodeBase64": f"data:image/png;base64,{img_str}"
    }

# ========================
# PHASE 4: REPORTING & DASHBOARD
# ========================

@app.get("/dashboard/coordinator/{coordinator_id}")
async def get_coordinator_dashboard(coordinator_id: str):
    """Get coordinator dashboard data"""
    validate_firebase()
    
    # Get events created by coordinator
    events_query = db.collection('events').where('createdBy', '==', coordinator_id)
    events = list(events_query.stream())
    
    # Get upcoming events
    upcoming = []
    past = []
    today = datetime.now().strftime("%Y-%m-%d")
    
    for event_doc in events:
        event_data = event_doc.to_dict()
        event_date = event_data.get('date', '')
        
        if event_date >= today:
            upcoming.append(event_data)
        else:
            past.append(event_data)
    
    # Category distribution
    categories = {}
    for event_doc in events:
        cat = event_doc.to_dict().get('category', 'Other')
        categories[cat] = categories.get(cat, 0) + 1
    
    # School distribution
    schools = {}
    for event_doc in events:
        school = event_doc.to_dict().get('school', 'Unknown')
        schools[school] = schools.get(school, 0) + 1
    
    return {
        "totalEvents": len(events),
        "upcomingEvents": len(upcoming),
        "pastEvents": len(past),
        "categoryDistribution": categories,
        "schoolDistribution": schools,
        "recentEvents": upcoming[:5]
    }

@app.get("/dashboard/teacher/{teacher_id}")
async def get_teacher_dashboard(teacher_id: str):
    """Get teacher dashboard data"""
    validate_firebase()
    
    # Get teacher info
    teacher_ref = db.collection('users').document(teacher_id)
    teacher_doc = teacher_ref.get()
    
    if not teacher_doc.exists:
        raise HTTPException(status_code=404, detail="Teacher not found")
    
    teacher_data = teacher_doc.to_dict()
    teacher_school = teacher_data.get('school', '')
    
    # Get events from teacher's school
    events_query = db.collection('events').where('school', '==', teacher_school)
    events = list(events_query.stream())
    
    # Get attendance stats
    total_attendance = 0
    od_granted_count = 0
    
    for event_doc in events:
        event_id = event_doc.id
        att_query = db.collection('attendance').where('eventId', '==', event_id)
        for att_doc in att_query.stream():
            total_attendance += 1
            if att_doc.to_dict().get('odGranted'):
                od_granted_count += 1
    
    return {
        "school": teacher_school,
        "totalEvents": len(events),
        "totalAttendance": total_attendance,
        "odGrantedCount": od_granted_count,
        "events": [{"eventId": doc.id, **doc.to_dict()} for doc in events[:10]]
    }

@app.get("/dashboard/student/{student_id}")
async def get_student_dashboard(student_id: str):
    """Get student dashboard data"""
    
    # Use mock data if Firebase is not available
    if not validate_firebase():
        student_attendance = [rec for rec in MOCK_ATTENDANCE if rec.get('studentId') == student_id]
        present_count = sum(1 for rec in student_attendance if rec.get('status') == 'present')
        od_count = sum(1 for rec in student_attendance if rec.get('odGranted', False))
        
        attended_events = []
        for rec in student_attendance:
            event = next((e for e in MOCK_EVENTS if e['eventId'] == rec.get('eventId')), None)
            if event:
                attended_events.append({
                    "eventId": event['eventId'],
                    "title": event['title'],
                    "date": event['date'],
                    "category": event['category'],
                    "odGranted": rec.get('odGranted', False)
                })
        
        return {
            "studentId": student_id,
            "totalEventsAttended": len(student_attendance),
            "presentCount": present_count,
            "odGrantedCount": od_count,
            "attendedEvents": attended_events
        }
    
    # Get student's attendance records
    att_query = db.collection('attendance').where('studentId', '==', student_id)
    attendance_docs = list(att_query.stream())
    
    # Count by status
    present_count = 0
    od_count = 0
    
    for att_doc in attendance_docs:
        att_data = att_doc.to_dict()
        if att_data.get('odGranted'):
            od_count += 1
        elif att_data.get('status') == 'present':
            present_count += 1
    
    # Get event details
    attended_events = []
    for att_doc in attendance_docs:
        att_data = att_doc.to_dict()
        event_id = att_data.get('eventId')
        
        event_ref = db.collection('events').document(event_id)
        event_doc = event_ref.get()
        
        if event_doc.exists:
            event_data = event_doc.to_dict()
            attended_events.append({
                "eventId": event_id,
                "title": event_data.get('title'),
                "date": event_data.get('date'),
                "category": event_data.get('category'),
                "odGranted": att_data.get('odGranted', False)
            })
    
    return {
        "studentId": student_id,
        "totalEventsAttended": len(attendance_docs),
        "presentCount": present_count,
        "odGrantedCount": od_count,
        "attendedEvents": attended_events
    }

@app.post("/reports/export")
async def export_report(filters: ReportFilter, format: str = Query("csv", regex="^(csv|pdf)$")):
    """Generate and export attendance report"""
    validate_firebase()
    
    # Build query based on filters
    query = db.collection('attendance')
    
    if filters.eventId:
        query = query.where('eventId', '==', filters.eventId)
    
    # Execute query
    records = list(query.stream())
    
    # Filter by date range if provided
    filtered_records = []
    for doc in records:
        data = doc.to_dict()
        
        # Get event to check school and category
        if filters.school or filters.category:
            event_ref = db.collection('events').document(data.get('eventId'))
            event_doc = event_ref.get()
            if event_doc.exists:
                event_data = event_doc.to_dict()
                
                if filters.school and event_data.get('school') != filters.school:
                    continue
                if filters.category and event_data.get('category') != filters.category:
                    continue
        
        # Date filtering
        timestamp = data.get('timestamp', '')
        if filters.startDate and timestamp < filters.startDate:
            continue
        if filters.endDate and timestamp > filters.endDate:
            continue
        
        filtered_records.append({**data, 'attendanceId': doc.id})
    
    if format == "csv":
        # Generate CSV
        output = io.StringIO()
        if filtered_records:
            writer = csv.DictWriter(output, fieldnames=filtered_records[0].keys())
            writer.writeheader()
            writer.writerows(filtered_records)
        
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=attendance_report.csv"}
        )
    
    else:  # PDF
        # For PDF, would need reportlab or similar
        # For now, return JSON
        return {
            "format": "pdf",
            "message": "PDF generation not yet implemented",
            "recordCount": len(filtered_records),
            "records": filtered_records
        }

# ========================
# OD REQUEST AND EVENT REGISTRATION ENDPOINTS
# ========================

@app.post("/od-requests")
async def create_od_request(od_request: ODRequestCreate):
    """Create OD request for multiple students and subjects"""
    validate_firebase()
    
    # Create OD request document
    od_data = {
        "eventName": od_request.eventName,
        "eventDate": od_request.eventDate,
        "students": [student.dict() for student in od_request.students],
        "subjects": od_request.subjects,
        "reason": od_request.reason,
        "duration": od_request.duration,
        "status": "pending",
        "createdAt": datetime.now().isoformat(),
        "approvedBy": None,
        "approvedAt": None
    }
    
    # Add to Firestore
    od_ref = db.collection('od_requests').document()
    od_ref.set(od_data)
    
    return {
        "success": True,
        "message": "OD request submitted successfully",
        "requestId": od_ref.id,
        "data": od_data
    }

@app.get("/od-requests")
async def list_od_requests(status: Optional[str] = None, limit: int = Query(50, le=200)):
    """List all OD requests with optional status filter"""
    validate_firebase()
    
    query = db.collection('od_requests')
    
    if status:
        query = query.where('status', '==', status)
    
    od_requests = list(query.limit(limit).stream())
    
    results = []
    for doc in od_requests:
        data = doc.to_dict()
        data['requestId'] = doc.id
        results.append(data)
    
    return results

@app.patch("/od-requests/{request_id}/approve")
async def approve_od_request(request_id: str, teacher_id: str = Query(...)):
    """Approve OD request"""
    validate_firebase()
    
    od_ref = db.collection('od_requests').document(request_id)
    od_doc = od_ref.get()
    
    if not od_doc.exists:
        raise HTTPException(status_code=404, detail="OD request not found")
    
    od_ref.update({
        'status': 'approved',
        'approvedBy': teacher_id,
        'approvedAt': datetime.now().isoformat()
    })
    
    updated_doc = od_ref.get()
    updated_data = updated_doc.to_dict()
    updated_data['requestId'] = request_id
    
    return {
        "success": True,
        "message": "OD request approved",
        "data": updated_data
    }

@app.post("/events/{event_id}/register")
async def register_for_event(event_id: str, registration: EventRegistrationCreate):
    """Register student for event with optional team members"""
    validate_firebase()
    
    # Verify event exists
    event_ref = db.collection('events').document(event_id)
    event_doc = event_ref.get()
    
    if not event_doc.exists:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event_data = event_doc.to_dict()
    
    # Validate team size if applicable
    if registration.isTeamEvent:
        total_team_size = len(registration.teamMembers) + 1  # +1 for the registering student
        max_team_size = event_data.get('maxTeamSize', 5)
        min_team_size = event_data.get('minTeamSize', 1)
        
        if total_team_size < min_team_size:
            raise HTTPException(
                status_code=400,
                detail=f"Team size must be at least {min_team_size} members"
            )
        
        if total_team_size > max_team_size:
            raise HTTPException(
                status_code=400,
                detail=f"Team size cannot exceed {max_team_size} members"
            )
    
    # Create registration document
    registration_data = {
        "eventId": event_id,
        "eventTitle": registration.eventTitle,
        "studentId": registration.studentId,
        "studentName": registration.studentName,
        "studentEmail": registration.studentEmail,
        "studentPhone": registration.studentPhone,
        "isTeamEvent": registration.isTeamEvent,
        "teamName": registration.teamName,
        "teamMembers": [member.dict() for member in registration.teamMembers],
        "registeredAt": datetime.now().isoformat(),
        "status": "registered"
    }
    
    # Add to Firestore
    reg_ref = db.collection('event_registrations').document()
    reg_ref.set(registration_data)
    
    return {
        "success": True,
        "message": "Successfully registered for event",
        "registrationId": reg_ref.id,
        "data": registration_data
    }

@app.get("/events/{event_id}/registrations")
async def get_event_registrations(event_id: str):
    """Get all registrations for an event"""
    validate_firebase()
    
    query = db.collection('event_registrations').where('eventId', '==', event_id)
    registrations = list(query.stream())
    
    results = []
    for doc in registrations:
        data = doc.to_dict()
        data['registrationId'] = doc.id
        results.append(data)
    
    return {
        "eventId": event_id,
        "totalRegistrations": len(results),
        "registrations": results
    }

@app.get("/students/{student_id}/registrations")
async def get_student_registrations(student_id: str):
    """Get all event registrations for a student"""
    validate_firebase()
    
    query = db.collection('event_registrations').where('studentId', '==', student_id)
    registrations = list(query.stream())
    
    results = []
    for doc in registrations:
        data = doc.to_dict()
        data['registrationId'] = doc.id
        results.append(data)
    
    return {
        "studentId": student_id,
        "totalRegistrations": len(results),
        "registrations": results
    }

# Run server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
