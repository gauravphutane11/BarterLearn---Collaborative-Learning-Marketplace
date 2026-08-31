# Learvix

Learvix is a collaborative learning platform where users exchange skills and knowledge. Features SkillProof AI — an AI-powered skill verification system with the motto: **"Don't show your certificate. Show what you can actually do."**

## Project Structure

```
learvix/
├── backend/              ← Flask API (Python)
│   ├── app.py            ← Main Flask app, all API routes
│   ├── models.py         ← SQLAlchemy models (User, Exchange, Notification)
│   ├── extensions.py     ← Shared db instance
│   ├── seed.py           ← Demo data seeder
│   ├── wsgi.py           ← Production WSGI entry (Gunicorn / Waitress)
│   ├── requirements.txt  ← Python dependencies
│   ├── .env              ← Backend env vars (never commit)
│   └── .env.example      ← Template for backend env vars
│
├── frontend/             ← React + Vite (JavaScript)
│   ├── src/              ← All React components, pages, API client
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── components/
│   │   └── pages/        (includes new SkillProof.jsx page)
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── vercel.json       ← Vercel SPA routing config
│   ├── .env              ← Local dev env (VITE_API_BASE=)
│   └── .env.production   ← Production env (VITE_API_BASE=<render-url>)
│
├── render.yaml           ← Render IaC (backend + PostgreSQL)
├── .gitignore
└── README.md
```

## Tech stack

- **Frontend**: React 18, Vite, React Router, Lucide icons → deployed on **Vercel**
- **Backend**: Python 3, Flask, Flask-SQLAlchemy, Flask-JWT-Extended, Flask-Migrate → deployed on **Render**
- **Database**: SQLite (local) / PostgreSQL (production via Render)

---

## Running Locally

### Terminal 1 — Backend (Flask)

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env          # first time only
python -m flask --app app.py db upgrade   # first time only
python -m flask --app app.py run
```

Backend API: http://localhost:5000

### Terminal 2 — Frontend (React)

```powershell
cd frontend
npm install                     # first time only
npm run dev
```

Frontend: http://localhost:3000  
_(Vite automatically proxies `/api` calls to `http://localhost:5000`)_

---

## Deploying to Production

### Backend → Render

1. Push this repo to GitHub.
2. On [render.com](https://render.com), click **New → Blueprint** and connect your repo — `render.yaml` handles everything automatically.
3. Set these environment variables in your Render service:
   | Key | Value |
   |-----|-------|
   | `JWT_SECRET_KEY` | any long random string |
   | `FLASK_ENV` | `production` |
   | `DATABASE_URL` | auto-filled from linked PostgreSQL |

### Frontend → Vercel

1. On [vercel.com](https://vercel.com), click **New Project** and import your repo.
2. Set **Root Directory** to `frontend`.
3. Set this environment variable:
   | Key | Value |
   |-----|-------|
   | `VITE_API_BASE` | `https://learvix-collaborative.onrender.com` |
4. Deploy — Vercel picks up `vercel.json` for SPA routing automatically.

---

## Authentication Flow

1. User registers → `POST /api/register` → password hashed with Werkzeug.
2. User logs in → `POST /api/login` → receives JWT access token.
3. Token stored in `localStorage` and attached to all subsequent requests as `Authorization: Bearer <token>`.
4. Protected routes call `GET /api/me` to restore session on page refresh.

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/register` | No | Register new user |
| POST | `/api/login` | No | Login, returns JWT |
| GET | `/api/me` | Yes | Current user profile |
| GET | `/api/users` | Yes | All users |
| PUT | `/api/users/:id` | Yes | Update user profile |
| GET | `/api/matches` | Yes | Skill-based matches |
| GET | `/api/exchanges` | Yes | All exchanges |
| POST | `/api/exchanges` | Yes | Create exchange |
| PATCH | `/api/exchanges/:id` | Yes | Update exchange |
| GET | `/api/notifications` | Yes | User notifications |
| PATCH | `/api/notifications/:id/read` | Yes | Mark notification read |
| GET | `/api/stats` | Yes | Platform + user stats |
| GET | `/api/health` | No | Health check |
