# MyVault - Your Digital Content Library

MyVault is a modern, full-stack web application for organizing and managing your digital content. Save articles, YouTube videos, Twitter posts, Reddit threads, and more in one beautifully designed interface.

## ✨ Features

### 🎯 Content Management
- **Multi-Platform Support**: Save content from YouTube, Twitter, Reddit, articles, and more
- **Smart Previews**: Automatic preview generation with metadata extraction
- **Dynamic Cards**: Content cards that adapt their size based on content type and available information
- **Tag System**: Organize content with customizable colored tags
- **Inline Tag Creation**: Create new tags directly while adding content

### 👤 User Experience
- **User Profiles**: Personalized sidebar with avatar and username display
- **Settings Page**: Comprehensive settings for appearance, preferences, and security
- **Professional UI**: Clean, modern interface with smooth animations and transitions
- **Responsive Design**: Works seamlessly across desktop and mobile devices

### 🔧 Technical Features
- **Real-time Updates**: Live content synchronization
- **Secure Authentication**: JWT-based authentication system
- **RESTful API**: Well-structured backend API
- **Modern Stack**: React + Node.js + MongoDB

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/killjoycircuit/myvault.git
   cd myvault
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the backend directory:
   ```env
   JWT_SECRET_KEY=your_super_secret_jwt_key_here
   MONGO_URL=mongodb://localhost:27017/myvault
   PORT=3000
   ```

4. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Configure frontend**
   Update `frontend/config.js` if needed:
   ```javascript
   export const API_BASE_URL = 'http://localhost:3000/api/v1';
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application**
   Open your browser and navigate to `http://localhost:5173`

## 📱 Usage Guide

### Getting Started
1. **Sign Up**: Create a new account with username, email, and optional avatar
2. **Sign In**: Log in to access your personal vault
3. **Add Content**: Click the "+" button to add new content

### Adding Content
1. **Choose Content Type**: Select from Article, YouTube, Twitter, Reddit, or Other
2. **Enter Details**: Provide title and URL
3. **Add Tags**: Select existing tags or create new ones inline
4. **Preview**: See a live preview of your content
5. **Save**: Add to your vault

### Managing Tags
- **Create Tags**: Use the "+" button in the sidebar or during content creation
- **Color Coding**: Assign colors to tags for better organization
- **Filter Content**: Click tags to filter your content
- **Edit/Delete**: Hover over tags in the sidebar for edit options

### Settings
Access settings via your profile menu to customize:
- **Profile**: Update username and avatar
- **Appearance**: Choose theme and default view
- **Preferences**: Configure auto-preview and notifications
- **Security**: Change password and security settings

## 🏗️ Architecture

### Frontend (React)
```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── ContentCard.jsx  # Dynamic content card component
│   ├── pages/              # Main application pages
│   │   ├── HomePage.jsx    # Main dashboard
│   │   ├── SettingsPage.jsx # User settings
│   │   ├── LoginPage.jsx   # Authentication
│   │   └── SignupPage.jsx  # User registration
│   ├── assets/             # Static assets and utilities
│   └── App.jsx            # Main application component
```

### Backend (Node.js + Express)
```
backend/
├── models/
│   └── db.js              # MongoDB schemas
├── middleware.js          # Authentication middleware
├── utils.js              # Utility functions
└── index.js              # Main server file
```

## 🎨 Supported Content Types

### 📰 Articles
- Automatic metadata extraction
- Favicon and preview image display
- Site name and description

### 🎥 YouTube Videos
- Embedded video player
- Thumbnail previews
- Direct video playback

### 🐦 Twitter/X Posts
- Tweet preview cards
- Link to original post
- Platform branding

### 🔴 Reddit Posts
- Reddit-specific styling
- Post preview
- Community context

### 🌐 Other Links
- Generic link previews
- Fallback favicon support
- Clean URL display

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/signup` - Create new user account
- `POST /api/v1/signin` - User login
- `POST /api/v1/logout` - User logout

### User Profile
- `GET /api/v1/profile` - Get user profile
- `PUT /api/v1/profile` - Update user profile

### Content Management
- `GET /api/v1/content` - Get user's content
- `POST /api/v1/content` - Create new content
- `DELETE /api/v1/content` - Delete content

### Tag Management
- `GET /api/v1/tags` - Get user's tags
- `POST /api/v1/tags` - Create new tag
- `PUT /api/v1/tags/:id` - Update tag
- `DELETE /api/v1/tags` - Delete tag

## 🛠️ Development

### Development Commands
```bash
# Backend
npm run dev      # Start with nodemon
npm start        # Production start

# Frontend  
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

## 🔒 Security

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Zod schema validation
- **CORS Protection**: Configured CORS policies
- **Environment Variables**: Sensitive data in environment files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

---

**Made with ❤️ by the MyVault Team**
