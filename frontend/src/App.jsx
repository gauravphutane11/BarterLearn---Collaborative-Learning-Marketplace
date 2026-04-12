import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Matching from './pages/Matching';
import VideoChat from './pages/VideoChat';
import Progress from './pages/Progress';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import { api } from './api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token && !currentUser) {
      api.getMe()
        .then(async (me) => {
          setCurrentUser(me);
          try {
            const allUsers = await api.getUsers();
            setUsers(allUsers);
          } catch (err) {
            console.error('Failed to load users after auth', err);
          }
        })
        .catch(() => localStorage.removeItem('access_token'));
    }
  }, [currentUser]);

  const updateUserProfile = async (data) => {
    try {
      const updatedUser = await api.updateUser(currentUser.id, data);
      setCurrentUser(updatedUser);
      alert('Profile updated successfully');
    } catch (err) {
      console.error('Profile update failed', err);
      alert(err.message || 'Unable to update profile');
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const { access_token } = await api.login(email, password);
      localStorage.setItem('access_token', access_token);
      const me = await api.getMe();
      setCurrentUser(me);
      const all = await api.getUsers();
      setUsers(all);
      // Fetch unread notifications count
      const notifications = await api.getNotifications();
      const unread = notifications.filter(n => !n.read).length;
      setUnreadNotifications(unread);
    } catch (err) {
      console.error('login failed', err);
      alert(err.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setCurrentUser(null);
    setUnreadNotifications(0);
  };

  const updateUnreadNotifications = async () => {
    if (currentUser) {
      try {
        const notifications = await api.getNotifications();
        const unread = notifications.filter(n => !n.read).length;
        setUnreadNotifications(unread);
      } catch (err) {
        console.error('Failed to update notifications', err);
      }
    }
  };

  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {currentUser && <Navbar currentUser={currentUser} onLogout={handleLogout} unreadNotifications={unreadNotifications} />}

        <Routes>
          <Route
            path="/login"
            element={
              currentUser ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
            }
          />

          <Route
            path="/"
            element={
              currentUser ? <Home currentUser={currentUser} users={users} /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/profile"
            element={
              currentUser ?
                <Profile currentUser={currentUser} updateUser={updateUserProfile} /> :
                <Navigate to="/login" />
            }
          />

          <Route
            path="/matching"
            element={
              currentUser ? <Matching currentUser={currentUser} /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/video-chat/:matchId"
            element={
              currentUser ? <VideoChat currentUser={currentUser} users={users} /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/progress"
            element={
              currentUser ? <Progress currentUser={currentUser} /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/notifications"
            element={
              currentUser ? <Notifications currentUser={currentUser} updateUnread={updateUnreadNotifications} /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
