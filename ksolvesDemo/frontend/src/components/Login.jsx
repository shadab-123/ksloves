import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Login.css'; // Import the shared CSS file

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { username, password });
      const token = response.data.token; // Assuming token is returned in response.data.token
      localStorage.setItem('token', token);

      // Decode token to get user roles (example for JWT token)
      //const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userRole = response.data.roles[0]; // Adjust based on token payload structure
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } catch (err) {
      setError('Error logging in');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="form-container">
        <img src={logo} alt="Ksolves Logo" className="logo" />
      <form onSubmit={handleSubmit}>
      <h1>Login</h1>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit">Login</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;
