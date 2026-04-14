import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Video, VideoOff, Mic, MicOff, PhoneOff, 
  MessageSquare, Users, Clock, MonitorUp, Settings, Send
} from "lucide-react";

export default function VideoChat({ currentUser = {}, users = [] }) {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const chatBottomRef = useRef(null);

  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);

  const [chatMessages, setChatMessages] = useState([
    { sender: "System", message: "Call started. Peer-to-peer connection established.", time: "Now", isSystem: true }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const partner = users.find((u) => u?.id?.toString() === matchId) || { name: "Learning Partner", avatar: "🙂" };

  useEffect(() => {
    const timer = setInterval(() => setSessionTime((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (showChat && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, showChat]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    if (window.confirm("End this learning session?")) {
      navigate("/progress");
    }
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      sender: "You",
      message: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSelf: true
    };

    setChatMessages((prev) => [...prev, msg]);
    setNewMessage("");
  };

  return (
    <div style={styles.container}>
      
      {/* ── VIDEO AREA ── */}
      <div style={styles.videoArea}>
        
        {/* Top Info Bar */}
        <div style={styles.topBar}>
          <div style={styles.badgeSolid}>
            <div style={styles.liveDot} className="anim-pulseGlow" /> Live
          </div>
          <div style={styles.badgeGlass}>
            <Clock size={14} /> {formatTime(sessionTime)}
          </div>
          <div style={styles.badgeGlass} className="hide-mobile">
            <Users size={14} /> Room: {matchId}
          </div>
        </div>

        {/* Main Partner Video */}
        <div style={styles.mainVideo}>
          <div style={styles.videoAvatarWrap}>
            <div className="avatar-inner" style={{ width: 140, height: 140, fontSize: 60, boxShadow: '0 0 50px rgba(0,0,0,0.5)' }}>
              {partner?.avatar || "🙂"}
            </div>
            <h2 style={{ marginTop: 20, fontSize: 24, fontWeight: 700, textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
              {partner?.name || "Partner"}
            </h2>
            {!isVideoOn && <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Camera is off</p>}
          </div>
        </div>

        {/* Mini Self Video */}
        <div className="glass-card-static" style={{ ...styles.miniVideo, borderColor: isVideoOn ? 'var(--primary)' : 'var(--border)' }}>
          <div style={{ position: 'absolute', top: 8, left: 8, fontSize: 11, background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: 4, zIndex: 2 }}>You</div>
          <div style={styles.miniVideoContent}>
            <div className="avatar-inner" style={{ width: 60, height: 60, fontSize: 30 }}>
              {currentUser?.avatar || "🙂"}
            </div>
          </div>
          {!isVideoOn && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
              <VideoOff size={24} color="var(--text-muted)" />
            </div>
          )}
        </div>

        {/* Floating Controls Bar */}
        <div style={styles.bottomControlsWrap}>
          <div className="glass-card-static" style={styles.bottomControls}>
            <button 
              className={`btn-icon ${!isAudioOn ? 'danger-icon' : ''}`} 
              style={{ ...styles.ctrlBtn, background: !isAudioOn ? 'rgba(244,63,94,0.2)' : '' }}
              onClick={() => setIsAudioOn(!isAudioOn)}
            >
              {isAudioOn ? <Mic size={20} /> : <MicOff size={20} color="#fb7185" />}
            </button>
            
            <button 
              className={`btn-icon ${!isVideoOn ? 'danger-icon' : ''}`}
              style={{ ...styles.ctrlBtn, background: !isVideoOn ? 'rgba(244,63,94,0.2)' : '' }} 
              onClick={() => setIsVideoOn(!isVideoOn)}
            >
              {isVideoOn ? <Video size={20} /> : <VideoOff size={20} color="#fb7185" />}
            </button>

            <button className="btn-icon" style={styles.ctrlBtn} onClick={() => setIsScreenSharing(!isScreenSharing)}>
              <MonitorUp size={20} color={isScreenSharing ? "var(--secondary-light)" : "inherit"} />
            </button>

            <button className="btn-icon" style={{ ...styles.ctrlBtn, position: 'relative' }} onClick={() => setShowChat(!showChat)}>
              <MessageSquare size={20} />
              {showChat === false && chatMessages.length > 1 && <span style={styles.chatBadge} className="anim-scaleIn" />}
            </button>
            
            <button className="btn-icon" style={styles.ctrlBtn}>
              <Settings size={20} />
            </button>

            <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)', margin: '0 8px' }} />

            <button className="btn-icon" style={styles.endBtn} onClick={handleEndCall}>
              <PhoneOff size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* ── CHAT PANEL ── */}
      {showChat && (
        <div className="glass-card-static anim-slideLeft" style={styles.sidePanel}>
          <div style={styles.panelHeader}>
            <h3 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <MessageSquare size={16} /> Meeting Chat
            </h3>
            <button className="btn-icon" style={{ width: 28, height: 28 }} onClick={() => setShowChat(false)}>
              <X size={16} />
            </button>
          </div>

          <div style={styles.chatArea}>
            {chatMessages.map((msg, idx) => {
              if (msg.isSystem) return (
                <div key={idx} style={styles.systemMsg}>{msg.message}</div>
              );

              return (
                <div key={idx} style={{ ...styles.msgBubbleWrap, alignSelf: msg.isSelf ? 'flex-end' : 'flex-start' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, display: 'flex', justifyContent: msg.isSelf ? 'flex-end' : 'flex-start', gap: 6 }}>
                    <span>{msg.sender}</span>
                    <span>{msg.time}</span>
                  </div>
                  <div style={{ ...styles.msgBubble, background: msg.isSelf ? 'var(--primary-dark)' : 'rgba(255,255,255,0.1)', borderRadius: msg.isSelf ? '12px 12px 0 12px' : '12px 12px 12px 0' }}>
                    {msg.message}
                  </div>
                </div>
              );
            })}
            <div ref={chatBottomRef} />
          </div>

          <div style={styles.chatInputWrap}>
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 8 }}>
              <input 
                className="form-input" 
                style={{ borderRadius: 20, padding: '10px 16px', background: 'rgba(0,0,0,0.3)' }}
                placeholder="Type a message..." 
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
              />
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: 42, height: 42, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: 'none', cursor: 'pointer' }}
                disabled={!newMessage.trim()}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

const styles = {
  container: { display: "flex", height: "calc(100vh - 64px)", background: "#000", overflow: "hidden", position: "relative" },
  videoArea: { flex: 1, position: "relative", display: "flex", flexDirection: "column", background: "radial-gradient(circle at center, #1a2235 0%, #080e1a 100%)" },
  
  topBar: { position: "absolute", top: 20, left: 24, zIndex: 10, display: "flex", gap: 12, alignItems: "center" },
  badgeSolid: { background: "var(--danger)", color: "#fff", padding: "6px 12px", borderRadius: 8, fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 0 15px rgba(244,63,94,0.4)" },
  liveDot: { width: 8, height: 8, borderRadius: "50%", background: "#fff" },
  badgeGlass: { background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "6px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 },
  
  mainVideo: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center" },
  videoAvatarWrap: { display: "flex", flexDirection: "column", alignItems: "center" },
  
  miniVideo: { position: "absolute", bottom: 100, right: 24, width: 220, height: 140, background: "#111", borderRadius: 16, overflow: "hidden", zIndex: 10, boxShadow: "0 10px 40px rgba(0,0,0,0.5)", transition: "all 0.3s" },
  miniVideoContent: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" },
  
  bottomControlsWrap: { position: "absolute", bottom: 24, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 20 },
  bottomControls: { display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderRadius: 24, background: "rgba(15,23,42,0.85)" },
  ctrlBtn: { width: 44, height: 44, background: "rgba(255,255,255,0.05)", border: "none" },
  endBtn: { width: 56, height: 44, borderRadius: 16, background: "var(--danger)", color: "#fff", border: "none", boxShadow: "0 4px 15px rgba(244,63,94,0.4)" },
  chatBadge: { position: "absolute", top: 8, right: 8, width: 10, height: 10, background: "var(--danger)", borderRadius: "50%", border: "2px solid #1e293b" },
  
  sidePanel: { width: 340, background: "var(--bg-elevated)", borderLeft: "1px solid var(--border)", borderTop: "none", borderBottom: "none", borderRight: "none", borderRadius: 0, display: "flex", flexDirection: "column", zIndex: 30 },
  panelHeader: { padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" },
  chatArea: { flex: 1, padding: 20, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 },
  systemMsg: { textAlign: "center", fontSize: 11, color: "var(--text-muted)", padding: "4px 0", alignSelf: "center", background: "rgba(255,255,255,0.03)", paddingInline: 12, borderRadius: 10 },
  msgBubbleWrap: { display: "flex", flexDirection: "column", maxWidth: "85%" },
  msgBubble: { padding: "10px 14px", fontSize: 14, color: "#fff", lineHeight: 1.5, wordBreak: "break-word" },
  chatInputWrap: { padding: 16, borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.2)" }
};