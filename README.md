# BarterLearn

BarterLearn is a simplified collaborative learning marketplace built with a React frontend and Flask backend.

## What this project contains

- `backend/` — Flask API server, database models, seed data, and production entrypoint.
- `src/` — React frontend UI, page routes, and API client.
- `package.json` — frontend dependencies and useful scripts.
- `vite.config.js` — local dev server config with API proxy to Flask.
- `backend/.env.example` — sample backend environment variables.

## Tech stack

- Frontend: React 18, Vite, React Router, Lucide icons
- Backend: Python 3, Flask, Flask-SQLAlchemy, Flask-JWT-Extended, Flask-Migrate
- Database: SQLite (local file `backend/barterlearn.db`)
- Production server: Waitress via `backend/wsgi.py`

## Project responsibilities

- `src/App.jsx` — global app state, authentication, route protection, and current user loading.
- `src/api.js` — centralized API service for communicating with the Flask backend.
- `src/pages/*` — main app pages: Home, Login, Profile, Matching, Progress, Notifications.
- `backend/app.py` — Flask app configuration, API endpoints, CORS, JWT, and static SPA serving.
- `backend/models.py` — database tables for users, exchanges, and notifications.
- `backend/seed.py` — creates sample user data for a demo environment.
- `backend/wsgi.py` — production entrypoint using Waitress.

## Database location

The local SQLite database file is created at:

- `backend/barterlearn.db`

If you use the sample `.env.example`, the DB URL is:

```env
DATABASE_URL=sqlite:///barterlearn.db
```

## Run locally

### 1. Install frontend packages

```powershell
npm install
```

### 2. Install backend packages

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure backend environment

```powershell
copy backend\.env.example backend\.env
```

Edit `backend/.env` only if you want to change the default port, JWT secret, or CORS origins.

### 4. Initialize the database

```powershell
cd backend
python -m flask --app app.py db init
python -m flask --app app.py db migrate -m "initial"
python -m flask --app app.py db upgrade
```

### 5. Seed demo users (optional)

```powershell
python seed.py
```

### 6. Start the backend API

```powershell
python -m flask --app app.py run
```

### 7. Start the frontend

In the project root:

```powershell
npm start
```

### 8. Open the app

- Frontend: `http://localhost:3000`
- Backend health check: `http://localhost:5000/api/health`

## Production preview

Build the frontend and run the Flask production server:

```powershell
npm run build
cd backend
python wsgi.py
```

Then open `http://localhost:5000`.

## Current workflow

1. User logs in or registers via the login page.
2. The frontend stores a JWT token in `localStorage`.
3. `src/App.jsx` loads current user data and user list from the backend.
4. The matching page requests `/api/matches` and displays compatible partners.
5. Users can update profiles on `/profile` using `/api/users/:id`.
6. Exchange progress is visible on `/progress` from `/api/exchanges`.
7. Notifications are loaded from `/api/notifications` and can be marked read.

## Notes

- The app is now easier to run with a clear backend environment template.
- The `matching` page now uses actual API data and creates exchanges for better interactivity.
- The backend seed script now initializes the DB tables before inserting sample users.
- See `PROJECT_OVERVIEW.md` for architecture and user flows.
