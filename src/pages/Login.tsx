import { useState } from 'react';
import api from '../api';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.access_token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-glass">
        <div className="login-title">Admin Login</div>
        <div className="login-subtitle">
          Login to manage LibraryHub
        </div>

        <input
          className="login-field"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          className="login-field"
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>

        {error && <div className="login-error">{error}</div>}
      </div>
    </div>
  );
}
