import './Login.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// use env variable for API base
const API_URL = process.env.REACT_APP_API_URL;
const LOG_LEVEL = process.env.REACT_APP_LOG_LEVEL || "error";


function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ✅ use API_URL from env instead of hardcoding
      const res = await axios.post(`${API_URL}/users/login`, {
        userName,
        password
      });

      if (LOG_LEVEL === "debug") {
        console.log('Login successful:', res.data);
      }

      localStorage.setItem('token', res.data.token);
      
      const headers = { Authorization: `Bearer ${res.data.token}` };
      const userRes = await axios.get(`${API_URL}/users/me`, { headers });
      const user = userRes.data.data;
      
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'driver') {
        navigate('/driver-dashboard');
      } else {
        navigate('/admin'); 
      }

    } catch (err) {
      if (LOG_LEVEL === "debug") {
        console.error('Login failed:', err.response?.data || err.message);
      }
      setError(err.response?.data?.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Staff Login</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="User name"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
              if (error) setError('');
            }}
            onFocus={() => setError('')}
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError('');
            }}
            onFocus={() => setError('')}
            required
            disabled={loading}
          />

          <button 
            type="submit" 
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
