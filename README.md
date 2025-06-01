# 💕 Lock - College Dating App

A modern, sleek dating application designed specifically for college students. Built with React, Node.js, and MongoDB, featuring a beautiful navy blue aesthetic with smooth animations and professional UI/UX.

![Lock Dating App](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/React-18.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-brightgreen)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-blue)

## ✨ Features

### 🎨 **Modern UI/UX Design**

- **Navy Blue Aesthetic** - Professional and engaging color scheme
- **Smooth Animations** - Hover effects, transitions, and micro-interactions
- **Glassmorphism Effects** - Modern backdrop blur and transparency
- **Responsive Design** - Works seamlessly on all devices
- **Dark Navy Sidebar** - Gradient backgrounds with animated elements

### 🔐 **Authentication & Security**

- **Google OAuth Integration** - Secure login with Google accounts
- **JWT Token Authentication** - Secure session management
- **Protected Routes** - Authenticated access to app features
- **Session Persistence** - Stay logged in across browser sessions

### 👤 **Profile Management**

- **Multi-Step Profile Completion** - Guided onboarding process
- **College/University Integration** - Academic information
- **Interest Selection** - 20+ predefined interests
- **Bio & Personal Information** - Rich profile customization
- **Profile Picture Upload** - Visual profile representation

### 💖 **Matching System**

- **Smart Discovery** - Find compatible matches
- **Swipe Interface** - Intuitive like/pass system
- **Match Notifications** - Real-time match alerts
- **Interest-Based Matching** - Algorithm considers shared interests

### 💬 **Messaging**

- **Real-Time Chat** - Instant messaging with matches
- **Message History** - Persistent conversation storage
- **Online Status** - See who's currently active
- **Unread Indicators** - Never miss a message

### 🎯 **User Experience**

- **Empty States** - Engaging placeholders with call-to-actions
- **Loading States** - Smooth loading animations
- **Error Handling** - User-friendly error messages
- **Hot Reload** - Instant development updates

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- MongoDB 6.x or higher
- Google OAuth credentials
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/lock-dating-app.git
   cd lock-dating-app
   ```

2. **Install server dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**

   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**

   Create `.env` file in the `server` directory:

   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/lock-dating
   JWT_SECRET=your-super-secret-jwt-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   CLIENT_URL=http://localhost:3000
   ```

   Create `.env` file in the `client` directory:

   ```env
   FAST_REFRESH=true
   CHOKIDAR_USEPOLLING=true
   WATCHPACK_POLLING=true
   REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
   REACT_APP_API_URL=http://localhost:5001
   ```

5. **Start MongoDB**

   ```bash
   # Using MongoDB service
   sudo systemctl start mongod

   # Or using MongoDB directly
   mongod
   ```

6. **Start the application**

   Terminal 1 (Server):

   ```bash
   cd server
   npm run dev
   ```

   Terminal 2 (Client):

   ```bash
   cd client
   npm start
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

## 🏗️ Project Structure

```
lock-dating-app/
├── client/                 # React frontend
│   ├── public/
│   │   ├── components/     # React components
│   │   │   ├── Dashboard.js
│   │   │   ├── Login.js
│   │   │   └── ProfileCompletion.js
│   │   ├── context/        # React context
│   │   │   └── AuthContext.js
│   │   ├── App.js
│   │   └── index.js
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── scripts/           # Utility scripts
│   ├── server.js          # Main server file
│   └── package.json
└── README.md
```

## 🎨 Design System

### Color Palette

- **Navy**: `#0f172a` to `#f8fafc` (9 shades)
- **Primary Blue**: `#3b82f6` to `#1e3a8a`
- **Secondary Purple**: `#d946ef` to `#701a75`
- **Accent Colors**: Green, Red, Yellow for status indicators

### Typography

- **Font Family**: Inter, system-ui, sans-serif
- **Headings**: Bold weights (600-900)
- **Body**: Regular weight (400-500)

### Animations

- **Hover Effects**: Scale, translate, color transitions
- **Loading States**: Spinners, pulse effects
- **Page Transitions**: Smooth fade-in/slide-up
- **Micro-interactions**: Button scales, icon animations

## 🛠️ Technology Stack

### Frontend

- **React 18** - Modern React with hooks
- **Tailwind CSS 3** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Tokens for auth

### Development Tools

- **Nodemon** - Auto-restart server
- **Concurrently** - Run multiple commands
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📱 Features in Detail

### Authentication Flow

1. User clicks "Login with Google"
2. Google OAuth popup appears
3. User grants permissions
4. JWT token generated and stored
5. User redirected to profile completion or dashboard

### Profile Completion

1. **Step 1**: Basic Info (College, Major, Date of Birth)
2. **Step 2**: Preferences (Gender, Interested In)
3. **Step 3**: About You (Bio, Interests)

### Dashboard Sections

- **Discover**: Browse potential matches
- **Matches**: View mutual likes
- **Messages**: Chat with matches
- **Profile**: Manage your profile
- **Settings**: App preferences

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/discover` - Get potential matches

### Matches

- `POST /api/matches/swipe` - Swipe on a profile
- `GET /api/matches` - Get user's matches

### Messages

- `GET /api/messages/:matchId` - Get conversation
- `POST /api/messages` - Send message

## 🚀 Deployment

### Frontend (Netlify/Vercel)

1. Build the React app: `npm run build`
2. Deploy the `build` folder
3. Set environment variables

### Backend (Heroku/Railway)

1. Create production MongoDB database
2. Set environment variables
3. Deploy server code

### Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
CLIENT_URL=your-production-frontend-url
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🙏 Acknowledgments

- **Tailwind CSS** for the amazing utility-first CSS framework
- **Lucide** for the beautiful icon library
- **Google** for OAuth integration
- **MongoDB** for the flexible database solution

## 📞 Support

If you have any questions or need help with setup, please open an issue or contact:

- **Email**: denilcollins@gmail.com
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/lock-dating-app/issues)

---

**Made with ❤️ for college students looking for meaningful connections**
