import React, { useState, useEffect } from "react";
import { Bell, Check, X, CheckCircle, AlertTriangle, Info, Clock, Trash2 } from "lucide-react";
import { api } from "../api";

export default function Notifications({ currentUser, updateUnread }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await api.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error(err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
      if (updateUnread) updateUnread();
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.read);
    for (const n of unread) {
      await markAsRead(n.id);
    }
  };

  const getIconData = (type) => {
    switch (type) {
      case "success": return { icon: CheckCircle, color: "var(--secondary)", bg: "rgba(16,185,129,0.15)" };
      case "warning": return { icon: AlertTriangle, color: "var(--accent)", bg: "rgba(245,158,11,0.15)" };
      case "error": return { icon: X, color: "var(--danger)", bg: "rgba(244,63,94,0.15)" };
      default: return { icon: Info, color: "var(--primary-light)", bg: "rgba(99,102,241,0.15)" };
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="page-container-sm" style={styles.container}>
      <div className="section-header anim-fadeInUp">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={styles.headerIconWrap}>
            <Bell size={24} color="var(--primary-light)" />
            {unreadCount > 0 && <span style={styles.headerBadge} className="anim-scaleIn" />}
          </div>
          <div>
            <h1 className="section-title">Notifications</h1>
            <p className="section-subtitle">You have {unreadCount} unread messages.</p>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <button className="btn btn-ghost" onClick={markAllAsRead}>
            <Check size={16} /> Mark all read
          </button>
        )}
      </div>

      <div style={styles.list} className="anim-fadeInUp delay-1">
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div className="spinner" style={{ margin: "0 auto" }} />
          </div>
        ) : notifications.length === 0 ? (
          <div className="empty-state glass-card-static">
             <div className="empty-state-icon">
                <Bell size={32} color="var(--text-muted)" />
             </div>
             <h3>All caught up!</h3>
             <p style={{ marginTop: 8 }}>You don't have any new notifications right now.</p>
          </div>
        ) : (
          notifications.map((n, idx) => {
            const { icon: TypeIcon, color, bg } = getIconData(n?.type);
            
            return (
              <div 
                key={n?.id} 
                className={`glass-card ${!n.read ? 'unread-notification' : ''}`}
                style={{ ...styles.card, animationDelay: `${idx * 0.05}s`, borderColor: !n.read ? 'var(--primary)' : 'var(--glass-border)' }}
              >
                {!n.read && <div style={styles.unreadIndicator} />}
                
                <div style={{ ...styles.iconWrap, background: bg, color }}>
                  <TypeIcon size={20} />
                </div>
                
                <div style={styles.content}>
                  <h3 style={{ ...styles.title, color: !n.read ? '#fff' : 'var(--text-primary)' }}>
                    {n?.title || "Notification"}
                  </h3>
                  <p style={styles.message}>{n?.message}</p>
                  <p style={styles.time}>
                    <Clock size={12} /> {n?.createdAt ? new Date(n.createdAt).toLocaleString() : "Just now"}
                  </p>
                </div>

                {!n.read && (
                  <button className="btn btn-icon" onClick={() => markAsRead(n.id)} title="Mark as read">
                    <Check size={16} color="var(--secondary)" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .unread-notification {
          background: rgba(99,102,241,0.08) !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(99,102,241,0.2) !important;
        }
      `}} />
    </div>
  );
}

const styles = {
  container: { paddingBottom: 80 },
  headerIconWrap: { position: "relative", width: 48, height: 48, borderRadius: 14, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center" },
  headerBadge: { position: "absolute", top: -2, right: -2, width: 12, height: 12, background: "var(--danger)", borderRadius: "50%", border: "2px solid var(--bg-base)" },
  list: { display: "flex", flexDirection: "column", gap: 12 },
  card: { padding: 20, display: "flex", alignItems: "flex-start", gap: 16, position: "relative", overflow: "hidden" },
  unreadIndicator: { position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "var(--primary)", boxShadow: "0 0 10px var(--primary-glow)" },
  iconWrap: { width: 40, height: 40, flexShrink: 0, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
  content: { flex: 1, display: "flex", flexDirection: "column", gap: 4 },
  title: { fontSize: 15, fontWeight: 600, lineHeight: 1.3 },
  message: { fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 4 },
  time: { fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }
};