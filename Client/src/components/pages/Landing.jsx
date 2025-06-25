import React from 'react';
import './Landing.css';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="landing-hero-bg">
      <div className="landing-overlay">
        <header className="landing-header">
          <div className="landing-logo">VirtualBid</div>
          <nav>
            <Link to="/signin" className="landing-nav-btn">Login</Link>
            <Link to="/signup" className="landing-nav-btn landing-signup">Sign Up</Link>
          </nav>
        </header>
        <main className="landing-main">
          <h1 className="landing-title">Bid Smarter. Win Bigger.</h1>
          <p className="landing-desc">
            Join the most interactive, secure, and real-time online auction platform. Discover exclusive items, compete live, and experience seamless transactions—all in one place.
          </p>
          <div className="landing-cta">
            <Link to="/signup" className="landing-btn landing-btn-main">Get Started</Link>
            <Link to="/signin" className="landing-btn">Login</Link>
          </div>
        </main>
        <footer className="landing-footer">
          &copy; {new Date().getFullYear()} VirtualBid. All rights reserved.
        </footer>
      </div>
    </div>
  );
} 