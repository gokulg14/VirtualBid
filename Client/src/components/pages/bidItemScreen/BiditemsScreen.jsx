import React, { useState, useEffect } from 'react';
import { Search, Clock, DollarSign, Users, TrendingUp, Eye } from 'lucide-react';

const BidItemsScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bidItems, setBidItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [showBidModal, setShowBidModal] = useState(false);
  const [placingBid, setPlacingBid] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [showBidHistory, setShowBidHistory] = useState(false);
  const [bidHistory, setBidHistory] = useState([]);
  const [selectedItemForHistory, setSelectedItemForHistory] = useState(null);

  // Fetch bid items from backend
  useEffect(() => {
    fetchBidItems();
    // Get current user email for comparison
    setCurrentUserEmail(localStorage.getItem('email') || '');
  }, []);

  const fetchBidItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch('http://localhost:3000/bid/all-bids', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch bid items`);
      }
      
      const data = await response.json();
      console.log('Fetched bid items:', data); // Debug log
      setBidItems(data);
    } catch (error) {
      console.error('Error fetching bid items:', error);
      alert(`Failed to load bid items: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeRemaining = (endTime) => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const difference = end - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (days > 0) return `${days}d ${hours}h ${minutes}m`;
      if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
      return `${minutes}m ${seconds}s`;
    }
    return 'Expired';
  };

  const [timeRemaining, setTimeRemaining] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeRemaining = {};
      bidItems.forEach(item => {
        newTimeRemaining[item._id] = calculateTimeRemaining(item.endTime);
      });
      setTimeRemaining(newTimeRemaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [bidItems]);

  const filteredItems = bidItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBidClick = (item) => {
    if (!canBid(item)) {
      if (isAuctionCreator(item)) {
        alert('You cannot bid on your own auction item.');
      } else {
        alert('This auction is not active for bidding.');
      }
      return;
    }
    
    setSelectedItem(item);
    const currentBid = item.highestBid || item.startingBid || 0;
    setBidAmount((currentBid + 10).toString());
    setShowBidModal(true);
  };

  const handlePlaceBid = async () => {
    if (!selectedItem) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to place a bid');
      return;
    }

    if (parseFloat(bidAmount) <= (selectedItem.highestBid || selectedItem.startingBid || 0)) {
      alert('Bid amount must be higher than current highest bid');
      return;
    }

    try {
      setPlacingBid(true);
      
      const response = await fetch('http://localhost:3000/bid/place-bid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bidId: selectedItem._id,
          bidAmount: parseFloat(bidAmount)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place bid');
      }

      // Update the local state with the new bid information
      setBidItems(prev => prev.map(item => 
        item._id === selectedItem._id 
          ? { 
              ...item, 
              highestBid: parseFloat(bidAmount), 
              totalBids: (item.totalBids || 0) + 1,
              highestBidder: data.bid.highestBidder
            }
          : item
      ));

      alert('Bid placed successfully!');
      setShowBidModal(false);
      setBidAmount('');
      setSelectedItem(null);
    } catch (error) {
      console.error('Error placing bid:', error);
      alert(error.message);
    } finally {
      setPlacingBid(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#22c55e';
      case 'ended': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const isAuctionCreator = (item) => {
    return item.createdBy?.email === currentUserEmail;
  };

  const canBid = (item) => {
    return item.status === 'active' && !isAuctionCreator(item);
  };

  const fetchBidHistory = async (bidId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/bid/bid-history/${bidId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch bid history');
      }
      
      const data = await response.json();
      setBidHistory(data);
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

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        fontSize: '18px',
        color: '#6b7280'
      }}>
        Loading bid items...
      </div>
    );
  }

  return (
    <main style={{ flex: 1, padding: '1.5rem' }}>
      {/* Header Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          marginBottom: '0.5rem' 
        }}>
          Live Auctions
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1rem' }}>
          Browse and bid on active auction items
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ 
        position: 'relative', 
        marginBottom: '2rem',
        maxWidth: '500px'
      }}>
        <Search 
          size={20} 
          style={{ 
            position: 'absolute', 
            left: '15px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: '#6b7280' 
          }} 
        />
        <input
          type="text"
          placeholder="Search auction items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 12px 12px 45px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '16px',
            backgroundColor: 'white',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#3b82f6';
            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#d1d5db';
            e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
          }}
        />
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Active Auctions</p>
              <p style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937' }}>
                {bidItems.filter(item => item.status === 'active').length}
              </p>
            </div>
            <div style={{ 
              backgroundColor: '#dbeafe', 
              padding: '0.75rem', 
              borderRadius: '0.5rem' 
            }}>
              <TrendingUp size={24} style={{ color: '#3b82f6' }} />
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Bids</p>
              <p style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937' }}>
                {bidItems.reduce((sum, item) => sum + (item.totalBids || 0), 0)}
              </p>
            </div>
            <div style={{ 
              backgroundColor: '#dcfce7', 
              padding: '0.75rem', 
              borderRadius: '0.5rem' 
            }}>
              <Users size={24} style={{ color: '#16a34a' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Bid Items Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {filteredItems.map((item) => (
          <div 
            key={item._id}
            style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
          >
            {/* Item Image */}
            <div style={{ 
              height: '200px', 
              backgroundColor: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              {item.imagePath && item.imagePath !== 'uploads/default-property.jpg' ? (
                <img 
                  src={`http://localhost:3000/${item.imagePath}`} 
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <Eye size={48} style={{ color: '#9ca3af' }} />
              )}
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                padding: '4px 8px',
                backgroundColor: getStatusColor(item.status),
                color: 'white',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500',
                textTransform: 'capitalize'
              }}>
                {item.status}
              </div>
              {isAuctionCreator(item) && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  padding: '4px 8px',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  Your Item
                </div>
              )}
            </div>

            {/* Item Details */}
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: '#1f2937', 
                marginBottom: '0.5rem',
                lineHeight: '1.4'
              }}>
                {item.title}
              </h3>
              
              <p style={{ 
                color: '#6b7280', 
                fontSize: '0.875rem', 
                marginBottom: '1rem',
                lineHeight: '1.5'
              }}>
                {item.description}
              </p>

              {/* Timer */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '1rem',
                padding: '0.5rem 0.75rem',
                backgroundColor: '#fef3c7',
                borderRadius: '0.375rem',
                border: '1px solid #fbbf24'
              }}>
                <Clock size={16} style={{ color: '#d97706', marginRight: '0.5rem' }} />
                <span style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#92400e' 
                }}>
                  {timeRemaining[item._id] || 'Calculating...'}
                </span>
              </div>

              {/* Bid Information */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.125rem' }}>
                    Current Bid
                  </p>
                  <p style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '600', 
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <DollarSign size={18} style={{ marginRight: '0.125rem' }} />
                    {(item.highestBid || item.startingBid || 0).toLocaleString()}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.125rem' }}>
                    Total Bids
                  </p>
                  <p style={{ fontSize: '1rem', fontWeight: '500', color: '#1f2937' }}>
                    {item.totalBids || 0}
                  </p>
                </div>
              </div>

              {/* Bid Button */}
              <button
                onClick={() => handleBidClick(item)}
                disabled={!canBid(item)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: canBid(item) ? '#3b82f6' : '#9ca3af',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: canBid(item) ? 'pointer' : 'not-allowed',
                  transition: 'background-color 0.2s',
                  marginBottom: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  if (canBid(item)) {
                    e.target.style.backgroundColor = '#2563eb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (canBid(item)) {
                    e.target.style.backgroundColor = '#3b82f6';
                  }
                }}
              >
                {isAuctionCreator(item) ? 'Your Auction' : 
                 item.status === 'active' ? 'Place Bid' : 'Not Active'}
              </button>

              {/* View History Button */}
              <button
                onClick={() => handleViewBidHistory(item)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.borderColor = '#9ca3af';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderColor = '#d1d5db';
                }}
              >
                View Bid History ({item.totalBids || 0})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bid Modal */}
      {showBidModal && (
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
            maxWidth: '500px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: '#1f2937', 
              marginBottom: '1rem' 
            }}>
              Place Your Bid
            </h2>
            
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.125rem', color: '#1f2937', marginBottom: '0.5rem' }}>
                {selectedItem?.title}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Current highest bid: ${(selectedItem?.highestBid || selectedItem?.startingBid || 0).toLocaleString()}
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '0.5rem' 
              }}>
                Your Bid Amount
              </label>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                min={(selectedItem?.highestBid || selectedItem?.startingBid || 0) + 1}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setShowBidModal(false)}
                disabled={placingBid}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  cursor: placingBid ? 'not-allowed' : 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceBid}
                disabled={placingBid || parseFloat(bidAmount) <= (selectedItem?.highestBid || selectedItem?.startingBid || 0)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: (placingBid || parseFloat(bidAmount) <= (selectedItem?.highestBid || selectedItem?.startingBid || 0)) ? '#d1d5db' : '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  cursor: (placingBid || parseFloat(bidAmount) <= (selectedItem?.highestBid || selectedItem?.startingBid || 0)) ? 'not-allowed' : 'pointer'
                }}
              >
                {placingBid ? 'Placing Bid...' : 'Place Bid'}
              </button>
            </div>
          </div>
        </div>
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
                  color: '#6b7280'
                }}
              >
                ×
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

      {/* No Results */}
      {filteredItems.length === 0 && searchTerm && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem 1.25rem',
          color: '#6b7280'
        }}>
          <Search size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>No items found</h3>
          <p>Try adjusting your search terms</p>
        </div>
      )}

      {/* No Items */}
      {filteredItems.length === 0 && !searchTerm && !loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem 1.25rem',
          color: '#6b7280'
        }}>
          <Eye size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>No auction items available</h3>
          <p>Check back later for new auctions</p>
        </div>
      )}
    </main>
  );
};

export default BidItemsScreen;