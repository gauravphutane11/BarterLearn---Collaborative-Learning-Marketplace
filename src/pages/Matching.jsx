import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Star, BookOpen, ArrowRight, Heart, X } from 'lucide-react';

const Matching = ({ currentUser, users }) => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    calculateMatches();
  }, []);

  const calculateMatches = () => {
    const otherUsers = users.filter(u => u.id !== currentUser.id);
    
    const scoredMatches = otherUsers.map(user => {
      let matchScore = 0;
      const commonSkills = [];
      
      // Check if user can teach what currentUser wants to learn
      currentUser.skillsWanted.forEach(wantedSkill => {
        if (user.skillsOffered.includes(wantedSkill)) {
          matchScore += 10;
          commonSkills.push({
            skill: wantedSkill,
            type: 'learn',
            canTeach: user.name
          });
        }
      });
      
      // Check if currentUser can teach what user wants to learn
      currentUser.skillsOffered.forEach(offeredSkill => {
        if (user.skillsWanted.includes(offeredSkill)) {
          matchScore += 10;
          commonSkills.push({
            skill: offeredSkill,
            type: 'teach',
            canTeach: currentUser.name
          });
        }
      });
      
      // Bonus for mutual exchange
      const mutualExchange = commonSkills.some(s => s.type === 'learn') && 
                            commonSkills.some(s => s.type === 'teach');
      if (mutualExchange) matchScore += 20;
      
      // Rating bonus
      matchScore += user.rating * 2;
      
      return {
        user,
        matchScore,
        commonSkills,
        mutualExchange
      };
    });
    
    // Sort by match score
    const sortedMatches = scoredMatches
      .filter(m => m.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);
    
    setMatches(sortedMatches);
  };

  const handleConnect = (match) => {
    alert(`Connection request sent to ${match.user.name}! 🎉\n\nIn a real app, this would send a notification and create a chat.`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Find Learning Partners</h1>
          <p style={styles.subtitle}>
            Matched with {matches.length} learners based on complementary skills
          </p>
        </div>
      </div>

      <div style={styles.content}>
        {matches.length === 0 ? (
          <div style={styles.emptyState}>
            <Users size={64} color="var(--text-light)" />
            <h3 style={styles.emptyTitle}>No matches found</h3>
            <p style={styles.emptyText}>
              Add more skills to your profile to find compatible learning partners
            </p>
            <button onClick={() => navigate('/profile')} style={styles.emptyButton}>
              Update Profile
            </button>
          </div>
        ) : (
          <div style={styles.matchesGrid}>
            {matches.map((match, index) => (
              <div key={match.user.id} style={styles.matchCard}>
                <div style={styles.matchHeader}>
                  <div style={styles.matchBadge}>
                    #{index + 1} Match
                  </div>
                  <div style={styles.matchScore}>
                    {Math.round(match.matchScore)}% Compatible
                  </div>
                </div>

                <div style={styles.userInfo}>
                  <span style={styles.userAvatar}>{match.user.avatar}</span>
                  <div>
                    <h3 style={styles.userName}>{match.user.name}</h3>
                    <div style={styles.userRating}>
                      <Star size={16} fill="gold" color="gold" />
                      <span>{match.user.rating}</span>
                      <span style={styles.exchanges}>
                        • {match.user.completedExchanges} exchanges
                      </span>
                    </div>
                  </div>
                </div>

                <p style={styles.userBio}>{match.user.bio}</p>

                <div style={styles.skillsSection}>
                  {match.mutualExchange && (
                    <div style={styles.mutualBadge}>
                      <Heart size={14} fill="red" color="red" />
                      Perfect Match - Mutual Exchange Possible!
                    </div>
                  )}
                  
                  <div style={styles.commonSkills}>
                    <h4 style={styles.skillsSectionTitle}>Skill Exchange Opportunities:</h4>
                    {match.commonSkills.map((common, idx) => (
                      <div key={idx} style={styles.commonSkill}>
                        {common.type === 'learn' ? (
                          <>
                            <BookOpen size={16} color="var(--secondary-color)" />
                            <span>You can learn <strong>{common.skill}</strong> from them</span>
                          </>
                        ) : (
                          <>
                            <BookOpen size={16} color="var(--primary-color)" />
                            <span>You can teach <strong>{common.skill}</strong> to them</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={styles.allSkills}>
                  <div style={styles.skillGroup}>
                    <p style={styles.skillLabel}>They offer:</p>
                    <div style={styles.skillTags}>
                      {match.user.skillsOffered.slice(0, 3).map((skill, idx) => (
                        <span key={idx} style={styles.skillTag}>{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div style={styles.skillGroup}>
                    <p style={styles.skillLabel}>They want:</p>
                    <div style={styles.skillTags}>
                      {match.user.skillsWanted.slice(0, 3).map((skill, idx) => (
                        <span key={idx} style={{...styles.skillTag, ...styles.skillTagWanted}}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={styles.actions}>
                  <button 
                    onClick={() => handleConnect(match)}
                    style={styles.connectButton}
                  >
                    <Users size={18} />
                    Connect
                  </button>
                  <button 
                    onClick={() => setSelectedMatch(match)}
                    style={styles.viewButton}
                  >
                    View Full Profile
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedMatch && (
        <div style={styles.modal} onClick={() => setSelectedMatch(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedMatch(null)} style={styles.closeButton}>
              <X size={24} />
            </button>
            <div style={styles.modalHeader}>
              <span style={styles.modalAvatar}>{selectedMatch.user.avatar}</span>
              <div>
                <h2 style={styles.modalName}>{selectedMatch.user.name}</h2>
                <p style={styles.modalEmail}>{selectedMatch.user.email}</p>
              </div>
            </div>
            <p style={styles.modalBio}>{selectedMatch.user.bio}</p>
            <div style={styles.modalSkills}>
              <div>
                <h4 style={styles.modalSkillTitle}>Skills Offered</h4>
                {selectedMatch.user.skillsOffered.map((skill, idx) => (
                  <span key={idx} style={styles.modalSkillTag}>{skill}</span>
                ))}
              </div>
              <div>
                <h4 style={styles.modalSkillTitle}>Skills Wanted</h4>
                {selectedMatch.user.skillsWanted.map((skill, idx) => (
                  <span key={idx} style={{...styles.modalSkillTag, ...styles.skillTagWanted}}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <button onClick={() => handleConnect(selectedMatch)} style={styles.modalConnectButton}>
              <Users size={20} />
              Send Connection Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    flex: 1
  },
  header: {
    marginBottom: '32px'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: 'var(--text-dark)',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '16px',
    color: 'var(--text-medium)'
  },
  content: {
    minHeight: '400px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)'
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'var(--text-dark)',
    marginTop: '16px',
    marginBottom: '8px'
  },
  emptyText: {
    fontSize: '14px',
    color: 'var(--text-medium)',
    marginBottom: '24px'
  },
  emptyButton: {
    padding: '12px 24px',
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600'
  },
  matchesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '24px'
  },
  matchCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: 'var(--shadow)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  matchHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  matchBadge: {
    padding: '6px 12px',
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  },
  matchScore: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--secondary-color)'
  },
  userInfo: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  userAvatar: {
    fontSize: '48px'
  },
  userName: {
    fontSize: '20px',
    fontWeight: '600',
    color: 'var(--text-dark)',
    marginBottom: '4px'
  },
  userRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '13px',
    color: 'var(--text-medium)'
  },
  exchanges: {
    color: 'var(--text-light)'
  },
  userBio: {
    fontSize: '13px',
    color: 'var(--text-medium)',
    lineHeight: '1.5'
  },
  skillsSection: {
    padding: '12px',
    backgroundColor: 'var(--bg-gray)',
    borderRadius: '8px'
  },
  mutualBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '12px'
  },
  commonSkills: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  skillsSectionTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-dark)',
    marginBottom: '4px'
  },
  commonSkill: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: 'var(--text-dark)'
  },
  allSkills: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  skillGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  skillLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--text-medium)'
  },
  skillTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px'
  },
  skillTag: {
    padding: '4px 10px',
    backgroundColor: '#e0e7ff',
    color: '#4338ca',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '500'
  },
  skillTagWanted: {
    backgroundColor: '#d1fae5',
    color: '#065f46'
  },
  actions: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px'
  },
  connectButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '12px',
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600'
  },
  viewButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '12px',
    backgroundColor: 'var(--bg-gray)',
    color: 'var(--text-dark)',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative'
  },
  closeButton: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    padding: '8px',
    backgroundColor: 'transparent',
    color: 'var(--text-medium)'
  },
  modalHeader: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    marginBottom: '16px'
  },
  modalAvatar: {
    fontSize: '64px'
  },
  modalName: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'var(--text-dark)',
    marginBottom: '4px'
  },
  modalEmail: {
    fontSize: '14px',
    color: 'var(--text-medium)'
  },
  modalBio: {
    fontSize: '14px',
    color: 'var(--text-dark)',
    lineHeight: '1.6',
    marginBottom: '24px'
  },
  modalSkills: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '24px'
  },
  modalSkillTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-dark)',
    marginBottom: '8px'
  },
  modalSkillTag: {
    display: 'inline-block',
    padding: '6px 12px',
    backgroundColor: '#e0e7ff',
    color: '#4338ca',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: '500',
    marginRight: '6px',
    marginBottom: '6px'
  },
  modalConnectButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px',
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600'
  }
};

export default Matching;
