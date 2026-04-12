import React, { useState, useEffect } from "react";
import { Bell, Check, X, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { api } from "../api";

const Notifications = ({ currentUser, updateUnread }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error("Failed to load notifications", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.markNotificationRead(id);

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );

      if (updateUnread) updateUnread();
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.read);

    for (const n of unread) {
      await markAsRead(n.id);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle color="#10b981" size={20} />;

      case "warning":
        return <AlertTriangle color="#f59e0b" size={20} />;

      case "error":
        return <X color="#ef4444" size={20} />;

      default:
        return <Info color="#3b82f6" size={20} />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatDate = (date) => {
    if (!date) return "Unknown time";

    try {
      return new Date(date).toLocaleString();
    } catch {
      return "Unknown time";
    }
  };

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
          notifications.map((notification) => (
            <div
              key={notification?.id}
              style={{
                ...styles.notification,
                ...(notification?.read ? {} : styles.unread)
              }}
            >
              <div style={styles.notificationIcon}>
                {getIcon(notification?.type)}
              </div>

              <div style={styles.notificationContent}>
                <h3 style={styles.notificationTitle}>
                  {notification?.title || "Notification"}
                </h3>

                <p style={styles.notificationMessage}>
                  {notification?.message || ""}
                </p>

                <span style={styles.notificationTime}>
                  {formatDate(notification?.createdAt)}
                </span>
              </div>

              {!notification?.read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  style={styles.markReadBtn}
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
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    minHeight: "100vh"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "15px"
  },

  titleSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },

  title: {
    fontSize: "24px",
    fontWeight: "700"
  },

  badge: {
    background: "#ef4444",
    color: "white",
    borderRadius: "10px",
    padding: "2px 8px",
    fontSize: "12px",
    fontWeight: "600"
  },

  markAllBtn: {
    background: "#6366f1",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  notificationsList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px"
  },

  notification: {
    display: "flex",
    gap: "14px",
    padding: "16px",
    borderRadius: "8px",
    background: "#f9fafb",
    border: "1px solid #e5e7eb"
  },

  unread: {
    borderLeft: "4px solid #6366f1",
    background: "#eef2ff"
  },

  notificationIcon: {
    marginTop: "4px"
  },

  notificationContent: {
    flex: 1
  },

  notificationTitle: {
    fontSize: "15px",
    fontWeight: "600"
  },

  notificationMessage: {
    fontSize: "14px",
    marginTop: "4px",
    marginBottom: "6px"
  },

  notificationTime: {
    fontSize: "12px",
    opacity: 0.6
  },

  markReadBtn: {
    background: "transparent",
    border: "1px solid #10b981",
    color: "#10b981",
    padding: "4px",
    borderRadius: "4px",
    cursor: "pointer"
  },

  empty: {
    textAlign: "center",
    padding: "60px"
  },

  loading: {
    textAlign: "center",
    padding: "40px"
  }
};

export default Notifications;