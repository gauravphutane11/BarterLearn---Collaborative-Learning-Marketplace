# BarterLearn - Collaborative Learning Marketplace 📚

A modern web application that enables users to exchange skills and knowledge through a collaborative learning platform. Built as a software engineering project prototype with React and modern web technologies.

## 🌟 Features

### Core Functionality
- **User Profiles**: Create and manage personal learning profiles with skills offered and wanted
- **Smart Matching System**: Algorithm-based matching that pairs users with complementary skills
- **Video Chat Interface**: Live learning sessions with video/audio controls and chat
- **Progress Tracking**: Monitor active and completed skill exchanges with detailed analytics
- **Responsive Design**: Works seamlessly on both desktop and mobile devices

### Key Highlights
- 🎯 Intelligent matching algorithm that calculates compatibility scores
- 🎥 Simulated video chat environment (ready for WebRTC integration)
- 📊 Real-time progress tracking and session management
- 💬 In-session chat functionality
- ⭐ User ratings and review system
- 📈 Personal learning statistics dashboard

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/barterlearn.git
   cd barterlearn
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Set up the backend**
   ```bash
   cd backend
   python -m venv venv             # create virtual environment
   venv\Scripts\activate         # Windows activate
   pip install -r requirements.txt
   flask db init                   # initialize migrations
   flask db migrate -m "initial"
   flask db upgrade   # optionally populate sample users
   python seed.py   ```
   Create a `.env` file with at least:
   ```env
   JWT_SECRET_KEY=your_jwt_secret
   DATABASE_URL=sqlite:///barterlearn.db
   ```

4. **Start both servers**
   - backend: `cd backend && flask run`
   - frontend: back in root `npm run dev`

5. **Open your browser**
   Navigate to `http://localhost:3000` (frontend) and use API at `http://localhost:5000`

---

### Production Deployment Notes

Once the application is ready for production you'll need to:

1. Build the React app (`npm run build`) and serve the static files with a web server (Nginx, Express, etc.).
2. Configure the Flask backend for production (disable debug, set proper `JWT_SECRET_KEY`, use a real database such as PostgreSQL or MySQL, and enable HTTPS).
3. Consider containerizing both front‑ and back‑ends with Docker and orchestrating with `docker-compose` or Kubernetes.
4. Deploy the frontend to a static host (Vercel, Netlify, AWS S3/CloudFront) and the backend to a Python‑friendly service (Heroku, Azure App Service, AWS Elastic Beanstalk, etc.).
5. Set environment variables on the hosting platform for secrets and database connection strings.

Refer to the **🏗️ Project Structure** section above for more details on where to place files.

### Build for Production

```bash
npm run build
```

The production build will be created in the `dist` directory.

## 📱 Usage

### Logging In
1. On the login page, select any user from the dropdown (demo mode)
2. Each user has different skills and learning goals

### Navigating the Platform

#### Home Dashboard
- View your statistics and recent activity
- See suggested matches
- Quick access to key features

#### Profile Management
- Update your bio
- Add skills you can teach
- Add skills you want to learn
- View your rating and completed exchanges

#### Finding Matches
- Browse compatible learning partners
- View detailed compatibility scores
- See mutual exchange opportunities
- Connect with matches

#### Video Sessions
- Start live learning sessions (UI prototype)
- Control video, audio, and screen sharing
- Use in-session chat
- Track session duration

#### Progress Tracking
- View active exchanges
- Monitor learning progress
- See completed exchanges
- Access certificates and reviews

## 🏗️ Project Structure

```
barterlearn/
├── backend/                   # Python/Flask API
│   ├── app.py                 # Flask application
│   ├── models.py              # SQLAlchemy models
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # environment variables (JWT secret, DATABASE_URL)
├── public/
├── src/
│   ├── components/
│   │   └── Navbar.jsx          # Navigation component
│   ├── pages/
│   │   ├── Home.jsx             # Dashboard
│   │   ├── Login.jsx            # Authentication
│   │   ├── Profile.jsx          # User profile management
│   │   ├── Matching.jsx         # Partner matching
│   │   ├── VideoChat.jsx        # Live session interface
│   │   └── Progress.jsx         # Progress tracking
│   ├── data/
│   │   └── staticData.js        # Static lists (skills etc.)

│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── index.html
├── package.json
├── vite.config.js
├── README.md
```

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Styling**: CSS-in-JS (inline styles)
- **State Management**: React Hooks (useState, useEffect)

## 🎨 Design Features

- **Premium Dark Mode**: Sophisticated dark theme with harmonious indigo and emerald accents
- **Modern Typography**: Integrated 'Inter' and 'Outfit' Google Fonts for a professional aesthetic
- **Glassmorphism**: Elegant card designs with background blur and subtle borders
- **Dynamic Interactions**: Smooth micro-animations and hover effects
- **Responsive Layout**: Optimized for all screen sizes

## 🔮 Future Enhancements

### Technical
- [ ] Backend API integration (Node.js/Express or similar)
- [ ] Database setup (MongoDB/PostgreSQL)
- [ ] Real WebRTC video chat implementation
- [ ] Real-time notifications (WebSocket/Socket.io)
- [ ] User authentication (JWT/OAuth)
- [ ] Email notifications
- [ ] Calendar integration

### Features
- [ ] Advanced search and filtering
- [ ] Group learning sessions
- [ ] Skill certification system
- [ ] Payment integration for premium features
- [ ] Mobile apps (React Native)
- [ ] AI-powered skill recommendations
- [ ] Learning resources library
- [ ] Gamification (badges, achievements)

## 📝 Notes for Development

### Current Implementation
This is a **prototype/demo** version with:
- Mock data for users and exchanges
- Simulated video chat interface
- Client-side only (no backend)
- Demo authentication (no real auth)

### For Production Deployment
You'll need to add:
1. **Backend API** for data persistence
2. **Database** for user and exchange data
3. **Real video chat** using WebRTC or services like Agora/Twilio
4. **Authentication system** with proper security
5. **Payment processing** if monetizing
6. **Hosting** on platforms like Vercel, Netlify, or AWS

## 🤝 Contributing

This is a software engineering project prototype. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- React community for excellent documentation
- Lucide for beautiful icon set
- All open-source contributors

## 📞 Support

For support or questions about this project:
- Open an issue on GitHub
- Contact: your.email@example.com

---

**Note**: This is a prototype built for educational purposes as part of a software engineering course project. It demonstrates key concepts in modern web development, component architecture, and user experience design.
