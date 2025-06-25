import React, { useState } from 'react';
import '../../../styles/SignUp.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleDobChange = (e) => {
    const birthDate = new Date(e.target.value);
    const today = new Date();
    let calcAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calcAge--;
    }
    setDob(e.target.value);
    setAge(calcAge);
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Username is required';
    if (!email.includes('@')) newErrors.email = 'Enter a valid email';
    if (!dob) newErrors.dob = 'Date of birth is required';
    if (!password || password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await axios.post('http://localhost:3000/auth/user-reg', {
          name,
          email,
          age,
          password,
        });
        alert('Signup successful!');
        navigate('/signin');
      } catch (error) {
        alert(error.response?.data?.error || 'Signup failed');
      }
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit} noValidate>
        <h2>CREATE ACCOUNT</h2>

        <input
          type="text"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <span className="error">{errors.name}</span>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <span className="error">{errors.email}</span>

        <input
          id="dob"
          type="date"
          value={dob}
          placeholder="Date of Birth"
          onChange={handleDobChange}
        />
        <span className="error">{errors.dob}</span>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span className="error">{errors.password}</span>

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <span className="error">{errors.confirmPassword}</span>

        <button type="submit">Sign Up</button>

        <Link to="/signin">Already have an account?</Link>
      </form>
    </div>
  );
}