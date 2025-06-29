import React, { useState, useEffect } from 'react';
import {
    Home,
    User,
    FileText,
    Car,
    Upload,
    CheckCircle,
    DollarSign,
    TrendingUp,
    Bell,
    Settings,
    Search,
    Plus,
    LogOut,
    Gavel,
} from 'lucide-react';
import dashboardStyles from '../pages/dashboard/AuctionDashboard.module.css';
import Dashboard from '../pages/dashboard/AuctionDashboard';
import AddBidScreen from '../pages/addBidScreen/AddBidScreen';
import './SideMenu.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BidItemsScreen from '../pages/bidItemScreen/BiditemsScreen';
import ProfileScreen from '../pages/profile/ProfileScreen';
import AuctionHistoryScreen from '../pages/historyScreen/AuctionHistoryScreen';


// Header Component
const Header = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            const email = localStorage.getItem('email');

            await axios.post(
                'http://localhost:3000/auth/user-logout',
                { email }, // Request body
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Remove from storage
            localStorage.removeItem('token');
            localStorage.removeItem('email');

            navigate('/signin');
        } catch (error) {
            console.error('Logout failed', error);
            alert('Logout failed');
        }
    };



    return (
        <header className="header">
            <div className="headerContent">
                <div className="logo">
                    <div className="logoIcon">
                        <Gavel size={24} />
                    </div>
                    <h1 className="logoText">Virtual Bid</h1>
                </div>
                <div className="headerRight">
                    <button className="notificationButton">
                        <Bell size={24} />
                    </button>
                    <button className="notificationButton" onClick={handleLogout}>
                        <LogOut size={24} />
                    </button>
                </div>
            </div>
        </header>
    );
};

// Sidebar Component
const Sidebar = ({ activeTab, setActiveTab, username, profilePicture, onTabChange }) => {
    const sidebarItems = [
        { id: 'dashboard', icon: Home, label: 'Dashboard' },
        { id: 'add-bid', icon: Plus, label: 'Add New Bid' },
        { id: 'bid-item', icon: FileText, label: 'Live Bids' },
        { id: 'profile', icon: User, label: 'Profile' },
        { id: 'history', icon: TrendingUp, label: 'Bidding History' },
    ];

    return (
        <aside className={dashboardStyles.sidebar}>
            <div className={dashboardStyles.sidebarContent}>
                <div className={dashboardStyles.profileSection}>
                    <div className={dashboardStyles.profileAvatar}>
                        {profilePicture ? (
                            <img 
                                src={`http://localhost:3000/${profilePicture}`} 
                                alt="Profile" 
                                style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    objectPosition: 'center'
                                }} 
                            />
                        ) : (
                            <User size={32} color="white" />
                        )}
                    </div>
                    <div className={dashboardStyles.profileInfo}>
                        <div className={dashboardStyles.profileName}>{username || 'Loading...'}</div>
                    </div>
                </div>

                <nav className={dashboardStyles.navigation}>
                    {sidebarItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={
                                `${dashboardStyles.navItem} ${activeTab === item.id ? dashboardStyles.navItemActive : ''}`
                            }
                        >
                            <item.icon size={20} />
                            <span className="navItemSpan">{item.label}</span>
                            {item.badge && (
                                <span className={dashboardStyles.badge}>{item.badge}</span>
                            )}
                            {item.status === 'complete' && (
                                <CheckCircle size={16} className={dashboardStyles.checkIcon} />
                            )}
                            {item.status === 'alert' && (
                                <div className={dashboardStyles.statusDot}></div>
                            )}
                        </button>
                    ))}
                </nav>
            </div>
        </aside>
    );
};


// Default/Placeholder Component for other tabs
const DefaultScreen = ({ tabName }) => {
    const getTabDisplayName = (tabName) => {
        const tabNames = {
            'dashboard': 'Dashboard',
            'profile': 'Profile Verification',
            'personal': 'Personal Information',
            'select': 'Select Type',
            'documents': 'Documents',
            'driving': 'Driving License',
            'deposit': 'Deposit Authorization',
            'terms': 'Terms & Conditions',
            'bidding': 'Bidding History',
            'settings': 'Settings'
        };
        return tabNames[tabName] || tabName;
    };

    return (
        <main className="mainContent">
            <div className="welcomeHeader">
                <h2 className="welcomeTitle">{getTabDisplayName(tabName)}</h2>
            </div>

            <div className="placeholderCard">
                <div className="placeholderText">
                    {getTabDisplayName(tabName)} Content
                </div>
                <div className="placeholderSubtext">
                    This section is under development. The {getTabDisplayName(tabName)} component will be implemented here.
                </div>
            </div>
        </main>
    );
};

// Main App Component
const SideMenu = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);

    const fetchUserInfo = async () => {
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
                setUsername(response.data.user.name);
                setProfilePicture(response.data.user.profilePicture);
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            // Set a fallback username if fetch fails
            setUsername('User');
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        // Refresh user info when switching to profile tab to get updated profile picture
        if (tabId === 'profile') {
            fetchUserInfo();
        }
    };

    const renderMainContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard />;
            case 'add-bid':
                return <AddBidScreen />;
            case 'bid-item':
                return <BidItemsScreen/>;
            case 'profile':
                return <ProfileScreen/>;
            case 'history':
                return <AuctionHistoryScreen/>
            default:
                return <DefaultScreen tabName={activeTab} />;
        }
    };

    return (
        <div className="container">
            <Header />
            <div className="mainLayout">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} username={username} profilePicture={profilePicture} onTabChange={handleTabChange} />
                {renderMainContent()}
            </div>
        </div>
    );
};

export default SideMenu;