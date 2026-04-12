import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  CheckCircle,
  Clock,
  Star,
  BookOpen
} from "lucide-react";
import { api } from "../api";

const Progress = ({ currentUser = {} }) => {

  const [activeTab, setActiveTab] = useState("active");
  const [exchanges, setExchanges] = useState([]);

  useEffect(() => {
    fetchExchanges();
  }, []);

  const fetchExchanges = async () => {
    try {

      const data = await api.getExchanges();

      setExchanges(data || []);

    } catch (err) {

      console.error("error fetching exchanges", err);
      setExchanges([]);

    }
  };

  const handleLogSession = async (exchange) => {

    try {

      const completed = exchange?.sessionsCompleted || 0;
      const total = exchange?.totalSessions || 0;

      const nextCount = Math.min(completed + 1, total);

      if (nextCount === completed) return;

      const res = await api.updateExchange(exchange.id, {
        sessions_completed: nextCount
      });

      setExchanges(prev =>
        prev.map(e => (e.id === res.id ? res : e))
      );

    } catch (err) {

      console.error("failed to log session", err);
      alert("Failed to log session");

    }
  };

  const handleCompleteExchange = async (exchange) => {

    const rating = prompt("Please rate this exchange (1-5):", "5");

    if (rating === null) return;

    const ratingNum = parseInt(rating);

    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      alert("Please enter a valid rating between 1 and 5");
      return;
    }

    try {

      const res = await api.updateExchange(exchange.id, {
        status: "completed",
        rating: ratingNum
      });

      setExchanges(prev =>
        prev.map(e => (e.id === res.id ? res : e))
      );

      alert("Exchange marked as completed 🎉");

    } catch (err) {

      console.error("failed to complete exchange", err);
      alert("Failed to complete exchange");

    }
  };

  const activeExchanges = exchanges.filter(
    e =>
      e?.status === "active" &&
      (e?.userId === currentUser?.id || e?.partnerId === currentUser?.id)
  );

  const completedExchanges = exchanges.filter(
    e =>
      e?.status === "completed" &&
      (e?.userId === currentUser?.id || e?.partnerId === currentUser?.id)
  );

  const stats = [

    {
      icon: BookOpen,
      label: "Active Exchanges",
      value: activeExchanges.length,
      color: "#6366f1"
    },

    {
      icon: CheckCircle,
      label: "Completed",
      value: completedExchanges.length,
      color: "#10b981"
    },

    {
      icon: Clock,
      label: "Total Sessions",
      value: exchanges.reduce(
        (acc, e) => acc + (e?.sessionsCompleted || 0),
        0
      ),
      color: "#f59e0b"
    },

    {
      icon: Star,
      label: "Avg Rating",
      value: currentUser?.rating || 0,
      color: "#ef4444"
    }

  ];

  const calculateProgress = (completed, total) => {

    if (!total) return 0;

    return Math.round((completed / total) * 100);

  };

  return (

    <div style={styles.container}>

      <div style={styles.header}>
        <h1 style={styles.title}>Learning Progress</h1>
        <p style={styles.subtitle}>
          Track your skill exchanges and achievements
        </p>
      </div>

      <div style={styles.statsGrid}>

        {stats.map((stat, index) => {

          const Icon = stat.icon;

          return (

            <div key={index} style={styles.statCard}>

              <div
                style={{
                  ...styles.statIcon,
                  backgroundColor: stat.color + "20",
                  color: stat.color
                }}
              >
                <Icon size={24} />
              </div>

              <div>
                <p style={styles.statValue}>{stat.value}</p>
                <p style={styles.statLabel}>{stat.label}</p>
              </div>

            </div>

          );

        })}

      </div>

      <div style={styles.tabs}>

        <button
          onClick={() => setActiveTab("active")}
          style={{
            ...styles.tab,
            ...(activeTab === "active" ? styles.tabActive : {})
          }}
        >
          Active ({activeExchanges.length})
        </button>

        <button
          onClick={() => setActiveTab("completed")}
          style={{
            ...styles.tab,
            ...(activeTab === "completed" ? styles.tabActive : {})
          }}
        >
          Completed ({completedExchanges.length})
        </button>

      </div>

      <div style={styles.content}>

        {(activeTab === "active"
          ? activeExchanges
          : completedExchanges
        ).length === 0 ? (

          <div style={styles.empty}>
            <BookOpen size={48} />
            <p>No exchanges yet</p>
          </div>

        ) : (

          (activeTab === "active"
            ? activeExchanges
            : completedExchanges
          ).map(exchange => (

            <div key={exchange.id} style={styles.exchangeCard}>

              <h3>Exchange #{exchange.id}</h3>

              <p>
                Learn: <b>{exchange?.partnerSkill}</b>
              </p>

              <p>
                Teach: <b>{exchange?.skill}</b>
              </p>

              <p>
                Sessions: {exchange?.sessionsCompleted || 0}/
                {exchange?.totalSessions || 0}
              </p>

              {activeTab === "active" && (

                <div style={styles.actions}>

                  <button
                    onClick={() => handleLogSession(exchange)}
                    style={styles.primaryBtn}
                  >
                    Log Session
                  </button>

                  <button
                    onClick={() => handleCompleteExchange(exchange)}
                    style={styles.secondaryBtn}
                  >
                    Complete
                  </button>

                </div>

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
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "40px 20px"
  },

  header: {
    marginBottom: "30px"
  },

  title: {
    fontSize: "30px",
    fontWeight: "700"
  },

  subtitle: {
    opacity: 0.7
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
    gap: "20px",
    marginBottom: "30px"
  },

  statCard: {
    display: "flex",
    gap: "14px",
    background: "white",
    padding: "20px",
    borderRadius: "10px"
  },

  statIcon: {
    padding: "10px",
    borderRadius: "10px"
  },

  statValue: {
    fontSize: "22px",
    fontWeight: "700"
  },

  statLabel: {
    fontSize: "13px"
  },

  tabs: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px"
  },

  tab: {
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  tabActive: {
    background: "#6366f1",
    color: "white"
  },

  content: {
    display: "flex",
    flexDirection: "column",
    gap: "14px"
  },

  exchangeCard: {
    background: "white",
    padding: "20px",
    borderRadius: "10px"
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "10px"
  },

  primaryBtn: {
    background: "#6366f1",
    color: "white",
    padding: "8px 14px",
    borderRadius: "6px"
  },

  secondaryBtn: {
    padding: "8px 14px",
    borderRadius: "6px"
  },

  empty: {
    textAlign: "center",
    padding: "40px"
  }

};

export default Progress;