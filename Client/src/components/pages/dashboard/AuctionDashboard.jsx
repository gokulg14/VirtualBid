import React, { useState, useEffect } from 'react';
import {
  Home,
  TrendingUp,
  Award,
  MapPin,
  Bed,
  Filter,
  List,
  X,
  Clock,
  DollarSign
} from 'lucide-react';
import dashboardStyles from './AuctionDashboard.module.css';
import axios from 'axios';

const Dashboard = () => {

  const [currentTime, setCurrentTime] = useState(new Date());
  const [username, setUsername] = useState('');
  const [completedBids, setCompletedBids] = useState([]);
  const [upcomingAuctions, setUpcomingAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBidHistory, setShowBidHistory] = useState(false);
  const [bidHistory, setBidHistory] = useState([]);
  const [selectedItemForHistory, setSelectedItemForHistory] = useState(null);
  const [stats, setStats] = useState({
    participated: 0,
    won: 0,
    profileComplete: 100
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        
        if (token && email) {
          // Fetch user info
          const userResponse = await axios.get(
            `http://localhost:3000/auth/user-info/${email}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          setUsername(userResponse.data.user.name);

          // Fetch completed bids
          const completedBidsResponse = await axios.get(
            'http://localhost:3000/bid/end-bids',
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          setCompletedBids(completedBidsResponse.data);

          // Fetch upcoming auctions
          const upcomingBidsResponse = await axios.get(
            'http://localhost:3000/bid/upcoming-bids',
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          setUpcomingAuctions(upcomingBidsResponse.data);

          // Calculate stats
          setStats({
            participated: completedBidsResponse.data.length,
            won: completedBidsResponse.data.filter(bid => bid.highestBidder?.email === email).length,
            profileComplete: 100
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const fetchBidHistory = async (bidId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:3000/bid/bid-history/${bidId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setBidHistory(response.data);
    } catch (error) {
      console.error('Error fetching bid history:', error);
      alert('Failed to load bid history');
    }
  };

  const handleViewBidHistory = (item) => {
    setSelectedItemForHistory(item);
    fetchBidHistory(item._id);
    setShowBidHistory(true);
  };

  return (
    <main className={dashboardStyles.main}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3>Loading dashboard data...</h3>
        </div>
      ) : (
        <>
          {/* Welcome Header */}
          <div className={dashboardStyles.welcomeSection}>
            <h2 className={dashboardStyles.welcomeTitle}>Welcome Back {username || 'User'}!</h2>
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

              {/* Stats Cards */}
              <div className={dashboardStyles.statsGrid}>
                <StatCard
                  icon={TrendingUp}
                  value={stats.participated}
                  label="The total number of Auctions completed."
                  bgColor="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                />
                <StatCard
                  icon={Award}
                  value={stats.won}
                  label="The Auctions you win this month."
                  bgColor="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
                />
              </div>

              {/* Completed Bids */}
              <div className={dashboardStyles.card}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <h3 className={dashboardStyles.cardTitle}>Completed Bids</h3>
                  <button className={dashboardStyles.viewLink}>
                    <Filter size={16} />
                    <span>Filter</span>
                  </button>
                </div>
                <div className={dashboardStyles.tableContainer}>
                  <table className={dashboardStyles.table}>
                    <thead className={dashboardStyles.tableHeader}>
                      <tr>
                        <th className={dashboardStyles.tableHeaderCell}>Item Name</th>
                        <th className={dashboardStyles.tableHeaderCell}>Date End</th>
                        <th className={dashboardStyles.tableHeaderCell}>Bidding Amount</th>
                        <th className={dashboardStyles.tableHeaderCell}>Status</th>
                        <th className={dashboardStyles.tableHeaderCell}>Winner Name</th>
                        <th className={dashboardStyles.tableHeaderCell}>Total Bids</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedBids.map((item, index) => (
                        <tr key={item._id} className={dashboardStyles.tableRow}>
                          <td className={dashboardStyles.tableCell}>
                            <div className={dashboardStyles.houseName}>{index + 1}. {item.title}</div>
                          </td>
                          <td className={dashboardStyles.tableCell}>
                            {new Date(item.endTime).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td className={dashboardStyles.tableCell}>
                            <span className={dashboardStyles.amount}>${item.highestBid?.toLocaleString() || item.startingBid?.toLocaleString()}</span>
                          </td>
                          <td className={dashboardStyles.tableCell}>
                            <span className={dashboardStyles.statusBadge}>Ended</span>
                          </td>
                          <td className={dashboardStyles.tableCell}>
                            <div className={dashboardStyles.houseName}>{item.highestBidder?.name || 'No winner'}</div>
                          </td>
                          <td className={dashboardStyles.tableCell}>
                            <a href="#" className={dashboardStyles.viewLink} onClick={() => handleViewBidHistory(item)}>
                              View Details
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
                  {upcomingAuctions.length > 0 ? (
                    upcomingAuctions.map((auction) => (
                      <div key={auction._id} className={dashboardStyles.auctionCard}>
                        <div className={dashboardStyles.auctionContent}>
                          <div className={dashboardStyles.auctionImage}>
                            <Home size={32} color="white" />
                          </div>
                          <div className={dashboardStyles.auctionDetails}>
                            <h4 className={dashboardStyles.auctionTitle}>{auction.title}</h4>
                            <div className={dashboardStyles.auctionInfo}>
                              <div className={dashboardStyles.auctionInfoRow}>
                                <List size={16} />
                                <span>Description: {auction.description}</span>
                              </div>
                              <div className={dashboardStyles.auctionFooter}>
                                <div className={dashboardStyles.bidAmount}>
                                  ${auction.startingBid?.toLocaleString()}
                                </div>
                                <button className={dashboardStyles.viewDetailsBtn}>
                                  VIEW DETAILS
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{
                      textAlign: 'center',
                      padding: '40px 20px',
                      color: '#6b7280',
                      fontSize: '16px'
                    }}>
                      <Home size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                      <p>No Upcoming Auctions</p>
                      <p style={{ fontSize: '14px', marginTop: '8px' }}>Check back later for new auctions</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Bid History Modal */}
      {showBidHistory && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0.75rem',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '600', 
                color: '#1f2937'
              }}>
                Bid History
              </h2>
              <button
                onClick={() => setShowBidHistory(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '0.5rem',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', color: '#1f2937', marginBottom: '0.5rem' }}>
                {selectedItemForHistory?.title}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Total bids: {bidHistory.length}
              </p>
            </div>

            {bidHistory.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                <p>No bids placed yet</p>
              </div>
            ) : (
              <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                {bidHistory.map((bid, index) => (
                  <div key={bid._id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    marginBottom: '0.5rem',
                    backgroundColor: index === 0 ? '#f0f9ff' : 'white'
                  }}>
                    <div>
                      <p style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>
                        {bid.bidder?.name || 'Unknown Bidder'}
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {new Date(bid.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ 
                        fontSize: '1.125rem', 
                        fontWeight: '600', 
                        color: '#059669',
                        marginBottom: '0.25rem'
                      }}>
                        ${bid.bidAmount.toLocaleString()}
                      </p>
                      {index === 0 && (
                        <span style={{
                          fontSize: '0.75rem',
                          backgroundColor: '#22c55e',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem'
                        }}>
                          Current Highest
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default Dashboard;