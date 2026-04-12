import React, { useState } from "react";
import { Plus, X, Save, Award } from "lucide-react";
import { popularSkills } from "../data/staticData";

const Profile = ({ currentUser = {}, updateUser }) => {
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
      alert("Profile updated successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    }
  };

  const addSkillOffered = () => {
    if (newSkillOffered && !formData.skillsOffered.includes(newSkillOffered)) {
      setFormData({
        ...formData,
        skillsOffered: [...formData.skillsOffered, newSkillOffered]
      });
      setNewSkillOffered("");
    }
  };

  const addSkillWanted = () => {
    if (newSkillWanted && !formData.skillsWanted.includes(newSkillWanted)) {
      setFormData({
        ...formData,
        skillsWanted: [...formData.skillsWanted, newSkillWanted]
      });
      setNewSkillWanted("");
    }
  };

  const removeSkillOffered = (skill) => {
    setFormData({
      ...formData,
      skillsOffered: formData.skillsOffered.filter((s) => s !== skill)
    });
  };

  const removeSkillWanted = (skill) => {
    setFormData({
      ...formData,
      skillsWanted: formData.skillsWanted.filter((s) => s !== skill)
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Profile</h1>

        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} style={styles.editButton}>
            Edit Profile
          </button>
        ) : (
          <div style={styles.editActions}>
            <button
              onClick={() => setIsEditing(false)}
              style={styles.cancelButton}
            >
              Cancel
            </button>

            <button onClick={handleSave} style={styles.saveButton}>
              <Save size={18} />
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div style={styles.profileCard}>
        <div style={styles.profileHeader}>
          <span style={styles.avatar}>{currentUser?.avatar || "🙂"}</span>

          <div>
            <h2 style={styles.name}>{currentUser?.name || "User"}</h2>

            <p style={styles.email}>{currentUser?.email}</p>

            <div style={styles.stats}>
              <span style={styles.statBadge}>
                <Award size={16} />
                {currentUser?.rating || 0} ⭐
              </span>

              <span style={styles.statBadge}>
                {currentUser?.completedExchanges || 0} exchanges
              </span>
            </div>
          </div>
        </div>

        <div style={styles.bioSection}>
          <h3 style={styles.sectionTitle}>Bio</h3>

          {isEditing ? (
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              style={styles.textarea}
            />
          ) : (
            <p style={styles.bio}>{currentUser?.bio || "No bio added yet."}</p>
          )}
        </div>
      </div>

      <div style={styles.skillsGrid}>
        {/* Skills Offered */}
        <div style={styles.skillCard}>
          <h3 style={styles.skillCardTitle}>Skills I Offer 🎓</h3>

          <div style={styles.skillList}>
            {(isEditing
              ? formData.skillsOffered
              : currentUser?.skillsOffered || []
            ).map((skill, index) => (
              <span key={index} style={styles.skillTag}>
                {skill}

                {isEditing && (
                  <button
                    onClick={() => removeSkillOffered(skill)}
                    style={styles.removeButton}
                  >
                    <X size={14} />
                  </button>
                )}
              </span>
            ))}
          </div>

          {isEditing && (
            <div style={styles.addSkillSection}>
              <select
                value={newSkillOffered}
                onChange={(e) => setNewSkillOffered(e.target.value)}
                style={styles.select}
              >
                <option value="">Select skill</option>

                {popularSkills
                  .filter((s) => !formData.skillsOffered.includes(s))
                  .map((skill, index) => (
                    <option key={index} value={skill}>
                      {skill}
                    </option>
                  ))}
              </select>

              <button onClick={addSkillOffered} style={styles.addButton}>
                <Plus size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Skills Wanted */}
        <div style={styles.skillCard}>
          <h3 style={styles.skillCardTitle}>Skills I Want 📚</h3>

          <div style={styles.skillList}>
            {(isEditing
              ? formData.skillsWanted
              : currentUser?.skillsWanted || []
            ).map((skill, index) => (
              <span
                key={index}
                style={{ ...styles.skillTag, ...styles.skillTagWanted }}
              >
                {skill}

                {isEditing && (
                  <button
                    onClick={() => removeSkillWanted(skill)}
                    style={styles.removeButton}
                  >
                    <X size={14} />
                  </button>
                )}
              </span>
            ))}
          </div>

          {isEditing && (
            <div style={styles.addSkillSection}>
              <select
                value={newSkillWanted}
                onChange={(e) => setNewSkillWanted(e.target.value)}
                style={styles.select}
              >
                <option value="">Select skill</option>

                {popularSkills
                  .filter((s) => !formData.skillsWanted.includes(s))
                  .map((skill, index) => (
                    <option key={index} value={skill}>
                      {skill}
                    </option>
                  ))}
              </select>

              <button onClick={addSkillWanted} style={styles.addButton}>
                <Plus size={18} />
              </button>
            </div>
          )}
        </div>
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
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "30px"
  },

  title: {
    fontSize: "32px",
    fontWeight: "700"
  },

  editButton: {
    padding: "10px 20px",
    background: "#6366f1",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer"
  },

  editActions: {
    display: "flex",
    gap: "10px"
  },

  cancelButton: {
    padding: "10px 20px",
    borderRadius: "8px"
  },

  saveButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "10px 20px",
    background: "#10b981",
    color: "white",
    borderRadius: "8px"
  },

  profileCard: {
    background: "white",
    borderRadius: "12px",
    padding: "30px",
    marginBottom: "20px"
  },

  profileHeader: {
    display: "flex",
    gap: "20px"
  },

  avatar: {
    fontSize: "70px"
  },

  name: {
    fontSize: "26px",
    fontWeight: "700"
  },

  email: {
    fontSize: "14px",
    opacity: 0.7
  },

  stats: {
    display: "flex",
    gap: "10px",
    marginTop: "10px"
  },

  statBadge: {
    display: "flex",
    gap: "4px",
    background: "#f3f4f6",
    padding: "4px 10px",
    borderRadius: "10px",
    fontSize: "12px"
  },

  bioSection: {
    marginTop: "20px"
  },

  sectionTitle: {
    fontWeight: "600",
    marginBottom: "8px"
  },

  bio: {
    fontSize: "14px"
  },

  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px"
  },

  skillsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px"
  },

  skillCard: {
    background: "white",
    padding: "20px",
    borderRadius: "12px"
  },

  skillCardTitle: {
    marginBottom: "12px"
  },

  skillList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px"
  },

  skillTag: {
    padding: "6px 12px",
    background: "#e0e7ff",
    borderRadius: "20px",
    fontSize: "12px"
  },

  skillTagWanted: {
    background: "#d1fae5"
  },

  removeButton: {
    marginLeft: "6px"
  },

  addSkillSection: {
    display: "flex",
    gap: "8px",
    marginTop: "10px"
  },

  select: {
    flex: 1,
    padding: "8px"
  },

  addButton: {
    padding: "8px 12px",
    background: "#6366f1",
    color: "white",
    borderRadius: "6px"
  }
};

export default Profile;