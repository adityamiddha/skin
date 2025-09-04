# 🧴 SkinCare AI Project

An AI-powered skincare analysis and tracking platform that provides comprehensive skin health insights through image analysis.

## ✨ Features

- **🔐 User Authentication**: Secure signup/login with JWT tokens
- **📸 Image Upload**: Drag & drop image upload with preview
- **🤖 AI Analysis**: Automated skin condition assessment
- **📊 Progress Tracking**: Historical scan results and comparisons
- **👤 User Profile**: Manage personal information and settings
- **📱 Responsive Design**: Modern, mobile-friendly interface

## 🏗️ Architecture

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js/Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **File Storage**: Cloudinary
- **AI Model**: Python-based skin analysis (placeholder)

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Python 3.8+ (for AI model)
- Cloudinary account

### 1. Clone the Repository

```bash
git clone <repository-url>
cd skincare-ai-project
```

### 2. Install Dependencies

#### Backend Dependencies
```bash
npm install
```

#### Frontend Dependencies
```bash
cd client
npm install
cd ..
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/skincare-ai

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 4. Start the Application

#### Development Mode
```bash
# Terminal 1: Start Backend Server
npm start

# Terminal 2: Start Frontend (in client directory)
cd client
npm start
```

#### Production Mode
```bash
# Build frontend
cd client
npm run build

# Start server (serves built frontend)
npm start
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Landing Page**: http://localhost:5000 (when frontend is built)

## 📁 Project Structure

```
skincare-ai-project/
├── client/                     # React Frontend
│   ├── public/                # Static files
│   ├── src/                   # Source code
│   │   ├── components/        # React components
│   │   │   ├── auth/         # Authentication components
│   │   │   ├── dashboard/    # Dashboard components
│   │   │   └── common/       # Shared components
│   │   ├── context/          # React context
│   │   ├── services/         # API services
│   │   └── App.js            # Main app component
│   ├── package.json          # Frontend dependencies
│   └── tailwind.config.js    # Tailwind configuration
├── server/                    # Node.js Backend
│   ├── controllers/          # Route controllers
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── middlewares/          # Custom middlewares
│   └── server.js             # Main server file
├── utils/                     # Utility functions
├── ai-model/                  # Python AI model (placeholder)
├── package.json               # Backend dependencies
└── README.md                  # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/getMe` - Get current user
- `PATCH /api/auth/updateMe` - Update profile
- `PATCH /api/auth/updateMyPassword` - Change password

### Images
- `POST /api/image/upload` - Upload skin image
- `GET /api/image/my-images` - Get user's images

### AI Analysis
- `POST /api/ai/scan/:imageId` - Analyze image with AI

### Scan Results
- `POST /api/scans` - Create scan result
- `GET /api/scans/my-scans` - Get user's scan history
- `POST /api/scans/compare-scans` - Compare two scans

## 🎨 Frontend Features

### Authentication Pages
- **Landing Page**: Welcome screen with login/signup options
- **Login Form**: Email/password authentication
- **Signup Form**: User registration with validation

### Dashboard
- **Upload & Scan**: Image upload with drag & drop
- **Scan History**: View and compare scan results
- **Profile Management**: Update personal information

### UI Components
- Responsive design with Tailwind CSS
- Modern card-based layout
- Interactive forms with validation
- Toast notifications
- Loading states and animations

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation and sanitization
- Secure file upload handling

## 🚧 Development Status

### ✅ Completed
- Complete backend API structure
- User authentication system
- Image upload and storage
- Database models and relationships
- Frontend authentication flow
- Dashboard with all main features
- Responsive UI design

### 🔄 In Progress
- AI model integration
- Advanced analytics and charts

### 📋 Planned
- Real-time notifications
- Mobile app development
- Advanced skin condition detection
- Treatment recommendations
- Social features and sharing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- **Advanced AI Models**: Integration with state-of-the-art skin analysis models
- **Telemedicine Integration**: Connect with dermatologists
- **Product Recommendations**: Personalized skincare product suggestions
- **Progress Analytics**: Advanced charts and insights
- **Mobile App**: Native iOS and Android applications
- **API Integration**: Third-party skincare app connections

---

**Built with ❤️ for better skin health**

