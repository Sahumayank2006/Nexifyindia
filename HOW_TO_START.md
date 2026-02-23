# 🚀 Quick Start Guide - Campus Memory

## ⚡ ONE-COMMAND START

### **EASIEST**: Just Run This File
```bash
C:\Users\Asus\Downloads\campus-memory-main\campus-memory-main\QUICK_START.bat
```
Double-click this file or run it from anywhere!

---

## 📋 Other Start Methods

### Option 1: Batch File (Recommended)
```cmd
cd C:\Users\Asus\Downloads\campus-memory-main\campus-memory-main
.\start.bat
```

### Option 2: PowerShell Script
```powershell
cd C:\Users\Asus\Downloads\campus-memory-main\campus-memory-main
.\START_SERVERS.ps1
```

### Option 3: Quick Start (No Checks)
```cmd
cd C:\Users\Asus\Downloads\campus-memory-main\campus-memory-main
.\QUICK_START.bat
```

### Option 4: Single PowerShell Command
```powershell
Start-Process powershell -ArgumentList "-NoExit","-Command","cd C:\Users\Asus\Downloads\campus-memory-main\campus-memory-main; & .\.venv-3\Scripts\Activate.ps1; python event_api_server.py"; Start-Sleep 3; Start-Process powershell -ArgumentList "-NoExit","-Command","cd C:\Users\Asus\Downloads\campus-memory-main\campus-memory-main\CampusMemory\CampusMemory; npm run dev"
```

---

## ⏱️ What to Expect

After running any start command:

1. **Two terminal windows open**:
   - 🔵 Backend (Python) - Port 8001
   - 🟢 Frontend (Node.js) - Port 3000

2. **Wait 30-60 seconds** for backend AI models to load:
   - Firebase: Connects
   - EasyOCR: Initializes (downloads on first run)
   - Classifiers & NER: Load

3. **Backend Ready** when you see:
   ```
   INFO: Uvicorn running on http://0.0.0.0:8001
   ```

4. **Frontend Ready** when you see:
   ```
   ▲ Next.js - Local: http://localhost:3000
   ```

---

## 🌐 Access Your Application

- **Main Application**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **API Documentation**: http://localhost:8001/docs

---

## 🛑 Stop Servers

Press **Ctrl+C** in each terminal window to stop the servers.

---

## 📁 File Structure

```
campus-memory-main/
├── QUICK_START.bat      ← Ultra-fast launcher
├── START_SERVERS.ps1    ← PowerShell launcher
├── start.bat            ← Full setup + start
├── stop.bat             ← Stop all servers
└── event_api_server.py  ← Main backend server
```

---

## ✅ System Requirements

- Python 3.8+ (with virtual environment `.venv-3`)
- Node.js 18+
- All dependencies installed (`pip install -r requirements.txt` + `npm install`)
- Firebase credentials configured

---

## 🔧 Troubleshooting

### Backend won't start?
- Check if `.venv-3` exists
- Make sure Firebase credentials are configured
- Try: `python event_api_server.py` manually

### Frontend won't start?
- Make sure `node_modules` exists in `CampusMemory/CampusMemory/`
- Try: `cd CampusMemory/CampusMemory && npm install`

### Port conflicts?
- Port 8001 (Backend): Check if another app is using it
- Port 3000 (Frontend): Check if another Next.js app is running

---

## 🎉 You're All Set!

Run `QUICK_START.bat` and your Campus Memory system will be up in seconds!
