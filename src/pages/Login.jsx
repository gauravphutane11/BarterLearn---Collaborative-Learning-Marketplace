import React, { useState } from 'react';
import { LogIn } from 'lucide-react';

const Login = ({ onLogin, users }) => {
  const [selectedUser, setSelectedUser] = useState('');

  const handleLogin = () => {
    if (selectedUser) {
      onLogin(parseInt(selectedUser));
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <div style={styles.header}>
          <span style={styles.logo}>📚</span>
          <h1 style={styles.title}>BarterLearn</h1>
          <p style={styles.subtitle}>Collaborative Learning Marketplace</p>
        </div>

        <div style={styles.form}>
          <label style={styles.label}>Select User (Demo)</label>
          <select 
            value={selectedUser} 
            onChange={(e) => setSelectedUser(e.target.value)}
            style={styles.select}
          >
            <option value="">Choose a user...</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.avatar} {user.name}
              </option>
            ))}
          </select>

          <button 
            onClick={handleLogin} 
            disabled={!selectedUser}
            style={{
              ...styles.button,
              ...(selectedUser ? {} : styles.buttonDisabled)
            }}
          >
            <LogIn size={20} />
            <span>Login</span>
          </button>
        </div>

        <div style={styles.info}>
          <p style={styles.infoText}>
            ℹ️ This is a prototype demo. Select any user to explore the platform.
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden'
  },
  loginBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '40px',
    maxWidth: '420px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    animation: 'slideInUp 0.6s ease-out',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    animation: 'fadeIn 1s ease-out'
  },
  logo: {
    fontSize: '64px',
    display: 'block',
    marginBottom: '16px',
    animation: 'float 3s ease-in-out infinite'
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '8px',
    animation: 'slideInUp 0.8s ease-out'
  },
  subtitle: {
    fontSize: '16px',
    color: 'var(--text-medium)',
    animation: 'slideInUp 1s ease-out'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-dark)',
    marginBottom: '4px'
  },
  select: {
    padding: '14px',
    borderRadius: '12px',
    border: '2px solid var(--border-color)',
    fontSize: '14px',
    backgroundColor: 'white',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '10px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    cursor: 'pointer'
  },
  buttonDisabled: {
    background: 'var(--text-light)',
    cursor: 'not-allowed',
    boxShadow: 'none'
  },
  info: {
    marginTop: '24px',
    padding: '16px',
    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    borderRadius: '12px',
    animation: 'slideInUp 1.2s ease-out'
  },
  infoText: {
    fontSize: '13px',
    color: '#92400e',
    lineHeight: '1.5'
  }
};

export default Login;
