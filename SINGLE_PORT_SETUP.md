# Single Port Access - Campus Memory

## Overview
The entire Campus Memory application now runs through **port 3000 only**!

## How It Works
- **Frontend (Next.js)** runs on port 3000
- **Backend (FastAPI)** runs on port 8000 (internal)
- **Next.js Proxy** forwards all `/api/*` requests from port 3000 to port 8000
- **You only need to access**: `http://localhost:3000`

## Architecture
```
User Browser
    ↓
http://localhost:3000 (Next.js Frontend)
    ↓
http://localhost:3000/api/* → Proxied to → http://localhost:8000/* (FastAPI Backend)
```

## Quick Start

### Option 1: Using start.bat (Recommended)
```bash
start.bat
```
This opens two terminal windows:
- Backend Server (Python FastAPI on port 8000)
- Frontend Server (Next.js on port 3000 with proxy)

Then access: **http://localhost:3000**

### Option 2: Manual Start
```bash
# Terminal 1: Start Backend
uvicorn backend_server:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2: Start Frontend with Proxy
cd CampusMemory/CampusMemory
npm run dev
```

Then access: **http://localhost:3000**

## Configuration Files

### next.config.mjs
```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://localhost:8000/:path*',
    },
  ];
}
```

### src/lib/api.ts
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
```

## Benefits
✅ Single URL to remember: `http://localhost:3000`
✅ No CORS issues
✅ Cleaner development experience
✅ Production-ready architecture
✅ All API calls automatically routed

## API Access
- **Frontend Pages**: `http://localhost:3000`
- **API Endpoints**: `http://localhost:3000/api/*`
- **Direct Backend** (optional): `http://localhost:8000/*`
- **API Documentation**: `http://localhost:8000/docs`

## Example API Calls
From the browser or frontend code, all these work seamlessly:

- `GET /api/events` → Get all events
- `POST /api/recommendations` → Get event recommendations
- `GET /api/guidance` → Get event guidance
- `POST /api/register` → Register for event

All requests automatically proxied to the FastAPI backend!
