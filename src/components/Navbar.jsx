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
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div style={styles.userSection}>
          <span style={styles.avatar}>{currentUser.avatar}</span>
          <span style={styles.userName}>{currentUser.name}</span>
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
    backgroundColor: 'var(--bg-white)',
    borderBottom: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow)',
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
    fontSize: '20px',
    color: 'var(--primary-color)'
  },
  logo: {
    fontSize: '28px'
  },
  brandName: {
    display: 'inline-block'
  },
  navLinks: {
    display: 'flex',
    gap: '10px',
    flex: 1,
    justifyContent: 'center'
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '8px',
    color: 'var(--text-medium)',
    transition: 'all 0.2s',
    fontSize: '14px',
    fontWeight: '500'
  },
  navLinkActive: {
    backgroundColor: 'var(--primary-color)',
    color: 'white'
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  avatar: {
    fontSize: '24px'
  },
  userName: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--text-dark)'
  },
  logoutBtn: {
    padding: '8px',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    color: 'var(--text-medium)',
    transition: 'all 0.2s'
  }
};

export default Navbar;
