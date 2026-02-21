import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Video, TrendingUp, Award, ArrowRight } from 'lucide-react';

const Home = ({ currentUser, users }) => {
  const navigate = useNavigate();

  const stats = [
    { icon: Users, label: 'Active Matches', value: currentUser.activeMatches?.length || 0, color: '#6366f1' },
    { icon: Video, label: 'Sessions This Month', value: 8, color: '#10b981' },
    { icon: TrendingUp, label: 'Completed Exchanges', value: currentUser.completedExchanges, color: '#f59e0b' },
    { icon: Award, label: 'Rating', value: currentUser.rating + ' ⭐', color: '#ef4444' }
  ];

  const recentActivity = [
    { type: 'session', partner: 'Sarah Chen', skill: 'UI/UX Design', time: '2 hours ago' },
    { type: 'match', partner: 'Marcus Williams', skill: 'Machine Learning', time: '1 day ago' },
    { type: 'complete', partner: 'Emma Rodriguez', skill: 'Spanish', time: '3 days ago' }
  ];

  const suggestedMatches = users
    .filter(u => u.id !== currentUser.id)
    .slice(0, 3);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Welcome back, {currentUser.name.split(' ')[0]}! 👋</h1>
        <p style={styles.subtitle}>Continue your learning journey</p>
      </div>

      <div style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div 
            key={index} 
            style={{
              ...styles.statCard,
              animationDelay: `${index * 0.1}s`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{ ...styles.statIcon, backgroundColor: stat.color + '20', color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div>
              <p style={styles.statValue}>{stat.value}</p>
              <p style={styles.statLabel}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.grid}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Recent Activity</h2>
          <div style={styles.activityList}>
            {recentActivity.map((activity, index) => (
              <div 
                key={index} 
                style={styles.activityItem}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(8px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={styles.activityIcon}>
                  {activity.type === 'session' && '🎥'}
                  {activity.type === 'match' && '🤝'}
                  {activity.type === 'complete' && '✅'}
                </div>
                <div style={styles.activityContent}>
                  <p style={styles.activityTitle}>
                    {activity.type === 'session' && `Session with ${activity.partner}`}
                    {activity.type === 'match' && `Matched with ${activity.partner}`}
                    {activity.type === 'complete' && `Completed exchange with ${activity.partner}`}
                  </p>
                  <p style={styles.activitySubtitle}>{activity.skill} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Suggested Matches</h2>
          <div style={styles.matchList}>
            {suggestedMatches.map((user) => (
              <div 
                key={user.id} 
                style={styles.matchCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={styles.matchHeader}>
                  <span style={styles.matchAvatar}>{user.avatar}</span>
                  <div>
                    <p style={styles.matchName}>{user.name}</p>
                    <p style={styles.matchRating}>⭐ {user.rating}</p>
                  </div>
                </div>
                <p style={styles.matchSkills}>
                  <strong>Offers:</strong> {user.skillsOffered.slice(0, 2).join(', ')}
                </p>
                <button 
                  onClick={() => navigate('/matching')}
                  style={styles.matchButton}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                  }}
                >
                  View Match
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.quickActions}>
        <button 
          onClick={() => navigate('/matching')} 
          style={{...styles.actionButton, backgroundColor: 'var(--primary-color)'}}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(99, 102, 241, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
          }}
        >
          <Users size={20} />
          Find Matches
        </button>
        <button 
          onClick={() => navigate('/profile')} 
          style={{...styles.actionButton, backgroundColor: 'var(--secondary-color)'}}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(16, 185, 129, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
          }}
        >
          <TrendingUp size={20} />
          Update Profile
        </button>
      </div>
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
    marginBottom: '32px',
    animation: 'slideInUp 0.6s ease-out'
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '16px',
    color: 'var(--text-medium)'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '32px'
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '24px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    animation: 'slideInUp 0.6s ease-out',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  },
  statIcon: {
    padding: '16px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease'
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: 'var(--text-dark)',
    marginBottom: '4px'
  },
  statLabel: {
    fontSize: '13px',
    color: 'var(--text-medium)',
    fontWeight: '500'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  },
  section: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    animation: 'slideInUp 0.8s ease-out',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: 'var(--text-dark)',
    marginBottom: '20px'
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  activityItem: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    border: '1px solid var(--border-color)'
  },
  activityIcon: {
    fontSize: '28px',
    animation: 'pulse 2s ease-in-out infinite'
  },
  activityContent: {
    flex: 1
  },
  activityTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--text-dark)',
    marginBottom: '4px'
  },
  activitySubtitle: {
    fontSize: '12px',
    color: 'var(--text-medium)'
  },
  matchList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  matchCard: {
    padding: '16px',
    background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  matchHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px'
  },
  matchAvatar: {
    fontSize: '36px',
    animation: 'float 3s ease-in-out infinite'
  },
  matchName: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--text-dark)'
  },
  matchRating: {
    fontSize: '13px',
    color: 'var(--text-medium)'
  },
  matchSkills: {
    fontSize: '13px',
    color: 'var(--text-dark)',
    marginBottom: '12px',
    lineHeight: '1.5'
  },
  matchButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    width: '100%',
    padding: '10px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
  },
  quickActions: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    animation: 'slideInUp 1s ease-out'
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '16px 32px',
    color: 'white',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  }
};

export default Home;
