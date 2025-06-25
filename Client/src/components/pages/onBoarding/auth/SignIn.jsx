import React, { useState } from 'react';
import '../../../styles/SignUp.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email.includes('@')) newErrors.email = 'Enter a valid email';
    if (!password || password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const res = await axios.post('http://localhost:3000/auth/user-login', {
          email,
          password,
        });
        localStorage.setItem('token', res.data.token);
        alert(res.data.message);
        navigate('/dashboard');
      } catch (error) {
        alert(error.response?.data?.error || 'Login failed');
        navigate('/signin');
      }
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit} noValidate>
        <h2>SIGN IN</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <span className="error">{errors.email}</span>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span className="error">{errors.password}</span>

        <button type="submit">Sign In</button>

        <Link to="/signup">Don't have an account?</Link>
      </form>
    </div>
  );
}