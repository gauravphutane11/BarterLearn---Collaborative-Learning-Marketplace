# `README.md`

````markdown
# Learvix

> **Don't show your certificate. Show what you can actually do.**

Learvix is a collaborative learning platform where users exchange skills and knowledge with each other.

It introduces **SkillProof AI**, an AI-powered skill verification concept designed to evaluate practical ability through real-world challenges, explanations, and evidence rather than relying only on certificates or course completion records.

---

## Overview

Traditional learning platforms primarily focus on course completion and certificates. However, completing a course does not always demonstrate practical skill.

Learvix aims to bridge this gap by combining:

- Collaborative peer-to-peer learning
- Skill discovery and matching
- Skill exchange
- Practical skill assessment
- Evidence-based skill verification

### SkillProof AI

The core concept is:

```text
Skill
  ↓
Practical Challenge
  ↓
Student Attempt
  ↓
Explanation / Evidence
  ↓
AI Evaluation
  ↓
Skill Evidence
  ↓
SkillProof Card
````

Example:

```text
Python
Score: 84/100

Logic:           88%
Problem Solving: 86%
Explanation:      82%
Debugging:        76%

Strength:
Problem solving

Improve:
Debugging and error handling
```

The goal is to provide evidence of what a learner can practically demonstrate.

---

## Features

### Collaborative Learning

* User registration and login
* User profiles
* Skills offered
* Skills wanted
* Skill search
* Skill-based matching
* Skill exchange requests
* Learning/session tracking
* Notifications

### SkillProof

* Select a skill
* Receive a practical challenge
* Submit a solution
* Explain the approach
* Optional camera-based evidence
* Skill evaluation
* Skill breakdown
* Strengths and improvement areas
* SkillProof Card

### Platform

* JWT authentication
* Protected API routes
* User statistics
* Admin-oriented functionality
* Responsive web interface

---

## Project Structure

```text
learvix/
│
├── backend/
│   ├── app.py
│   ├── models.py
│   ├── extensions.py
│   ├── seed.py
│   ├── wsgi.py
│   ├── requirements.txt
│   ├── migrations/
│   ├── .env.example
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Matching.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Progress.jsx
│   │   │   ├── SkillProof.jsx
│   │   │   └── VideoChat.jsx
│   │   └── ...
│   │
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
├── render.yaml
├── .gitignore
├── LICENSE
└── README.md
```

---

# Technology Stack

## Frontend

* **React 18**
* **Vite**
* **React Router**
* **Lucide React**

The frontend provides the interactive user interface and communicates with the backend through REST APIs.

## Backend

* **Python 3**
* **Flask**
* **Flask-SQLAlchemy**
* **Flask-JWT-Extended**
* **Flask-Migrate**

The backend provides REST APIs, authentication, business logic, and database access.

## Database

* **SQLite** for local development
* **PostgreSQL** for production

## Deployment

* **Frontend:** Vercel
* **Backend:** Render

---

# Local Development

## Prerequisites

Make sure you have:

* Python 3
* Node.js
* npm
* Git

---

## Backend

Open a terminal:

```powershell
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt
```

Create the environment file:

```powershell
copy .env.example .env
```

Run database migrations:

```powershell
python -m flask --app app.py db upgrade
```

Start Flask:

```powershell
python -m flask --app app.py run
```

Backend:

```text
http://localhost:5000
```

---

## Frontend

Open another terminal:

```powershell
cd frontend

npm install

npm run dev
```

Frontend:

```text
http://localhost:3000
```

Vite is configured to proxy `/api` requests to the Flask backend during local development.

---

# Authentication

Learvix uses JWT-based authentication.

Authentication flow:

```text
Register
   ↓
POST /api/register
   ↓
Password is securely hashed
   ↓
Login
   ↓
POST /api/login
   ↓
JWT access token
   ↓
