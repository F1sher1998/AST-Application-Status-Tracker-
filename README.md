# Application Status Tracker (AST)

> **Work in Progress** - A backend API for tracking job applications and interview rounds.

## Overview

Application Status Tracker is a RESTful API built to help users manage their job application process. Track applications, record interview rounds, and maintain notes throughout your job search journey.

## Features

- **User Management**
  - User registration and authentication
  - JWT-based access and refresh token system
  - Secure password hashing with bcrypt

- **Application Tracking**
  - Create and manage job applications
  - Filter applications by status, company, date, etc.
  - Update application status (applied, interviewing, rejected)
  - Track reached persons and application dates

- **Interview Rounds**
  - Record multiple interview rounds per application
  - Add preparation and reflection notes
  - Track interview progression

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (via Neon serverless)
- **Caching/Sessions**: Redis
- **Authentication**: JWT + HTTP-only cookies
- **Validation**: Joi
- **Development**: tsx (TypeScript execution)

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database (Neon serverless)
- Redis instance
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ast
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env` file in the root directory:
```env
ENVIRONMENT=testing # or production
DEV_DATABASE_URL=your_neon_database_url
TEST_DATABASE_URL=your_test_database_url
JWT_SECRET=your_jwt_secret
PORT=3000

# Redis Configuration
REDIS_USERNAME=your_redis_username
REDIS_PASSWORD=your_redis_password
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
```

4. Run database migrations

Execute the SQL migration file located at `src/db/migrations/001_init.sql` in your PostgreSQL database.

## Running the Application

### Development Mode
```bash
npm run start:dev
```

The server will start with hot-reload enabled using tsx watch.

## API Endpoints

### Users
- `POST /users` - Create a new user
- `POST /users/login` - User login
- `GET /users` - Get all users (authenticated)
- `GET /users/:id` - Get user by ID (authenticated)

### Applications
- `POST /applications` - Create new application (authenticated)
- `GET /applications` - Get all applications (authenticated)
- `GET /applications/:filterType/:value` - Filter applications (authenticated)
- `PATCH /applications/:appId` - Update application status (authenticated)

### Rounds
- `POST /rounds` - Create interview round (authenticated)
- `PATCH /rounds/:userId/:appId` - Update round notes (authenticated)

## Database Schema

### Users Table
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- email (VARCHAR, UNIQUE)
- password_hash (TEXT)
- created_at (TIMESTAMPTZ)

### Applications Table
- id (SERIAL PRIMARY KEY)
- user_id (INT, FOREIGN KEY)
- job_title (VARCHAR)
- status (VARCHAR: applied, interviewing, rejected)
- company (VARCHAR)
- application_date (DATE)
- reached_person (VARCHAR)
- last_touch (DATE)
- offer (BOOLEAN)
- rej_reason (TEXT)
- created_at, updated_at (TIMESTAMPTZ)

### Rounds Table
- id (SERIAL PRIMARY KEY)
- user_id (INT, FOREIGN KEY)
- application_id (INT, FOREIGN KEY)
- prepare_note (TEXT)
- reflection_note (TEXT)
- interview_number (INT)

## Authentication

The API uses a dual-token authentication system:
- **Access Token**: Short-lived (15 minutes), stored in HTTP-only cookie
- **Refresh Token**: Used to refresh access token, stored in Redis with expiration

All protected routes require valid authentication tokens.

## Project Structure

```
ast/
├── src/
│   ├── controllers/      # Request handlers
│   ├── db/              # Database clients (Neon, Redis)
│   ├── middleware/      # Authentication middleware
│   ├── routes/          # API route definitions
│   ├── utils/           # Shared utilities and types
│   ├── validator.ts     # Joi validation schemas
│   └── server.ts        # Express app setup
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Validation

All inputs are validated using Joi schemas:
- User registration: name, email, password requirements
- Application creation: required fields and status validation
- Round creation: interview number validation
- Note updates: text field validation

## Security Features

- Password hashing using bcrypt
- JWT token-based authentication
- HTTP-only secure cookies
- CORS enabled
- SQL injection prevention via parameterized queries

## Current Limitations

- Auto-rejection after 5 days of inactivity (checkLastTouch function needs DOM integration)
- Token refresh mechanism requires further testing
- No rate limiting implemented yet

## Future Plans

- [ ] Add comprehensive testing suite
- [ ] Implement rate limiting
- [ ] Add email notifications
- [ ] Enhance error handling
- [ ] Add logging system
- [ ] **UI will be added later**

## Contributing

This is a work-in-progress project. Contributions, issues, and feature requests are welcome!

## License

ISC

---

**Note**: This project is currently in development. The UI will be added later to provide a complete application tracking solution.
