import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Home,
  Users,
  TrendingUp,
  Bell,
  User,
  LogOut,
  Zap,
  Menu,
  X
} from "lucide-react";

const NAV_LINKS = [
  { to: "/",             label: "Home",          icon: Home        },
  { to: "/matching",     label: "Matching",      icon: Users       },
  { to: "/progress",     label: "Progress",      icon: TrendingUp  },
  { to: "/notifications",label: "Notifications", icon: Bell        },
  { to: "/profile",      label: "Profile",       icon: User        },
];

export default function Navbar({ currentUser, onLogout, unreadNotifications }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const initials = currentUser?.name
    ? currentUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "BL";

  return (
    <header style={styles.header}>
      <nav style={styles.nav}>

        {/* ── Logo ── */}
        <Link to="/" style={styles.logo}>
          <div style={styles.logoIcon}>
            <Zap size={16} color="#fff" />
          </div>
          <span style={styles.logoText}>BarterLearn</span>
        </Link>

        {/* ── Desktop Links ── */}
        <div style={styles.links}>
          {NAV_LINKS.map(({ to, label, icon: Icon }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                style={{
                  ...styles.link,
                  ...(active ? styles.linkActive : {}),
                }}
              >
                <Icon size={15} />
                <span>{label}</span>
                {label === "Notifications" && unreadNotifications > 0 && (
                  <span className="notification-dot" style={styles.badge}>
                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                  </span>
                )}
                {active && <span style={styles.activeDot} />}
              </Link>
            );
          })}
        </div>

        {/* ── Right: Avatar + Logout ── */}
        <div style={styles.right}>
          <div style={styles.avatarWrap}>
            <span style={styles.avatarEmoji}>{currentUser?.avatar || "🙂"}</span>
            <div style={styles.avatarInfo} className="hide-mobile">
              <span style={styles.avatarName}>{currentUser?.name || "User"}</span>
              <span style={styles.avatarSub}>{currentUser?.email?.split("@")[0]}</span>
            </div>
          </div>

          <button onClick={onLogout} style={styles.logoutBtn} title="Logout">
            <LogOut size={16} />
            <span className="hide-mobile">Logout</span>
          </button>

          {/* Mobile hamburger */}
          <button
            style={styles.hamburger}
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div style={styles.mobileMenu}>
          {NAV_LINKS.map(({ to, label, icon: Icon }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                style={{ ...styles.mobileLink, ...(active ? styles.mobileLinkActive : {}) }}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={17} />
                {label}
                {label === "Notifications" && unreadNotifications > 0 && (
                  <span className="notification-dot">{unreadNotifications}</span>
                )}
              </Link>
            );
          })}
          <button onClick={onLogout} style={styles.mobileLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </header>
  );
}

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 900,
    background: "rgba(8, 14, 26, 0.82)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    boxShadow: "0 4px 30px rgba(0,0,0,0.4)",
  },

  nav: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "0 28px",
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
  },

  /* Logo */
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    flexShrink: 0,
  },
  logoIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 14px rgba(99,102,241,0.5)",
    flexShrink: 0,
  },
  logoText: {
    fontWeight: "800",
    fontSize: "18px",
    background: "linear-gradient(120deg, #818cf8, #6366f1)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    letterSpacing: "-0.02em",
  },

  /* Nav Links */
  links: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    flex: 1,
    justifyContent: "center",
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 13px",
    borderRadius: "10px",
    fontSize: "13.5px",
    fontWeight: "500",
    color: "rgba(148,163,184,0.85)",
    textDecoration: "none",
    transition: "all 0.2s",
    position: "relative",
    whiteSpace: "nowrap",
  },
  linkActive: {
    background: "rgba(99,102,241,0.14)",
    color: "#818cf8",
    fontWeight: "600",
    boxShadow: "inset 0 0 0 1px rgba(99,102,241,0.25)",
  },
  activeDot: {
    position: "absolute",
    bottom: "2px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    background: "#6366f1",
  },
  badge: {
    fontSize: "10px",
    minWidth: "16px",
    height: "16px",
    padding: "0 4px",
  },

  /* Right section */
  right: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexShrink: 0,
  },

  avatarWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "6px 12px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "12px",
  },
  avatarEmoji: {
    fontSize: "22px",
    lineHeight: 1,
  },
  avatarInfo: {
    display: "flex",
    flexDirection: "column",
  },
  avatarName: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#f1f5f9",
    lineHeight: 1.2,
  },
  avatarSub: {
    fontSize: "11px",
    color: "#64748b",
  },

  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 14px",
    borderRadius: "10px",
    background: "rgba(244,63,94,0.1)",
    border: "1px solid rgba(244,63,94,0.2)",
    color: "#fb7185",
    fontSize: "13px",
    fontWeight: "600",
    transition: "all 0.2s",
    cursor: "pointer",
  },

  hamburger: {
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    color: "#94a3b8",
    cursor: "pointer",
  },

  /* Mobile menu */
  mobileMenu: {
    display: "none",
    flexDirection: "column",
    gap: "4px",
    padding: "12px 16px 16px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(8,14,26,0.95)",
  },
  mobileLink: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 14px",
    borderRadius: "10px",
    color: "#94a3b8",
    fontSize: "14px",
    fontWeight: "500",
    textDecoration: "none",
    transition: "all 0.2s",
  },
  mobileLinkActive: {
    background: "rgba(99,102,241,0.14)",
    color: "#818cf8",
  },
  mobileLogout: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 14px",
    borderRadius: "10px",
    background: "rgba(244,63,94,0.08)",
    border: "1px solid rgba(244,63,94,0.2)",
    color: "#fb7185",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "4px",
  },
};

/* Add responsive styles via a single <style> tag approach */
if (typeof document !== "undefined") {
  const styleId = "navbar-responsive";
  if (!document.getElementById(styleId)) {
    const el = document.createElement("style");
    el.id = styleId;
    el.textContent = `
      @media (max-width: 768px) {
        nav .navbar-links { display: none !important; }
        header [data-hamburger] { display: flex !important; }
        header [data-mobile-menu] { display: flex !important; }
      }
      header a:hover:not([class*="Active"]) {
        background: rgba(255,255,255,0.06);
        color: #f1f5f9 !important;
      }
      header button[title="Logout"]:hover {
        background: rgba(244,63,94,0.18) !important;
        box-shadow: 0 0 12px rgba(244,63,94,0.2) !important;
      }
    `;
    document.head.appendChild(el);
  }
}