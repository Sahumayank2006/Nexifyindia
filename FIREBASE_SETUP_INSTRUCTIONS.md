# 🔥 Firebase Setup Instructions

## Current Status: ❌ NOT CONNECTED

Your application cannot connect to Firebase because `firebase-credentials.json` is missing.

## Quick Setup (5 minutes)

### Step 1: Download Firebase Credentials

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `campus-memory`
3. **Navigate to Settings**:
   - Click the ⚙️ gear icon (top left)
   - Select **Project Settings**
4. **Go to Service Accounts tab**
5. **Generate new private key**:
   - Click "Generate New Private Key" button
   - Confirm the download
6. **Save the file** as: `firebase-credentials.json`

### Step 2: Place the File

Copy the downloaded file to:
```
c:\Users\Asus\Downloads\campus-memory-main\campus-memory-main\firebase-credentials.json
```

### Step 3: Verify Connection

Run this test script:
```powershell
cd campus-memory-main
python test_firebase_connection.py
```

### Step 4: Restart Servers

After adding credentials, restart your servers:
```powershell
cd campus-memory-main
python event_api_server.py
```

You should see:
```
✅ Firebase Admin SDK initialized successfully!
```

## Security Notes

⚠️ **IMPORTANT**: 
- **NEVER** commit `firebase-credentials.json` to git
- Add it to `.gitignore`
- Keep this file secure - it has full access to your Firebase project

## What Firebase Provides

Once connected, your app will be able to:

✅ **Store Event Data** - Events, categories, schedules
✅ **Track Attendance** - QR code scans, student attendance
✅ **Manage OD Requests** - Student leave requests, teacher approvals
✅ **Upload Files** - Event posters, images to Firebase Storage
✅ **User Authentication** - Student, teacher, coordinator logins

## Troubleshooting

### Error: "Permission denied"
- Check that your Firebase project has Firestore enabled
- Verify storage bucket name: `campus-memory.firebasestorage.app`

### Error: "Invalid credentials"
- Download a fresh service account key
- Ensure the file is valid JSON
- Check for any extra spaces or characters

### Still having issues?
Run the diagnostic:
```powershell
python check_firebase_setup.py
```

## Need Help?

If you need assistance:
1. Share the error message (hide your private keys!)
2. Check Firebase Console for any project issues
3. Verify Firestore and Storage are enabled in Firebase
