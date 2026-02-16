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
          <div key={index} style={styles.statCard}>
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
              <div key={index} style={styles.activityItem}>
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
              <div key={user.id} style={styles.matchCard}>
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
        <button onClick={() => navigate('/matching')} style={{...styles.actionButton, backgroundColor: 'var(--primary-color)'}}>
          <Users size={20} />
          Find Matches
        </button>
        <button onClick={() => navigate('/profile')} style={{...styles.actionButton, backgroundColor: 'var(--secondary-color)'}}>
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
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)'
  },
  statIcon: {
    padding: '12px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statValue: {
    fontSize: '28px',
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
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: 'var(--shadow)'
  },
  sectionTitle: {
    fontSize: '18px',
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
    padding: '12px',
    backgroundColor: 'var(--bg-gray)',
    borderRadius: '8px'
  },
  activityIcon: {
    fontSize: '24px'
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
    backgroundColor: 'var(--bg-gray)',
    borderRadius: '8px',
    border: '1px solid var(--border-color)'
  },
  matchHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px'
  },
  matchAvatar: {
    fontSize: '32px'
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
    padding: '8px',
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500'
  },
  quickActions: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center'
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 28px',
    color: 'white',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    boxShadow: 'var(--shadow)'
  }
};

export default Home;
