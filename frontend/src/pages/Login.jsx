import React, { useState } from "react";
import { LogIn } from "lucide-react";
import { api } from "../api";

const Login = ({ onLogin }) => {

  const [isRegister, setIsRegister] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {

      setLoading(true);

      await onLogin(email, password);

    } catch (err) {

      console.error("Login error", err);
      alert("Login failed");

    } finally {

      setLoading(false);

    }

  };

  const handleRegister = async () => {

    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {

      setLoading(true);

      await api.register({
        name,
        email,
        password
      });

      alert("Registration successful. Please login.");

      setIsRegister(false);
      setPassword("");

    } catch (err) {

      console.error("Register error", err);
      alert(err?.message || "Registration failed");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div style={styles.container}>

      <div style={styles.loginBox}>

        <div style={styles.header}>

          <span style={styles.logo}>📚</span>

          <h1 style={styles.title}>BarterLearn</h1>

          <p style={styles.subtitle}>
            Collaborative Learning Marketplace
          </p>

        </div>

        <div style={styles.form}>

          {isRegister && (
            <>
              <label style={styles.label}>Name</label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
                placeholder="Enter your name"
              />
            </>
          )}

          <label style={styles.label}>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            placeholder="Enter your email"
          />

          <label style={styles.label}>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            placeholder="Enter your password"
          />

          <button
            onClick={isRegister ? handleRegister : handleLogin}
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }}
          >

            <LogIn size={20} />

            {loading
              ? "Please wait..."
              : isRegister
                ? "Register"
                : "Login"}

          </button>

          <p
            style={styles.toggleText}
            onClick={() => setIsRegister(!isRegister)}
          >

            {isRegister
              ? "Already have an account? Login"
              : "Don't have an account? Register"}

          </p>

        </div>

        <div style={styles.info}>

          <p style={styles.infoText}>
            ℹ️ This is a demo platform for collaborative skill exchange.
          </p>

        </div>

      </div>

    </div>

  );

};

const styles = {

  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",

    background:
      "linear-gradient(135deg,#4f46e5,#6366f1,#8b5cf6)",

    padding: "20px"
  },

  loginBox: {

    background: "white",

    borderRadius: "20px",

    padding: "40px",

    maxWidth: "420px",
    width: "100%",

    boxShadow:
      "0 25px 70px rgba(0,0,0,0.25)"

  },

  header: {
    textAlign: "center",
    marginBottom: "30px"
  },

  logo: {
    fontSize: "60px",
    display: "block",
    marginBottom: "10px"
  },

  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "6px"
  },

  subtitle: {
    fontSize: "14px",
    color: "#6b7280"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px"
  },

  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151"
  },

  input: {

    padding: "12px",

    borderRadius: "10px",

    border: "1px solid #d1d5db",

    fontSize: "14px",

    outline: "none"

  },

  button: {

    marginTop: "10px",

    padding: "14px",

    borderRadius: "12px",

    border: "none",

    background:
      "linear-gradient(135deg,#6366f1,#8b5cf6)",

    color: "white",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    gap: "8px",

    cursor: "pointer",

    fontWeight: "600",

    fontSize: "15px",

    transition: "all 0.2s"

  },

  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed"
  },

  toggleText: {

    textAlign: "center",

    fontSize: "13px",

    color: "#6366f1",

    cursor: "pointer",

    marginTop: "10px"

  },

  info: {

    marginTop: "20px",

    padding: "14px",

    background: "#fef3c7",

    borderRadius: "10px"

  },

  infoText: {
    fontSize: "13px",
    color: "#92400e"
  }

};

export default Login;