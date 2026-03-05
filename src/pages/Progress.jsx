import React, { useState, useEffect } from 'react';
import { TrendingUp, CheckCircle, Clock, Star, Calendar, BookOpen } from 'lucide-react';
import { api } from '../api';

const Progress = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState('active');
  const [exchanges, setExchanges] = useState([]);

  useEffect(() => {
    fetchExchanges();
  }, []);

  const fetchExchanges = async () => {
    try {
      const data = await api.getExchanges();
      setExchanges(data);
    } catch (err) {
      console.error('error fetching exchanges', err);
      setExchanges([]);
    }
  };

  const handleLogSession = async (exchange) => {
    try {
      const nextCount = Math.min(exchange.sessionsCompleted + 1, exchange.totalSessions);
      if (nextCount === exchange.sessionsCompleted) return;

      const res = await api.updateExchange(exchange.id, { sessions_completed: nextCount });
      setExchanges(exchanges.map(e => e.id === res.id ? res : e));
    } catch (err) {
      console.error('failed to log session', err);
      alert('Failed to log session');
    }
  };

  const handleCompleteExchange = async (exchange) => {
    const rating = prompt('Please rate this exchange (1-5):', '5');
    if (rating === null) return;

    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      alert('Please enter a valid rating between 1 and 5');
      return;
    }

    try {
      const res = await api.updateExchange(exchange.id, { status: 'completed', rating: ratingNum });
      setExchanges(exchanges.map(e => e.id === res.id ? res : e));
      alert('Exchange marked as completed! 🎉');
    } catch (err) {
      console.error('failed to complete exchange', err);
      alert('Failed to complete exchange');
    }
  };

  const activeExchanges = exchanges.filter(e => e.status === 'active' && (e.userId === currentUser.id || e.partnerId === currentUser.id));
  const completedExchanges = exchanges.filter(e => e.status === 'completed' && (e.userId === currentUser.id || e.partnerId === currentUser.id));

  const stats = [
    {
      icon: BookOpen,
      label: 'Active Exchanges',
      value: activeExchanges.length,
      color: '#6366f1'
    },
    {
      icon: CheckCircle,
      label: 'Completed',
      value: completedExchanges.length,
      color: '#10b981'
    },
    {
      icon: Clock,
      label: 'Total Sessions',
      value: exchanges.reduce((acc, e) => acc + e.sessionsCompleted, 0),
      color: '#f59e0b'
    },
    {
      icon: Star,
      label: 'Avg Rating',
      value: currentUser.rating,
      color: '#ef4444'
    }
  ];

  const calculateProgress = (completed, total) => {
    return Math.round((completed / total) * 100);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Learning Progress</h1>
        <p style={styles.subtitle}>Track your skill exchanges and achievements</p>
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

      <div style={styles.tabContainer}>
        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab('active')}
            style={{
              ...styles.tab,
              ...(activeTab === 'active' ? styles.tabActive : {})
            }}
          >
            Active ({activeExchanges.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            style={{
              ...styles.tab,
              ...(activeTab === 'completed' ? styles.tabActive : {})
            }}
          >
            Completed ({completedExchanges.length})
          </button>
        </div>

        <div style={styles.tabContent}>
          {activeTab === 'active' && (
            <div style={styles.exchangeList}>
              {activeExchanges.length === 0 ? (
                <div style={styles.emptyState}>
                  <BookOpen size={48} color="var(--text-light)" />
                  <p style={styles.emptyText}>No active exchanges</p>
                  <p style={styles.emptySubtext}>Start matching to begin your learning journey</p>
                </div>
              ) : (
                activeExchanges.map((exchange) => (
                  <div key={exchange.id} style={styles.exchangeCard}>
                    <div style={styles.exchangeHeader}>
                      <div>
                        <h3 style={styles.exchangeTitle}>Exchange #{exchange.id}</h3>
                        <p style={styles.exchangeDate}>
                          Started {new Date(exchange.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div style={styles.statusBadge}>
                        <Clock size={14} />
                        In Progress
                      </div>
                    </div>

                    <div style={styles.exchangeSkills}>
                      <div style={styles.skillExchange}>
                        <span style={styles.skillLabel}>You're learning:</span>
                        <span style={styles.skillValue}>{exchange.partnerSkill}</span>
                      </div>
                      <div style={styles.exchangeArrow}>⇄</div>
                      <div style={styles.skillExchange}>
                        <span style={styles.skillLabel}>You're teaching:</span>
                        <span style={styles.skillValue}>{exchange.skill}</span>
                      </div>
                    </div>

                    <div style={styles.progressSection}>
                      <div style={styles.progressHeader}>
                        <span style={styles.progressLabel}>
                          Sessions: {exchange.sessionsCompleted}/{exchange.totalSessions}
                        </span>
                        <span style={styles.progressPercentage}>
                          {calculateProgress(exchange.sessionsCompleted, exchange.totalSessions)}%
                        </span>
                      </div>
                      <div style={styles.progressBar}>
                        <div
                          style={{
                            ...styles.progressFill,
                            width: `${calculateProgress(exchange.sessionsCompleted, exchange.totalSessions)}%`
                          }}
                        />
                      </div>
                    </div>

                    <div style={styles.exchangeActions}>
                      <button onClick={() => handleLogSession(exchange)} style={styles.continueButton}>
                        <Clock size={16} />
                        Log Session
                      </button>
                      <button onClick={() => handleCompleteExchange(exchange)} style={styles.viewButton}>Complete Exchange</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'completed' && (
            <div style={styles.exchangeList}>
              {completedExchanges.length === 0 ? (
                <div style={styles.emptyState}>
                  <CheckCircle size={48} color="var(--text-light)" />
                  <p style={styles.emptyText}>No completed exchanges yet</p>
                  <p style={styles.emptySubtext}>Complete your first exchange to see it here</p>
                </div>
              ) : (
                completedExchanges.map((exchange) => (
                  <div key={exchange.id} style={{ ...styles.exchangeCard, ...styles.completedCard }}>
                    <div style={styles.exchangeHeader}>
                      <div>
                        <h3 style={styles.exchangeTitle}>Exchange #{exchange.id}</h3>
                        <p style={styles.exchangeDate}>
                          {new Date(exchange.startDate).toLocaleDateString()} - {new Date(exchange.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div style={{ ...styles.statusBadge, backgroundColor: '#d1fae5', color: '#065f46' }}>
                        <CheckCircle size={14} />
                        Completed
                      </div>
                    </div>

                    <div style={styles.exchangeSkills}>
                      <div style={styles.skillExchange}>
                        <span style={styles.skillLabel}>Learned:</span>
                        <span style={styles.skillValue}>{exchange.partnerSkill}</span>
                      </div>
                      <div style={styles.exchangeArrow}>⇄</div>
                      <div style={styles.skillExchange}>
                        <span style={styles.skillLabel}>Taught:</span>
                        <span style={styles.skillValue}>{exchange.skill}</span>
                      </div>
                    </div>

                    <div style={styles.completedInfo}>
                      <div style={styles.completedStat}>
                        <CheckCircle size={16} color="var(--secondary-color)" />
                        <span>{exchange.sessionsCompleted} sessions completed</span>
                      </div>
                      <div style={styles.completedStat}>
                        <Star size={16} fill="gold" color="gold" />
                        <span>Rated {exchange.rating}/5</span>
                      </div>
                    </div>

                    <div style={styles.exchangeActions}>
                      <button style={styles.viewButton}>View Certificate</button>
                      <button style={styles.viewButton}>Leave Review</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
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
  tabContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)',
    overflow: 'hidden'
  },
  tabs: {
    display: 'flex',
    borderBottom: '2px solid var(--border-color)'
  },
  tab: {
    flex: 1,
    padding: '16px',
    backgroundColor: 'transparent',
    color: 'var(--text-medium)',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.2s',
    borderBottom: '3px solid transparent'
  },
  tabActive: {
    color: 'var(--primary-color)',
    borderBottomColor: 'var(--primary-color)'
  },
  tabContent: {
    padding: '24px'
  },
  exchangeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: 'var(--text-medium)'
  },
  emptyText: {
    fontSize: '18px',
    fontWeight: '600',
    marginTop: '16px',
    marginBottom: '8px'
  },
  emptySubtext: {
    fontSize: '14px',
    color: 'var(--text-light)'
  },
  exchangeCard: {
    padding: '24px',
    backgroundColor: 'var(--bg-gray)',
    borderRadius: '12px',
    border: '2px solid var(--border-color)'
  },
  completedCard: {
    backgroundColor: '#f0fdf4',
    borderColor: '#86efac'
  },
  exchangeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  exchangeTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--text-dark)',
    marginBottom: '4px'
  },
  exchangeDate: {
    fontSize: '13px',
    color: 'var(--text-medium)'
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: '#fef3c7',
    color: '#92400e',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  },
  exchangeSkills: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '8px'
  },
  skillExchange: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  skillLabel: {
    fontSize: '12px',
    color: 'var(--text-medium)',
    fontWeight: '500'
  },
  skillValue: {
    fontSize: '15px',
    color: 'var(--text-dark)',
    fontWeight: '600'
  },
  exchangeArrow: {
    fontSize: '24px',
    color: 'var(--text-medium)'
  },
  progressSection: {
    marginBottom: '20px'
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px'
  },
  progressLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--text-dark)'
  },
  progressPercentage: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--primary-color)'
  },
  progressBar: {
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'var(--primary-color)',
    transition: 'width 0.3s ease'
  },
  completedInfo: {
    display: 'flex',
    gap: '24px',
    marginBottom: '20px'
  },
  completedStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--text-dark)'
  },
  exchangeActions: {
    display: 'flex',
    gap: '12px'
  },
  continueButton: {
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
    padding: '12px',
    backgroundColor: 'white',
    color: 'var(--text-dark)',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    border: '1px solid var(--border-color)'
  }
};

export default Progress;
