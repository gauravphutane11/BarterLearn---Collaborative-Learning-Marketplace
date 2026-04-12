import React, { useState, useEffect } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import { Users, Star, BookOpen, ArrowRight, Heart, X } from "lucide-react";

const Matching = ({ currentUser = {} }) => {
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const data = await api.getMatches();
      setMatches(data || []);
    } catch (err) {
      console.error("failed to fetch matches", err);
      setMatches([]);
    }
  };

  const handleConnect = async (match) => {
    try {
      const skill =
        currentUser?.skillsOffered?.[0] || "Skill Exchange";

      const partnerSkill =
        currentUser?.skillsWanted?.[0] ||
        match?.skillsOffered?.[0] ||
        "Skill Exchange";

      const res = await api.createExchange({
        partner_id: match?.id,
        skill,
        partner_skill: partnerSkill,
        total_sessions: 5
      });

      alert(
        `Connection request sent to ${match?.name}! 🎉\nExchange #${res?.id} created.`
      );
    } catch (err) {
      console.error("failed to create exchange", err);
      alert(err.message || "Unable to connect right now.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Find Learning Partners</h1>

        <p style={styles.subtitle}>
          Matched with {matches?.length || 0} learners based on your skills
        </p>
      </div>

      {matches.length === 0 ? (
        <div style={styles.emptyState}>
          <Users size={64} />

          <h3>No matches found</h3>

          <p>
            Add more skills to your profile to discover learning partners.
          </p>

          <button
            onClick={() => navigate("/profile")}
            style={styles.primaryBtn}
          >
            Update Profile
          </button>
        </div>
      ) : (
        <div style={styles.matchesGrid}>
          {matches.map((match, index) => (
            <div key={match?.id} style={styles.matchCard}>
              <div style={styles.matchHeader}>
                <span style={styles.matchBadge}>
                  #{index + 1} Match
                </span>

                <span style={styles.matchScore}>
                  {Math.round(match?.matchScore || 0)}%
                </span>
              </div>

              <div style={styles.userInfo}>
                <span style={styles.avatar}>
                  {match?.avatar || "🙂"}
                </span>

                <div>
                  <h3>{match?.name || "User"}</h3>

                  <div style={styles.rating}>
                    <Star size={14} fill="gold" color="gold" />
                    {match?.rating || 0}
                  </div>
                </div>
              </div>

              <p style={styles.bio}>{match?.bio || "No bio available"}</p>

              {match?.mutualExchange && (
                <div style={styles.mutualBadge}>
                  <Heart size={14} color="red" />
                  Mutual Exchange Possible
                </div>
              )}

              <div style={styles.skillGroup}>
                <p style={styles.skillLabel}>Offers:</p>

                {(match?.skillsOffered || []).slice(0, 3).map((s, i) => (
                  <span key={i} style={styles.skillTag}>
                    {s}
                  </span>
                ))}
              </div>

              <div style={styles.skillGroup}>
                <p style={styles.skillLabel}>Wants:</p>

                {(match?.skillsWanted || []).slice(0, 3).map((s, i) => (
                  <span
                    key={i}
                    style={{ ...styles.skillTag, ...styles.skillTagWanted }}
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div style={styles.actions}>
                <button
                  onClick={() => handleConnect(match)}
                  style={styles.connectBtn}
                >
                  <Users size={16} />
                  Connect
                </button>

                <button
                  onClick={() => setSelectedMatch(match)}
                  style={styles.viewBtn}
                >
                  View Profile
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedMatch && (
        <div
          style={styles.modal}
          onClick={() => setSelectedMatch(null)}
        >
          <div
            style={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={styles.closeBtn}
              onClick={() => setSelectedMatch(null)}
            >
              <X />
            </button>

            <h2>{selectedMatch?.name}</h2>

            <p>{selectedMatch?.bio}</p>

            <div style={styles.modalSkills}>
              <div>
                <h4>Skills Offered</h4>

                {(selectedMatch?.skillsOffered || []).map((s, i) => (
                  <span key={i} style={styles.skillTag}>
                    {s}
                  </span>
                ))}
              </div>

              <div>
                <h4>Skills Wanted</h4>

                {(selectedMatch?.skillsWanted || []).map((s, i) => (
                  <span
                    key={i}
                    style={{
                      ...styles.skillTag,
                      ...styles.skillTagWanted
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <button
              style={styles.primaryBtn}
              onClick={() => handleConnect(selectedMatch)}
            >
              Send Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "30px"
  },

  header: {
    marginBottom: "30px"
  },

  title: {
    fontSize: "32px",
    fontWeight: "700"
  },

  subtitle: {
    opacity: 0.7
  },

  matchesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
    gap: "20px"
  },

  matchCard: {
    padding: "20px",
    borderRadius: "14px",
    background: "white",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
  },

  matchHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px"
  },

  matchBadge: {
    fontSize: "12px",
    fontWeight: "600"
  },

  matchScore: {
    fontWeight: "700"
  },

  userInfo: {
    display: "flex",
    gap: "10px",
    alignItems: "center"
  },

  avatar: {
    fontSize: "40px"
  },

  rating: {
    display: "flex",
    gap: "4px",
    alignItems: "center",
    fontSize: "12px"
  },

  bio: {
    fontSize: "13px",
    margin: "10px 0"
  },

  mutualBadge: {
    fontSize: "12px",
    color: "red",
    marginBottom: "10px"
  },

  skillGroup: {
    marginBottom: "10px"
  },

  skillLabel: {
    fontSize: "12px",
    fontWeight: "600"
  },

  skillTag: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "10px",
    background: "#e0e7ff",
    fontSize: "11px",
    marginRight: "6px"
  },

  skillTagWanted: {
    background: "#d1fae5"
  },

  actions: {
    display: "flex",
    gap: "8px"
  },

  connectBtn: {
    flex: 1,
    padding: "8px",
    background: "#6366f1",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer"
  },

  viewBtn: {
    flex: 1,
    padding: "8px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  emptyState: {
    textAlign: "center",
    padding: "80px"
  },

  primaryBtn: {
    padding: "10px 20px",
    background: "#6366f1",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer"
  },

  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  modalContent: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    width: "400px"
  },

  closeBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    cursor: "pointer"
  },

  modalSkills: {
    marginTop: "20px"
  }
};

export default Matching;