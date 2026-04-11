# BarterLearn

A simplified collaborative learning marketplace prototype using React and Flask.

## Project structure

- `backend/` — Flask API, data models, and database
- `src/` — React frontend application
- `package.json` — frontend dependencies and startup scripts
- `vite.config.js` — Vite dev server configuration and backend proxy
- `backend/barterlearn.db` — default SQLite file created locally

## Technology stack

- Frontend: React 18, Vite, React Router
- Backend: Python Flask, Flask-SQLAlchemy, Flask-JWT-Extended
- Database: SQLite by default
- Production server: Waitress via `backend/wsgi.py`

## How to run locally

1. Install frontend dependencies:
   ```powershell
   npm install
   ```

2. Install backend dependencies:
   ```powershell
   cd backend
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Create backend environment file:
   ```powershell
   copy backend\.env.example backend\.env
   ```
   Edit `backend/.env` if needed.

4. Create or update the database:
   ```powershell
   cd backend
   python -m flask --app app.py db init
   python -m flask --app app.py db migrate -m "initial"
   python -m flask --app app.py db upgrade
   ```

5. Seed sample users (optional):
   ```powershell
   python seed.py
   ```

6. Start the backend server:
   ```powershell
   python -m flask --app app.py run
   ```

7. Start the frontend app:
   ```powershell
   cd ..
   npm start
   ```

8. Open the app in your browser:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## Production build

1. Build the frontend:
   ```powershell
   npm run build
   ```

2. Start the production backend from the `backend` folder:
   ```powershell
   cd backend
   python wsgi.py
   ```

3. The backend will serve the built frontend from `../dist` and the API from `/api/*`.

## Notes

- The frontend now correctly proxies `/api/*` requests to the Flask backend.
- Profile updates work with both frontend camelCase fields and backend snake_case fields.
- The backend loads environment variables from `backend/.env`.
- The app was simplified to make startup and development easier.

## More details

See `PROJECT_OVERVIEW.md` for architecture, workflow, and code responsibilities.
