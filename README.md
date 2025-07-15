# 🏥 SophieCare - Mental Health Care Management Platform

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0.3-green.svg)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC.svg)](https://tailwindcss.com/)

A comprehensive mental health care management platform designed to streamline the relationship between therapists and patients. SophieCare provides a modern, secure, and intuitive interface for managing treatments, patient records, and therapeutic interventions.

## 🌟 Features

### 👨‍⚕️ **Therapist Portal**
- **Patient Management**: Add, view, and manage patient profiles with comprehensive health records
- **Treatment Sessions**: Create detailed treatment sessions with structured notes and interventions
- **Progress Tracking**: Monitor patient progress through key insights and milestone tracking
- **Calendar Integration**: Schedule and manage appointments with a full-featured calendar
- **Voice-to-Text Notes**: Dictate session notes using speech recognition technology
- **Treatment Templates**: Streamlined forms for consistent treatment documentation

### 👤 **Patient Portal**
- **Treatment History**: View complete treatment history and progress
- **Homework Tracking**: Monitor assigned homework and therapeutic exercises
- **Progress Visualization**: See treatment progress through timeline and insights
- **Secure Communication**: Direct access to treatment notes and recommendations

### 🔐 **Security & Authentication**
- **Multi-Role Authentication**: Support for therapists, patients, and administrators
- **JWT Token Management**: Secure session management with automatic token refresh
- **Google OAuth Integration**: Seamless login with Google accounts
- **Role-Based Access Control**: Granular permissions based on user roles
- **Data Encryption**: Secure transmission and storage of sensitive health information

### 🎨 **User Experience**
- **Five Elements Design System**: Beautiful, calming interface inspired by natural elements
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Accessibility**: WCAG compliant design for inclusive user experience
- **Dark/Light Mode Ready**: Flexible theming system

### 📊 **Advanced Features**
- **AI-Powered Insights**: Intelligent analysis of treatment patterns and progress
- **Timeline Visualization**: Chronological view of patient journey and milestones
- **Export Capabilities**: Generate reports and treatment summaries
- **Real-time Updates**: Live synchronization across devices
- **Offline Support**: Basic functionality available without internet connection

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - Modern UI library with hooks and functional components
- **TypeScript 5.8.3** - Type-safe development with strict mode
- **Vite 6.3.5** - Lightning-fast build tool and development server
- **Redux Toolkit 2.8.2** - State management with RTK Query
- **React Router 6.30.1** - Client-side routing with protected routes
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Framer Motion 12.15.0** - Production-ready motion library
- **React Hook Form 7.57.0** - Performant forms with validation
- **Zod 3.25.46** - TypeScript-first schema validation

### Backend
- **Node.js 18+** - JavaScript runtime environment
- **Express.js 4.18.2** - Fast, unopinionated web framework
- **MongoDB 7.0.3** - NoSQL database with Mongoose ODM
- **JWT Authentication** - Secure token-based authentication
- **bcryptjs 2.4.3** - Password hashing and security
- **Zod Validation** - Runtime type checking and validation
- **CORS Support** - Cross-origin resource sharing
- **Rate Limiting** - API protection against abuse

### Development Tools
- **ESLint** - Code linting and quality enforcement
- **Prettier** - Code formatting and consistency
- **Jest** - Unit testing framework
- **TypeScript** - Static type checking
- **Nodemon** - Development server with auto-restart

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0.0 or higher
- MongoDB 7.0.3 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/sophicare-mvp.git
   cd sophicare-mvp
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Backend environment variables
   cd server
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/sophicare
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-key
   GOOGLE_CLIENT_ID=your-google-oauth-client-id
   ```

4. **Start the development servers**
   ```bash
   # Start backend server (from server directory)
   npm run dev
   
   # Start frontend server (from client directory)
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 📁 Project Structure

```
sophicare-mvp/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── therapist/  # Therapist-specific components
│   │   │   ├── patient/    # Patient-specific components
│   │   │   └── layout/     # Layout and navigation
│   │   ├── services/       # API service layer
│   │   ├── store/          # Redux store and slices
│   │   ├── types/          # TypeScript type definitions
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── server/                 # Node.js backend application
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API route definitions
│   │   ├── middleware/     # Express middleware
│   │   ├── validators/     # Input validation schemas
│   │   └── services/       # Business logic services
│   └── tests/              # Backend test suite
└── README.md              # This file
```

## 🔧 Available Scripts

### Frontend (client/)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend (server/)
```bash
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript
npm start            # Start production server
npm test             # Run test suite
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

## 🧪 Testing

The application includes comprehensive testing:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📦 Deployment

### Frontend Deployment
```bash
cd client
npm run build
# Deploy the dist/ folder to your hosting provider
```

### Backend Deployment
```bash
cd server
npm run build
npm start
# Deploy to your preferred hosting platform
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Include tests for new features
- Update documentation as needed
- Follow the established code style

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Daniel Raz** - Lead Developer & Architect
- **Contact**: raz.daniel@gmail.com

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB team for the robust database
- Tailwind CSS for the beautiful design system
- All contributors and beta testers

## 📞 Support

For support, email raz.daniel@gmail.com or create an issue in the repository.

---

**SophieCare** - Empowering mental health professionals with modern technology for better patient care. 🌱