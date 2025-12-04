# Quick Start Guide

## One-Command Setup

### Backend (Terminal 1)
```bash
cd backend
npm install
npm run dev
```

### Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```

## Verify Setup

1. **Backend**: Open `http://localhost:5000/health`
   - Should show: `{"status":"Server is running"}`

2. **Frontend**: Open `http://localhost:3000`
   - Should show LibraryHub home page

## First Steps

1. **Create Account**
   - Go to `/signup`
   - Fill in name, email, password
   - Click Sign Up

2. **Browse Books**
   - Go to `/dashboard`
   - Browse available books
   - Use search and filter

3. **Request a Book**
   - Click on any book
   - Click "Request This Book"
   - View status in "My Requests"

## Admin Access

1. **Login as Admin**
   - Email: `admin@example.com`
   - Password: `admin123`

2. **Access Dashboard**
   - Go to `/admin/dashboard`
   - View statistics

3. **Manage Books**
   - Go to `/admin/books`
   - Add/Edit/Delete books

4. **Handle Requests**
   - Go to `/admin/requests`
   - Approve/Reject/Issue/Return books

5. **Manage Users**
   - Go to `/admin/users`
   - Edit user roles
   - Delete users

## Database Setup (MongoDB)

### Option 1: Local MongoDB
```bash
# Windows
mongod

# macOS/Linux
mongod
```

### Option 2: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGO_URI` in `.env`

## File Structure Summary

```
backend/
  ├── models/           # Data schemas
  ├── controllers/      # Business logic
  ├── routes/           # API endpoints
  ├── middlewares/      # Auth & admin checks
  ├── server.js         # Main server
  └── .env             # Configuration

frontend/
  ├── app/             # Pages (login, dashboard, etc.)
  ├── components/      # Reusable UI components
  ├── services/        # API calls
  ├── context/         # Authentication state
  └── styles/          # Global styles
```

## Key Features at a Glance

✅ **User Features**
- Sign up & Login
- Browse & search books
- Request books
- Track request status

✅ **Admin Features**
- Manage books (CRUD)
- Manage users
- Approve/reject requests
- Mark books issued & returned

✅ **Design**
- Glassmorphic UI
- Responsive layout
- Smooth animations
- Dark theme

## Common Commands

```bash
# Backend
npm run dev        # Development server
npm start         # Production server

# Frontend
npm run dev       # Development server
npm run build    # Build for production
npm start        # Run production build
npm run lint     # Check code
```

## Need Help?

Check the main README.md for:
- Full API documentation
- Database schema
- Troubleshooting
- Deployment guide
- Technology stack

---

**You're all set! Start exploring LibraryHub 🚀**
