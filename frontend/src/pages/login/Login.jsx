import './Login.css';
import { useState } from 'react';
import axios from 'axios'; // install via: npm install axios
import { useNavigate } from 'react-router-dom';

function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

   const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:8000/api/v1/users/login', {
        userName,
        password
      });

      console.log('Login successful:', res.data);

      // Store token in localStorage (optional but useful for protected routes)
      localStorage.setItem('token', res.data.token);
      

      // ✅ Redirect to admin dashboard
      navigate('/admin');
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      alert('Login failed. Check username or password.');
    }
  };
  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Staff Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="User name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
