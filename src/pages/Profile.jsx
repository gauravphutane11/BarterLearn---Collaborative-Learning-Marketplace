import React, { useState } from 'react';
import { Plus, X, Save, Award } from 'lucide-react';
import { popularSkills } from '../data/staticData';

const Profile = ({ currentUser, updateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: currentUser.bio,
    skillsOffered: [...currentUser.skillsOffered],
    skillsWanted: [...currentUser.skillsWanted]
  });
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');

  const handleSave = () => {
    updateUser({ ...currentUser, ...formData });
    setIsEditing(false);
  };

  const addSkillOffered = () => {
    if (newSkillOffered && !formData.skillsOffered.includes(newSkillOffered)) {
      setFormData({
        ...formData,
        skillsOffered: [...formData.skillsOffered, newSkillOffered]
      });
      setNewSkillOffered('');
    }
  };

  const addSkillWanted = () => {
    if (newSkillWanted && !formData.skillsWanted.includes(newSkillWanted)) {
      setFormData({
        ...formData,
        skillsWanted: [...formData.skillsWanted, newSkillWanted]
      });
      setNewSkillWanted('');
    }
  };

  const removeSkillOffered = (skill) => {
    setFormData({
      ...formData,
      skillsOffered: formData.skillsOffered.filter(s => s !== skill)
    });
  };

  const removeSkillWanted = (skill) => {
    setFormData({
      ...formData,
      skillsWanted: formData.skillsWanted.filter(s => s !== skill)
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
            <button onClick={() => setIsEditing(false)} style={styles.cancelButton}>
              Cancel
            </button>
            <button onClick={handleSave} style={styles.saveButton}>
              <Save size={18} />
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div style={styles.content}>
        <div style={styles.profileCard}>
          <div style={styles.profileHeader}>
            <span style={styles.avatar}>{currentUser.avatar}</span>
            <div>
              <h2 style={styles.name}>{currentUser.name}</h2>
              <p style={styles.email}>{currentUser.email}</p>
              <div style={styles.stats}>
                <span style={styles.statBadge}>
                  <Award size={16} />
                  {currentUser.rating} ⭐
                </span>
                <span style={styles.statBadge}>
                  {currentUser.completedExchanges} exchanges
                </span>
              </div>
            </div>
          </div>

          <div style={styles.bioSection}>
            <h3 style={styles.sectionTitle}>Bio</h3>
            {isEditing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                style={styles.textarea}
                rows="3"
              />
            ) : (
              <p style={styles.bio}>{currentUser.bio}</p>
            )}
          </div>
        </div>

        <div style={styles.skillsGrid}>
          <div style={styles.skillCard}>
            <h3 style={styles.skillCardTitle}>Skills I Offer 🎓</h3>
            <div style={styles.skillList}>
              {(isEditing ? formData.skillsOffered : currentUser.skillsOffered).map((skill, index) => (
                <span key={index} style={styles.skillTag}>
                  {skill}
                  {isEditing && (
                    <button onClick={() => removeSkillOffered(skill)} style={styles.removeButton}>
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
                  <option value="">Select a skill...</option>
                  {popularSkills
                    .filter(s => !formData.skillsOffered.includes(s))
                    .map((skill, index) => (
                      <option key={index} value={skill}>{skill}</option>
                    ))}
                </select>
                <button onClick={addSkillOffered} style={styles.addButton}>
                  <Plus size={18} />
                  Add
                </button>
              </div>
            )}
          </div>

          <div style={styles.skillCard}>
            <h3 style={styles.skillCardTitle}>Skills I Want to Learn 📚</h3>
            <div style={styles.skillList}>
              {(isEditing ? formData.skillsWanted : currentUser.skillsWanted).map((skill, index) => (
                <span key={index} style={{...styles.skillTag, ...styles.skillTagWanted}}>
                  {skill}
                  {isEditing && (
                    <button onClick={() => removeSkillWanted(skill)} style={styles.removeButton}>
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
                  <option value="">Select a skill...</option>
                  {popularSkills
                    .filter(s => !formData.skillsWanted.includes(s))
                    .map((skill, index) => (
                      <option key={index} value={skill}>{skill}</option>
                    ))}
                </select>
                <button onClick={addSkillWanted} style={styles.addButton}>
                  <Plus size={18} />
                  Add
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '40px 20px',
    flex: 1
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: 'var(--text-dark)'
  },
  editButton: {
    padding: '10px 20px',
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600'
  },
  editActions: {
    display: 'flex',
    gap: '12px'
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: 'var(--bg-gray)',
    color: 'var(--text-dark)',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600'
  },
  saveButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 20px',
    backgroundColor: 'var(--secondary-color)',
    color: 'white',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: 'var(--shadow)'
  },
  profileHeader: {
    display: 'flex',
    gap: '24px',
    marginBottom: '32px',
    alignItems: 'flex-start'
  },
  avatar: {
    fontSize: '80px'
  },
  name: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: 'var(--text-dark)',
    marginBottom: '4px'
  },
  email: {
    fontSize: '14px',
    color: 'var(--text-medium)',
    marginBottom: '12px'
  },
  stats: {
    display: 'flex',
    gap: '12px'
  },
  statBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    backgroundColor: 'var(--bg-gray)',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--text-dark)'
  },
  bioSection: {
    paddingTop: '24px',
    borderTop: '1px solid var(--border-color)'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--text-dark)',
    marginBottom: '12px'
  },
  bio: {
    fontSize: '14px',
    color: 'var(--text-medium)',
    lineHeight: '1.6'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  skillsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px'
  },
  skillCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: 'var(--shadow)'
  },
  skillCardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--text-dark)',
    marginBottom: '16px'
  },
  skillList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  skillTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    backgroundColor: '#e0e7ff',
    color: '#4338ca',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500'
  },
  skillTagWanted: {
    backgroundColor: '#d1fae5',
    color: '#065f46'
  },
  removeButton: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: '50%',
    padding: '2px',
    marginLeft: '4px'
  },
  addSkillSection: {
    display: 'flex',
    gap: '8px',
    marginTop: '16px'
  },
  select: {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    fontSize: '13px'
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '10px 16px',
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600'
  }
};

export default Profile;
