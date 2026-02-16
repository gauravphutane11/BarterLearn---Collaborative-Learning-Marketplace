import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, MessageSquare, 
  Users, Clock, MonitorUp, Settings 
} from 'lucide-react';

const VideoChat = ({ currentUser, users }) => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const partner = users.find(u => u.id.toString() === matchId) || users[1];

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    if (window.confirm('Are you sure you want to end this session?')) {
      navigate('/progress');
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([...chatMessages, {
        sender: currentUser.name,
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setNewMessage('');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.videoArea}>
        <div style={styles.partnerVideo}>
          <div style={styles.videoPlaceholder}>
            <span style={styles.partnerAvatar}>{partner.avatar}</span>
            <p style={styles.partnerName}>{partner.name}</p>
            {!isVideoOn && <p style={styles.videoStatus}>Video Off</p>}
          </div>
          <div style={styles.sessionInfo}>
            <div style={styles.sessionBadge}>
              <Clock size={16} />
              {formatTime(sessionTime)}
            </div>
            <div style={styles.sessionBadge}>
              <Users size={16} />
              Learning: React from {partner.name}
            </div>
          </div>
        </div>

        <div style={styles.userVideo}>
          <div style={styles.userVideoPlaceholder}>
            <span style={styles.userAvatar}>{currentUser.avatar}</span>
            {!isVideoOn && <VideoOff size={20} color="white" />}
          </div>
        </div>

        <div style={styles.controls}>
          <button 
            onClick={() => setIsVideoOn(!isVideoOn)}
            style={{
              ...styles.controlButton,
              ...(isVideoOn ? styles.controlButtonActive : styles.controlButtonInactive)
            }}
            title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
          >
            {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          <button 
            onClick={() => setIsAudioOn(!isAudioOn)}
            style={{
              ...styles.controlButton,
              ...(isAudioOn ? styles.controlButtonActive : styles.controlButtonInactive)
            }}
            title={isAudioOn ? 'Mute' : 'Unmute'}
          >
            {isAudioOn ? <Mic size={20} /> : <MicOff size={20} />}
          </button>

          <button 
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            style={{
              ...styles.controlButton,
              ...(isScreenSharing ? styles.controlButtonInactive : styles.controlButtonActive)
            }}
            title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
          >
            <MonitorUp size={20} />
          </button>

          <button 
            onClick={() => setShowChat(!showChat)}
            style={{
              ...styles.controlButton,
              ...(showChat ? styles.controlButtonInactive : styles.controlButtonActive)
            }}
            title="Toggle chat"
          >
            <MessageSquare size={20} />
          </button>

          <button 
            onClick={handleEndCall}
            style={styles.endCallButton}
            title="End call"
          >
            <PhoneOff size={20} />
          </button>

          <button 
            style={styles.controlButton}
            title="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {showChat && (
        <div style={styles.chatPanel}>
          <div style={styles.chatHeader}>
            <h3 style={styles.chatTitle}>Chat</h3>
            <button onClick={() => setShowChat(false)} style={styles.chatClose}>×</button>
          </div>

          <div style={styles.chatMessages}>
            {chatMessages.length === 0 ? (
              <p style={styles.noChatMessages}>No messages yet. Start the conversation!</p>
            ) : (
              chatMessages.map((msg, index) => (
                <div key={index} style={styles.chatMessage}>
                  <div style={styles.chatMessageHeader}>
                    <strong>{msg.sender}</strong>
                    <span style={styles.chatMessageTime}>{msg.time}</span>
                  </div>
                  <p style={styles.chatMessageText}>{msg.message}</p>
                </div>
              ))
            )}
          </div>

          <div style={styles.chatInput}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              style={styles.chatInputField}
            />
            <button onClick={handleSendMessage} style={styles.chatSendButton}>
              Send
            </button>
          </div>
        </div>
      )}

      <div style={styles.infoPanel}>
        <h3 style={styles.infoPanelTitle}>Session Info</h3>
        <div style={styles.infoPanelContent}>
          <div style={styles.infoItem}>
            <p style={styles.infoLabel}>Learning Partner:</p>
            <p style={styles.infoValue}>{partner.name}</p>
          </div>
          <div style={styles.infoItem}>
            <p style={styles.infoLabel}>Topic:</p>
            <p style={styles.infoValue}>React Fundamentals</p>
          </div>
          <div style={styles.infoItem}>
            <p style={styles.infoLabel}>Session Duration:</p>
            <p style={styles.infoValue}>{formatTime(sessionTime)}</p>
          </div>
          <div style={styles.infoItem}>
            <p style={styles.infoLabel}>Status:</p>
            <p style={{...styles.infoValue, color: 'var(--secondary-color)'}}>● Active</p>
          </div>
        </div>
        <p style={styles.prototypNote}>
          📝 This is a prototype UI. In a real implementation, this would integrate with WebRTC or services like Agora/Twilio for actual video/audio streaming.
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: 'calc(100vh - 64px)',
    backgroundColor: '#1a1a1a',
    position: 'relative'
  },
  videoArea: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column'
  },
  partnerVideo: {
    flex: 1,
    backgroundColor: '#2d2d2d',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  videoPlaceholder: {
    textAlign: 'center',
    color: 'white'
  },
  partnerAvatar: {
    fontSize: '120px',
    display: 'block',
    marginBottom: '20px'
  },
  partnerName: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  videoStatus: {
    fontSize: '14px',
    opacity: 0.7
  },
  sessionInfo: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  sessionBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: 'white',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
    backdropFilter: 'blur(10px)'
  },
  userVideo: {
    position: 'absolute',
    bottom: '100px',
    right: '20px',
    width: '240px',
    height: '180px',
    backgroundColor: '#3d3d3d',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
  },
  userVideoPlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white'
  },
  userAvatar: {
    fontSize: '64px'
  },
  controls: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '12px',
    padding: '12px',
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: '50px',
    backdropFilter: 'blur(10px)'
  },
  controlButton: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
  },
  controlButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white'
  },
  controlButtonInactive: {
    backgroundColor: '#ef4444',
    color: 'white'
  },
  endCallButton: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#ef4444',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  chatPanel: {
    width: '320px',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    borderLeft: '1px solid var(--border-color)'
  },
  chatHeader: {
    padding: '16px',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  chatTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--text-dark)'
  },
  chatClose: {
    fontSize: '24px',
    backgroundColor: 'transparent',
    color: 'var(--text-medium)',
    padding: '4px 8px'
  },
  chatMessages: {
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  noChatMessages: {
    textAlign: 'center',
    color: 'var(--text-light)',
    fontSize: '13px',
    padding: '40px 20px'
  },
  chatMessage: {
    padding: '12px',
    backgroundColor: 'var(--bg-gray)',
    borderRadius: '8px'
  },
  chatMessageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '6px',
    fontSize: '12px'
  },
  chatMessageTime: {
    color: 'var(--text-light)'
  },
  chatMessageText: {
    fontSize: '14px',
    color: 'var(--text-dark)',
    lineHeight: '1.4'
  },
  chatInput: {
    padding: '16px',
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    gap: '8px'
  },
  chatInputField: {
    flex: 1,
    padding: '10px',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    fontSize: '14px'
  },
  chatSendButton: {
    padding: '10px 20px',
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600'
  },
  infoPanel: {
    width: '280px',
    backgroundColor: 'white',
    padding: '20px',
    borderLeft: '1px solid var(--border-color)',
    overflowY: 'auto'
  },
  infoPanelTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--text-dark)',
    marginBottom: '16px'
  },
  infoPanelContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px'
  },
  infoItem: {
    paddingBottom: '12px',
    borderBottom: '1px solid var(--border-color)'
  },
  infoLabel: {
    fontSize: '12px',
    color: 'var(--text-medium)',
    marginBottom: '4px',
    fontWeight: '500'
  },
  infoValue: {
    fontSize: '14px',
    color: 'var(--text-dark)',
    fontWeight: '600'
  },
  prototypNote: {
    padding: '12px',
    backgroundColor: '#fef3c7',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#92400e',
    lineHeight: '1.5'
  }
};

export default VideoChat;
