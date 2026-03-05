import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Matching from './pages/Matching';
import VideoChat from './pages/VideoChat';
import Progress from './pages/Progress';
import Login from './pages/Login';
import { api } from './api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);

  const handleLogin = async (email, password) => {
    try {
      const { access_token } = await api.login(email, password);
      localStorage.setItem('access_token', access_token);
      const me = await api.getMe();
      setCurrentUser(me);
      const all = await api.getUsers();
      setUsers(all);
    } catch (err) {
      console.error('login failed', err);
      alert(err.msg || 'Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setCurrentUser(null);
  };

  const updateUserProfile = async (updatedUser) => {
    try {
      const res = await api.updateUser(updatedUser.id, updatedUser);
      setUsers(users.map(u => u.id === res.id ? res : u));
      setCurrentUser(res);
    } catch (err) {
      console.error('update failed', err);
      alert(err.msg || 'Update failed');
    }
  };

  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {currentUser && <Navbar currentUser={currentUser} onLogout={handleLogout} />}

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
