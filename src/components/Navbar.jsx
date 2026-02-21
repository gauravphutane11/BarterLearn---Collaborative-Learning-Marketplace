import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Users, Video, TrendingUp, LogOut } from 'lucide-react';

const Navbar = ({ currentUser, onLogout }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/matching', icon: Users, label: 'Match' },
    { path: '/progress', icon: TrendingUp, label: 'Progress' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <div style={styles.brand}>
          <span style={styles.logo}>📚</span>
          <span style={styles.brandName}>BarterLearn</span>
        </div>

        <div style={styles.navLinks}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.navLink,
                ...(isActive(item.path) ? styles.navLinkActive : {})
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div style={styles.userSection}>
          <span style={styles.avatar}>{currentUser.avatar}</span>
          <span style={styles.userName}>{currentUser.name}</span>
          <button 
            onClick={onLogout} 
            style={styles.logoutBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fee2e2';
              e.currentTarget.style.color = '#ef4444';
              e.currentTarget.style.transform = 'rotate(-10deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-medium)';
              e.currentTarget.style.transform = 'rotate(0deg)';
            }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: 'bold',
    fontSize: '22px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  logo: {
    fontSize: '32px',
    animation: 'float 3s ease-in-out infinite'
  },
  brandName: {
    display: 'inline-block'
  },
  navLinks: {
    display: 'flex',
    gap: '8px',
    flex: 1,
    justifyContent: 'center'
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 18px',
    borderRadius: '12px',
    color: 'var(--text-medium)',
    transition: 'all 0.3s ease',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  navLinkActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  avatar: {
    fontSize: '28px',
    animation: 'pulse 3s ease-in-out infinite'
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-dark)'
  },
  logoutBtn: {
    padding: '10px',
    borderRadius: '10px',
    backgroundColor: 'transparent',
    color: 'var(--text-medium)',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  }
};

export default Navbar;
