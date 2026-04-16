// Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import

const STAFF = [
  { id:"alice", name:"Alice Tan", email:"nisa@gmail.com", avatar:"AT", color:"#4f46e5" },
  { id:"bob",   name:"Bob Lim",   email:"bob@co.com",   avatar:"BL", color:"#e11d48" },
  { id:"carol", name:"Carol Wong", email:"carol@co.com", avatar:"CW", color:"#059669" },
  { id:"david", name:"David Ng",  email:"david@co.com", avatar:"DN", color:"#d97706" },
];

const PASSWORD = "123456";

export default function Login({ onLogin }) {
  const navigate = useNavigate(); // Add this hook
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setError("");
    
    const user = STAFF.find(s => s.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      setError("Email not found");
      return;
    }
    
    if (password !== PASSWORD) {
      setError("Wrong password");
      return;
    }
    
    setLoading(true);
    
    // Store user info in localStorage (for persistence)
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("isLoggedIn", "true");
    
    setTimeout(() => {
      setLoading(false);
      
      // Call the onLogin callback if provided
      if (onLogin) {
        onLogin(user);
      }
      
      // Navigate to calendar page
      navigate("/calendar");
    }, 500);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>📅</span>
          <h1 style={styles.logoText}>Calendar</h1>
        </div>

        <h2 style={styles.title}>Sign In</h2>
        <p style={styles.subtitle}></p>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            style={styles.input}
            placeholder="alice@co.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            style={styles.input}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        {error && (
          <div style={styles.error}>
            ⚠️ {error}
          </div>
        )}

        <button 
          style={styles.button}
          onClick={handleLogin}
          disabled={loading || !email || !password}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "'Segoe UI', 'DM Sans', sans-serif",
  },
  card: {
    background: "white",
    borderRadius: 24,
    padding: "48px 40px",
    width: "100%",
    maxWidth: 440,
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 32,
  },
  logoIcon: {
    fontSize: 32,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 600,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: 600,
    margin: 0,
    marginBottom: 8,
    color: "#1a1a2e",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    fontSize: 14,
    border: "1.5px solid #e0e0e0",
    borderRadius: 12,
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  error: {
    background: "#fee",
    border: "1px solid #fcc",
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 13,
    color: "#e11d48",
    marginBottom: 20,
  },
  button: {
    width: "100%",
    padding: "14px",
    fontSize: 16,
    fontWeight: 600,
    color: "white",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    transition: "transform 0.1s, opacity 0.2s",
    marginBottom: 24,
  },
  demoHint: {
    marginTop: 20,
    paddingTop: 16,
    borderTop: "1px solid #f0f0f0",
  },
  demoText: {
    fontSize: 12,
    fontWeight: 600,
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  demoEmail: {
    fontSize: 11,
    color: "#999",
    textAlign: "center",
    margin: "4px 0",
  },
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  button:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  input:focus {
    border-color: #667eea !important;
  }
`;
document.head.appendChild(styleSheet);