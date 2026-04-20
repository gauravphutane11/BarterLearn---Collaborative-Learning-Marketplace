import React, { useState } from "react";
import { Plus, X, Save, Award, Edit2, Shield, User } from "lucide-react";
import { popularSkills } from "../data/staticData";

export default function Profile({ currentUser = {}, updateUser }) {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    bio: currentUser?.bio || "",
    skillsOffered: [...(currentUser?.skillsOffered || [])],
    skillsWanted: [...(currentUser?.skillsWanted || [])]
  });

  const [newSkillOffered, setNewSkillOffered] = useState("");
  const [newSkillWanted, setNewSkillWanted] = useState("");

  const handleSave = async () => {
    try {
      await updateUser(formData);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const addSkill = (type) => {
    const skill = type === 'offered' ? newSkillOffered : newSkillWanted;
    const targetArray = type === 'offered' ? formData.skillsOffered : formData.skillsWanted;
    
    if (skill && !targetArray.includes(skill)) {
      setFormData({
        ...formData,
        [type === 'offered' ? 'skillsOffered' : 'skillsWanted']: [...targetArray, skill]
      });
      type === 'offered' ? setNewSkillOffered("") : setNewSkillWanted("");
    }
  };

  const removeSkill = (type, skillToRemove) => {
    const key = type === 'offered' ? 'skillsOffered' : 'skillsWanted';
    setFormData({
      ...formData,
      [key]: formData[key].filter(s => s !== skillToRemove)
    });
  };

  return (
    <div className="page-container-sm" style={styles.container}>
      {/* HEADER */}
      <div className="section-header anim-fadeInUp">
        <div>
          <h1 className="section-title">My Profile</h1>
          <p className="section-subtitle">Manage your personal information and skills.</p>
        </div>
        {!isEditing ? (
          <button className="btn btn-ghost" onClick={() => setIsEditing(true)}>
            <Edit2 size={16} /> Edit Profile
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-ghost" onClick={() => setIsEditing(false)}>Cancel</button>
            <button className="btn btn-success" onClick={handleSave}>
              <Save size={16} /> Save Changes
            </button>
          </div>
        )}
      </div>

      <div style={styles.grid}>
        {/* IDENTiTY CARD */}
        <div className="glass-card-static anim-fadeInUp delay-1" style={styles.card}>
          <div style={styles.identityTop}>
            <div className="avatar-ring">
              <div className="avatar-inner" style={{ width: 80, height: 80, fontSize: 40 }}>
                {currentUser?.avatar || "🙂"}
              </div>
            </div>
            <div style={styles.identityInfo}>
              <h2 style={styles.name}>{currentUser?.name || "User"}</h2>
              <p style={styles.email}>{currentUser?.email}</p>
              
              <div style={styles.badges}>
                <span className="badge badge-primary">
                  <Shield size={12} /> Verified Member
                </span>
                <span className="badge badge-warning">
                  <Award size={12} /> {currentUser?.rating || 0} Rating
                </span>
              </div>
            </div>
          </div>

          <div className="divider" />

          <div className="form-group">
            <label className="form-label">About Me</label>
            {isEditing ? (
              <textarea
                className="form-input form-textarea"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Write a short bio about yourself..."
              />
            ) : (
              <p style={styles.bioText}>
                {currentUser?.bio || <span style={{ opacity: 0.5 }}>No bio provided yet. Click "Edit Profile" to add one.</span>}
              </p>
            )}
          </div>
        </div>

        {/* SKILLS CARDS */}
        <div style={styles.skillsWrapper}>
          {/* SKILLS OFFERED */}
          <div className="glass-card-static anim-fadeInUp delay-2" style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Skills I Offer</h3>
              <span className="badge badge-primary">{formData.skillsOffered.length}</span>
            </div>
            <p style={styles.cardDesc}>Skills you are proficient in and willing to teach others.</p>

            <div style={styles.skillBox}>
              {(isEditing ? formData.skillsOffered : currentUser?.skillsOffered || []).length === 0 && !isEditing ? (
                <p className="text-muted text-sm">No skills added.</p>
              ) : (
                <div style={styles.skillTags}>
                  {(isEditing ? formData.skillsOffered : currentUser?.skillsOffered || []).map((skill, idx) => (
                    <span key={idx} className="skill-tag skill-tag-offered anim-scaleIn">
                      {skill}
                      {isEditing && (
                        <button style={styles.removeBtn} onClick={() => removeSkill('offered', skill)}>
                          <X size={12} />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              )}

              {isEditing && (
                <div style={styles.skillInputWrap}>
                  <select
                    className="form-input form-select"
                    style={{ color: 'black' }}
                    value={newSkillOffered}
                    onChange={(e) => setNewSkillOffered(e.target.value)}
                  >
                    <option value="" style={{ color: 'black' }}>Select a skill...</option>
                    {popularSkills
                      .filter(s => !formData.skillsOffered.includes(s))
                      .map((s, i) => <option key={i} value={s} style={{ color: 'black' }}>{s}</option>)}
                  </select>
                  <button className="btn btn-primary btn-icon" onClick={() => addSkill('offered')} disabled={!newSkillOffered}>
                    <Plus size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* SKILLS WANTED */}
          <div className="glass-card-static anim-fadeInUp delay-3" style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Skills I Want</h3>
              <span className="badge badge-success">{formData.skillsWanted.length}</span>
            </div>
            <p style={styles.cardDesc}>Skills you want to learn from other members.</p>

            <div style={styles.skillBox}>
              {(isEditing ? formData.skillsWanted : currentUser?.skillsWanted || []).length === 0 && !isEditing ? (
                <p className="text-muted text-sm">No skills added.</p>
              ) : (
                <div style={styles.skillTags}>
                  {(isEditing ? formData.skillsWanted : currentUser?.skillsWanted || []).map((skill, idx) => (
                    <span key={idx} className="skill-tag skill-tag-wanted anim-scaleIn">
                      {skill}
                      {isEditing && (
                        <button style={styles.removeBtn} onClick={() => removeSkill('wanted', skill)}>
                          <X size={12} />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              )}

              {isEditing && (
                <div style={styles.skillInputWrap}>
                  <select
                    className="form-input form-select"
                    style={{ color: 'black' }}
                    value={newSkillWanted}
                    onChange={(e) => setNewSkillWanted(e.target.value)}
                  >
                    <option value="" style={{ color: 'black' }}>Select a skill...</option>
                    {popularSkills
                      .filter(s => !formData.skillsWanted.includes(s))
                      .map((s, i) => <option key={i} value={s} style={{ color: 'black' }}>{s}</option>)}
                  </select>
                  <button className="btn btn-success btn-icon" onClick={() => addSkill('wanted')} disabled={!newSkillWanted}>
                    <Plus size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    paddingBottom: 60
  },
  grid: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  card: {
    padding: "32px",
  },
  identityTop: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },
  identityInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  name: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#fff",
    letterSpacing: "-0.02em",
    lineHeight: 1,
  },
  email: {
    fontSize: "14px",
    color: "var(--text-secondary)",
    marginBottom: "8px",
  },
  badges: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  bioText: {
    fontSize: "15px",
    color: "var(--text-primary)",
    lineHeight: "1.6",
    background: "rgba(255,255,255,0.02)",
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid var(--border)",
  },
  
  skillsWrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "6px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#fff",
  },
  cardDesc: {
    fontSize: "13px",
    color: "var(--text-secondary)",
    marginBottom: "20px",
  },
  skillBox: {
    background: "rgba(0,0,0,0.2)",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid var(--border)",
    minHeight: "140px",
    display: "flex",
    flexDirection: "column",
  },
  skillTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "auto",
  },
  removeBtn: {
    background: "rgba(0,0,0,0.2)",
    border: "none",
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "inherit",
    cursor: "pointer",
    padding: 0,
    marginLeft: "4px",
  },
  skillInputWrap: {
    display: "flex",
    gap: "10px",
    marginTop: "24px",
    paddingTop: "16px",
    borderTop: "1px dashed var(--border)",
  }
};