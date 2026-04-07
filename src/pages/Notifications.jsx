import React, { useState, useEffect } from 'react';
import { Bell, Check, X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { api } from '../api';

const Notifications = ({ currentUser, updateUnread }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ));
      if (updateUnread) updateUnread();
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.read);
    for (const n of unread) {
      await markAsRead(n.id);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle color="#10b981" size={20} />;
      case 'warning': return <AlertTriangle color="#f59e0b" size={20} />;
      case 'error': return <X color="#ef4444" size={20} />;
      default: return <Info color="#3b82f6" size={20} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading notifications...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <Bell size={24} />
          <h1 style={styles.title}>Notifications</h1>
          {unreadCount > 0 && (
            <span style={styles.badge}>{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} style={styles.markAllBtn}>
            Mark All Read
          </button>
        )}
      </div>

      <div style={styles.notificationsList}>
        {notifications.length === 0 ? (
          <div style={styles.empty}>
            <Bell size={48} color="#9ca3af" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              style={{
                ...styles.notification,
                ...(notification.read ? {} : styles.unread)
              }}
            >
              <div style={styles.notificationIcon}>
                {getIcon(notification.type)}
              </div>
              <div style={styles.notificationContent}>
                <h3 style={styles.notificationTitle}>{notification.title}</h3>
                <p style={styles.notificationMessage}>{notification.message}</p>
                <span style={styles.notificationTime}>
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
              </div>
              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  style={styles.markReadBtn}
                  title="Mark as read"
                >
                  <Check size={16} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    background: 'var(--bg-white)',
    minHeight: '100vh'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '1px solid var(--border-color)'
  },
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'var(--text-dark)',
    margin: 0
  },
  badge: {
    background: '#ef4444',
    color: 'white',
    borderRadius: '12px',
    padding: '2px 8px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  markAllBtn: {
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background 0.2s'
  },
  notificationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  notification: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '15px',
    padding: '20px',
    background: 'var(--bg-slate)',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    transition: 'box-shadow 0.2s'
  },
  unread: {
    borderLeft: '4px solid #3b82f6',
    background: 'rgba(59, 130, 246, 0.05)'
  },
  notificationIcon: {
    flexShrink: 0,
    marginTop: '2px'
  },
  notificationContent: {
    flex: 1
  },
  notificationTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--text-dark)',
    margin: '0 0 5px 0'
  },
  notificationMessage: {
    fontSize: '14px',
    color: 'var(--text-medium)',
    margin: '0 0 10px 0',
    lineHeight: '1.4'
  },
  notificationTime: {
    fontSize: '12px',
    color: 'var(--text-light)',
    fontStyle: 'italic'
  },
  markReadBtn: {
    background: 'transparent',
    border: '1px solid #10b981',
    color: '#10b981',
    padding: '4px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
    color: 'var(--text-light)'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: 'var(--text-medium)'
  }
};

export default Notifications;