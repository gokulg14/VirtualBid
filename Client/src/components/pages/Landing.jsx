import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Gavel, 
  ArrowRight, 
  Users, 
  Shield, 
  Clock, 
  TrendingUp, 
  Star, 
  ChevronDown,
  CheckCircle,
  Play,
  Home,
  DollarSign,
  Award,
  Eye,
  Heart,
  MessageCircle
} from 'lucide-react';

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const navigate = useNavigate();

  const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    lineHeight: 1.6,
    color: '#1f2937',
  },
  
  // Navigation
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #e5e7eb',
    zIndex: 1000,
    padding: '1rem 0',
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  brandName: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
  },
  navButtons: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  signInButton: {
    padding: '0.5rem 1.5rem',
    background: 'transparent',
    border: '2px solid #dc2626',
    borderRadius: '25px',
    color: '#dc2626',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  getStartedButton: {
    padding: '0.5rem 1.5rem',
    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
    border: 'none',
    borderRadius: '25px',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)',
  },
  
  // Hero Section
  hero: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%)',
    overflow: 'hidden',
  },
  heroBackground: {
    position: 'absolute',
    inset: 0,
    background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  },
  heroContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
    alignItems: 'center',
    zIndex: 2,
  },
  heroText: {
    color: 'white',
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    lineHeight: '1.2',
    animation: 'fadeInUp 1s ease-out',
  },
  heroHighlight: {
    background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    marginBottom: '2rem',
    opacity: 0.9,
    animation: 'fadeInUp 1s ease-out 0.2s both',
  },
  heroStats: {
    display: 'flex',
    gap: '2rem',
    marginBottom: '2.5rem',
    animation: 'fadeInUp 1s ease-out 0.4s both',
  },
  statItem: {
    textAlign: 'center',
  },
  statNumber: {
    display: 'block',
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#fbbf24',
  },
  statLabel: {
    fontSize: '0.875rem',
    opacity: 0.8,
  },
  heroActions: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    animation: 'fadeInUp 1s ease-out 0.6s both',
  },
  primaryButton: {
    padding: '1rem 2rem',
    background: 'linear-gradient(45deg, #dc2626, #b91c1c)',
    border: 'none',
    borderRadius: '50px',
    color: 'white',
    fontWeight: '600',
    fontSize: '1.1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 25px rgba(220, 38, 38, 0.4)',
  },
  secondaryButton: {
    padding: '1rem 2rem',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50px',
    color: 'white',
    fontWeight: '600',
    fontSize: '1.1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },
  heroVisual: {
    display: 'flex',
    justifyContent: 'center',
    animation: 'fadeInRight 1s ease-out 0.8s both',
  },
  floatingCard: {
    background: 'white',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
    transform: 'rotate(-5deg)',
    animation: 'float 6s ease-in-out infinite',
  },
  cardImage: {
    width: '300px',
    height: '200px',
    objectFit: 'cover',
  },
  cardContent: {
    padding: '1.5rem',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#1f2937',
  },
  cardPrice: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: '1rem',
  },
  cardStats: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.875rem',
    color: '#6b7280',
  },
  scrollIndicator: {
    position: 'absolute',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    color: 'white',
    animation: 'bounce 2s infinite',
  },
  
  // Sections
  section: {
    padding: '5rem 0',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#1f2937',
  },
  sectionSubtitle: {
    fontSize: '1.2rem',
    color: '#6b7280',
    maxWidth: '600px',
    margin: '0 auto',
  },
  
  // Property Grid
  propertyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem',
    padding: '0 2rem',
  },
  propertyCard: {
    background: 'white',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    animation: 'fadeInUp 1s ease-out both',
  },
  propertyImageContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  propertyImage: {
    width: '100%',
    height: '250px',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  },
  propertyBadge: {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    background: 'rgba(220, 38, 38, 0.9)',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  propertyActions: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    display: 'flex',
    gap: '0.5rem',
  },
  actionButton: {
    background: 'rgba(255, 255, 255, 0.9)',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  propertyInfo: {
    padding: '1.5rem',
  },
  propertyTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#1f2937',
  },
  propertyPrice: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: '1rem',
  },
  propertyMeta: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '1.5rem',
  },
  bidButton: {
    width: '100%',
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(45deg, #dc2626, #b91c1c)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
  },
  
  // Features Section
  featuresSection: {
    background: '#f9fafb',
    padding: '5rem 0',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    padding: '0 2rem',
  },
  featureCard: {
    background: 'white',
    padding: '2rem',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 5px 20px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
  },
  featureIcon: {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(45deg, #dc2626, #b91c1c)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
    color: 'white',
  },
  featureTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#1f2937',
  },
  featureDescription: {
    color: '#6b7280',
    lineHeight: '1.6',
  },
  
  // Testimonials
  testimonialsSection: {
    padding: '5rem 0',
  },
  testimonialsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    padding: '0 2rem',
  },
  testimonialCard: {
    background: 'white',
    padding: '2rem',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
  },
  testimonialRating: {
    display: 'flex',
    gap: '0.25rem',
    marginBottom: '1rem',
  },
  testimonialContent: {
    fontSize: '1.1rem',
    color: '#374151',
    marginBottom: '1.5rem',
    fontStyle: 'italic',
  },
  testimonialAuthor: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  testimonialAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  testimonialName: {
    fontWeight: '600',
    color: '#1f2937',
  },
  testimonialRole: {
    fontSize: '0.875rem',
    color: '#6b7280',
  },
  
  // CTA Section
  ctaSection: {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%)',
    padding: '5rem 0',
    color: 'white',
    textAlign: 'center',
  },
  ctaContent: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  ctaTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  ctaSubtitle: {
    fontSize: '1.2rem',
    marginBottom: '2.5rem',
    opacity: 0.9,
  },
  ctaButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  ctaPrimaryButton: {
    padding: '1rem 2rem',
    background: 'linear-gradient(45deg, #dc2626, #b91c1c)',
    border: 'none',
    borderRadius: '50px',
    color: 'white',
    fontWeight: '600',
    fontSize: '1.1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 25px rgba(220, 38, 38, 0.4)',
  },
  ctaSecondaryButton: {
    padding: '1rem 2rem',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50px',
    color: 'white',
    fontWeight: '600',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },
  
  // Footer
  footer: {
    background: '#1f2937',
    color: 'white',
    padding: '3rem 0 1rem',
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: '2rem',
  },
  footerBrand: {
    maxWidth: '300px',
  },
  footerBrandName: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: 'white',
  },
  footerDescription: {
    marginTop: '1rem',
    color: '#d1d5db',
    lineHeight: '1.6',
  },
  footerLinks: {
    display: 'contents',
  },
  footerColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  footerColumnTitle: {
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: 'white',
  },
  footerLink: {
    color: '#d1d5db',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
  },
  footerBottom: {
    maxWidth: '1200px',
    margin: '2rem auto 0',
    padding: '2rem 2rem 0',
    borderTop: '1px solid #374151',
    textAlign: 'center',
  },
  copyright: {
    color: '#9ca3af',
    fontSize: '0.875rem',
  },
  
  // Keyframe animations (CSS-in-JS approximation)
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
  '@keyframes fadeInRight': {
    '0%': {
      opacity: 0,
      transform: 'translateX(30px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateX(0)',
    },
  },
  '@keyframes float': {
    '0%, 100%': {
      transform: 'rotate(-5deg) translateY(0px)',
    },
    '50%': {
      transform: 'rotate(-5deg) translateY(-20px)',
    },
  },
  '@keyframes bounce': {
    '0%, 20%, 53%, 80%, 100%': {
      transform: 'translateX(-50%) translateY(0)',
    },
    '40%, 43%': {
      transform: 'translateX(-50%) translateY(-15px)',
    },
    '70%': {
      transform: 'translateX(-50%) translateY(-7px)',
    },
    '90%': {
      transform: 'translateX(-50%) translateY(-3px)',
    },
  },
  
  // Hover effects (would need to be implemented with CSS or onMouseEnter/Leave)
  // These are just reference for the intended hover states
  hoverEffects: {
    propertyCard: {
      transform: 'translateY(-10px)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    },
    featureCard: {
      transform: 'translateY(-5px)',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.12)',
    },
    button: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(220, 38, 38, 0.6)',
    },
  },
  
  // Responsive breakpoints
  '@media (max-width: 768px)': {
    heroContent: {
      gridTemplateColumns: '1fr',
      textAlign: 'center',
      gap: '2rem',
    },
    heroTitle: {
      fontSize: '2.5rem',
    },
    heroStats: {
      justifyContent: 'center',
    },
    footerContent: {
      gridTemplateColumns: '1fr',
      textAlign: 'center',
      gap: '2rem',
    },
    propertyGrid: {
      gridTemplateColumns: '1fr',
      padding: '0 1rem',
    },
    featuresGrid: {
      gridTemplateColumns: '1fr',
      padding: '0 1rem',
    },
    testimonialsGrid: {
      gridTemplateColumns: '1fr',
      padding: '0 1rem',
    },
  },
};

  const featuredProperties = [
    {
      id: 1,
      title: "Luxury Villa in Beverly Hills",
      price: "$2,500,000",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop",
      bids: 24,
      timeLeft: "2h 15m",
      views: 1200
    },
    {
      id: 2,
      title: "Bag",
      price: "$1,800,000",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
      bids: 18,
      timeLeft: "5h 42m",
      views: 890
    },
    {
      id: 3,
      title: "Historic Estate Mansion",
      price: "$3,200,000",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
      bids: 31,
      timeLeft: "1d 8h",
      views: 2100
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Property Investor",
      content: "Found my dream investment property through VirtualBid. The bidding process was transparent and exciting!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Michael Chen",
      role: "First-time Buyer",
      content: "As a first-time buyer, the platform made it easy to understand the auction process. Excellent support!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Emily Rodriguez",
      role: "Real Estate Agent",
      content: "I recommend Virtual Bid to all my clients. The platform is professional and delivers results consistently.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProperties.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleGetStarted = () => {
    navigate('/signin');
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          <div style={styles.logo}>
            <Gavel size={32} color="#dc2626" />
            <span style={styles.brandName}>VIRTUAL BID</span>
          </div>
          <div style={styles.navButtons}>
            <button onClick={handleSignIn} style={styles.signInButton}>
              Sign In
            </button>
            <button onClick={handleGetStarted} style={styles.getStartedButton}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroBackground}></div>
        <div style={styles.heroContent}>
          <div style={styles.heroText}>
            <h1 style={styles.heroTitle}>
              Discover and Bid Your Dream Item at 
              <span style={styles.heroHighlight}> Live Auctions</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Join thousands of successful bidders in the most transparent and exciting 
              auction platform. Bid with confidence, win with pride.
            </p>
            <div style={styles.heroStats}>
              <div style={styles.statItem}>
                <span style={styles.statNumber}>50K+</span>
                <span style={styles.statLabel}>Active Bidders</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statNumber}>$2.5B+</span>
                <span style={styles.statLabel}>Item Sold</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statNumber}>98%</span>
                <span style={styles.statLabel}>Success Rate</span>
              </div>
            </div>
            <div style={styles.heroActions}>
              <button onClick={handleGetStarted} style={styles.primaryButton}>
                Start Bidding Now
                <ArrowRight size={20} />
              </button>
              <button style={styles.secondaryButton}>
                <Play size={20} />
                Watch Demo
              </button>
            </div>
          </div>
          <div style={styles.heroVisual}>
            <div style={styles.floatingCard}>
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop" 
                alt="Luxury Property"
                style={styles.cardImage}
              />
              <div style={styles.cardContent}>
                <h3 style={styles.cardTitle}>Live Auction</h3>
                <p style={styles.cardPrice}>$1,850,000</p>
                <div style={styles.cardStats}>
                  <span><Users size={16} /> 23 bidders</span>
                  <span><Clock size={16} /> 2h 45m left</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={styles.scrollIndicator}>
          <ChevronDown size={24} />
        </div>
      </section>

      {/* Featured Properties */}
      <section id="featured" style={styles.section}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Featured Auctions</h2>
            <p style={styles.sectionSubtitle}>
              Don't miss these exclusive items going live soon
            </p>
          </div>
          
          <div style={styles.propertyGrid}>
            {featuredProperties.map((property, index) => (
              <div 
                key={property.id} 
                style={{
                  ...styles.propertyCard,
                  animationDelay: `${index * 0.2}s`
                }}
              >
                <div style={styles.propertyImageContainer}>
                  <img 
                    src={property.image} 
                    alt={property.title}
                    style={styles.propertyImage}
                  />
                  <div style={styles.propertyBadge}>
                    <Clock size={16} />
                    {property.timeLeft}
                  </div>
                  <div style={styles.propertyActions}>
                    <button style={styles.actionButton}>
                      <Heart size={18} />
                    </button>
                    <button style={styles.actionButton}>
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
                <div style={styles.propertyInfo}>
                  <h3 style={styles.propertyTitle}>{property.title}</h3>
                  <p style={styles.propertyPrice}>{property.price}</p>
                  <div style={styles.propertyMeta}>
                    <span><Users size={16} /> {property.bids} bids</span>
                    <span><Eye size={16} /> {property.views} views</span>
                  </div>
                  <button style={styles.bidButton}>
                    Place Bid
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={styles.featuresSection}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Why Choose VirtialBid?</h2>
            <p style={styles.sectionSubtitle}>
              Experience the future of auctions with our cutting-edge platform
            </p>
          </div>
          
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <Shield size={32} />
              </div>
              <h3 style={styles.featureTitle}>Secure & Transparent</h3>
              <p style={styles.featureDescription}>
                Bank-level security with complete transparency in every transaction and bid.
              </p>
            </div>
            
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <Clock size={32} />
              </div>
              <h3 style={styles.featureTitle}>Real-Time Bidding</h3>
              <p style={styles.featureDescription}>
                Experience the thrill of live auctions with real-time updates and notifications.
              </p>
            </div>
            
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <Award size={32} />
              </div>
              <h3 style={styles.featureTitle}>Verified Items</h3>
              <p style={styles.featureDescription}>
                Every items is professionally verified and authenticated before listing.
              </p>
            </div>
            
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <TrendingUp size={32} />
              </div>
              <h3 style={styles.featureTitle}>Market Analytics</h3>
              <p style={styles.featureDescription}>
                Make informed decisions with comprehensive market data and price analytics.
              </p>
            </div>
            
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <Users size={32} />
              </div>
              <h3 style={styles.featureTitle}>Expert Support</h3>
              <p style={styles.featureDescription}>
                Get 24/7 support from our team of auction experts.
              </p>
            </div>
            
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <DollarSign size={32} />
              </div>
              <h3 style={styles.featureTitle}>Best Value</h3>
              <p style={styles.featureDescription}>
                Competitive pricing with no hidden fees. Pay only when you win.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" style={styles.testimonialsSection}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>What Our Users Say</h2>
            <p style={styles.sectionSubtitle}>
              Join thousands of satisfied bid buyers and sellers
            </p>
          </div>
          
          <div style={styles.testimonialsGrid}>
            {testimonials.map((testimonial, index) => (
              <div key={index} style={styles.testimonialCard}>
                <div style={styles.testimonialRating}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
                  ))}
                </div>
                <p style={styles.testimonialContent}>"{testimonial.content}"</p>
                <div style={styles.testimonialAuthor}>
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    style={styles.testimonialAvatar}
                  />
                  <div>
                    <div style={styles.testimonialName}>{testimonial.name}</div>
                    <div style={styles.testimonialRole}>{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <div style={styles.container}>
          <div style={styles.ctaContent}>
            <h2 style={styles.ctaTitle}>Ready to Find Your Dream Bid?</h2>
            <p style={styles.ctaSubtitle}>
              Join VirtualBid today and start bidding on premium items
            </p>
            <div style={styles.ctaButtons}>
              <button onClick={handleGetStarted} style={styles.ctaPrimaryButton}>
                Create Free Account
                <ArrowRight size={20} />
              </button>
              <button onClick={handleSignIn} style={styles.ctaSecondaryButton}>
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.container}>
          <div style={styles.footerContent}>
            <div style={styles.footerBrand}>
              <div style={styles.logo}>
                <Gavel size={24} color="#dc2626" />
                <span style={styles.footerBrandName}>VirtualBid</span>
              </div>
              <p style={styles.footerDescription}>
                The premier platform for auctions, connecting buyers and sellers worldwide.
              </p>
            </div>
            <div style={styles.footerLinks}>
              <div style={styles.footerColumn}>
                <h4 style={styles.footerColumnTitle}>Platform</h4>
                <a href="#" style={styles.footerLink}>How it Works</a>
                <a href="#" style={styles.footerLink}>Pricing</a>
                <a href="#" style={styles.footerLink}>Security</a>
              </div>
              <div style={styles.footerColumn}>
                <h4 style={styles.footerColumnTitle}>Support</h4>
                <a href="#" style={styles.footerLink}>Help Center</a>
                <a href="#" style={styles.footerLink}>Contact Us</a>
                <a href="#" style={styles.footerLink}>Community</a>
              </div>
              <div style={styles.footerColumn}>
                <h4 style={styles.footerColumnTitle}>Legal</h4>
                <a href="#" style={styles.footerLink}>Privacy Policy</a>
                <a href="#" style={styles.footerLink}>Terms of Service</a>
                <a href="#" style={styles.footerLink}>Cookie Policy</a>
              </div>
            </div>
          </div>
          <div style={styles.footerBottom}>
            <p style={styles.copyright}>
              © 2025 VirtualBid. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};


export default LandingPage;