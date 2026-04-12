import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./styles/global.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Matching from "./pages/Matching";
import VideoChat from "./pages/VideoChat";
import Progress from "./pages/Progress";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";

import { api } from "./api";

function App() {

  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [loading, setLoading] = useState(true);


  // AUTO LOGIN
  useEffect(() => {

    const initAuth = async () => {

      const token = localStorage.getItem("access_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {

        const me = await api.getMe();
        setCurrentUser(me);

        const allUsers = await api.getUsers();
        setUsers(allUsers);

        const notifications = await api.getNotifications();
        const unread = notifications.filter(n => !n.read).length;
        setUnreadNotifications(unread);

      } catch (err) {

        console.error("Auth failed", err);
        localStorage.removeItem("access_token");

      }

      setLoading(false);

    };

    initAuth();

  }, []);



  // PROFILE UPDATE
  const updateUserProfile = async (data) => {

    try {

      const updatedUser = await api.updateUser(data);

      setCurrentUser(updatedUser);

      alert("Profile updated successfully");

    } catch (err) {

      console.error("Profile update failed", err);
      alert(err.message || "Unable to update profile");

    }

  };



  // LOGIN
  const handleLogin = async (email, password) => {

    try {

      const { access_token } = await api.login(email, password);

      localStorage.setItem("access_token", access_token);

      const me = await api.getMe();
      setCurrentUser(me);

      const allUsers = await api.getUsers();
      setUsers(allUsers);

      const notifications = await api.getNotifications();
      const unread = notifications.filter(n => !n.read).length;

      setUnreadNotifications(unread);

    } catch (err) {

      console.error("Login failed", err);
      alert(err.message || "Login failed");

    }

  };



  // LOGOUT
  const handleLogout = () => {

    localStorage.removeItem("access_token");

    setCurrentUser(null);
    setUsers([]);
    setUnreadNotifications(0);

  };



  // UPDATE NOTIFICATIONS
  const updateUnreadNotifications = async () => {

    if (!currentUser) return;

    try {

      const notifications = await api.getNotifications();
      const unread = notifications.filter(n => !n.read).length;

      setUnreadNotifications(unread);

    } catch (err) {

      console.error("Failed to update notifications", err);

    }

  };



  // LOADING SCREEN
  if (loading) {

    return (

      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg,#1e3c72,#2a5298)",
          color: "white",
          fontSize: "22px",
          fontWeight: "bold"
        }}
      >
        Loading BarterLearn...
      </div>

    );

  }



  return (

    <Router>

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg,#1e3c72,#2a5298)"
        }}
      >

        {currentUser && (
          <Navbar
            currentUser={currentUser}
            onLogout={handleLogout}
            unreadNotifications={unreadNotifications}
          />
        )}



        <Routes>

          <Route
            path="/login"
            element={
              currentUser
                ? <Navigate to="/" />
                : <Login onLogin={handleLogin} />
            }
          />



          <Route
            path="/"
            element={
              currentUser
                ? <Home currentUser={currentUser} users={users} />
                : <Navigate to="/login" />
            }
          />



          <Route
            path="/profile"
            element={
              currentUser
                ? <Profile currentUser={currentUser} updateUser={updateUserProfile} />
                : <Navigate to="/login" />
            }
          />



          <Route
            path="/matching"
            element={
              currentUser
                ? <Matching currentUser={currentUser} />
                : <Navigate to="/login" />
            }
          />



          <Route
            path="/video-chat/:matchId"
            element={
              currentUser
                ? <VideoChat currentUser={currentUser} users={users} />
                : <Navigate to="/login" />
            }
          />



          <Route
            path="/progress"
            element={
              currentUser
                ? <Progress currentUser={currentUser} />
                : <Navigate to="/login" />
            }
          />



          <Route
            path="/notifications"
            element={
              currentUser
                ? (
                  <Notifications
                    currentUser={currentUser}
                    updateUnread={updateUnreadNotifications}
                  />
                )
                : <Navigate to="/login" />
            }
          />

        </Routes>

      </div>

    </Router>

  );

}

export default App;