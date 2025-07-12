# 🏷️ VirtualBid - Online Auction Platform

A modern, full-stack auction platform built with React and Node.js that allows users to create, bid on, and manage auctions in real-time.

![VirtualBid Platform](https://img.shields.io/badge/React-19.1.0-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/MongoDB-8.16.0-green) ![JWT](https://img.shields.io/badge/JWT-Authentication-orange)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Security Features](#-security-features)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Authentication & User Management
- User registration and login with JWT authentication
- Secure password hashing with bcrypt
- Protected routes and middleware
- User profile management
- Session management with automatic logout

### 🏷️ Auction Management
- Create new auctions with images and descriptions
- Real-time bidding system
- Automatic auction status updates (active/ended)
- Bid history tracking
- Minimum bid increment validation

### 📊 Dashboard & Analytics
- User bidding history
- Auction statistics
- Active and ended auctions view
- User performance metrics

### 🎨 Modern UI/UX
- Responsive design with React
- Intuitive navigation with side menu
- Real-time updates
- Image upload and preview
- Clean and modern interface

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icons
- **CSS Modules** - Scoped styling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Node-cron** - Scheduled tasks

### Security & Performance
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection
- **Input Validation** - Data sanitization
- **File Upload Security** - Safe file handling

## 📁 Project Structure

```
VirtualBid/
├── Client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── pages/      # Page components
│   │   │   ├── common/     # Shared components
│   │   │   └── sideMenuBar/ # Navigation
│   │   ├── context/        # React context
│   │   ├── utils/          # Utility functions
│   │   └── assets/         # Static assets
│   ├── public/             # Public assets
│   └── package.json
├── Server/                 # Node.js Backend
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── middlewares/       # Custom middleware
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   ├── cron/              # Scheduled tasks
│   └── uploads/           # File uploads
└── README.md
```

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/VirtualBid.git
   cd VirtualBid/Server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the Server directory:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/virtualbid
   JWT_SECRET=your_secure_jwt_secret_here
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd ../Client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📖 Usage

### Getting Started

1. **Register/Login**: Create an account or sign in to access the platform
2. **Browse Auctions**: View active auctions on the dashboard
3. **Create Auction**: Add new items for auction with images and descriptions
4. **Place Bids**: Bid on items with automatic validation
5. **Track History**: Monitor your bidding history and statistics

### Key Features

- **Real-time Bidding**: Place bids and see updates immediately
- **Image Upload**: Add images to your auction items
- **Automatic Status Updates**: Auctions automatically end at specified times
- **Bid Validation**: Prevents invalid bids and ensures fair bidding
- **User Statistics**: Track your performance and activity

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/protected` - Protected route test
- `PUT /auth/updateProfile` - Update user profile

### Bidding
- `POST /bid/addBid` - Create new auction
- `GET /bid/activeBids` - Get active auctions
- `GET /bid/endedBids` - Get ended auctions
- `GET /bid/allBids` - Get all auctions
- `POST /bid/placeBid` - Place a bid on auction

### User Data
- `GET /auth/userStatistics` - Get user statistics
- `GET /auth/userBiddingHistory` - Get user bidding history

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Comprehensive data validation
- **File Upload Security**: Safe file handling with type validation
- **CORS Protection**: Configured cross-origin resource sharing
- **Rate Limiting**: API protection against abuse
- **Protected Routes**: Middleware for route protection

## 🧪 Testing

### Backend Testing
```bash
cd Server
npm test
```

### Frontend Testing
```bash
cd Client
npm run lint
```

### Comprehensive Test Report
The project includes a comprehensive test suite covering:
- Authentication flows
- Bidding functionality
- Data validation
- Security vulnerabilities
- Performance metrics

View the full test report in `COMPREHENSIVE_TEST_REPORT.md`

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js for the robust backend framework
- MongoDB for the flexible database solution
- All contributors and testers

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/VirtualBid/issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

**Made with ❤️ by the VirtualBid Team**

*An innovative auction platform for the digital age*
