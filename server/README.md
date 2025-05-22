# SophieCare MVP Backend

A TypeScript-based Express backend for SophieCare MVP.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd sophicare-mvp/server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/sophicare
NODE_ENV=development
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

## Development

Start the development server with hot-reload:
```bash
npm run dev
```

The server will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build the project
- `npm start` - Start the production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run clean` - Clean build directory

## API Endpoints

### Health Check
- `GET /health` - Check server health status

## Project Structure

```
src/
├── config/         # Configuration files
├── errors/         # Error handling
├── middleware/     # Express middleware
├── routes/         # API routes
├── types/          # TypeScript types
└── app.ts         # Express app setup
```

## Error Handling

The application uses a centralized error handling mechanism with custom error classes and middleware.

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

ISC 