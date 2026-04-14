import React, { useState } from "react";
import { LogIn, UserPlus, Zap } from "lucide-react";
import { api } from "../api";

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || (isRegister && !formData.name)) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      if (isRegister) {
        await api.register(formData);
        alert("Registration successful. Please login.");
        setIsRegister(false);
        setFormData(p => ({ ...p, password: "" }));
      } else {
        await onLogin(formData.email, formData.password);
      }
    } catch (err) {
      console.error(err);
      alert(err?.message || (isRegister ? "Registration failed" : "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Decorative Orbs */}
      <div style={{ ...styles.orb, top: "-10%", left: "-10%", background: "var(--primary)" }} className="anim-float delay-1" />
      <div style={{ ...styles.orb, bottom: "-10%", right: "-10%", background: "var(--secondary)" }} className="anim-float delay-3" />

      <div style={styles.loginCard} className="glass-card-static anim-scaleIn">
        
        <div style={styles.header}>
          <div style={styles.logoBox}>
            <Zap size={32} color="#fff" />
          </div>
          <h1 style={styles.title}>BarterLearn</h1>
          <p style={styles.subtitle}>
            {isRegister ? "Join the skill exchange network" : "Welcome back. Log in to continue."}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {isRegister && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Jane Doe"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={styles.submitBtn}
            disabled={loading}
          >
            {loading ? (
              <div className="spinner" />
            ) : isRegister ? (
              <><UserPlus size={18} /> Create Account</>
            ) : (
              <><LogIn size={18} /> Sign In</>
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.toggleText}>
            {isRegister ? "Already have an account?" : "New to BarterLearn?"}{" "}
            <span
              style={styles.toggleLink}
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? "Log in instead" : "Create an account"}
            </span>
          </p>
        </div>

        {/* Demo Note */}
        <div style={styles.demoNote}>
          <p>ℹ️ Demo mode: Use <b>test@test.com</b> / <b>password</b></p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    position: "relative",
    overflow: "hidden",
    background: "var(--bg-base)",
  },
  orb: {
    position: "absolute",
    width: "40vw",
    height: "40vw",
    borderRadius: "50%",
    filter: "blur(100px)",
    opacity: 0.15,
    zIndex: 0,
    pointerEvents: "none",
  },
  loginCard: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: "440px",
    padding: "40px",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(99, 102, 241, 0.15)",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  logoBox: {
    width: "64px",
    height: "64px",
    borderRadius: "18px",
    background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    boxShadow: "0 8px 24px var(--primary-glow)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#fff",
    marginBottom: "8px",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "15px",
    color: "var(--text-secondary)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  submitBtn: {
    marginTop: "8px",
    padding: "14px",
    fontSize: "16px",
    width: "100%",
  },
  footer: {
    marginTop: "24px",
    textAlign: "center",
  },
  toggleText: {
    fontSize: "14px",
    color: "var(--text-secondary)",
  },
  toggleLink: {
    color: "var(--primary-light)",
    fontWeight: "600",
    cursor: "pointer",
    transition: "color 0.2s",
  },
  demoNote: {
    marginTop: "32px",
    padding: "16px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    fontSize: "13px",
    color: "var(--text-muted)",
    textAlign: "center",
  },
};