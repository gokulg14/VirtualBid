import React, { useState, useEffect } from 'react';
import {
  Home,
  TrendingUp,
  Award,
  MapPin,
  Bed,
  Filter,
} from 'lucide-react';
import dashboardStyles from './AuctionDashboard.module.css';

const Dashboard = () => {

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
      className={dashboardStyles.card}
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
    <main className={dashboardStyles.main}>
      {/* Welcome Header */}
      <div className={dashboardStyles.welcomeSection}>
        <h2 className={dashboardStyles.welcomeTitle}>Welcome Back Shahryar!</h2>
        <p className={dashboardStyles.welcomeDate}>
          Today is {currentTime.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      <div className={dashboardStyles.gridContainer}>
        {/* Left Column - Stats and History */}
        <div className={dashboardStyles.leftColumn}>
          {/* Profile Completion */}
          <div className={dashboardStyles.card}>
            <div className={dashboardStyles.profileCompleteCard}>
              <h3 className={dashboardStyles.cardTitle}>Completed Profile</h3>
              <span className={dashboardStyles.completePercent}>100%</span>
            </div>
            <div className={dashboardStyles.fullProgressBar}>
              <div className={dashboardStyles.fullProgressFill}></div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className={dashboardStyles.statsGrid}>
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
          <div className={dashboardStyles.card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 className={dashboardStyles.cardTitle}>Bidder History</h3>
              <button className={dashboardStyles.viewLink}>
                <Filter size={16} />
                <span>Filter</span>
              </button>
            </div>
            <div className={dashboardStyles.tableContainer}>
              <table className={dashboardStyles.table}>
                <thead className={dashboardStyles.tableHeader}>
                  <tr>
                    <th className={dashboardStyles.tableHeaderCell}>House Name</th>
                    <th className={dashboardStyles.tableHeaderCell}>Date Start</th>
                    <th className={dashboardStyles.tableHeaderCell}>Bidding Amount</th>
                    <th className={dashboardStyles.tableHeaderCell}>Status</th>
                    <th className={dashboardStyles.tableHeaderCell}>Total Bids</th>
                  </tr>
                </thead>
                <tbody>
                  {biddingHistory.map((item, index) => (
                    <tr key={item.id} className={dashboardStyles.tableRow}>
                      <td className={dashboardStyles.tableCell}>
                        <div className={dashboardStyles.houseName}>{index + 1}. {item.name}</div>
                      </td>
                      <td className={dashboardStyles.tableCell}>{item.date}</td>
                      <td className={dashboardStyles.tableCell}>
                        <span className={dashboardStyles.amount}>{item.amount}</span>
                      </td>
                      <td className={dashboardStyles.tableCell}>
                        <span className={dashboardStyles.statusBadge}>{item.status}</span>
                      </td>
                      <td className={dashboardStyles.tableCell}>
                        <a href="#" className={dashboardStyles.viewLink}>
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
        <div className={dashboardStyles.rightColumn}>
          <div className={dashboardStyles.card}>
            <h3 className={dashboardStyles.cardTitle}>Upcoming Auctions</h3>
            <div>
              {upcomingAuctions.map((auction) => (
                <div key={auction.id} className={dashboardStyles.auctionCard}>
                  <div className={dashboardStyles.auctionContent}>
                    <div className={dashboardStyles.auctionImage}>
                      <Home size={32} color="white" />
                    </div>
                    <div className={dashboardStyles.auctionDetails}>
                      <h4 className={dashboardStyles.auctionTitle}>{auction.title}</h4>
                      <div className={dashboardStyles.auctionInfo}>
                        <div className={dashboardStyles.auctionInfoRow}>
                          <MapPin size={16} />
                          <span>Area: {auction.area}</span>
                        </div>
                        <div className={dashboardStyles.auctionInfoRow}>
                          <Bed size={16} />
                          <span>Room: {auction.rooms}</span>
                        </div>
                        <div className={dashboardStyles.auctionFooter}>
                          <div className={dashboardStyles.bidAmount}>
                            {auction.highestBid || auction.openingBid}
                          </div>
                          <button className={dashboardStyles.viewDetailsBtn}>
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
  );
}

export default Dashboard;