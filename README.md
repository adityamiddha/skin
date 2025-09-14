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

### 2. Automated Setup

We provide an automatic setup script that installs dependencies and creates configuration files:

```bash
npm run setup
```

This will:

- Install backend dependencies
- Install frontend dependencies
- Create a sample .env file if it doesn't exist

### 3. Environment Setup

Update the `.env` file in the root directory with your credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DEV_PROXY_PORT=8080
FRONTEND_PORT=3000

# MongoDB
MONGO_URI=mongodb://localhost:27017/skincare-ai

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 4. Start the Application

#### Development Mode (Separate Servers)

```bash
# Terminal 1: Start Backend Server
npm run dev

# Terminal 2: Start Frontend
npm run dev:frontend
```

#### Development Mode with Proxy (Recommended)

This runs a proxy server that handles both frontend and backend requests:

```bash
# Run all services with one command
npm run dev:all

# Access at http://localhost:8080
```

#### Production Mode

```bash
# Build frontend and start production server
npm run build-and-start
```

### 5. Access the Application

- **Development with Proxy**: http://localhost:8080
- **Development Frontend**: http://localhost:3000
- **Development Backend API**: http://localhost:5000/api
- **Production**: http://localhost:5000

## 🌐 Deployment

### Render Deployment

This project is configured for easy deployment on [Render](https://render.com). Follow these steps:

1. **Create a Web Service**
   - Sign up or log in to [Render](https://render.com)
   - Click on "New" and select "Web Service"
   - Connect your GitHub repository

2. **Configure the Service**
   - Name: `skincare-ai` (or your preferred name)
   - Environment: `Node`
   - Build Command: `./render-build.sh`
   - Start Command: `npm start`
   - Region: Choose the closest to your users
   - Branch: `main` (or your deployment branch)
   - Plan: Select an appropriate plan (Free tier works for testing)

3. **Configure Environment Variables**
   Set the following in the Render dashboard:
   - `PORT`: 10000 (or any port, Render will assign its own port with $PORT)
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - `NODE_ENV`: production

4. **Health Checks**
   - Add a health check to monitor your deployment
   - URL Path: `/api/health`
   - Status: 200 OK

5. **Deploy**
   Click "Create Web Service" and Render will automatically deploy your application.

For more detailed deployment instructions and troubleshooting, see:

- [DEPLOYMENT.md](DEPLOYMENT.md) - General deployment guide
- [PLATFORM_DEPLOYMENT.md](PLATFORM_DEPLOYMENT.md) - Platform-specific deployment instructions

### Manual Deployment

Create a `.env.production` file based on the example:

```env
# Server Configuration
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-production-domain.com

# MongoDB
MONGO_URI=mongodb+srv://username:password@your-cluster.mongodb.net/skincare-ai

# JWT
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 2. Build for Production

```bash
npm run build-client
```

### 3. Start Production Server

```bash
NODE_ENV=production npm start
```

### 4. Deployment Platforms

#### Render.com (Recommended)

- Create a web service
- Set the build command: `npm install && npm run build-client`
- Set the start command: `npm start`
- Add environment variables from your `.env.production`

#### Railway/Heroku/Digital Ocean

- Similar setup to Render
- Make sure to set all environment variables
- The app is configured to work behind reverse proxies

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

### Code Formatting and Linting

This project uses ESLint and Prettier to maintain code quality and consistency. A GitHub Action automatically runs on all pull requests and commits to the main branch to ensure code quality.

- To format code locally: `npm run format`
- To lint code locally: `npm run lint`
- To automatically fix linting issues: `npm run lint:fix`

The GitHub Action will automatically fix formatting and linting issues and commit the changes if needed.

For detailed coding standards and guidelines, see [CODING_STANDARDS.md](CODING_STANDARDS.md).

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
