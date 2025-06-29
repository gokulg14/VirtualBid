import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  Camera, 
  Save, 
  X,
  Award,
  TrendingUp,
  Target,
  Clock,
  CreditCard,
  Shield,
  Bell,
  Eye,
  EyeOff
} from 'lucide-react';
import axios from 'axios';

const ProfileScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    joinDate: '',
    profilePicture: null
  });
  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [userStats, setUserStats] = useState({
    totalBids: 0,
    wonAuctions: 0,
    successRate: '0%',
    activeBids: 0
  });

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
    fetchUserStatistics();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');
      
      if (!token || !email) {
        console.error('No token or email found');
        return;
      }

      const response = await axios.get(
        `http://localhost:3000/auth/user-info/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const user = response.data.user;
      const formattedData = {
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        age: user.age || '',
        joinDate: new Date(user.createdAt).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        }),
        profilePicture: user.profilePicture ? `http://localhost:3000/${user.profilePicture}` : null
      };

      setProfileData(formattedData);
      setOriginalData(formattedData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setIsLoading(false);
    }
  };

  const fetchUserStatistics = async () => {
    try {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');
      
      if (!token || !email) {
        console.error('No token or email found');
        return;
      }

      const response = await axios.get(
        `http://localhost:3000/auth/user-statistics/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUserStats(response.data.statistics);
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      // Keep default values if fetch fails
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          profilePicture: 'Please select an image file'
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          profilePicture: 'Image size should be less than 5MB'
        }));
        return;
      }

      // Store the file for upload
      setSelectedImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      setErrors(prev => ({
        ...prev,
        profilePicture: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!profileData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(profileData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');
      
      const formData = new FormData();
      formData.append('email', email);
      formData.append('name', profileData.name);
      formData.append('phone', profileData.phone);
      
      // Add profile picture if selected
      if (selectedImageFile) {
        formData.append('profilePicture', selectedImageFile);
      }

      const response = await axios.put(
        'http://localhost:3000/auth/update-profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setOriginalData(profileData);
      setIsEditing(false);
      setSelectedImageFile(null);
      setImagePreview(null);
      alert('Profile updated successfully!');
      
      // Refresh user data to get updated profile picture
      fetchUserData();
      fetchUserStatistics();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setErrors({});
    setSelectedImageFile(null);
    setImagePreview(null);
    setIsEditing(false);
  };

  const stats = [
    { label: 'Total Bids', value: userStats.totalBids.toString(), icon: Target, color: '#dc2626' },
    { label: 'Won Auctions', value: userStats.wonAuctions.toString(), icon: Award, color: '#7c3aed' },
    { label: 'Success Rate', value: userStats.successRate, icon: TrendingUp, color: '#059669' },
    { label: 'Active Bids', value: userStats.activeBids.toString(), icon: Clock, color: '#ea580c' }
  ];

  if (isLoading) {
    return (
      <main style={{ flex: 1, padding: '1.5rem' }}>
        <div style={styles.loadingContainer}>
          <div style={styles.loader}></div>
          <p>Loading profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ flex: 1, padding: '1.5rem' }}>
      {/* Profile Header */}
      <div style={styles.profileHeader}>
        <div style={styles.profileImageSection}>
          <div style={styles.profileImageContainer}>
            <img 
              src={imagePreview || profileData.profilePicture || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2IYhSn8Y9S9_HF3tVaYOepJBcrYcd809pBA&s"}
              alt="Profile"
              style={styles.profileImage}
            />
            {isEditing && (
              <label style={styles.cameraButton}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  style={{ display: 'none' }}
                />
                <Camera size={16} />
              </label>
            )}
          </div>
          {errors.profilePicture && (
            <span style={styles.errorText}>{errors.profilePicture}</span>
          )}
          <div style={styles.profileInfo}>
            <h1 style={styles.profileName}>{profileData.name}</h1>
            <p style={styles.memberSince}>Member since {profileData.joinDate}</p>
            <div style={styles.verificationBadge}>
              <Shield size={16} />
              <span>Verified User</span>
            </div>
          </div>
        </div>
        
        <div style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <div key={index} style={styles.statCard}>
              <div style={{...styles.statIcon, backgroundColor: `${stat.color}15`}}>
                <stat.icon size={20} color={stat.color} />
              </div>
              <div style={styles.statInfo}>
                <h3 style={styles.statValue}>{stat.value}</h3>
                <p style={styles.statLabel}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div style={styles.tabContent}>
        {activeTab === 'personal' && (
          <div style={styles.personalSection}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Personal Information</h2>
              <div style={styles.buttonGroup}>
                <button 
                  style={styles.editButton}
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <div style={styles.smallLoader}></div>
                  ) : isEditing ? (
                    <Save size={16} />
                  ) : (
                    <Edit size={16} />
                  )}
                  {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
                {isEditing && (
                  <button style={styles.cancelButton} onClick={handleCancel}>
                    <X size={16} />
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>User Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  style={{...styles.input, ...(isEditing ? styles.inputEditing : {})}}
                />
                {errors.name && <span style={styles.errorText}>{errors.name}</span>}
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  disabled={true}
                  style={{...styles.input, backgroundColor: '#f3f4f6'}}
                />
                <small style={styles.helperText}>Email cannot be changed</small>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  style={{...styles.input, ...(isEditing ? styles.inputEditing : {})}}
                />
                {errors.phone && <span style={styles.errorText}>{errors.phone}</span>}
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Age</label>
                <input
                  type="number"
                  name="age"
                  value={profileData.age}
                  disabled={true}
                  style={{...styles.input, backgroundColor: '#f3f4f6'}}
                />
                <small style={styles.helperText}>Age cannot be changed</small>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

const styles = {
  profileHeader: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '20px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '20px'
  },
  profileImageSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  profileImageContainer: {
    position: 'relative'
  },
  profileImage: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #dc2626'
  },
  cameraButton: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  profileName: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0
  },
  memberSince: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0
  },
  verificationBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#059669',
    fontSize: '14px',
    fontWeight: '500'
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '15px',
    maxWidth: '600px'
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  },
  statIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  statValue: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0
  },
  statLabel: {
    fontSize: '12px',
    color: '#6b7280',
    margin: 0
  },
  tabContainer: {
    display: 'flex',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '8px',
    marginBottom: '20px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    gap: '4px',
    overflow: 'auto'
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap'
  },
  activeTab: {
    backgroundColor: '#dc2626',
    color: 'white'
  },
  tabContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '10px'
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0
  },
  editButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s ease'
  },
  cancelButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s ease'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  inputGroupFull: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  input: {
    padding: '12px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#f9fafb',
    transition: 'all 0.2s ease'
  },
  inputEditing: {
    backgroundColor: 'white',
    borderColor: '#dc2626',
    outline: 'none'
  },
  textarea: {
    padding: '12px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#f9fafb',
    transition: 'all 0.2s ease',
    resize: 'vertical',
    minHeight: '100px'
  },
  securityCard: {
    backgroundColor: '#f9fafb',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    marginBottom: '20px'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '8px'
  },
  cardDescription: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '20px'
  },
  passwordInput: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  passwordToggle: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6b7280'
  },
  primaryButton: {
    padding: '12px 24px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s ease'
  },
  secondaryButton: {
    padding: '12px 24px',
    backgroundColor: 'white',
    color: '#dc2626',
    border: '2px solid #dc2626',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  },
  preferencesCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  preferenceItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    border: '1px solid #e5e7eb'
  },
  preferenceLabel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: '50px',
    height: '24px'
  },
  slider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ccc',
    transition: '.4s',
    borderRadius: '24px',
    '&:before': {
      position: 'absolute',
      content: '""',
      height: '18px',
      width: '18px',
      left: '3px',
      bottom: '3px',
      backgroundColor: 'white',
      transition: '.4s',
      borderRadius: '50%'
    }
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh'
  },
  loader: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #dc2626',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
  },
  errorText: {
    color: '#dc2626',
    fontSize: '12px',
    marginTop: '4px'
  },
  helperText: {
    color: '#6b7280',
    fontSize: '12px'
  },
  smallLoader: {
    border: '2px solid #f3f3f3',
    borderTop: '2px solid #dc2626',
    borderRadius: '50%',
    width: '16px',
    height: '16px',
    animation: 'spin 1s linear infinite',
    marginRight: '8px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px'
  }
};

// Add CSS keyframes for animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default ProfileScreen;