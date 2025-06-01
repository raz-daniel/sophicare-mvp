# SophiCare Client

The frontend application for SophiCare, a mental health care platform built with React, TypeScript, and modern web technologies.

## Features

- Modern authentication system with role-based access control
- Clean, professional UI with Five Elements color theme
- Form validation with React Hook Form and Yup
- State management with Redux Toolkit
- TypeScript for type safety
- Responsive design for all devices

## Tech Stack

- React 18
- TypeScript
- Vite
- Redux Toolkit
- React Router v6
- React Hook Form
- Yup
- Tailwind CSS
- Axios
- React Hot Toast

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
  components/
    auth/          # Login/Register forms
    layout/        # Header, Layout components
    ui/            # Reusable UI components
  pages/           # Page components
  services/        # API services
  store/
    slices/        # Redux slices
  types/           # TypeScript interfaces
  hooks/           # Custom hooks
  utils/           # Utility functions
```

## Development

- The application uses TypeScript in strict mode
- Follow the established folder structure
- Use the provided color theme variables
- Implement proper error handling
- Write clean, maintainable code
- Follow React best practices

## API Integration

The client connects to the backend API at `http://localhost:3000`. Make sure the backend server is running before starting the client.

## Authentication

The application implements a JWT-based authentication system with:
- Access and refresh tokens
- Automatic token refresh
- Role-based access control
- Secure token storage

## Contributing

1. Follow the established code style
2. Write meaningful commit messages
3. Test your changes thoroughly
4. Update documentation as needed
