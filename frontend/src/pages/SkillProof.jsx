import React, { useState } from "react";
import { Sparkles, CheckCircle, Trophy, Upload, ArrowRight, Lock } from "lucide-react";

export default function SkillProof({ currentUser = {} }) {
  const [activeTab, setActiveTab] = useState("overview");

  const features = [
    {
      icon: Trophy,
      title: "Prove Your Skills",
      desc: "Complete real-world challenges to verify your expertise with AI assessment.",
    },
    {
      icon: CheckCircle,
      title: "AI-Verified Badges",
      desc: "Get instant, trustworthy skill badges backed by SkillProof AI technology.",
    },
    {
      icon: Lock,
      title: "Secure & Transparent",
      desc: "All assessments are private, fair, and non-biased.",
    },
  ];

  const proofs = [
    { skill: "Python", status: "pending", completedAt: null },
    { skill: "Web Design", status: "pending", completedAt: null },
  ];

  return (
    <div className="page-container" style={styles.container}>
      {/* HEADER */}
      <div className="section-header anim-fadeInUp">
        <div>
          <h1 className="section-title">SkillProof AI</h1>
          <p className="section-subtitle">
            Don't show your certificate. Show what you can actually do.
          </p>
        </div>
      </div>

      {/* HERO BANNER */}
      <section style={styles.heroBanner} className="glass-card-static anim-fadeInUp delay-1">
        <div style={styles.heroBannerContent}>
          <div style={styles.heroBadge}>
            <Sparkles size={20} color="#ec4899" />
            <span>Coming Soon</span>
          </div>
          <h2 style={styles.heroBannerTitle}>
            AI-Powered Skill Verification
          </h2>
          <p style={styles.heroBannerText}>
            SkillProof transforms how learning is validated. Instead of relying on certificates or diplomas, Learvix uses AI to assess and verify that you can actually do what you claim. Complete challenges, get verified, build real credibility.
          </p>
          <div style={styles.heroBannerActions}>
            <button className="btn btn-primary" style={{ gap: 8 }}>
              Learn More <ArrowRight size={16} />
            </button>
            <button className="btn btn-ghost">View Docs</button>
          </div>
        </div>
      </section>

      {/* TABS */}
      <div style={styles.tabsContainer} className="anim-fadeInUp delay-2">
        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === "overview" ? styles.tabActive : {}),
            }}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === "myproofs" ? styles.tabActive : {}),
            }}
            onClick={() => setActiveTab("myproofs")}
          >
            My SkillProofs
          </button>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div style={styles.content}>
          {/* FEATURES */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>How SkillProof Works</h2>
            <div style={styles.featuresGrid}>
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={idx}
                    className="glass-card"
                    style={styles.featureCard}
                  >
                    <div style={styles.featureIcon}>
                      <Icon size={32} color="var(--primary-light)" />
                    </div>
                    <h3 style={styles.featureTitle}>{feature.title}</h3>
                    <p style={styles.featureDesc}>{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* PROCESS */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>The Verification Process</h2>
            <div style={styles.processSteps}>
              {[
                { num: "1", title: "Choose a Skill", desc: "Select a skill you want to get verified." },
                { num: "2", title: "Complete Challenge", desc: "Solve AI-designed challenges that prove your ability." },
                { num: "3", title: "AI Assessment", desc: "Our AI evaluates your work fairly and instantly." },
                { num: "4", title: "Get Badge", desc: "Earn a verified SkillProof badge on your profile." },
              ].map((step, i) => (
                <div key={i} style={styles.processStep}>
                  <div style={styles.processStepNum}>{step.num}</div>
                  <div>
                    <h3 style={styles.processStepTitle}>{step.title}</h3>
                    <p style={styles.processStepDesc}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section style={styles.ctaSection}>
            <h2 style={styles.ctaTitle}>Ready to Prove Your Skills?</h2>
            <p style={styles.ctaText}>
              SkillProof AI is launching soon. Be among the first to verify your expertise.
            </p>
            <button className="btn btn-primary" style={{ gap: 8 }}>
              <Upload size={18} /> Get Notified
            </button>
          </section>
        </div>
      )}

      {/* MY SKILLPROOFS TAB */}
      {activeTab === "myproofs" && (
        <div style={styles.content}>
          <div style={styles.myProofsContainer}>
            <h2 style={styles.sectionTitle}>Your SkillProofs</h2>
            <p style={styles.sectionSubtitle}>
              Skills you've verified with SkillProof AI (coming soon)
            </p>

            {proofs.length === 0 ? (
              <div className="glass-card-static" style={styles.emptyState}>
                <Lock size={48} color="var(--text-muted)" />
                <h3>No SkillProofs Yet</h3>
                <p>
                  Complete challenges to unlock verified skill badges.
                </p>
              </div>
            ) : (
              <div style={styles.proofsList}>
                {proofs.map((proof, idx) => (
                  <div key={idx} className="glass-card" style={styles.proofCard}>
                    <div style={styles.proofTop}>
                      <h3 style={styles.proofSkill}>{proof.skill}</h3>
                      <span
                        style={{
                          ...styles.proofBadge,
                          background:
                            proof.status === "verified"
                              ? "var(--success)"
                              : "var(--warning)",
                        }}
                      >
                        {proof.status}
                      </span>
                    </div>
                    {proof.completedAt && (
                      <p style={styles.proofDate}>
                        Verified on {new Date(proof.completedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1000px",
  },
  heroBanner: {
    background: "linear-gradient(135deg, rgba(236,72,153,0.1), rgba(99,102,241,0.1))",
    borderRadius: "20px",
    padding: "48px",
    textAlign: "center",
    marginBottom: "48px",
  },
  heroBannerContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  },
  heroBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(236,72,153,0.1)",
    border: "1px solid rgba(236,72,153,0.3)",
    borderRadius: "20px",
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#ec4899",
    width: "fit-content",
  },
  heroBannerTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "var(--text-primary)",
    margin: "0 0 12px 0",
  },
  heroBannerText: {
    fontSize: "15px",
    color: "var(--text-secondary)",
    maxWidth: "600px",
    lineHeight: "1.6",
  },
  heroBannerActions: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    marginTop: "16px",
  },
  tabsContainer: {
    marginBottom: "32px",
  },
  tabs: {
    display: "flex",
    gap: "8px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  tab: {
    padding: "12px 20px",
    border: "none",
    background: "none",
    color: "var(--text-secondary)",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
    borderBottom: "2px solid transparent",
    marginBottom: "-1px",
  },
  tabActive: {
    color: "var(--primary-light)",
    borderBottomColor: "var(--primary-light)",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "48px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  sectionTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "var(--text-primary)",
    margin: 0,
  },
  sectionSubtitle: {
    color: "var(--text-secondary)",
    margin: 0,
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "16px",
  },
  featureCard: {
    padding: "24px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  featureIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "64px",
    height: "64px",
    background: "rgba(99,102,241,0.1)",
    borderRadius: "16px",
  },
  featureTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "var(--text-primary)",
    margin: 0,
  },
  featureDesc: {
    fontSize: "13px",
    color: "var(--text-secondary)",
    margin: 0,
  },
  processSteps: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  processStep: {
    display: "flex",
    gap: "20px",
    padding: "20px",
    borderRadius: "12px",
    background: "rgba(99,102,241,0.05)",
    border: "1px solid rgba(99,102,241,0.1)",
  },
  processStepNum: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "16px",
    flexShrink: 0,
  },
  processStepTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "var(--text-primary)",
    margin: "0 0 4px 0",
  },
  processStepDesc: {
    fontSize: "13px",
    color: "var(--text-secondary)",
    margin: 0,
  },
  ctaSection: {
    textAlign: "center",
    padding: "48px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1))",
    border: "1px solid rgba(99,102,241,0.2)",
  },
  ctaTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "var(--text-primary)",
    margin: "0 0 12px 0",
  },
  ctaText: {
    fontSize: "15px",
    color: "var(--text-secondary)",
    margin: "0 0 24px 0",
  },
  myProofsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  emptyState: {
    textAlign: "center",
    padding: "48px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  },
  proofsList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "16px",
  },
  proofCard: {
    padding: "20px",
  },
  proofTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    gap: "12px",
    marginBottom: "12px",
  },
  proofSkill: {
    fontSize: "16px",
    fontWeight: "600",
    color: "var(--text-primary)",
    margin: 0,
  },
  proofBadge: {
    fontSize: "11px",
    fontWeight: "600",
    color: "white",
    padding: "4px 10px",
    borderRadius: "8px",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },
  proofDate: {
    fontSize: "12px",
    color: "var(--text-secondary)",
    margin: 0,
  },
};