Authenticated API requests
```

Protected requests use:

```http
Authorization: Bearer <token>
```

The frontend restores the authenticated user through:

```http
GET /api/me
```

---

# API Endpoints

| Method | Endpoint                      | Auth | Description                  |
| ------ | ----------------------------- | ---- | ---------------------------- |
| POST   | `/api/register`               | No   | Register a new user          |
| POST   | `/api/login`                  | No   | Login and receive JWT        |
| GET    | `/api/me`                     | Yes  | Get current user             |
| GET    | `/api/users`                  | Yes  | Get users                    |
| PUT    | `/api/users/:id`              | Yes  | Update user profile          |
| GET    | `/api/matches`                | Yes  | Get skill-based matches      |
| GET    | `/api/exchanges`              | Yes  | Get exchanges                |
| POST   | `/api/exchanges`              | Yes  | Create an exchange           |
| PATCH  | `/api/exchanges/:id`          | Yes  | Update an exchange           |
| GET    | `/api/notifications`          | Yes  | Get notifications            |
| PATCH  | `/api/notifications/:id/read` | Yes  | Mark notification as read    |
| GET    | `/api/stats`                  | Yes  | Get platform/user statistics |
| GET    | `/api/health`                 | No   | API health check             |

SkillProof-specific API endpoints can be added as the feature evolves.

---

# Database

The current application uses SQLAlchemy models for the core platform.

Main entities include:

```text
User
Exchange
Notification
```

The SkillProof concept can extend the data model with entities such as:

```text
SkillProof
Skill
Skill Evidence
Evaluation
```

These can be introduced progressively as the prototype develops.

---

# Production Deployment

## Backend — Render

The repository includes:

```text
render.yaml
```

which can be used for Render deployment.

General process:

```text
GitHub Repository
       ↓
Render Blueprint
       ↓
Flask Backend
       ↓
PostgreSQL
```

Production environment variables should include:

```text
JWT_SECRET_KEY=<secure-random-secret>
FLASK_ENV=production
DATABASE_URL=<production-database-url>
```

**Never commit real secrets to GitHub.**

---

## Frontend — Vercel

Set the frontend root directory to:

```text
frontend
```

Configure:

```text
VITE_API_BASE=<production-backend-url>
```

The project includes:

```text
frontend/vercel.json
```

for SPA routing.

---

# SkillProof Vision

SkillProof is designed around **evidence-based micro-assessment**.

Instead of relying only on:

```text
Resume
Certificate
Course Completion
```

Learvix can produce:

```text
Skill
  ↓
Practical Task
  ↓
Attempt
  ↓
Reasoning
  ↓
Evidence
  ↓
Evaluation
```

This creates a richer representation of practical ability.

### Example

```text
┌────────────────────────────────────┐
│          LEARVIX SKILLPROOF        │
│                                    │
│ Skill: Python                      │
│ Score: 84 / 100                    │
│                                    │
│ Logic             88%              │
│ Problem Solving   86%              │
│ Explanation       82%              │
│ Debugging         76%              │
│                                    │
│ Evidence                          │
│ Completed a practical task and     │
│ explained the chosen approach.     │
│                                    │
│ Strength                          │
│ Problem Solving                    │
│                                    │
│ Improve                           │
│ Debugging                         │
└────────────────────────────────────┘
```

SkillProof is intended as an **assessment/evidence mechanism**, not as a replacement for formal professional certifications.

---

# Future Direction

Learvix can evolve beyond the initial prototype toward:

* AI-powered skill recommendations
* AI-generated practical challenges
* Local/on-device AI evaluation
* Voice-based reasoning evaluation
* Camera-based evidence
* Real-time learning sessions
* Communities
* Mentorship
* Learning roadmaps
* Skill portfolios
* Verified skill evidence
* Mobile applications
* Enterprise learning
* University partnerships

These are future directions and are not necessarily part of the current prototype.

---

# Project Status

```text
Current Stage
──────────────────────────────
Hackathon Prototype

Existing Foundation
──────────────────────────────
✓ React + Vite frontend
✓ Flask REST API
✓ JWT authentication
✓ SQLAlchemy
✓ Database migrations
✓ Skill matching
✓ Skill exchange
✓ Session/progress tracking
✓ Notifications
✓ SkillProof concept
```

---

# Vision

> **Learvix aims to make learning more collaborative and make practical skills easier to demonstrate through evidence.**

**Don't show your certificate. Show what you can actually do.**

---

## License

See the `LICENSE` file for project licensing information.

```
```
