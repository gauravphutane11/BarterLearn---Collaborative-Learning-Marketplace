import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Matching from './pages/Matching';
import VideoChat from './pages/VideoChat';
import Progress from './pages/Progress';
import Login from './pages/Login';
import { mockUsers } from './data/mockData';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(mockUsers);

  const handleLogin = (userId) => {
    const user = users.find(u => u.id === userId);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const updateUserProfile = (updatedUser) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
  };

  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {currentUser && <Navbar currentUser={currentUser} onLogout={handleLogout} />}
        
        <Routes>
          <Route 
            path="/login" 
            element={
              currentUser ? <Navigate to="/" /> : <Login onLogin={handleLogin} users={users} />
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
              currentUser ? <Matching currentUser={currentUser} users={users} /> : <Navigate to="/login" />
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
