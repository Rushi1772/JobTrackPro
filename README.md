# JobTrackPro

A full-stack job application tracking system built with Node.js, Express, MySQL, and React. Deployable as a single application on Render.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Application Tracking**: Add, view, and manage job applications
- **Status Management**: Track application status (Applied, Interview, Rejected)
- **Event Logging**: Record important events related to job applications
- **Responsive Design**: Modern, mobile-friendly interface
- **Single Deployment**: Frontend and backend served from one application

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MySQL** database with connection pooling
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Frontend
- **React 19** with modern hooks
- **Vite** for fast development and building
- **CSS** with glassmorphism design

## Prerequisites

- Node.js (v16 or higher)
- MySQL database (local or cloud like Aiven, PlanetScale, etc.)

## Installation & Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd JobTrackPro
   ```

2. **Install all dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Build the frontend**
   ```bash
   npm run build
   ```

5. **Start the application**
   ```bash
   npm start
   ```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=your-mysql-host
DB_PORT=3306
DB_USER=your-username
DB_PASS=your-password
DB_NAME=your-database-name

# JWT Secret (use a strong, random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Port (Render will set this automatically)
PORT=10000
```

## Deployment on Render

1. **Connect your GitHub repository** to Render
2. **Create a new Web Service**
3. **Configure build settings**:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
4. **Add environment variables** in Render dashboard
5. **Deploy!**

The application will automatically build the frontend and serve both frontend and API from the same port.

## API Endpoints

- `GET /api` - API status
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/applications` - Get user's applications
- `POST /api/applications` - Add new application
- `DELETE /api/applications/:id` - Delete application
- `GET /api/events` - Get user's events
- `POST /api/events` - Add new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

## Development Scripts

- `npm run build` - Build frontend for production
- `npm start` - Start production server
- `npm run dev` - Build frontend and start development server
- `npm run dev:frontend` - Start frontend development server only
- `npm run dev:backend` - Start backend development server only

## Project Structure

```
JobTrackPro/
├── app.js                 # Main server file
├── config/
│   └── database.js        # Database configuration
├── middleware/
│   └── auth.js           # JWT authentication middleware
├── routes/
│   ├── users.js          # User authentication routes
│   ├── applications.js   # Application CRUD routes
│   └── events.js         # Event management routes
├── public/                # Built React frontend (auto-generated)
├── frontend/              # React source code
│   ├── src/
│   │   ├── components/   # React components
│   │   └── api.js        # API service functions
│   └── package.json
├── .env.example          # Environment variables template
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.