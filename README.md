# AstraZeneca Clinical Trials Website

A full-stack web application for AstraZeneca Clinical Trials participant registration and management.

## Tech Stack

- **Frontend**: React 18, React Router, React Icons, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens), bcrypt

## Project Structure

```
az-clinical-trials/
├── client/                    # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   └── styles/            # Global styles
│   └── package.json
├── server/                    # Node.js Backend
│   ├── config/                # Database config
│   ├── middleware/            # Auth middleware
│   ├── models/                # Mongoose models
│   ├── routes/                # API routes
│   ├── server.js
│   └── package.json
└── package.json
```

## Features

### Public Pages
- **Home Page**: Hero section, About, Research Areas, Why Participate, CTA, Footer
- **Register Interest**: Form for clinical trial registration

### Admin Dashboard
- Secure login/registration with JWT authentication
- View all registrations
- Approve/Reject/Delete registrations
- Detailed view of each registration

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
# Install root dependencies
npm install

# Install all dependencies (server + client)
npm run install-all
```

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### Running the Application

**Development mode (runs both server and client):**
```bash
npm run dev
```

**Or run separately:**
```bash
# Start backend server
npm run server

# Start frontend (in another terminal)
npm run client
```

The frontend will run on `http://localhost:3000`
The backend will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create admin account
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token

### Registrations
- `POST /api/registrations` - Submit registration (public)
- `GET /api/registrations` - Get all registrations (protected)
- `GET /api/registrations/:id` - Get single registration (protected)
- `PUT /api/registrations/:id` - Update registration status (protected)
- `DELETE /api/registrations/:id` - Delete registration (protected)

## Design Colors

- Primary Burgundy: `#830051`
- Primary Gold: `#E8A000`
- Background: `#F8F8F8`
- Text Gray: `#666666`

## License

This project is for demonstration purposes only.
