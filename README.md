# Support System Backend - Node.js Express

Node.js Express backend API for authentication system with MongoDB integration.

## Features

- ✅ User Registration with validation
- ✅ Secure password hashing with bcrypt
- ✅ Login authentication
- ✅ MongoDB integration with Mongoose
- ✅ Input validation with express-validator
- ✅ Error handling
- ✅ CORS enabled for frontend
- ✅ Support request system

## Tech Stack

- **Express.js** - Fast, minimalist web framework for Node.js
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **bcrypt** - Password hashing
- **express-validator** - Request validation
- **dotenv** - Environment variable management
- **cors** - Cross-Origin Resource Sharing

## Installation

```bash
# Install dependencies
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=3001
NODE_ENV=development
```

## Running the Application

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check

#### Server Status
```http
GET /
```

**Response:**
```json
{
  "message": "Support System API",
  "status": "Running",
  "timestamp": "2025-10-31T..."
}
```

### Authentication

#### Sign Up
```http
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Registration successful! Please login.",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-10-31T..."
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful!",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-10-31T..."
  }
}
```

### Support Requests

#### Create Support Request
```http
POST /support
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Issue with login",
  "description": "I am unable to login to my account after password reset",
  "contactNumber": "+1234567890",
  "screenshot": "base64_encoded_image_or_url"
}
```

**Response:**
```json
{
  "message": "Support request submitted successfully",
  "data": {
    "_id": "request_id",
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Issue with login",
    "description": "I am unable to login to my account after password reset",
    "contactNumber": "+1234567890",
    "screenshot": "base64_encoded_image_or_url",
    "createdAt": "2025-10-31T...",
    "updatedAt": "2025-10-31T..."
  }
}
```

#### Get All Support Requests
```http
GET /support
```

**Response:**
```json
{
  "count": 2,
  "data": [
    {
      "_id": "request_id",
      "name": "John Doe",
      "email": "john@example.com",
      "subject": "Issue with login",
      "description": "I am unable to login...",
      "contactNumber": "+1234567890",
      "createdAt": "2025-10-31T...",
      "updatedAt": "2025-10-31T..."
    }
  ]
}
```

#### Get Support Request by ID
```http
GET /support/:id
```

**Response:**
```json
{
  "data": {
    "_id": "request_id",
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Issue with login",
    "description": "I am unable to login...",
    "contactNumber": "+1234567890",
    "createdAt": "2025-10-31T...",
    "updatedAt": "2025-10-31T..."
  }
}
```

## Database Schema

### User Collection

```javascript
{
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  isActive: Boolean (default: true),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

### Support Request Collection

```javascript
{
  name: String (required),
  email: String (required),
  subject: String (required, min: 5 chars),
  description: String (required, min: 10 chars),
  screenshot: String (optional),
  contactNumber: String (required),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## Validation Rules

### Sign Up
- **Name**: Required, must be a string
- **Email**: Required, must be valid email format
- **Password**: Required, minimum 6 characters

### Login
- **Email**: Required, must be valid email format
- **Password**: Required

### Support Request
- **Name**: Required, must be a string
- **Email**: Required, must be valid email format
- **Subject**: Required, minimum 5 characters
- **Description**: Required, minimum 10 characters
- **Contact Number**: Required
- **Screenshot**: Optional, string format

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["Validation error messages"],
  "error": "Bad Request"
}
```

### 401 Unauthorized (Invalid credentials)
```json
{
  "statusCode": 401,
  "message": "Invalid email or password",
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Support request not found",
  "error": "Not Found"
}
```

### 409 Conflict (Email already exists)
```json
{
  "statusCode": 409,
  "message": "Email already registered. Please login.",
  "error": "Conflict"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal Server Error",
  "error": "Error"
}
```

## Project Structure

```
Backend-NodeJS/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── auth.controller.js   # Authentication logic
│   └── support.controller.js # Support request logic
├── middleware/
│   ├── errorHandler.js      # Global error handler
│   └── validation.js        # Request validation rules
├── models/
│   ├── User.js              # User schema
│   └── SupportRequest.js    # Support request schema
├── routes/
│   ├── auth.routes.js       # Authentication routes
│   └── support.routes.js    # Support request routes
├── .env                     # Environment variables
├── package.json             # Dependencies and scripts
└── server.js                # Application entry point
```

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- Input validation and sanitization
- Email uniqueness check
- Case-insensitive email storage
- Active user status check
- Global error handling
- CORS protection

## Development

### Adding New Routes

1. Create controller in `controllers/` directory
2. Create route file in `routes/` directory
3. Add validation rules in `middleware/validation.js`
4. Register route in `server.js`

### Adding New Models

1. Create model file in `models/` directory
2. Define schema with Mongoose
3. Add validation rules
4. Export model

## Dependencies

### Production Dependencies
- `express`: ^4.18.2 - Web framework
- `mongoose`: ^8.0.3 - MongoDB ODM
- `bcrypt`: ^5.1.1 - Password hashing
- `dotenv`: ^16.3.1 - Environment variables
- `cors`: ^2.8.5 - CORS middleware
- `express-validator`: ^7.0.1 - Request validation

### Development Dependencies
- `nodemon`: ^3.0.2 - Auto-restart on file changes

## License

MIT

## Author

Your Name

---

**Note**: Make sure to never commit your `.env` file to version control. Add it to `.gitignore`.
