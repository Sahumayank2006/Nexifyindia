# Firebase Setup Guide

## ✅ Frontend Configuration - COMPLETED

The frontend Firebase configuration has been updated with your Firebase credentials in:
- File: `CampusMemory/CampusMemory/src/lib/firebase.ts`
- Project: `campus-memory`
- Services: Authentication, Firestore, Storage

## 🔧 Backend Configuration - Service Account Required

### Step 1: Download Firebase Service Account Key

To connect the backend Python server to Firebase, you need a service account key file.

#### Instructions:

1. **Go to Firebase Console**
   - Open: https://console.firebase.google.com/
   - Select your project: **campus-memory**

2. **Navigate to Project Settings**
   - Click the ⚙️ gear icon in the left sidebar
   - Select "Project Settings"

3. **Go to Service Accounts Tab**
   - Click on "Service accounts" tab at the top
   
4. **Generate New Private Key**
   - Scroll down to "Firebase Admin SDK" section
   - Click "Generate new private key" button
   - **IMPORTANT**: Click "Generate key" in the confirmation dialog
   - A JSON file will be downloaded

5. **Rename and Move the File**
   - Rename the downloaded file to: `firebase-credentials.json`
   - Move it to the root directory: `campus-memory-main/`
   - **Path should be**: `C:\Users\Asus\Downloads\campus-memory-main\campus-memory-main\firebase-credentials.json`

6. **Verify File Location**
   - The file should be in the same directory as `event_api_server.py`
   - File should contain your service account credentials (DO NOT SHARE THIS FILE)

### Step 2: Security Important!

⚠️ **NEVER commit firebase-credentials.json to Git!**

The file contains sensitive credentials. To ensure it's not tracked:

1. Check if `.gitignore` exists in your project
2. Add this line to `.gitignore`:
   ```
   firebase-credentials.json
   ```

### Step 3: Verify Setup

After placing the file, test the connection:

```powershell
cd C:\Users\Asus\Downloads\campus-memory-main\campus-memory-main
python event_api_server.py
```

You should see:
```
✅ Firebase Admin SDK initialized successfully!
```

If you see a warning instead, check:
1. File name is exactly `firebase-credentials.json`
2. File is in the correct directory
3. File is valid JSON (not corrupted)

## 📊 Firestore Database Structure

Your events will be stored in Firestore with this structure:

```
campus-memory (Project)
└── events (Collection)
    ├── {eventId} (Document)
    │   ├── title: string
    │   ├── category: string
    │   ├── date: string
    │   ├── time: string
    │   ├── location: string
    │   ├── organizer: string
    │   ├── school: string
    │   ├── description: string
    │   ├── posterUrl: string
    │   ├── createdBy: string
    │   ├── createdAt: timestamp
    │   └── subUsers: array
    │
    ├── attendance (Subcollection)
    │   └── {attendanceId}: {...}
    │
    └── subUsers (Subcollection)
        └── {userId}: {...}
```

## 🎯 What's Configured

### Frontend (Client SDK)
- ✅ Authentication (getAuth)
- ✅ Firestore Database (getFirestore)
- ✅ Cloud Storage (getStorage)
- ✅ API Keys configured
- ✅ Project ID: campus-memory

### Backend (Admin SDK) - Requires Service Account
- ⏳ Firebase Admin SDK (needs firebase-credentials.json)
- ⏳ Firestore Database access
- ⏳ Cloud Storage bucket: campus-memory.firebasestorage.app

## 🚀 Testing Firebase Integration

Once the service account is configured:

### 1. Test Backend Connection
```powershell
python event_api_server.py
```

### 2. Test Create Event
```powershell
# Start the backend server
python event_api_server.py

# In another terminal, test creating an event:
curl -X POST "http://localhost:8001/events?coordinator_id=TEST001" ^
  -H "Content-Type: application/json" ^
  -d '{\"title\":\"Test Event\",\"category\":\"Technical\",\"date\":\"2026-03-15\",\"time\":\"14:00\",\"location\":\"Room 101\",\"organizer\":\"CS Dept\",\"registrationDeadline\":\"2026-03-10\",\"school\":\"Amity School of Engineering & Technology\",\"description\":\"Test event\"}'
```

### 3. Test Frontend
```bash
cd CampusMemory/CampusMemory
npm run dev
```

Visit `http://localhost:3000` and try creating an event.

## 🔍 Troubleshooting

### Error: "Firebase initialization failed"
- ❌ Service account file missing
- ✅ Download and place `firebase-credentials.json`

### Error: "Permission denied"
- ❌ Service account doesn't have Firestore permissions
- ✅ Go to Firebase Console → IAM & Admin → Grant "Cloud Datastore User" role

### Error: "Invalid credentials"
- ❌ Wrong service account file
- ✅ Download a fresh service account key

### Backend uses mock data instead of Firebase
- ❌ Firebase not initialized properly
- ✅ Check server logs for Firebase initialization message

## 📝 Next Steps

1. ✅ Frontend configured - DONE
2. ⏳ Download service account key - **DO THIS NOW**
3. ⏳ Place file as `firebase-credentials.json`
4. ⏳ Restart backend server
5. ⏳ Test creating events from frontend
6. ⏳ Verify events appear in Firebase Console

## 🎓 Firebase Console Access

Firebase Console: https://console.firebase.google.com/project/campus-memory
- View events: Firestore Database → events collection
- View storage: Storage → Files
- View users: Authentication → Users

---

**Need Help?**
- Firebase Docs: https://firebase.google.com/docs/admin/setup
- Firestore Guide: https://firebase.google.com/docs/firestore
