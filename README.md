# GigFlow CRM

GigFlow CRM is a full-stack lead management application built with React, TypeScript, Express, MongoDB, and JWT cookie authentication.

## Features

- User registration and login
- HTTP-only cookie authentication with access and refresh tokens
- Protected dashboard routes
- Lead listing with search, status filter, source filter, sorting, and pagination
- Lead create, edit, detail, delete, and CSV export
- Admin and sales user roles
- Centralized backend error handling
- Standard API response format
- Docker setup for frontend, backend, and MongoDB

## Tech Stack

Frontend:
- React
- TypeScript
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS

Backend:
- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcrypt

## Folder Structure

```txt
GigFlow/
  backend/
    src/
      config/
      constants/
      controllers/
      middleware/
      models/
      routes/
      services/
      types/
      utils/
      validators/
  frontend/
    src/
      components/
      context/
      hooks/
      pages/
      router/
      services/
      store/
      types/
      utils/
```

## Environment Variables

Backend example: `backend/.env.example`

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gigflow
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Frontend example: `frontend/.env.example`

```env
VITE_API_URL=http://localhost:5000/api
```

## Local Setup

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Create backend env file:

```bash
cp .env.example .env
```

3. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

4. Create frontend env file:

```bash
cp .env.example .env
```

5. Start MongoDB locally.

6. Start backend:

```bash
cd backend
npm run dev
```

7. Start frontend:

```bash
cd frontend
npm run dev
```

Frontend runs at:

```txt
http://localhost:5173
```

Backend API runs at:

```txt
http://localhost:5000/api
```

## Docker Setup

Run the full project with Docker:

```bash
docker compose up --build
```

Services:

```txt
Frontend: http://localhost:5173
Backend:  http://localhost:5000/api
MongoDB:  localhost:27017
```

## Demo Credentials

Admin:

```txt
Email: admin@gmail.com
Password: admin123
```

Make sure this user exists in your database with role `admin`.

## API Documentation

See [API.md](./API.md).

## Build Commands

Backend:

```bash
cd backend
npm run build
```

Frontend:

```bash
cd frontend
npm run build
```

## Submission Checklist

- GitHub Repository URL: add your repository link before submission
- Updated Resume: submit separately as requested
- Proper README.md: included
- `.env.example`: included for frontend and backend
- API Documentation: included in `API.md`
- Setup Instructions: included above
