Pastebin-Lite
A simple pastebin application with time-based expiry and view count limits. Users can create text pastes, set optional constraints (TTL and max views), and share via unique URLs.

Features
📝 Create pastes with optional constraints (TTL and max views)

🔗 Share via unique, auto-generated URLs

⏱️ Automatic expiration based on constraints

👁️ View counter with limit enforcement

🛡️ Secure HTML escaping (prevents XSS)

🧪 Test mode for deterministic expiry testing

📱 Responsive, clean UI

Tech Stack
Frontend: React.js

Backend: Node.js + Express.js

Database: SQLite (file-based, serverless-friendly)

Deployment: Vercel

Live Demo
Application: https://your-app.vercel.app

API Health Check: https://your-app.vercel.app/api/healthz

Local Development
Prerequisites
Node.js (v18 or higher)

npm or yarn

Setup
Clone the repository

bash
git clone <your-repo-url>
cd pastebin-lite
Install all dependencies

bash
npm run install-all
Or install separately:

bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
Start the development servers

Option A: Single command (from root)

bash
npm run dev
Option B: Separate terminals

bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start
Access the application

Frontend: http://localhost:3001

Backend API: http://localhost:5000

API Health: http://localhost:5000/api/healthz
