import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  MessageSquare,
  Users,
  Clock,
  MonitorUp,
  Settings
} from "lucide-react";

const VideoChat = ({ currentUser = {}, users = [] }) => {
  const { matchId } = useParams();
  const navigate = useNavigate();

  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);

  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const partner =
    users.find((u) => u?.id?.toString() === matchId) || {
      name: "Learning Partner",
      avatar: "🙂"
    };

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    if (window.confirm("End this learning session?")) {
      navigate("/progress");
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const msg = {
      sender: currentUser?.name || "You",
      message: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    setChatMessages((prev) => [...prev, msg]);
    setNewMessage("");
  };

  return (
    <div style={styles.container}>
      <div style={styles.videoArea}>
        {/* Partner Video */}
        <div style={styles.partnerVideo}>
          <div style={styles.videoPlaceholder}>
            <span style={styles.partnerAvatar}>
              {partner?.avatar || "🙂"}
            </span>

            <p style={styles.partnerName}>
              {partner?.name || "Partner"}
            </p>

            {!isVideoOn && <p style={styles.videoStatus}>Video Off</p>}
          </div>

          <div style={styles.sessionInfo}>
            <div style={styles.sessionBadge}>
              <Clock size={16} />
              {formatTime(sessionTime)}
            </div>

            <div style={styles.sessionBadge}>
              <Users size={16} />
              Learning Session
            </div>
          </div>
        </div>

        {/* User Video */}
        <div style={styles.userVideo}>
          <div style={styles.userVideoPlaceholder}>
            <span style={styles.userAvatar}>
              {currentUser?.avatar || "🙂"}
            </span>

            {!isVideoOn && <VideoOff size={20} color="white" />}
          </div>
        </div>

        {/* Controls */}
        <div style={styles.controls}>
          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            style={styles.controlButton}
          >
            {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          <button
            onClick={() => setIsAudioOn(!isAudioOn)}
            style={styles.controlButton}
          >
            {isAudioOn ? <Mic size={20} /> : <MicOff size={20} />}
          </button>

          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            style={styles.controlButton}
          >
            <MonitorUp size={20} />
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            style={styles.controlButton}
          >
            <MessageSquare size={20} />
          </button>

          <button onClick={handleEndCall} style={styles.endCallButton}>
            <PhoneOff size={20} />
          </button>

          <button style={styles.controlButton}>
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Chat */}
      {showChat && (
        <div style={styles.chatPanel}>
          <div style={styles.chatHeader}>
            <h3>Chat</h3>

            <button onClick={() => setShowChat(false)}>×</button>
          </div>

          <div style={styles.chatMessages}>
            {chatMessages.length === 0 ? (
              <p style={styles.noMessages}>
                No messages yet
              </p>
            ) : (
              chatMessages.map((msg, i) => (
                <div key={i} style={styles.chatMessage}>
                  <strong>{msg.sender}</strong>

                  <p>{msg.message}</p>

                  <span style={styles.chatTime}>
                    {msg.time}
                  </span>
                </div>
              ))
            )}
          </div>

          <div style={styles.chatInput}>
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type message..."
              onKeyDown={(e) =>
                e.key === "Enter" && handleSendMessage()
              }
            />

            <button onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      )}

      {/* Info Panel */}
      <div style={styles.infoPanel}>
        <h3>Session Info</h3>

        <p>
          <b>Partner:</b> {partner?.name}
        </p>

        <p>
          <b>Duration:</b> {formatTime(sessionTime)}
        </p>

        <p style={{ color: "green" }}>
          ● Active Session
        </p>

        <p style={styles.note}>
          Prototype UI — real video would use WebRTC /
          Agora / Twilio.
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    background: "#1a1a1a"
  },

  videoArea: {
    flex: 1,
    position: "relative"
  },

  partnerVideo: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white"
  },

  videoPlaceholder: {
    textAlign: "center"
  },

  partnerAvatar: {
    fontSize: "120px"
  },

  partnerName: {
    fontSize: "24px"
  },

  videoStatus: {
    opacity: 0.6
  },

  userVideo: {
    position: "absolute",
    bottom: "100px",
    right: "20px",
    width: "200px",
    height: "150px",
    background: "#333",
    borderRadius: "10px"
  },

  userVideoPlaceholder: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white"
  },

  userAvatar: {
    fontSize: "50px"
  },

  controls: {
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "10px"
  },

  controlButton: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "#333",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  endCallButton: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "#ef4444",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  sessionInfo: {
    position: "absolute",
    top: "20px",
    left: "20px",
    display: "flex",
    gap: "10px"
  },

  sessionBadge: {
    background: "rgba(0,0,0,0.6)",
    padding: "6px 12px",
    borderRadius: "20px",
    color: "white",
    display: "flex",
    gap: "6px",
    alignItems: "center"
  },

  chatPanel: {
    width: "320px",
    background: "white",
    display: "flex",
    flexDirection: "column"
  },

  chatHeader: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    display: "flex",
    justifyContent: "space-between"
  },

  chatMessages: {
    flex: 1,
    padding: "10px",
    overflowY: "auto"
  },

  noMessages: {
    textAlign: "center",
    opacity: 0.6
  },

  chatMessage: {
    padding: "10px",
    background: "#f4f4f4",
    borderRadius: "8px",
    marginBottom: "10px"
  },

  chatTime: {
    fontSize: "12px",
    opacity: 0.6
  },

  chatInput: {
    padding: "10px",
    display: "flex",
    gap: "8px"
  },

  infoPanel: {
    width: "260px",
    background: "white",
    padding: "20px"
  },

  note: {
    marginTop: "20px",
    fontSize: "12px",
    background: "#fef3c7",
    padding: "10px",
    borderRadius: "8px"
  }
};

export default VideoChat;