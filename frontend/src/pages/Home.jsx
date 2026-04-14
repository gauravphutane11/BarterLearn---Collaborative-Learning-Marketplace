import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Video,
  TrendingUp,
  Award,
  ArrowRight,
  MessageSquare,
  Zap,
  Sparkles
} from "lucide-react";

export default function Home({ currentUser = {}, users = [] }) {
  const navigate = useNavigate();

  const stats = [
    {
      icon: Users,
      label: "Active Matches",
      value: currentUser?.activeMatches?.length || 0,
      color: "var(--primary-light)",
    },
    {
      icon: Video,
      label: "Sessions This Month",
      value: 8,
      color: "var(--secondary-light)",
    },
    {
      icon: TrendingUp,
      label: "Completed Exchanges",
      value: currentUser?.completedExchanges || 0,
      color: "var(--accent)",
    },
    {
      icon: Award,
      label: "Rating",
      value: `${currentUser?.rating || 0} ⭐`,
      color: "var(--danger)",
    },
  ];

  const steps = [
    {
      icon: Users,
      title: "Find a Partner",
      desc: "Browse users who want what you teach.",
    },
    {
      icon: MessageSquare,
      title: "Connect & Chat",
      desc: "Discuss your learning goals and schedule.",
    },
    {
      icon: Zap,
      title: "Learn & Teach",
      desc: "Jump into a video session and start trading.",
    },
  ];

  const suggestedMatches =
    users?.filter((u) => u?.id !== currentUser?.id)?.slice(0, 3) || [];

  return (
    <div className="page-container" style={styles.container}>
      {/* ── HERO SECTION ── */}
      <section style={styles.heroSection} className="anim-fadeInUp">
        <div style={styles.heroBadge}>
          <Sparkles size={14} color="#f59e0b" />
          <span>The New Way to Learn</span>
        </div>
        <h1 style={styles.heroTitle}>
          Learn Anything. <br />
          <span className="gradient-text">Teach Everything.</span>
        </h1>
        <p style={styles.heroSubtitle}>
          Trade your expertise for the skills you want. Join BarterLearn to connect, match, and grow together through collaborative video sessions.
        </p>

        <div style={styles.heroActions}>
          <button className="btn btn-primary" onClick={() => navigate("/matching")} style={{ padding: "14px 28px", fontSize: "16px" }}>
            Explore Matches <ArrowRight size={18} />
          </button>
          <button className="btn btn-ghost" onClick={() => navigate("/profile")} style={{ padding: "14px 28px", fontSize: "16px" }}>
            Edit Profile
          </button>
        </div>
      </section>

      {/* ── STATS ROW ── */}
      <div style={styles.statsGrid} className="anim-fadeInUp delay-1">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="stat-card">
              <div
                style={{
                  ...styles.statIconWrap,
                  background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)`,
                  color: stat.color,
                  border: `1px solid ${stat.color}30`,
                }}
              >
                <Icon size={24} />
              </div>
              <div>
                <p className="stat-value">{stat.value}</p>
                <p className="stat-label">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── HOW IT WORKS ── */}
      <section style={styles.section} className="anim-fadeInUp delay-2">
        <div className="section-header">
          <div>
            <h2 className="section-title">How BarterLearn Works</h2>
            <p className="section-subtitle">Three simple steps to start exchanging skills.</p>
          </div>
        </div>
        <div style={styles.stepsGrid}>
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="glass-card" style={styles.stepCard}>
                <div style={styles.stepIconBox}>
                  <Icon size={26} color="var(--primary-light)" />
                </div>
                <h3 style={styles.stepTitle}>{step.title}</h3>
                <p style={styles.stepDesc}>{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── MATCH SUGGESTIONS ── */}
      <section style={styles.section} className="anim-fadeInUp delay-3">
        <div className="section-header">
          <div>
            <h2 className="section-title">Suggested Matches</h2>
            <p className="section-subtitle">People looking for the skills you offer.</p>
          </div>
          <button className="btn btn-ghost" onClick={() => navigate("/matching")} style={{ fontSize: "13px" }}>
            View All <ArrowRight size={14} />
          </button>
        </div>

        {suggestedMatches.length === 0 ? (
          <div className="empty-state glass-card-static">
            <div className="empty-state-icon">
              <Users size={32} color="var(--text-muted)" />
            </div>
            <h3>No Matches Yet</h3>
            <p style={{ marginTop: 8 }}>Add more skills to your profile to find partners.</p>
          </div>
        ) : (
          <div style={styles.matchGrid}>
            {suggestedMatches.map((user, i) => (
              <div key={user?.id} className="glass-card" style={{ ...styles.matchCard, animationDelay: `${i * 0.1}s` }}>
                <div style={styles.matchTop}>
                  <div className="avatar-ring">
                    <div className="avatar-inner" style={{ width: 48, height: 48 }}>
                      {user?.avatar || "🙂"}
                    </div>
                  </div>
                  <div>
                    <h3 style={styles.matchName}>{user?.name || "User"}</h3>
                    <div style={styles.matchRating}>
                      <Award size={13} color="var(--danger)" />
                      {user?.rating || "New"}
                    </div>
                  </div>
                </div>

                <div style={styles.matchSkills}>
                  <div style={styles.skillRow}>
                    <span style={styles.skillLabel}>Offers:</span>
                    <div style={styles.skillTags}>
                      {(user?.skillsOffered || []).slice(0, 2).map((s, idx) => (
                        <span key={idx} className="skill-tag skill-tag-offered">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div style={styles.skillRow}>
                    <span style={styles.skillLabel}>Wants:</span>
                    <div style={styles.skillTags}>
                      {(user?.skillsWanted || []).slice(0, 2).map((s, idx) => (
                        <span key={idx} className="skill-tag skill-tag-wanted">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={styles.matchActions}>
                  <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => navigate("/matching")}>
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const styles = {
  container: {
    paddingBottom: "80px",
  },
  heroSection: {
    textAlign: "center",
    padding: "80px 20px 60px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
  },
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 14px",
    background: "rgba(245, 158, 11, 0.1)",
    border: "1px solid rgba(245, 158, 11, 0.2)",
    borderRadius: "99px",
    color: "#fde68a",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "24px",
    letterSpacing: "0.03em",
  },
  heroTitle: {
    fontSize: "clamp(40px, 6vw, 64px)",
    fontWeight: "900",
    lineHeight: "1.1",
    letterSpacing: "-0.03em",
    marginBottom: "20px",
    color: "#fff",
  },
  heroSubtitle: {
    fontSize: "18px",
    color: "var(--text-secondary)",
    maxWidth: "600px",
    margin: "0 auto 36px",
    lineHeight: "1.6",
  },
  heroActions: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
    marginBottom: "80px",
  },
  statIconWrap: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  section: {
    marginBottom: "80px",
  },
  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
  },
  stepCard: {
    padding: "32px 24px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  stepIconBox: {
    width: "56px",
    height: "56px",
    borderRadius: "16px",
    background: "rgba(99, 102, 241, 0.1)",
    border: "1px solid rgba(99, 102, 241, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
    boxShadow: "0 0 20px rgba(99, 102, 241, 0.15)",
  },
  stepTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "8px",
  },
  stepDesc: {
    fontSize: "14px",
    color: "var(--text-secondary)",
    lineHeight: "1.6",
  },

  matchGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
  },
  matchCard: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  matchTop: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },
  matchName: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "4px",
  },
  matchRating: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "12px",
    color: "var(--text-muted)",
    fontWeight: "600",
  },
  matchSkills: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    flex: 1,
  },
  skillRow: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  skillLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "var(--text-muted)",
    textTransform: "uppercase",
  },
  skillTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
  },
  matchActions: {
    marginTop: "auto",
    paddingTop: "16px",
    borderTop: "1px solid var(--border)",
  },
};