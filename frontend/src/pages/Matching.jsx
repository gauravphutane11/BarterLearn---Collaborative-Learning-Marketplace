import React, { useState, useEffect } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import { Users, Star, ArrowRight, Heart, X, Target, Info } from "lucide-react";

export default function Matching({ currentUser = {} }) {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const data = await api.getMatches();
      setMatches(data || []);
    } catch (err) {
      console.error("failed to fetch matches", err);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (match) => {
    try {
      const weOfferTheyWant = (currentUser?.skillsOffered || []).find(s => (match?.skillsWanted || []).includes(s));
      const skill = weOfferTheyWant || currentUser?.skillsOffered?.[0] || "Skill Exchange";

      const partnerSkill = match?.commonSkills?.[0] || match?.skillsOffered?.[0] || "Skill Exchange";

      const res = await api.createExchange({
        partner_id: match?.id,
        skill,
        partner_skill: partnerSkill,
        total_sessions: 5
      });
      alert(`Connection request sent to ${match?.name}! \nExchange #${res?.id} created.`);
      setSelectedMatch(null);
    } catch (err) {
      console.error(err);
      alert(err.message || "Unable to connect right now.");
    }
  };

  return (
    <div className="page-container" style={styles.container}>
      <div className="section-header anim-fadeInUp">
        <div>
          <h1 className="section-title">Find Learning Partners</h1>
          <p className="section-subtitle">Based on your skills, we found {matches?.length || 0} potential matches.</p>
        </div>
      </div>

      {loading ? (
        <div style={styles.centerBox} className="anim-fadeIn">
          <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
        </div>
      ) : matches.length === 0 ? (
        <div className="empty-state glass-card-static anim-fadeInUp delay-1">
          <div className="empty-state-icon">
            <Users size={32} color="var(--text-muted)" />
          </div>
          <h3>No matches found</h3>
          <p style={{ marginTop: 8, marginBottom: 24, maxWidth: 400, marginInline: 'auto' }}>
            We couldn't find anyone looking for your skills right now. Try updating your profile with more skills.
          </p>
          <button className="btn btn-primary" onClick={() => navigate("/profile")}>
            Update Profile
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {matches.map((match, idx) => {
            const isHighMatch = match?.matchScore > 85;
            const mutual = match?.mutualExchange;
            return (
              <div
                key={match?.id}
                className={`glass-card hover-lift anim-fadeInUp ${mutual ? 'flashy-mutual' : ''}`}
                style={{
                  ...styles.card,
                  animationDelay: `${idx * 0.05}s`,
                  ...(isHighMatch ? styles.highMatchBorder : {})
                }}
              >

                <div style={styles.cardHeader}>
                  <div style={styles.matchScoreBadge}>
                    <Target size={14} /> {Math.round(match?.matchScore || 0)}% Match
                  </div>
                  {mutual && (
                    <div style={styles.mutualBadge} className="anim-pulseGlow" title="Both of you want what the other offers!">
                      <Heart size={14} /> Mutual Check
                    </div>
                  )}
                </div>

                <div style={styles.userInfo}>
                  <div className="avatar-ring" style={mutual ? { background: 'linear-gradient(135deg, #fb7185, #f43f5e)' } : {}}>
                    <div className="avatar-inner" style={{ width: 56, height: 56, fontSize: 28 }}>
                      {match?.avatar || "🙂"}
                    </div>
                  </div>
                  <div>
                    <h3 style={styles.userName}>{match?.name || "User"}</h3>
                    <div style={{ ...styles.rating, color: "var(--text-secondary)" }}>
                      <Star size={13} fill="var(--accent)" color="var(--accent)" />
                      {match?.rating || "New"}
                    </div>
                  </div>
                </div>

                <p style={{ ...styles.bio, color: "var(--text-primary)" }}>
                  {match?.bio ? (match.bio.length > 80 ? `${match.bio.substring(0, 80)}...` : match.bio) : "No bio available."}
                </p>

                <div style={styles.skillsSection}>
                  <div style={styles.skillGroup}>
                    <p style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "6px", textTransform: "uppercase" }}>Offers</p>
                    <div style={styles.skillTags}>
                      {(match?.skillsOffered || []).slice(0, 3).map((s, i) => (
                        <span key={i} className="skill-tag skill-tag-offered">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div style={styles.skillGroup}>
                    <p style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "6px", textTransform: "uppercase" }}>Wants</p>
                    <div style={styles.skillTags}>
                      {(match?.skillsWanted || []).slice(0, 3).map((s, i) => (
                        <span key={i} className="skill-tag skill-tag-wanted">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={styles.actions}>
                  <button className="btn btn-ghost" style={{ flex: 1, color: "var(--text-primary)" }} onClick={() => setSelectedMatch(match)}>
                    <Info size={16} /> Details
                  </button>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleConnect(match)}>
                    <Users size={16} /> Connect
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL */}
      {selectedMatch && (
        <div className="modal-overlay" onClick={() => setSelectedMatch(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setSelectedMatch(null)}>
              <X size={20} />
            </button>

            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div className="avatar-ring" style={{ marginBottom: 16 }}>
                <div className="avatar-inner" style={{ width: 80, height: 80, fontSize: 40 }}>
                  {selectedMatch.avatar || "🙂"}
                </div>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800 }}>{selectedMatch.name}</h2>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 }}>
                <span className="badge badge-primary"><Target size={12} /> {Math.round(selectedMatch.matchScore || 0)}% Match</span>
                <span className="badge badge-warning"><Star size={12} /> {selectedMatch.rating || 0} Rating</span>
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 12, marginBottom: 24 }}>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {selectedMatch.bio || "This user hasn't added a bio yet."}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
              <div>
                <h4 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>Skills Offered</h4>
                <div style={styles.skillTags}>
                  {(selectedMatch.skillsOffered || []).map((s, i) => (
                    <span key={i} className="skill-tag skill-tag-offered">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>Skills Wanted</h4>
                <div style={styles.skillTags}>
                  {(selectedMatch.skillsWanted || []).map((s, i) => (
                    <span key={i} className="skill-tag skill-tag-wanted">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: "100%", padding: 16, fontSize: 16 }} onClick={() => handleConnect(selectedMatch)}>
              Send Exchange Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { paddingBottom: 80 },
  centerBox: { display: "flex", justifyContent: "center", padding: "100px 0" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" },
  card: { padding: "24px", display: "flex", flexDirection: "column", background: "var(--bg-card)" },
  highMatchBorder: { boxShadow: "0 0 0 2px var(--primary), 0 10px 40px rgba(99,102,241,0.2)" },
  cardHeader: { display: "flex", justifyContent: "space-between", marginBottom: "16px" },
  matchScoreBadge: { display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(99,102,241,0.15)", color: "var(--primary-light)", padding: "4px 10px", borderRadius: "99px", fontSize: "12px", fontWeight: "700", border: "1px solid rgba(99,102,241,0.3)" },
  mutualBadge: { display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(244,63,94,0.15)", color: "#fb7185", padding: "4px 10px", borderRadius: "99px", fontSize: "12px", fontWeight: "700", border: "1px solid rgba(244,63,94,0.3)" },
  userInfo: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" },
  userName: { fontSize: "18px", fontWeight: "700", color: "#fff", lineHeight: 1.2 },
  rating: { display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px", fontWeight: "500" },
  bio: { fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.5", marginBottom: "20px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: "42px" },
  skillsSection: { display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px", flex: 1, background: "rgba(0,0,0,0.2)", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)" },
  skillTags: { display: "flex", flexWrap: "wrap", gap: "6px" },
  skillGroup: {},
  actions: { display: "flex", gap: "12px", marginTop: "auto" },
  closeBtn: { position: "absolute", top: 16, right: 16, background: "var(--glass-bg)", border: "1px solid var(--border)", color: "var(--text-muted)", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }
};