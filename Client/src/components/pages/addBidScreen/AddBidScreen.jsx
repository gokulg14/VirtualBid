import React, { useState, useEffect } from 'react';
import {  
  FileText, 
  CheckCircle, 
  Clock, 
  DollarSign,  
  Calendar,
  Plus,
  Image,
  Save,
  Camera,
  User,
  Award,
  TrendingUp,
  Eye,
  Mail,
  Phone,
  X
} from 'lucide-react';
import './AddBidScreen.css';
import axios from 'axios';

const AddBidScreen = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [ownerDetails, setOwnerDetails] = useState(null);
    const [userAuctions, setUserAuctions] = useState([]);
    const [loadingAuctions, setLoadingAuctions] = useState(true);
    const [showWinnerModal, setShowWinnerModal] = useState(false);
    const [selectedWinner, setSelectedWinner] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        startingBid: '',
        imageUrl: '',
        status: 'upcoming'
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchOwnerDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const email = localStorage.getItem('email');
                
                if (token && email) {
                    const response = await axios.get(
                        `http://localhost:3000/auth/user-info/${email}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );
                    setOwnerDetails(response.data.user);
                }
            } catch (error) {
                console.error('Error fetching owner details:', error);
            }
        };

        fetchOwnerDetails();
    }, []);

    useEffect(() => {
        const fetchUserAuctions = async () => {
            try {
                setLoadingAuctions(true);
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
                setLoadingAuctions(false);
            }
        };

        fetchUserAuctions();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
                setFormData(prev => ({
                    ...prev,
                    imageUrl: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

const handleSubmit = async () => {
  setIsSubmitting(true);

  try {
    // Validate required fields
    if (!formData.title.trim()) {
      throw new Error('Property title is required');
    }
    if (!formData.description.trim()) {
      throw new Error('Description is required');
    }
    if (!formData.startTime) {
      throw new Error('Start date and time is required');
    }
    if (!formData.endTime) {
      throw new Error('End date and time is required');
    }
    if (!formData.startingBid || parseFloat(formData.startingBid) <= 0) {
      throw new Error('Starting bid amount must be greater than 0');
    }

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please login first');
    }

    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('startTime', formData.startTime);
    form.append('endTime', formData.endTime);
    form.append('startingBid', formData.startingBid);
    
    // Only append image if a file is selected
    const imageFile = document.getElementById('imageInput').files[0];
    if (imageFile) {
      form.append('image', imageFile);
    }

    const res = await fetch('http://localhost:3000/bid/add', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Something went wrong');
    }

    const data = await res.json();
    alert('Bid item added successfully!');
    setFormData({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      startingBid: '',
      imageUrl: '',
      status: 'upcoming'
    });
    setImagePreview(null);
  } catch (err) {
    console.error('Error submitting bid:', err);
    alert(err.message);
  } finally {
    setIsSubmitting(false);
  }
};

    const handleViewWinnerDetails = (auction) => {
        setSelectedWinner(auction.winner);
        setShowWinnerModal(true);
    };

    const closeWinnerModal = () => {
        setShowWinnerModal(false);
        setSelectedWinner(null);
    };

    return (
        <main className="mainContent">
            {/* Welcome Header */}
            <div className="welcomeHeader">
                <h2 className="welcomeTitle">Add New Auction Item</h2>
                <p className="welcomeDate">Today is {currentTime.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}</p>
            </div>

            <div className="contentGrid">
                {/* Form Section */}
                <div className="formSection">
                    <h3 className="sectionTitle">
                        <Plus size={24} />
                        Auction Item Details
                    </h3>

                    <div className="form">
                        {/* Owner Details Section */}
                        <div className="formGroup" style={{ 
                            backgroundColor: '#f8fafc', 
                            padding: '1.5rem', 
                            borderRadius: '0.75rem', 
                            border: '1px solid #e2e8f0',
                            marginBottom: '2rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                                <User size={20} style={{ color: '#3b82f6', marginRight: '0.5rem' }} />
                                <label className="label" style={{ margin: 0, color: '#1e293b', fontWeight: '600' }}>
                                    Auction Owner Details
                                </label>
                            </div>
                            
                            {ownerDetails ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                    <div>
                                        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Owner Name</p>
                                        <p style={{ fontSize: '1rem', fontWeight: '500', color: '#1e293b' }}>
                                            {ownerDetails.name}
                                        </p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Email Address</p>
                                        <p style={{ fontSize: '1rem', fontWeight: '500', color: '#1e293b' }}>
                                            {ownerDetails.email}
                                        </p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Age</p>
                                        <p style={{ fontSize: '1rem', fontWeight: '500', color: '#1e293b' }}>
                                            {ownerDetails.age} years
                                        </p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Member Since</p>
                                        <p style={{ fontSize: '1rem', fontWeight: '500', color: '#1e293b' }}>
                                            {new Date(ownerDetails.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    padding: '1rem',
                                    color: '#64748b'
                                }}>
                                    <Clock size={16} style={{ marginRight: '0.5rem' }} />
                                    Loading owner details...
                                </div>
                            )}
                        </div>

                        <div className="formGroup">
                            <label className="label">Property Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Enter property title"
                                className="input"
                                required
                            />
                        </div>

                        <div className="formGroup">
                            <label className="label">Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe the property in detail..."
                                className="textarea"
                                required
                            />
                        </div>

                        <div className="formRow">
                            <div className="formGroup">
                                <label className="label">Start Date & Time *</label>
                                <input
                                    type="datetime-local"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleInputChange}
                                    className="input"
                                    required
                                />
                            </div>
                            <div className="formGroup">
                                <label className="label">End Date & Time *</label>
                                <input
                                    type="datetime-local"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleInputChange}
                                    className="input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="formRow">
                            <div className="formGroup">
                                <label className="label">Starting Bid Amount *</label>
                                <input
                                    type="number"
                                    name="startingBid"
                                    value={formData.startingBid}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    className="input"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div className="formGroup">
                                <label className="label">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="select"
                                >
                                    <option value="upcoming">Upcoming</option>
                                    <option value="active">Active</option>
                                    <option value="ended">Ended</option>
                                </select>
                            </div>
                        </div>

                        <div className="formGroup">
                            <label className="label">Property Image</label>
                            <div
                                className="imageUpload"
                                onClick={() => document.getElementById('imageInput').click()}
                            >
                                <input
                                    id="imageInput"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                                <Camera size={48} color="#9ca3af" className="cameraIcon" />
                                <p className="uploadText">
                                    Click to upload property image
                                </p>
                                <p className="uploadSubtext">
                                    PNG, JPG, GIF up to 10MB
                                </p>
                            </div>
                            {imagePreview && (
                                <img src={imagePreview} alt="Preview" className="imagePreview" />
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="submitButton"
                        >
                            {isSubmitting ? (
                                <>
                                    <Clock size={20} />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    Create Auction Item
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Side Panel */}
                <div className="sidePanel">
                    <div className="helpCard">
                        <h4 className="helpTitle">💡 Tips for Success</h4>
                        <ul className="helpList">
                            <li className="helpItem">
                                <CheckCircle className="helpIcon" />
                                <span>Use high-quality, well-lit property photos</span>
                            </li>
                            <li className="helpItem">
                                <CheckCircle className="helpIcon" />
                                <span>Write detailed, accurate descriptions</span>
                            </li>
                            <li className="helpItem">
                                <CheckCircle className="helpIcon" />
                                <span>Set realistic starting bid amounts</span>
                            </li>
                            <li className="helpItem">
                                <CheckCircle className="helpIcon" />
                                <span>Allow sufficient time for bidding</span>
                            </li>
                            <li className="helpItem">
                                <CheckCircle className="helpIcon" />
                                <span>Double-check all information before submitting</span>
                            </li>
                        </ul>
                    </div>

                    <div className="helpCard">
                        <h4 className="helpTitle">📋 Required Information</h4>
                        <ul className="helpList">
                            <li className="helpItem">
                                <FileText className="helpIcon" />
                                <span>Property title and description</span>
                            </li>
                            <li className="helpItem">
                                <Calendar className="helpIcon" />
                                <span>Auction start and end times</span>
                            </li>
                            <li className="helpItem">
                                <DollarSign className="helpIcon" />
                                <span>Starting bid amount</span>
                            </li>
                            <li className="helpItem">
                                <Image className="helpIcon" />
                                <span>Property photos (optional)</span>
                            </li>
                        </ul>
                    </div>

                    <div className="helpCard">
                        <h4 className="helpTitle">👤 Owner Information</h4>
                        <div style={{ 
                            backgroundColor: '#f0f9ff', 
                            padding: '1rem', 
                            borderRadius: '0.5rem', 
                            border: '1px solid #bae6fd',
                            marginBottom: '1rem'
                        }}>
                            <p style={{ 
                                fontSize: '0.875rem', 
                                color: '#0369a1', 
                                margin: 0,
                                lineHeight: '1.5'
                            }}>
                                Your profile information will be displayed to potential bidders. 
                                This helps build trust and transparency in the auction process.
                            </p>
                        </div>
                        <ul className="helpList">
                            <li className="helpItem">
                                <User className="helpIcon" />
                                <span>Your name and contact details</span>
                            </li>
                            <li className="helpItem">
                                <CheckCircle className="helpIcon" />
                                <span>Member since information</span>
                            </li>
                            <li className="helpItem">
                                <CheckCircle className="helpIcon" />
                                <span>Account verification status</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Winner Cards Section */}
            <div style={{ marginTop: '2rem' }}>
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

                {loadingAuctions ? (
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
            </div>

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
        </main>
    );
};

export default AddBidScreen;