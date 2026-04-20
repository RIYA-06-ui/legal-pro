# LexiGuard Server

Backend API server for the LexiGuard Legal Document Analysis Platform.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration values.

## Data Storage

Currently using in-memory storage for development. Data will be lost when the server restarts.
For production, consider integrating with a persistent database solution.

## Running the Server

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## API Endpoints

### Health Check

- `GET /api/health` - Check server status

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Documents

- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - Get user documents
- `GET /api/documents/:id` - Get specific document
- `DELETE /api/documents/:id` - Delete document

## Project Structure

```
server/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic
├── tests/           # Test files
├── uploads/         # File uploads
├── utils/           # Utility functions
└── server.js        # Entry point
```

## Environment Variables

See `.env.example` for all available environment variables.

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## License

MIT
