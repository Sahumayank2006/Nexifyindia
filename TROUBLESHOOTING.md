# 🔧 Troubleshooting: "Error analyzing poster"

## Quick Fix Steps

### 1. **Check if Backend is Running** ⭐ MOST COMMON ISSUE
```bash
# The backend server must be running!
cd campus-memory-main
python event_api_server.py
```

**Expected output:**
```
✅ AI Poster Analysis Pipeline loaded!
INFO:     Uvicorn running on http://0.0.0.0:8001
```

If you see this, backend is ready! Keep it running and try uploading again.

---

### 2. **Run Diagnostic Check**
```bash
python check_poster_setup.py
```

This will tell you exactly what's missing.

---

### 3. **Common Errors & Solutions**

#### Error: "Cannot connect to server"
**Cause:** Backend not running  
**Fix:** Start backend with `python event_api_server.py`

#### Error: "AI service not available" (503)
**Cause:** AI dependencies not installed  
**Fix:** 
```bash
# Option 1: Auto setup
python setup_poster_extraction.py

# Option 2: Manual install
pip install paddleocr transformers spacy python-dateutil
python -m spacy download en_core_web_sm
```

**Note:** Even without AI packages, it should work with fallback methods!

#### Error: "Module 'poster_analysis_ai' not found"
**Cause:** Wrong directory  
**Fix:** Make sure you're in `campus-memory-main` folder
```bash
cd campus-memory-main
python event_api_server.py
```

#### Error: "Firebase not initialized"
**This is OK!** Poster extraction works without Firebase.  
Just ignore this warning.

---

### 4. **Verify Setup Step by Step**

```bash
# 1. Check Python
python --version
# Should show Python 3.8+

# 2. Check dependencies
python check_poster_setup.py

# 3. Start backend
python event_api_server.py
# Keep this running!

# 4. In NEW terminal, test frontend
cd CampusMemory/CampusMemory
npm run dev

# 5. Open browser: http://localhost:3000
```

---

### 5. **Test Poster Extraction**

```bash
# Simple test (no server needed)
python test_poster_extraction.py
```

Expected output:
```
✅ Analysis complete!
📋 Event Information Extracted:
Title: TECH FEST 2026
Category: Technical
...
```

---

## Still Not Working?

### Check Console Errors

**In Browser Console (F12):**
- Look for red errors
- Check if it says "Failed to fetch" → Backend not running
- Check if it says "404" → Wrong API URL
- Check if it says "503" → Dependencies missing

**In Backend Terminal:**
- Look for errors when you upload
- Should show "🔍 Starting poster analysis..."
- Any Python errors? Share them!

### Manual Test API

```bash
# Test if API is reachable
curl http://localhost:8001/

# Should return: {"message": "Campus Event Management API"}
```

If this fails, backend isn't running or wrong port.

---

## Quick Solutions Summary

| Error Message | Solution |
|---------------|----------|
| "Cannot connect to server" | Start backend: `python event_api_server.py` |
| "AI service not available" | Install: `python setup_poster_extraction.py` |
| "Module not found" | Check directory: `cd campus-memory-main` |
| "Failed to fetch" | Backend not running on port 8001 |
| "Network error" | Check firewall/antivirus |

---

## Complete Fresh Start

If nothing works, try complete reset:

```bash
# 1. Navigate to project
cd C:\Users\Asus\Downloads\campus-memory-main\campus-memory-main

# 2. Check setup
python check_poster_setup.py

# 3. Install what's missing
python setup_poster_extraction.py

# 4. Test without server
python test_poster_extraction.py

# 5. Start backend
python event_api_server.py

# 6. Upload poster in frontend
```

---

## What Should Work Even Without AI

**Without paddleocr/transformers/spacy:**
- ✅ Mock text extraction
- ✅ Rule-based field detection
- ✅ Date/time parsing
- ✅ Location extraction
- ✅ Form auto-fill

**Accuracy will be lower (~50-60%) but it SHOULD STILL WORK!**

---

## Get Help

1. Run: `python check_poster_setup.py`
2. Copy the output
3. Share what error you see in:
   - Browser console (F12)
   - Backend terminal
   - Diagnostic check output

---

## Pro Tips

- ✅ Always keep backend running while testing
- ✅ Check browser console (F12) for real errors
- ✅ Backend should show "✅ AI Pipeline loaded"
- ✅ Test with `test_poster_extraction.py` first
- ✅ Clear browser cache if frontend behaves oddly

---

**Most common issue: Backend not running! 🎯**

Start it with: `python event_api_server.py` and keep it running!
