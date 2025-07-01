import React, { useState, useEffect } from 'react';
import { 
  Search, 
  TrendingUp, 
  Award, 
  Eye, 
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  User,
  Mail,
  Phone,
  X,
  Plus
} from 'lucide-react';
import axios from 'axios';

const AuctionHistoryScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  
  const itemsPerPage = 8;

  // State for real auction history data
  const [auctionHistory, setAuctionHistory] = useState([]);

  // New state for user-created auctions and winner modal
  const [userAuctions, setUserAuctions] = useState([]);
  const [loadingUserAuctions, setLoadingUserAuctions] = useState(true);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState(null);

  // Fetch auction history data on component mount
  useEffect(() => {
    fetchAuctionHistory();
    fetchUserAuctions();
  }, []);

  const fetchAuctionHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');
      
      if (!token || !email) {
        throw new Error('No authentication token or email found');
      }

      const response = await axios.get(
        `http://localhost:3000/auth/user-bidding-history/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAuctionHistory(response.data.biddingHistory);
    } catch (error) {
      console.error('Error fetching auction history:', error);
      setError(error.response?.data?.error || 'Failed to load auction history');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user-created auctions (like AddBidScreen)
  const fetchUserAuctions = async () => {
    try {
      setLoadingUserAuctions(true);
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');
      if (token && email) {
        const response = await axios.get(
          `http://localhost:3000/bid/user-created-auctions/${email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setUserAuctions(response.data.auctions);
      }
    } catch (error) {
      console.error('Error fetching user auctions:', error);
    } finally {
      setLoadingUserAuctions(false);
    }
  };

  // Filter and search logic
  const filteredAuctions = auctionHistory.filter(auction => {
    const matchesSearch = auction.houseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || auction.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAuctions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAuctions = filteredAuctions.slice(startIndex, startIndex + itemsPerPage);

  // Statistics
  const totalAuctions = auctionHistory.length;
  const wonAuctions = auctionHistory.filter(a => a.status === 'Winner').length;
  const totalSpent = auctionHistory
    .filter(a => a.status === 'Winner')
    .reduce((sum, a) => sum + a.finalAmount, 0);
  // New: total auctions listed by user
  const totalAuctionsListed = userAuctions.length;

  const getStatusBadge = (status) => {
    const baseStyle = {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase'
    };

    if (status === 'Winner') {
      return { ...baseStyle, backgroundColor: '#22c55e', color: 'white' };
    } else {
      return { ...baseStyle, backgroundColor: '#ef4444', color: 'white' };
    }
  };

  const handleViewOwnerDetails = (auction) => {
    setSelectedOwner(auction.owner);
    setShowOwnerModal(true);
  };

  const closeOwnerModal = () => {
    setShowOwnerModal(false);
    setSelectedOwner(null);
  };

  // Winner modal handlers
  const handleViewWinnerDetails = (auction) => {
    setSelectedWinner(auction.winner);
    setShowWinnerModal(true);
  };
  const closeWinnerModal = () => {
    setShowWinnerModal(false);
    setSelectedWinner(null);
  };

  // Loading state
  if (loading) {
    return (
      <main style={{ 
        flex: 1, 
        padding: '1.5rem',
        backgroundColor: '#f8fafc', 
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '400px',
          fontSize: '18px',
          color: '#6b7280'
        }}>
          Loading auction history...
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main style={{ 
        flex: 1, 
        padding: '1.5rem',
        backgroundColor: '#f8fafc', 
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem 1.25rem',
          color: '#6b7280'
        }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#dc2626' }}>
            Error loading auction history
          </h3>
          <p>{error}</p>
          <button
            onClick={fetchAuctionHistory}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ 
      flex: 1, 
      padding: '1.5rem',
      backgroundColor: '#f8fafc', 
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header Section */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          color: '#1f2937',
          marginBottom: '8px'
        }}>
          Auction History
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          Track all your auction activities and bidding history
        </p>
      </div>

      {/* Statistics Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>Total Auctions</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>{totalAuctions}</p>
            </div>
            <div style={{ 
              backgroundColor: '#dbeafe', 
              padding: '12px', 
              borderRadius: '12px',
              color: '#2563eb'
            }}>
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
        {/* New: Total Auction Listed Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>Total Auction Listed</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>{totalAuctionsListed}</p>
            </div>
            <div style={{ 
              backgroundColor: '#f0fdf4', 
              padding: '12px', 
              borderRadius: '12px',
              color: '#16a34a'
            }}>
              <Plus size={24} />
            </div>
          </div>
        </div>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>Won Auctions</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>{wonAuctions}</p>
            </div>
            <div style={{ 
              backgroundColor: '#dcfce7', 
              padding: '12px', 
              borderRadius: '12px',
              color: '#16a34a'
            }}>
              <Award size={24} />
            </div>
          </div>
        </div>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>Total Spent</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                ${totalSpent.toLocaleString()}
              </p>
            </div>
            <div style={{ 
              backgroundColor: '#fef3c7', 
              padding: '12px', 
              borderRadius: '12px',
              color: '#d97706'
            }}>
              <DollarSign size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', flex: 1 }}>
            {/* Search Bar */}
            <div style={{ position: 'relative', minWidth: '300px', flex: 1 }}>
              <Search 
                size={20} 
                style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#6b7280'
                }} 
              />
              <input
                type="text"
                placeholder="Search by auction name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '80%',
                  padding: '12px 16px 12px 44px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#dc2626'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Auction History Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {currentAuctions.map((auction) => (
          <div
            key={auction.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              border: '1px solid #e5e7eb',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
            }}
          >
            {/* Card Header */}
            <div style={{ 
              padding: '20px 24px 16px',
              borderBottom: '1px solid #f3f4f6'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {auction.imagePath && auction.imagePath !== 'uploads/default-property.jpg' ? (
                        <img 
                          src={`http://localhost:3000/${auction.imagePath}`} 
                          alt={auction.houseName}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <Eye size={24} color="#9ca3af" />
                      )}
                    </div>
                    <div>
                      <h3 style={{ 
                        fontSize: '18px', 
                        fontWeight: '600', 
                        color: '#1f2937',
                        margin: 0,
                        marginBottom: '4px'
                      }}>
                        {auction.houseName}
                      </h3>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    <span style={{
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {auction.category}
                    </span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <div style={getStatusBadge(auction.status)}>
                    {auction.status}
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    marginTop: '8px'
                  }}>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <p style={{ color: '#6b7280', fontSize: '12px', margin: 0, marginBottom: '4px' }}>
                    Your Bid
                  </p>
                  <p style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#1f2937',
                    margin: 0
                  }}>
                    ${auction.biddingAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p style={{ color: '#6b7280', fontSize: '12px', margin: 0, marginBottom: '4px' }}>
                    Final Amount
                  </p>
                  <p style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: auction.status === 'Winner' ? '#059669' : '#dc2626',
                    margin: 0
                  }}>
                    ${auction.finalAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} color="#6b7280" />
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                      {auction.dateStart}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={14} color="#6b7280" />
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                      {auction.totalBids} bids
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleViewOwnerDetails(auction)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
                >
                  <Eye size={14} />
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          marginTop: '32px'
        }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 12px',
              backgroundColor: currentPage === 1 ? '#f9fafb' : '#dc2626',
              color: currentPage === 1 ? '#9ca3af' : 'white',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          
          <div style={{ display: 'flex', gap: '4px' }}>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: currentPage === index + 1 ? '#dc2626' : 'white',
                  color: currentPage === index + 1 ? 'white' : '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  minWidth: '40px'
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 12px',
              backgroundColor: currentPage === totalPages ? '#f9fafb' : '#dc2626',
              color: currentPage === totalPages ? '#9ca3af' : 'white',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredAuctions.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '48px 24px',
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
            No auctions found
          </h3>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Try adjusting your search criteria or filters
          </p>
        </div>
      )}

      {/* New: Your Auction Winners Section */}
      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#1f2937',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Award size={24} color="#dc2626" />
            Your Auction Winners
          </h3>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            View details of winners from your completed auctions
          </p>
        </div>
        {loadingUserAuctions ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <Clock size={48} style={{ color: '#9ca3af', marginBottom: '1rem' }} />
            <p style={{ color: '#6b7280' }}>Loading your auctions...</p>
          </div>
        ) : userAuctions.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <Award size={48} style={{ color: '#9ca3af', marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.125rem', color: '#1f2937', marginBottom: '0.5rem' }}>
              No auctions created yet
            </h4>
            <p style={{ color: '#6b7280' }}>
              Create your first auction to see winners here
            </p>
          </div>
        ) : userAuctions.filter(auction => auction.hasWinner).length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <Award size={48} style={{ color: '#9ca3af', marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.125rem', color: '#1f2937', marginBottom: '0.5rem' }}>
              No winners yet
            </h4>
            <p style={{ color: '#6b7280' }}>
              Your auctions are still active or haven't received any bids yet. Winners will appear here once auctions are completed.
            </p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {userAuctions.filter(auction => auction.hasWinner).map((auction) => (
              <div
                key={auction._id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                }}
              >
                {/* Card Header */}
                <div style={{ 
                  padding: '20px 24px 16px',
                  borderBottom: '1px solid #f3f4f6'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          backgroundColor: '#f3f4f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {auction.imagePath && auction.imagePath !== 'uploads/default-property.jpg' ? (
                            <img 
                              src={`http://localhost:3000/${auction.imagePath}`} 
                              alt={auction.title}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          ) : (
                            <Eye size={24} color="#9ca3af" />
                          )}
                        </div>
                        <div>
                          <h3 style={{ 
                            fontSize: '18px', 
                            fontWeight: '600', 
                            color: '#1f2937',
                            margin: 0,
                            marginBottom: '4px'
                          }}>
                            {auction.title}
                          </h3>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                        <span style={{
                          backgroundColor: '#dcfce7',
                          color: '#16a34a',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          Winner
                        </span>
                        <span style={{
                          backgroundColor: '#f3f4f6',
                          color: '#374151',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {auction.status}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <div style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        backgroundColor: '#22c55e',
                        color: 'white'
                      }}>
                        Completed
                      </div>
                    </div>
                  </div>
                </div>
                {/* Card Body */}
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <p style={{ color: '#6b7280', fontSize: '12px', margin: 0, marginBottom: '4px' }}>
                        Final Bid
                      </p>
                      <p style={{ 
                        fontSize: '16px', 
                        fontWeight: '600', 
                        color: '#059669',
                        margin: 0
                      }}>
                        ${auction.highestBid?.toLocaleString() || auction.startingBid?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p style={{ color: '#6b7280', fontSize: '12px', margin: 0, marginBottom: '4px' }}>
                        Total Bids
                      </p>
                      <p style={{ 
                        fontSize: '16px', 
                        fontWeight: '600', 
                        color: '#1f2937',
                        margin: 0
                      }}>
                        {auction.totalBids || 0}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} color="#6b7280" />
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>
                          {new Date(auction.endTime).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <TrendingUp size={14} color="#6b7280" />
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>
                          {auction.totalBids || 0} bids
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewWinnerDetails(auction)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        backgroundColor: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
                    >
                      <Eye size={14} />
                      View Winner
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Winner Cards Section */}
        {userAuctions.filter(auction => !auction.hasWinner && auction.status === 'ended').length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <Award size={20} color="#9ca3af" />
              <span style={{ fontWeight: 600, fontSize: '1.1rem', color: '#374151' }}>Your Ended Auctions (No Winner)</span>
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {userAuctions.filter(auction => !auction.hasWinner && auction.status === 'ended').map((auction) => (
                <div
                  key={auction._id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.3s ease',
                    cursor: 'default'
                  }}
                >
                  {/* Card Header */}
                  <div style={{ 
                    padding: '20px 24px 16px',
                    borderBottom: '1px solid #f3f4f6'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            backgroundColor: '#f3f4f6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {auction.imagePath && auction.imagePath !== 'uploads/default-property.jpg' ? (
                              <img 
                                src={`http://localhost:3000/${auction.imagePath}`} 
                                alt={auction.title}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            ) : (
                              <Eye size={24} color="#9ca3af" />
                            )}
                          </div>
                          <div>
                            <h3 style={{ 
                              fontSize: '18px', 
                              fontWeight: '600', 
                              color: '#1f2937',
                              margin: 0,
                              marginBottom: '4px'
                            }}>
                              {auction.title}
                            </h3>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                          <span style={{
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            {auction.status}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <div style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          backgroundColor: '#9ca3af',
                          color: 'white'
                        }}>
                          No Winner
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Card Body */}
                  <div style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <p style={{ color: '#6b7280', fontSize: '12px', margin: 0, marginBottom: '4px' }}>
                          Starting Bid
                        </p>
                        <p style={{ 
                          fontSize: '16px', 
                          fontWeight: '600', 
                          color: '#1f2937',
                          margin: 0
                        }}>
                          ${auction.startingBid?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p style={{ color: '#6b7280', fontSize: '12px', margin: 0, marginBottom: '4px' }}>
                          Total Bids
                        </p>
                        <p style={{ 
                          fontSize: '16px', 
                          fontWeight: '600', 
                          color: '#1f2937',
                          margin: 0
                        }}>
                          {auction.totalBids || 0}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} color="#6b7280" />
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>
                          {new Date(auction.endTime).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <TrendingUp size={14} color="#6b7280" />
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>
                          {auction.totalBids || 0} bids
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Winner Details Modal */}
        {showWinnerModal && selectedWinner && (
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
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
              position: 'relative'
            }}>
              {/* Close Button */}
              <button
                onClick={closeWinnerModal}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6b7280',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <X size={20} />
              </button>
              {/* Modal Header */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '8px'
                }}>
                  Auction Winner Details
                </h2>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  Information about the person who won this auction
                </p>
              </div>
              {/* Winner Profile Section */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '24px',
                padding: '20px',
                backgroundColor: '#f0fdf4',
                borderRadius: '12px',
                border: '1px solid #bbf7d0'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  backgroundColor: '#e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {selectedWinner.profilePicture ? (
                    <img 
                      src={`http://localhost:3000/${selectedWinner.profilePicture}`} 
                      alt="Winner Profile"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <User size={32} color="#9ca3af" />
                  )}
                </div>
                <div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1f2937',
                    margin: 0,
                    marginBottom: '4px'
                  }}>
                    {selectedWinner.name}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#16a34a',
                    margin: 0,
                    fontWeight: '500'
                  }}>
                    🏆 Auction Winner
                  </p>
                </div>
              </div>
              {/* Winner Information */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: '#dbeafe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2563eb'
                  }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <p style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      margin: 0,
                      marginBottom: '2px'
                    }}>
                      Email Address
                    </p>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#1f2937',
                      margin: 0
                    }}>
                      {selectedWinner.email || 'Not provided'}
                    </p>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: '#dcfce7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#16a34a'
                  }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <p style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      margin: 0,
                      marginBottom: '2px'
                    }}>
                      Phone Number
                    </p>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#1f2937',
                      margin: 0
                    }}>
                      {selectedWinner.phone || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
              {/* Close Button */}
              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <button
                  onClick={closeWinnerModal}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Owner Details Modal */}
      {showOwnerModal && selectedOwner && (
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
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={closeOwnerModal}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6b7280',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '8px'
              }}>
                Auction Owner Details
              </h2>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Information about the person who created this auction
              </p>
            </div>

            {/* Owner Profile Section */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '24px',
              padding: '20px',
              backgroundColor: '#f9fafb',
              borderRadius: '12px'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {selectedOwner.profilePicture ? (
                  <img 
                    src={`http://localhost:3000/${selectedOwner.profilePicture}`} 
                    alt="Owner Profile"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <User size={32} color="#9ca3af" />
                )}
              </div>
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: 0,
                  marginBottom: '4px'
                }}>
                  {selectedOwner.name}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: 0
                }}>
                  Auction Creator
                </p>
              </div>
            </div>

            {/* Owner Information */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: '#dbeafe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563eb'
                }}>
                  <Mail size={20} />
                </div>
                <div>
                  <p style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    margin: 0,
                    marginBottom: '2px'
                  }}>
                    Email Address
                  </p>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1f2937',
                    margin: 0
                  }}>
                    {selectedOwner.email || 'Not provided'}
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: '#dcfce7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#16a34a'
                }}>
                  <Phone size={20} />
                </div>
                <div>
                  <p style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    margin: 0,
                    marginBottom: '2px'
                  }}>
                    Phone Number
                  </p>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1f2937',
                    margin: 0
                  }}>
                    {selectedOwner.phone || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <button
                onClick={closeOwnerModal}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default AuctionHistoryScreen;