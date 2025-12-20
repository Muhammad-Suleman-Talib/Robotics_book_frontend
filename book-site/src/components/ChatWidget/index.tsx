// import { useState } from "react";
// import styles from "./styles.module.css";

// export default function Chatbot() {
//   const [open, setOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const sessionId = "session_001";

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMsg = { role: "user", text: input };
//     setMessages(prev => [...prev, userMsg]);

//     setInput("");

//     try {
//       const res = await fetch("http://localhost:8000/api/query", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           query: userMsg.text,
//           session_id: sessionId,
//           selected_text: ""
//         })
//       });

//       const data = await res.json();

//       const botMsg = { role: "bot", text: data.response };
//       setMessages(prev => [...prev, botMsg]);

//     } catch (error) {
//       setMessages(prev => [
//         ...prev,
//         { role: "bot", text: "Server error. Try again." }
//       ]);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       {/* Floating button */}
//       {!open && (
//         <button className={styles.floatingBtn} onClick={() => setOpen(true)}>
//           💬
//         </button>
//       )}

//       {/* Chat Window */}
//       {open && (
//         <div className={styles.chatBox}>
//           <div className={styles.header}>
//             <span>Book Assistant</span>
//             <button className={styles.closeBtn} onClick={() => setOpen(false)}>×</button>
//           </div>

//           <div className={styles.messages}>
//             {messages.map((m, i) => (
//               <div
//                 key={i}
//                 className={m.role === "user" ? styles.userMsg : styles.botMsg}
//               >
//                 {m.text}
//               </div>
//             ))}
//           </div>

//           <div className={styles.inputBox}>
//             <input
//               value={input}
//               onChange={e => setInput(e.target.value)}
//               placeholder="Ask something..."
//               className={styles.input}
//             />
//             <button className={styles.sendBtn} onClick={sendMessage}>
//               Send
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



import { useState, useRef, useEffect } from "react";
import styles from "./styles.module.css";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello! I'm your book assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const sessionId = "session_001";

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // const sendMessage = async () => {
  //   if (!input.trim()) return;

  //   const userMsg = { role: "user", text: input };
  //   setMessages(prev => [...prev, userMsg]);
  //   setInput("");
  //   setIsTyping(true);

  //   try {
  //     const res = await fetch("https://fastapiagent-production.up.railway.app/query", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         query: userMsg.text,
  //         session_id: sessionId,
  //         // selected_text: ""
  //       })
  //     });

  //     const data = await res.json();
  //     setIsTyping(false);

  //     const botMsg = { role: "bot", text: data.response };
  //     setMessages(prev => [...prev, botMsg]);

  //   } catch (error) {
  //     setIsTyping(false);
  //     setMessages(prev => [
  //       ...prev,
  //       { role: "bot", text: "⚠️ Server error. Please try again." }
  //     ]);
  //   }
  // };
const sendMessage = async () => {
  if (!input.trim()) return;

  const userMsg = { role: "user", text: input };
  setMessages(prev => [...prev, userMsg]);
  setInput("");
  setIsTyping(true);

  try {
    const res = await fetch(
      "https://thriving-heart-production-8071.up.railway.app/api/query",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userMsg.text
        })
      }
    );

    if (!res.ok) {
      throw new Error("Server error");
    }

    const data = await res.json();

    setIsTyping(false);

    const botMsg = {
      role: "bot",
      text: data.answer || "No answer received"
    };

    setMessages(prev => [...prev, botMsg]);

  } catch (error) {
    console.error(error);
    setIsTyping(false);
    setMessages(prev => [
      ...prev,
      { role: "bot", text: "⚠️ Server error. Please try again." }
    ]);
  }
};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      { role: "bot", text: "Chat cleared! How can I assist you with books today?" }
    ]);
  };

  return (
    <div className={styles.container}>
      {/* Enhanced Floating Button with Animation */}
      {!open && (
        <button 
          className={`${styles.floatingBtn} ${styles.pulse}`}
          onClick={() => setOpen(true)}
          aria-label="Open chat"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className={styles.notificationBadge}>1</span>
        </button>
      )}

      {/* Modern Chat Window */}
      {open && (
        <div className={`${styles.chatBox} ${styles.slideUp}`}>
          {/* Header with Gradient */}
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <div className={styles.avatar}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5c-1.95 0-4.05.4-5.5 1.5c-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5c.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5c1.35-.85 3.8-1.5 5.5-1.5c1.65 0 3.35.3 4.75 1.05c.1.05.15.05.25.05c.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5c-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5c1.2 0 2.4.15 3.5.5v11.5z" />
                </svg>
              </div>
              <div className={styles.headerText}>
                <span className={styles.title}>Book Assistant</span>
                <span className={styles.subtitle}>Online • AI Powered</span>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button 
                className={styles.actionBtn}
                onClick={clearChat}
                aria-label="Clear chat"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
              <button 
                className={styles.closeBtn}
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className={styles.messages}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`${styles.message} ${m.role === "user" ? styles.userMessage : styles.botMessage}`}
              >
                <div className={styles.messageContent}>
                  <div className={styles.messageText}>{m.text}</div>
                  <div className={styles.messageTime}>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {m.role === "bot" && (
                  <div className={styles.messageAvatar}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5c-1.95 0-4.05.4-5.5 1.5c-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5c.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5c1.35-.85 3.8-1.5 5.5-1.5c1.65 0 3.35.3 4.75 1.05c.1.05.15.05.25.05c.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1z" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className={styles.typingIndicator}>
                <div className={styles.typingDot}></div>
                <div className={styles.typingDot}></div>
                <div className={styles.typingDot}></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Input Area */}
          <div className={styles.inputArea}>
            <div className={styles.inputWrapper}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about books, recommendations, or authors..."
                className={styles.input}
              />
              <div className={styles.inputActions}>
                <button 
                  className={styles.attachBtn}
                  aria-label="Attach file"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </button>
              </div>
            </div>
            <button 
              className={`${styles.sendBtn} ${input.trim() ? styles.active : ''}`}
              onClick={sendMessage}
              disabled={!input.trim()}
              aria-label="Send message"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

