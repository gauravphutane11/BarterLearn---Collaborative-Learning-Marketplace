import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Video, TrendingUp, Award, ArrowRight, BookOpen, MessageSquare, Zap } from 'lucide-react';

const Home = ({ currentUser, users }) => {
  const navigate = useNavigate();

  const stats = [
    { icon: Users, label: 'Active Matches', value: currentUser.activeMatches?.length || 0, color: '#6366f1' },
    { icon: Video, label: 'Sessions This Month', value: 8, color: '#10b981' },
    { icon: TrendingUp, label: 'Completed Exchanges', value: currentUser.completedExchanges, color: '#f59e0b' },
    { icon: Award, label: 'Rating', value: currentUser.rating + ' ⭐', color: '#f43f5e' }
  ];

  const steps = [
    { icon: Users, title: 'Find a Partner', desc: 'Browse users who want what you teach.' },
    { icon: MessageSquare, title: 'Connect & Chat', desc: 'Discuss your learning goals and schedule.' },
    { icon: Zap, title: 'Learn & Teach', desc: 'Jump into a video session and start trading.' }
  ];

  const suggestedMatches = users
    .filter(u => u.id !== currentUser.id)
    .slice(0, 3);

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Master New Skills through <span className="gradient-text">Collaboration</span>
          </h1>
          <p style={styles.heroSubtitle}>
            BarterLearn is the world's first skill-exchange marketplace. Teach what you know, learn what you don't.
          </p>
          <div style={styles.heroActions}>
            <button 
              onClick={() => navigate('/matching')} 
              style={styles.primaryBtn}
            >
              Explore Matches <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => navigate('/profile')} 
              style={styles.secondaryBtn}
            >
              Set Up Profile
            </button>
          </div>
        </div>
        <div style={styles.heroGraphic}>
          <div className="animate-float" style={styles.floatingCard}>
            <Zap color="#6366f1" size={40} />
            <p>12k+ Active Learners</p>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="premium-card"
            style={{
              ...styles.statCard,
              animationDelay: `${index * 0.1}s`
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

      {/* How it Works */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>How BarterLearn Works</h2>
        <div style={styles.stepsGrid}>
          {steps.map((step, i) => (
            <div key={i} style={styles.stepCard}>
              <div style={styles.stepIcon}>
                <step.icon size={32} color="var(--primary-color)" />
              </div>
              <h3 style={styles.stepTitle}>{step.title}</h3>
              <p style={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div style={styles.grid}>
        {/* Suggested Matches */}
        <div className="premium-card" style={styles.mainSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>People matching your interests</h2>
            <button onClick={() => navigate('/matching')} style={styles.textBtn}>View all</button>
          </div>
          <div style={styles.matchList}>
            {suggestedMatches.map((user) => (
              <div key={user.id} style={styles.matchItem}>
                <div style={styles.matchInfo}>
                  <span style={styles.matchAvatar}>{user.avatar}</span>
                  <div>
                    <p style={styles.matchName}>{user.name}</p>
                    <p style={styles.matchSkills}>Offers: {user.skillsOffered.join(', ')}</p>
                  </div>
                </div>
                <button onClick={() => navigate('/matching')} style={styles.matchActionBtn}>Connect</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px 80px',
  },
  heroSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '100px 0 60px',
    gap: '40px',
    minHeight: '70vh'
  },
  heroContent: {
    flex: 1,
    maxWidth: '640px'
  },
  heroTitle: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '64px',
    fontWeight: '800',
    lineHeight: '1.1',
    marginBottom: '24px',
    color: '#fff'
  },
  heroSubtitle: {
    fontSize: '20px',
    color: 'var(--text-light)',
    lineHeight: '1.6',
    marginBottom: '40px'
  },
  heroActions: {
    display: 'flex',
    gap: '16px'
  },
  primaryBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '16px 32px',
    background: 'var(--primary-color)',
    color: '#fff',
    borderRadius: '14px',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)'
  },
  secondaryBtn: {
    padding: '16px 32px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#fff',
    borderRadius: '14px',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  heroGraphic: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  floatingCard: {
    background: 'rgba(30, 41, 59, 0.8)',
    backdropFilter: 'blur(20px)',
    padding: '32px',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    textAlign: 'center',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '24px',
    marginBottom: '80px'
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '24px'
  },
  statIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '4px'
  },
  statLabel: {
    fontSize: '14px',
    color: 'var(--text-light)'
  },
  section: {
    marginBottom: '80px'
  },
  sectionTitle: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '40px',
    textAlign: 'center'
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '32px'
  },
  stepCard: {
    textAlign: 'center',
    padding: '40px',
    borderRadius: '24px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  stepIcon: {
    width: '64px',
    height: '64px',
    margin: '0 auto 24px',
    background: 'rgba(99, 102, 241, 0.1)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '12px'
  },
  stepDesc: {
    color: 'var(--text-light)',
    lineHeight: '1.6'
  },
  grid: {
    maxWidth: '900px',
    margin: '0 auto'
  },
  mainSection: {
    padding: '32px'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  textBtn: {
    background: 'none',
    color: 'var(--primary-color)',
    fontWeight: '600',
    fontSize: '14px'
  },
  matchList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  matchItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  matchInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  matchAvatar: {
    fontSize: '32px'
  },
  matchName: {
    fontWeight: '600',
    fontSize: '16px'
  },
  matchSkills: {
    fontSize: '13px',
    color: 'var(--text-light)'
  },
  matchActionBtn: {
    padding: '8px 20px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#fff',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  }
};

export default Home;
