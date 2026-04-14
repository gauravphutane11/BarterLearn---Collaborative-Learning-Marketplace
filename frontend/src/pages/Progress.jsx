import React, { useState, useEffect } from "react";
import { TrendingUp, CheckCircle, Clock, Star, BookOpen, PlayCircle, Loader2 } from "lucide-react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

export default function Progress({ currentUser = {} }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExchanges();
  }, []);

  const fetchExchanges = async () => {
    try {
      setLoading(true);
      const data = await api.getExchanges();
      setExchanges(data || []);
    } catch (err) {
      console.error(err);
      setExchanges([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogSession = async (exchange) => {
    try {
      const completed = exchange?.sessionsCompleted || 0;
      const total = exchange?.totalSessions || 0;
      const nextCount = Math.min(completed + 1, total);

      if (nextCount === completed) return;

      const res = await api.updateExchange(exchange.id, { sessions_completed: nextCount });
      setExchanges(prev => prev.map(e => (e.id === res.id ? res : e)));
    } catch (err) {
      console.error(err);
      alert("Failed to log session");
    }
  };

  const handleCompleteExchange = async (exchange) => {
    const rating = prompt("Please rate this exchange (1-5):", "5");
    if (rating === null) return;
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return alert("Please enter a valid rating between 1 and 5");
    }

    try {
      const res = await api.updateExchange(exchange.id, { status: "completed", rating: ratingNum });
      setExchanges(prev => prev.map(e => (e.id === res.id ? res : e)));
    } catch (err) {
      console.error(err);
      alert("Failed to complete exchange");
    }
  };

  const activeExchanges = exchanges.filter(e => e?.status === "active" && (e?.userId === currentUser?.id || e?.partnerId === currentUser?.id));
  const completedExchanges = exchanges.filter(e => e?.status === "completed" && (e?.userId === currentUser?.id || e?.partnerId === currentUser?.id));
  
  const totalSessions = exchanges.reduce((acc, e) => acc + (e?.sessionsCompleted || 0), 0);

  const stats = [
    { icon: BookOpen, label: "Active", value: activeExchanges.length, color: "var(--primary-light)" },
    { icon: CheckCircle, label: "Completed", value: completedExchanges.length, color: "var(--secondary-light)" },
    { icon: Clock, label: "Sessions", value: totalSessions, color: "var(--accent)" },
    { icon: Star, label: "Rating", value: currentUser?.rating || 0, color: "var(--danger)" }
  ];

  const displayedList = activeTab === "active" ? activeExchanges : completedExchanges;

  return (
    <div className="page-container-sm" style={styles.container}>
      <div className="section-header anim-fadeInUp">
        <div>
          <h1 className="section-title">My Progress</h1>
          <p className="section-subtitle">Track your learning journey and active exchanges.</p>
        </div>
      </div>

      {/* STATS ROW */}
      <div style={styles.statsGrid} className="anim-fadeInUp delay-1">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-card-static" style={styles.statCard}>
              <div style={{...styles.statIconWrap, background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)`, color: stat.color, border: `1px solid ${stat.color}30`}}>
                <Icon size={22} />
              </div>
              <div>
                <p className="stat-value" style={{ fontSize: 24 }}>{stat.value}</p>
                <p className="stat-label">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* TABS */}
      <div style={styles.tabs} className="anim-fadeInUp delay-2">
        <button
          style={{ ...styles.tab, ...(activeTab === "active" ? styles.tabActive : {}) }}
          onClick={() => setActiveTab("active")}
        >
          Active Exchanges
          <span className="badge" style={{ background: activeTab === 'active' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)', color: '#fff', marginLeft: 8 }}>{activeExchanges.length}</span>
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === "completed" ? styles.tabActive : {}) }}
          onClick={() => setActiveTab("completed")}
        >
          History
          <span className="badge" style={{ background: activeTab === 'completed' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)', color: '#fff', marginLeft: 8 }}>{completedExchanges.length}</span>
        </button>
      </div>

      {/* LIST */}
      <div style={styles.list} className="anim-fadeInUp delay-3">
        {loading ? (
          <div style={styles.centerBox}><Loader2 size={32} className="anim-spin" color="var(--primary)" /></div>
        ) : displayedList.length === 0 ? (
          <div className="empty-state glass-card-static">
             <div className="empty-state-icon">
                {activeTab === 'active' ? <BookOpen size={32} color="var(--text-muted)" /> : <CheckCircle size={32} color="var(--text-muted)" />}
             </div>
             <h3>No {activeTab} exchanges</h3>
             <p style={{ marginTop: 8 }}>{activeTab === 'active' ? "You don't have any ongoing skill exchanges right now." : "You haven't completed any exchanges yet."}</p>
             {activeTab === 'active' && (
                <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => navigate('/matching')}>Find a Partner</button>
             )}
          </div>
        ) : (
          displayedList.map((exchange, idx) => {
            const completed = exchange?.sessionsCompleted || 0;
            const total = exchange?.totalSessions || 5;
            const progressPercent = Math.round((completed / total) * 100);
            
            return (
              <div key={exchange.id} className="glass-card" style={{ ...styles.exchangeCard, animationDelay: `${idx * 0.05}s` }}>
                <div style={styles.exTop}>
                  <div>
                    <div style={styles.exId}>Exchange #{exchange.id}</div>
                    <h3 style={styles.exTitle}>Learning <span className="text-secondary">{exchange?.partnerSkill}</span></h3>
                    <p style={styles.exSubtitle}>Teaching {exchange?.skill}</p>
                  </div>
                  {activeTab === "active" ? (
                      <span className="badge badge-warning">Active</span>
                  ) : (
                      <span className="badge badge-success"><CheckCircle size={10}/> Completed</span>
                  )}
                </div>

                <div style={styles.progressSection}>
                  <div style={styles.progressHeader}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Session Progress</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{completed} / {total}</span>
                  </div>
                  <div className="progress-track">
                    <div className={`progress-fill ${activeTab === 'completed' ? 'progress-fill-green' : ''}`} style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>

                {activeTab === "active" && (
                  <div style={styles.actions}>
                    <button className="btn btn-primary" onClick={() => navigate(`/video-chat/${exchange.partnerId || 1}`)}>
                      <PlayCircle size={16} /> Join Video Session
                    </button>
                    <button className="btn btn-ghost" onClick={() => handleLogSession(exchange)}>
                      Log 1 Session
                    </button>
                    {completed >= total && (
                      <button className="btn btn-success" onClick={() => handleCompleteExchange(exchange)}>
                        Mark Completed
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { paddingBottom: 80 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 40 },
  statCard: { display: "flex", alignItems: "center", gap: 16, padding: 20 },
  statIconWrap: { width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" },
  tabs: { display: "flex", gap: 8, marginBottom: 24, padding: 6, background: "rgba(0,0,0,0.3)", borderRadius: 14, border: "1px solid var(--border)", width: "fit-content" },
  tab: { padding: "10px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", background: "transparent", transition: "all 0.2s", display: "flex", alignItems: "center" },
  tabActive: { background: "rgba(255,255,255,0.1)", color: "#fff", boxShadow: "0 2px 10px rgba(0,0,0,0.2)" },
  list: { display: "flex", flexDirection: "column", gap: 16 },
  centerBox: { display: "flex", justifyContent: "center", padding: "100px 0" },
  exchangeCard: { padding: 24, display: "flex", flexDirection: "column", gap: 20 },
  exTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  exId: { fontSize: 12, fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 },
  exTitle: { fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 4 },
  exSubtitle: { fontSize: 14, color: "var(--text-secondary)" },
  progressSection: { background: "rgba(0,0,0,0.2)", padding: 16, borderRadius: 12, border: "1px solid var(--border)" },
  progressHeader: { display: "flex", justifyContent: "space-between", marginBottom: 12 },
  actions: { display: "flex", gap: 12, flexWrap: "wrap", marginTop: 4, paddingTop: 20, borderTop: "1px solid var(--border)" }
};