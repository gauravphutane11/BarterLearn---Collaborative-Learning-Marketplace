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
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px'
  },
  loginBox: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '40px',
    maxWidth: '420px',
    width: '100%',
    boxShadow: 'var(--shadow-lg)'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  logo: {
    fontSize: '64px',
    display: 'block',
    marginBottom: '16px'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: 'var(--text-dark)',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '16px',
    color: 'var(--text-medium)'
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
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    fontSize: '14px',
    backgroundColor: 'var(--bg-gray)'
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px',
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '10px',
    transition: 'all 0.2s'
  },
  buttonDisabled: {
    backgroundColor: 'var(--text-light)',
    cursor: 'not-allowed'
  },
  info: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: 'var(--bg-gray)',
    borderRadius: '8px'
  },
  infoText: {
    fontSize: '13px',
    color: 'var(--text-medium)',
    lineHeight: '1.5'
  }
};

export default Login;
