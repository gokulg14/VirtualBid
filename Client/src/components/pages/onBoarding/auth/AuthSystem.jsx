import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Mail, Lock, Phone, Calendar, UserPlus, LogIn, Gavel, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const AuthSystem = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    dateOfBirth: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [age, setAge] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Set initial mode based on route
  useEffect(() => {
    if (location.pathname === '/signup') {
      setIsSignUp(true);
    } else {
      setIsSignUp(false);
    }
  }, [location.pathname]);

  // Calculate age when date of birth changes
  useEffect(() => {
    if (formData.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(formData.dateOfBirth);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      
      setAge(calculatedAge);
    } else {
      setAge(null);
    }
  }, [formData.dateOfBirth]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (isSignUp) {
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
      } else if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      }
      
      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = 'Date of birth is required';
      } else if (age < 18) {
        newErrors.dateOfBirth = 'You must be at least 18 years old';
      }
      
      // Phone validation only for sign-up
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Please enter a valid 10-digit phone number';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms and conditions';
      }
    }
    
    // Email and password validation for both sign-in and sign-up
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        // Handle Sign Up
        const signUpData = {
          name: formData.username,
          email: formData.email,
          age: age,
          phone: formData.phone,
          password: formData.password,
        };

        const response = await axios.post('http://localhost:3000/auth/user-reg', signUpData);
        alert('Account created successfully!');
        setIsSignUp(false); // Switch to sign in mode
        setFormData({
          username: '',
          email: '',
          dateOfBirth: '',
          phone: '',
          password: '',
          confirmPassword: '',
          agreeToTerms: false
        });
        setErrors({});
      } else {
        // Handle Sign In
        const signInData = {
          email: formData.email,
          password: formData.password,
        };

        const response = await axios.post('http://localhost:3000/auth/user-login', signInData);
        
        // Store token and email in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('email', formData.email);
        
        alert('Signed in successfully!');
        navigate('/sidemenu');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      const errorMessage = error.response?.data?.error || 
        (isSignUp ? 'Sign up failed. Please try again.' : 'Sign in failed. Please check your credentials.');
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    const newMode = !isSignUp;
    setIsSignUp(newMode);
    
    // Navigate to appropriate route
    if (newMode) {
      navigate('/signup');
    } else {
      navigate('/signin');
    }
    
    setFormData({
      username: '',
      email: '',
      dateOfBirth: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    setAge(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <div style={styles.brandSection}>
          <div style={styles.logo}>
            <Gavel size={32} color="#dc2626" />
            <span style={styles.brandName}>Homley CRM</span>
          </div>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>
              Welcome to the Future of Online Auctions
            </h1>
            <p style={styles.heroSubtitle}>
              Discover unique properties, participate in live auctions, and find your dream home with our cutting-edge platform.
            </p>
            <div style={styles.featureList}>
              <div style={styles.feature}>
                <CheckCircle size={20} color="#10b981" />
                <span>Real-time bidding system</span>
              </div>
              <div style={styles.feature}>
                <CheckCircle size={20} color="#10b981" />
                <span>Secure payment processing</span>
              </div>
              <div style={styles.feature}>
                <CheckCircle size={20} color="#10b981" />
                <span>Professional property verification</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div style={styles.rightPanel}>
        <div style={styles.authCard}>
          <div style={styles.authHeader}>
            <h2 style={styles.authTitle}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p style={styles.authSubtitle}>
              {isSignUp 
                ? 'Join thousands of successful bidders' 
                : 'Sign in to continue your auction journey'
              }
            </p>
          </div>
          
          <div style={styles.form}>
            {isSignUp && (
              <>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Username</label>
                  <div style={styles.inputWrapper}>
                    <User size={20} style={styles.inputIcon} />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Enter your username"
                      style={{
                        ...styles.input,
                        ...(errors.username ? styles.inputError : {})
                      }}
                    />
                  </div>
                  {errors.username && (
                    <span style={styles.errorText}>
                      <AlertCircle size={16} />
                      {errors.username}
                    </span>
                  )}
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Phone Number</label>
                  <div style={styles.inputWrapper}>
                    <Phone size={20} style={styles.inputIcon} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      style={{
                        ...styles.input,
                        ...(errors.phone ? styles.inputError : {})
                      }}
                    />
                  </div>
                  {errors.phone && (
                    <span style={styles.errorText}>
                      <AlertCircle size={16} />
                      {errors.phone}
                    </span>
                  )}
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Date of Birth</label>
                  <div style={styles.inputWrapper}>
                    <Calendar size={20} style={styles.inputIcon} />
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      style={{
                        ...styles.input,
                        ...(errors.dateOfBirth ? styles.inputError : {})
                      }}
                    />
                  </div>
                  {errors.dateOfBirth && (
                    <span style={styles.errorText}>
                      <AlertCircle size={16} />
                      {errors.dateOfBirth}
                    </span>
                  )}
                </div>
              </>
            )}
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <Mail size={20} style={styles.inputIcon} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  style={{
                    ...styles.input,
                    ...(errors.email ? styles.inputError : {})
                  }}
                />
              </div>
              {errors.email && (
                <span style={styles.errorText}>
                  <AlertCircle size={16} />
                  {errors.email}
                </span>
              )}
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <Lock size={20} style={styles.inputIcon} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  style={{
                    ...styles.input,
                    ...(errors.password ? styles.inputError : {})
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <span style={styles.errorText}>
                  <AlertCircle size={16} />
                  {errors.password}
                </span>
              )}
            </div>
            
            {isSignUp && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>Confirm Password</label>
                <div style={styles.inputWrapper}>
                  <Lock size={20} style={styles.inputIcon} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    style={{
                      ...styles.input,
                      ...(errors.confirmPassword ? styles.inputError : {})
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeButton}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span style={styles.errorText}>
                    <AlertCircle size={16} />
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
            )}
            
            {isSignUp && (
              <div style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  style={styles.checkbox}
                />
                <label style={styles.checkboxLabel}>
                  I agree to the <a href="#" style={styles.link}>Terms of Service</a> and <a href="#" style={styles.link}>Privacy Policy</a>
                </label>
                {errors.agreeToTerms && (
                  <span style={styles.errorText}>
                    <AlertCircle size={16} />
                    {errors.agreeToTerms}
                  </span>
                )}
              </div>
            )}
            
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              style={{
                ...styles.submitButton,
                ...(isLoading ? styles.submitButtonDisabled : {})
              }}
            >
              {isLoading ? (
                <div style={styles.loader}></div>
              ) : (
                <>
                  {isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />}
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </>
              )}
            </button>
          </div>
          
          <div style={styles.authFooter}>
            <p style={styles.authToggleText}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                onClick={toggleAuthMode}
                style={styles.authToggleButton}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  leftPanel: {
    flex: 1,
    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
  },
  brandSection: {
    textAlign: 'center',
    maxWidth: '500px',
    zIndex: 2,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '2rem',
    gap: '0.5rem',
  },
  brandName: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: 'white',
  },
  heroContent: {
    animation: 'fadeInUp 1s ease-out',
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    lineHeight: '1.2',
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    marginBottom: '2rem',
    opacity: 0.9,
    lineHeight: '1.6',
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'flex-start',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '1.1rem',
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    backgroundColor: '#f9fafb',
  },
  authCard: {
    width: '100%',
    maxWidth: '450px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    padding: '2.5rem',
    animation: 'slideInRight 0.8s ease-out',
  },
  authHeader: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  authTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '0.5rem',
  },
  authSubtitle: {
    color: '#6b7280',
    fontSize: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 3rem',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    backgroundColor: 'white',
    boxSizing: 'border-box',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  inputIcon: {
    position: 'absolute',
    left: '0.75rem',
    color: '#9ca3af',
    zIndex: 1,
  },
  eyeButton: {
    position: 'absolute',
    right: '0.75rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9ca3af',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
  },
  ageDisplay: {
    position: 'absolute',
    right: '0.75rem',
    fontSize: '0.875rem',
    color: '#10b981',
    fontWeight: '500',
  },
  errorText: {
    color: '#ef4444',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  checkbox: {
    marginRight: '0.5rem',
  },
  checkboxLabel: {
    fontSize: '0.875rem',
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
  },
  link: {
    color: '#dc2626',
    textDecoration: 'none',
    fontWeight: '500',
  },
  submitButton: {
    width: '100%',
    padding: '0.875rem 1rem',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '1rem',
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
  },
  loader: {
    width: '20px',
    height: '20px',
    border: '2px solid #ffffff33',
    borderTop: '2px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  authFooter: {
    textAlign: 'center',
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e5e7eb',
  },
  authToggleText: {
    color: '#6b7280',
    fontSize: '0.875rem',
  },
  authToggleButton: {
    color: '#dc2626',
    fontWeight: '600',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginLeft: '0.5rem',
    fontSize: '0.875rem',
  },
  '@keyframes fadeInUp': {
    '0%': {
      opacity: 0,
      transform: 'translateY(30px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  '@keyframes slideInRight': {
    '0%': {
      opacity: 0,
      transform: 'translateX(30px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateX(0)',
    },
  },
  '@keyframes spin': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
};

// Add responsive styles
const mediaQuery = window.matchMedia('(max-width: 768px)');
if (mediaQuery.matches) {
  styles.container.flexDirection = 'column';
  styles.leftPanel.padding = '1rem';
  styles.heroTitle.fontSize = '2rem';
  styles.heroSubtitle.fontSize = '1rem';
  styles.rightPanel.padding = '1rem';
  styles.authCard.padding = '1.5rem';
}

export default AuthSystem;