# BarterLearn Project Overview

## Project Summary

BarterLearn is a lightweight skill-exchange platform prototype. Users can register, build a profile, discover learning partners, track exchange progress, and view notifications.

## Architecture

### Frontend
- `React` with `Vite` for development and build.
- Client routes are managed by `react-router-dom`.
- `src/api.js` centralizes API requests using `fetch` and JWT tokens.
- Main pages:
  - `Login.jsx` — login/register flow
  - `Home.jsx` — dashboard summary and quick access
  - `Profile.jsx` — edit skills, bio, and personal data
  - `Matching.jsx` — partner discovery and exchange creation
  - `Progress.jsx` — active and completed exchanges
  - `Notifications.jsx` — in-app notifications and read status

### Backend
- `Flask` for API routes and static file serving.
- `Flask-SQLAlchemy` models represent users, exchanges, and notifications.
- JWT authentication handled by `Flask-JWT-Extended`.
- Local SQLite database configured with `DATABASE_URL`.
- `backend/seed.py` initializes sample users.
- `backend/wsgi.py` serves the app with `waitress` in production.

## Code Responsibilities

- `backend/app.py`
  - Sets up Flask, CORS, JWT, and database.
  - Defines API endpoints under `/api/*`.
  - Serves the built frontend from `../dist` in production.

- `backend/models.py`
  - Defines `User`, `Exchange`, `Notification` models.
  - Provides `to_dict()` methods for JSON responses.

- `backend/extensions.py`
  - Exposes a shared `db` object for SQLAlchemy.

- `backend/seed.py`
  - Creates the database schema and adds sample demo users.

- `src/api.js`
  - Wraps fetch calls and adds auth headers automatically.
  - Handles 400/401/403/404/500 errors with clearer messages.

- `src/App.jsx`
  - Loads current user and user list after login or page refresh.
  - Keeps unread notification count updated.

- `src/pages/Matching.jsx`
  - Fetches real match data from `/api/matches`.
  - Creates an exchange when the user connects with a match.

## Current workflow

1. **Login**
   - User logs in or registers.
   - Frontend stores JWT in `localStorage`.
   - `App.jsx` loads user and profile data from `/api/me`.

2. **Home**
   - Displays quick stats and suggested matches.
   - Uses `currentUser` and all users fetched from the backend.

3. **Profile**
   - Users can edit their bio, skills offered, and skills wanted.
   - Updates are saved to `/api/users/:id`.

4. **Matching**
   - Requests `/api/matches` to compute compatibility.
   - User can connect with a match and create an exchange.

5. **Progress**
   - Shows active and completed exchanges.
   - Logs sessions and completes exchanges via `/api/exchanges/:id`.

6. **Notifications**
   - Loads notifications from `/api/notifications`.
   - Allows users to mark notifications as read.

## How data moves

- User action in the frontend triggers `src/api.js`.
- API calls are routed through the Vite proxy (`/api` → Flask backend).
- Flask validates JWT and responds with JSON.
- React updates page state and re-renders.

## Database location

The app stores data in a local SQLite file at:

- `backend/barterlearn.db`

The DB path comes from `backend/.env` via `DATABASE_URL`.

## Running the project

Use the instructions in `README.md` for local setup and startup.

## Simplifications made

- Matching page now uses actual backend match results.
- Connect action now creates a real exchange record.
- Backend seed script now creates tables before seeding.
- Added a backend `.env.example` for easy configuration.
- [ ] AI-powered recommendations
- [ ] Certificate generation (PDF)
- [ ] Group learning sessions
- [ ] Mobile apps (React Native)

### Phase 4 (Scale)
- [ ] Gamification (badges, leaderboards)
- [ ] Community forums
- [ ] Learning resources library
- [ ] Admin dashboard
- [ ] Analytics and reporting

## 📝 For Your SE Project Report

### Topics to Cover

1. **Introduction**
   - Problem statement: Traditional learning is expensive and one-way
   - Solution: Peer-to-peer skill exchange platform

2. **System Design**
   - Architecture diagram
   - Component breakdown
   - Data flow diagrams

3. **Implementation**
   - Technology choices and justifications
   - Key features and screenshots
   - Code structure

4. **Algorithms**
   - Matching algorithm explanation
   - Complexity analysis (O(n²) for matching)

5. **Testing**
   - User testing scenarios
   - Edge cases handled

6. **Future Work**
   - Scalability considerations
   - Security improvements
   - Additional features

## 🤝 Collaboration Tips

If working in a team:
- Use Git branches for features
- Write clear commit messages
- Review each other's code
- Document your changes
- Use GitHub Issues for tracking tasks

## 📞 Support Resources

- React Docs: https://react.dev
- React Router: https://reactrouter.com
- Vite Docs: https://vitejs.dev
- Git Docs: https://git-scm.com/doc

---

**Remember**: This is a prototype demonstrating core concepts. Focus on presenting the architecture, design decisions, and potential for scalability in your project report!
