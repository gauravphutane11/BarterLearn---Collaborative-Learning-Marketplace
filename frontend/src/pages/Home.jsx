import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Video,
  TrendingUp,
  Award,
  ArrowRight,
  MessageSquare,
  Zap
} from "lucide-react";

const Home = ({ currentUser = {}, users = [] }) => {
  const navigate = useNavigate();

  const stats = [
    {
      icon: Users,
      label: "Active Matches",
      value: currentUser?.activeMatches?.length || 0,
      color: "#6366f1"
    },
    {
      icon: Video,
      label: "Sessions This Month",
      value: 8,
      color: "#10b981"
    },
    {
      icon: TrendingUp,
      label: "Completed Exchanges",
      value: currentUser?.completedExchanges || 0,
      color: "#f59e0b"
    },
    {
      icon: Award,
      label: "Rating",
      value: `${currentUser?.rating || 0} ⭐`,
      color: "#f43f5e"
    }
  ];

  const steps = [
    {
      icon: Users,
      title: "Find a Partner",
      desc: "Browse users who want what you teach."
    },
    {
      icon: MessageSquare,
      title: "Connect & Chat",
      desc: "Discuss your learning goals and schedule."
    },
    {
      icon: Zap,
      title: "Learn & Teach",
      desc: "Jump into a video session and start trading."
    }
  ];

  const suggestedMatches =
    users?.filter((u) => u?.id !== currentUser?.id)?.slice(0, 3) || [];

  return (
    <div style={styles.container}>
      {/* HERO */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Master New Skills through Collaboration
          </h1>

          <p style={styles.heroSubtitle}>
            Teach what you know and learn what you don't with the BarterLearn
            skill exchange platform.
          </p>

          <div style={styles.heroActions}>
            <button
              style={styles.primaryBtn}
              onClick={() => navigate("/matching")}
            >
              Explore Matches <ArrowRight size={18} />
            </button>

            <button
              style={styles.secondaryBtn}
              onClick={() => navigate("/profile")}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </section>

      {/* STATS */}
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
                <Icon size={22} />
              </div>

              <div>
                <p style={styles.statValue}>{stat.value}</p>
                <p style={styles.statLabel}>{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* HOW IT WORKS */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>How BarterLearn Works</h2>

        <div style={styles.stepsGrid}>
          {steps.map((step, i) => {
            const Icon = step.icon;

            return (
              <div key={i} style={styles.stepCard}>
                <div style={styles.stepIcon}>
                  <Icon size={30} color="#6366f1" />
                </div>

                <h3 style={styles.stepTitle}>{step.title}</h3>

                <p style={styles.stepDesc}>{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* MATCH PREVIEW */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Suggested Matches</h2>

          <button
            style={styles.textBtn}
            onClick={() => navigate("/matching")}
          >
            View All
          </button>
        </div>

        {suggestedMatches.length === 0 ? (
          <p style={{ textAlign: "center", opacity: 0.7 }}>
            No matches available yet.
          </p>
        ) : (
          <div style={styles.matchList}>
            {suggestedMatches.map((user) => (
              <div key={user?.id} style={styles.matchItem}>
                <div style={styles.matchInfo}>
                  <span style={styles.matchAvatar}>
                    {user?.avatar || "🙂"}
                  </span>

                  <div>
                    <p style={styles.matchName}>{user?.name || "User"}</p>

                    <p style={styles.matchSkills}>
                      Offers: {(user?.skillsOffered || []).join(", ")}
                    </p>
                  </div>
                </div>

                <button
                  style={styles.matchActionBtn}
                  onClick={() => navigate("/matching")}
                >
                  Connect
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px"
  },

  heroSection: {
    textAlign: "center",
    padding: "60px 0"
  },

  heroTitle: {
    fontSize: "40px",
    fontWeight: "800",
    marginBottom: "16px"
  },

  heroSubtitle: {
    fontSize: "18px",
    opacity: 0.8,
    marginBottom: "30px"
  },

  heroActions: {
    display: "flex",
    justifyContent: "center",
    gap: "16px"
  },

  primaryBtn: {
    padding: "12px 24px",
    background: "#6366f1",
    color: "white",
    borderRadius: "10px",
    cursor: "pointer"
  },

  secondaryBtn: {
    padding: "12px 24px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    cursor: "pointer"
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
    gap: "20px",
    marginBottom: "60px"
  },

  statCard: {
    display: "flex",
    gap: "16px",
    padding: "20px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.04)"
  },

  statIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  statValue: {
    fontSize: "22px",
    fontWeight: "700"
  },

  statLabel: {
    fontSize: "13px",
    opacity: 0.7
  },

  section: {
    marginBottom: "60px"
  },

  sectionTitle: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "20px"
  },

  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
    gap: "20px"
  },

  stepCard: {
    padding: "30px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.04)",
    textAlign: "center"
  },

  stepIcon: {
    marginBottom: "16px"
  },

  stepTitle: {
    fontWeight: "600",
    marginBottom: "10px"
  },

  stepDesc: {
    opacity: 0.7
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px"
  },

  textBtn: {
    cursor: "pointer",
    color: "#6366f1",
    fontWeight: "600"
  },

  matchList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  matchItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "14px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.04)"
  },

  matchInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },

  matchAvatar: {
    fontSize: "28px"
  },

  matchName: {
    fontWeight: "600"
  },

  matchSkills: {
    fontSize: "12px",
    opacity: 0.7
  },

  matchActionBtn: {
    padding: "6px 16px",
    borderRadius: "8px",
    cursor: "pointer"
  }
};

export default Home;