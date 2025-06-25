import React, { useState, useEffect } from 'react';
import { 
  Home, 
  User, 
  FileText, 
  Car, 
  Upload, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Award, 
  Calendar,
  MapPin,
  Bed,
  Eye,
  Bell,
  Settings,
  Search,
  Filter,
  LogOut
} from 'lucide-react';
import styles from './AuctionDashboard.module.css';

const AuctionDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    participated: 50,
    won: 25,
    profileComplete: 100
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', active: true },
    { id: 'profile', icon: User, label: 'Profile Verification', badge: '!' },
    { id: 'personal', icon: FileText, label: 'Personal Information', status: 'alert' },
    { id: 'select', icon: CheckCircle, label: 'Select Type', status: 'complete' },
    { id: 'documents', icon: Upload, label: 'Documents', status: 'complete' },
    { id: 'driving', icon: Car, label: 'Driving License', status: 'complete' },
    { id: 'deposit', icon: DollarSign, label: 'Deposit Authorization', status: 'complete' },
    { id: 'terms', icon: FileText, label: 'Terms & Conditions', status: 'complete' },
    { id: 'bidding', icon: TrendingUp, label: 'Bidding History' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  const biddingHistory = [
    { id: 1, name: 'The Greenwood', date: 'Apr 20, 2022', amount: '$152,500.00', status: 'Winner', bids: 180 },
    { id: 2, name: 'Windrush Place', date: 'Mar 18, 2022', amount: '$50,000.00', status: 'Winner', bids: 70 },
    { id: 3, name: 'Highgrove Park', date: 'Mar 10, 2022', amount: '$74,975.00', status: 'Winner', bids: 20 },
    { id: 4, name: 'Windrush Place', date: 'Feb 20, 2022', amount: '$142,750.00', status: 'Winner', bids: 150 },
    { id: 5, name: 'Cedar Place', date: 'Jan 08, 2022', amount: '$62,475.00', status: 'Winner', bids: 40 },
    { id: 6, name: 'Priory Field', date: 'Dec 16, 2021', amount: '$200,475.00', status: 'Winner', bids: 400 }
  ];

  const upcomingAuctions = [
    {
      id: 1,
      title: 'Modern Classic House, Downtown',
      area: '1576 SQFT',
      rooms: '3 Beds',
      highestBid: '$430,000',
      date: 'This Month',
      image: '/api/placeholder/100/100'
    },
    {
      id: 2,
      title: 'Cape Code House, Charles Missouri',
      area: '1576 SQFT',
      rooms: '3 Beds',
      openingBid: '$230,000',
      date: 'May 2022',
      image: '/api/placeholder/100/100'
    },
    {
      id: 3,
      title: 'Efesus Stone House, St Charles Missouri',
      area: '1576 SQFT',
      rooms: '3 Beds',
      openingBid: '$20,000',
      date: 'June 2022',
      image: '/api/placeholder/100/100'
    }
  ];

  const StatCard = ({ icon: Icon, value, label, bgColor }) => (
    <div
      className={styles.card}
      style={{ background: bgColor, color: 'white', position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s ease' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <Icon size={32} style={{ marginBottom: '16px' }} />
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '4px' }}>{value}</div>
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>{label}</div>
        </div>
        <div style={{
          fontSize: '4rem',
          opacity: 0.2,
          position: 'absolute',
          right: '20px',
          top: '20px'
        }}>
          <Icon size={80} />
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <Home size={24} color="white" />
            </div>
            <h1 className={styles.logoText}>Homley CRM</h1>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.searchContainer}>
              <Search size={20} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search auctions..." 
                className={styles.searchInput}
              />
            </div>
            <button className={styles.notificationBtn}>
              <Bell size={24} />
            </button>
            <button className={styles.notificationBtn}>
              <LogOut size={24} />
            </button>
          </div>
        </div>
      </header>

      <div className={styles.mainContainer}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            <div className={styles.profileSection}>
              <div className={styles.profileAvatar}>
                <User size={32} color="white" />
              </div>
              <div className={styles.profileInfo}>
                <div className={styles.profileName}>Shahryar</div>
                <div className={styles.profileProgress}>75% Completed</div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill}></div>
                </div>
                <div className={styles.progressText}>7/7</div>
              </div>
            </div>

            <nav className={styles.navigation}>
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={
                    `${styles.navItem} ${activeTab === item.id ? styles.navItemActive : ''}`
                  }
                >
                  <item.icon size={20} />
                  <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                  {item.badge && (
                    <span className={styles.badge}>{item.badge}</span>
                  )}
                  {item.status === 'complete' && (
                    <CheckCircle size={16} className={styles.checkIcon} />
                  )}
                  {item.status === 'alert' && (
                    <div className={styles.statusDot}></div>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.main}>
          {/* Welcome Header */}
          <div className={styles.welcomeSection}>
            <h2 className={styles.welcomeTitle}>Welcome Back Shahryar!</h2>
            <p className={styles.welcomeDate}>
              Today is {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <br />
            <button className={styles.addBidBtn}>
                ADD BID ITEM
            </button>
          </div>

          <div className={styles.gridContainer}>
            {/* Left Column - Stats and History */}
            <div className={styles.leftColumn}>
              {/* Profile Completion */}
              <div className={styles.card}>
                <div className={styles.profileCompleteCard}>
                  <h3 className={styles.cardTitle}>Completed Profile</h3>
                  <span className={styles.completePercent}>100%</span>
                </div>
                <div className={styles.fullProgressBar}>
                  <div className={styles.fullProgressFill}></div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className={styles.statsGrid}>
                <StatCard
                  icon={TrendingUp}
                  value={stats.participated}
                  label="The auction you participated in this month."
                  bgColor="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                />
                <StatCard
                  icon={Award}
                  value={stats.won}
                  label="The Auction you win this month."
                  bgColor="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
                />
              </div>

              {/* Bidding History */}
              <div className={styles.card}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <h3 className={styles.cardTitle}>Bidder History</h3>
                  <button className={styles.viewLink}>
                    <Filter size={16} />
                    <span>Filter</span>
                  </button>
                </div>
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead className={styles.tableHeader}>
                      <tr>
                        <th className={styles.tableHeaderCell}>House Name</th>
                        <th className={styles.tableHeaderCell}>Date Start</th>
                        <th className={styles.tableHeaderCell}>Bidding Amount</th>
                        <th className={styles.tableHeaderCell}>Status</th>
                        <th className={styles.tableHeaderCell}>Total Bids</th>
                      </tr>
                    </thead>
                    <tbody>
                      {biddingHistory.map((item, index) => (
                        <tr key={item.id} className={styles.tableRow}>
                          <td className={styles.tableCell}>
                            <div className={styles.houseName}>{index + 1}. {item.name}</div>
                          </td>
                          <td className={styles.tableCell}>{item.date}</td>
                          <td className={styles.tableCell}>
                            <span className={styles.amount}>{item.amount}</span>
                          </td>
                          <td className={styles.tableCell}>
                            <span className={styles.statusBadge}>{item.status}</span>
                          </td>
                          <td className={styles.tableCell}>
                            <a href="#" className={styles.viewLink}>
                              {item.bids} - view List
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column - Upcoming Auctions */}
            <div className={styles.rightColumn}>
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Upcoming Auctions</h3>
                <div>
                  {upcomingAuctions.map((auction) => (
                    <div key={auction.id} className={styles.auctionCard}>
                      <div className={styles.auctionContent}>
                        <div className={styles.auctionImage}>
                          <Home size={32} color="white" />
                        </div>
                        <div className={styles.auctionDetails}>
                          <h4 className={styles.auctionTitle}>{auction.title}</h4>
                          <div className={styles.auctionInfo}>
                            <div className={styles.auctionInfoRow}>
                              <MapPin size={16} />
                              <span>Area: {auction.area}</span>
                            </div>
                            <div className={styles.auctionInfoRow}>
                              <Bed size={16} />
                              <span>Room: {auction.rooms}</span>
                            </div>
                            <div className={styles.auctionFooter}>
                              <div className={styles.bidAmount}>
                                {auction.highestBid || auction.openingBid}
                              </div>
                              <button className={styles.viewDetailsBtn}>
                                VIEW DETAILS
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuctionDashboard;