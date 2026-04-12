import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, User, Users, TrendingUp, Bell, LogOut } from "lucide-react";

const Navbar = ({ currentUser, onLogout, unreadNotifications = 0 }) => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/profile", icon: User, label: "Profile" },
    { path: "/matching", icon: Users, label: "Match" },
    { path: "/progress", icon: TrendingUp, label: "Progress" },
    {
      path: "/notifications",
      icon: Bell,
      label: "Notifications",
      badge: unreadNotifications
    }
  ];

  const isActive = (path) => location.pathname === path;

  const avatar = currentUser?.avatar || "🙂";
  const name = currentUser?.name || "User";

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        {/* Brand */}
        <Link to="/" style={styles.brand}>
          <span style={styles.logo}>📚</span>
          <span style={styles.brandName}>BarterLearn</span>
        </Link>

        {/* Navigation */}
        <div style={styles.navLinks}>
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  ...styles.navLink,
                  ...(isActive(item.path) ? styles.navLinkActive : {})
                }}
              >
                <Icon size={18} />

                <span>{item.label}</span>

                {item.badge > 0 && (
                  <span style={styles.badge}>{item.badge}</span>
                )}
              </Link>
            );
          })}
        </div>

        {/* User Section */}
        <div style={styles.userSection}>
          <span style={styles.avatar}>{avatar}</span>

          <span style={styles.userName}>{name}</span>

          <button onClick={onLogout} style={styles.logoutBtn}>
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(0,0,0,0.05)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 1000
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "64px"
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "700",
    fontSize: "20px",
    textDecoration: "none",
    background: "linear-gradient(135deg,#667eea,#764ba2)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },

  logo: {
    fontSize: "26px"
  },

  brandName: {
    fontWeight: "700"
  },

  navLinks: {
    display: "flex",
    gap: "10px",
    flex: 1,
    justifyContent: "center"
  },

  navLink: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "10px 16px",
    borderRadius: "10px",
    color: "#444",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.25s ease"
  },

  navLinkActive: {
    background: "linear-gradient(135deg,#667eea,#764ba2)",
    color: "#fff",
    boxShadow: "0 4px 12px rgba(102,126,234,0.4)"
  },

  badge: {
    background: "#ef4444",
    color: "white",
    borderRadius: "10px",
    padding: "2px 6px",
    fontSize: "10px",
    fontWeight: "bold",
    marginLeft: "4px"
  },

  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },

  avatar: {
    fontSize: "24px"
  },

  userName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333"
  },

  logoutBtn: {
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "#555",
    transition: "all 0.2s ease"
  }
};

export default Navbar;