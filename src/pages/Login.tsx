import { useState } from "react";
import api from "../api";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return;
    
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.access_token);
      window.location.href = "/authors";
    } catch (error) {
      alert("Login failed. Please check your credentials.");
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>LibraryHub</h2>
        <p>Sign in to manage your library</p>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
        />

        <button 
          onClick={handleLogin}
          disabled={loading || !email.trim() || !password.trim()}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>
    </div>
  );
}
