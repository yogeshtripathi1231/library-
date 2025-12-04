# Library Management System - Complete Setup & Usage Guide

A modern, full-stack Library Management System built with Next.js, Node.js, Express, and MongoDB. Features glassmorphic UI, JWT authentication, and complete role-based access control.

## 🚀 Project Features

### User Features
- ✅ User Registration & Login
- ✅ Browse Book Catalog
- ✅ Search & Filter Books
- ✅ Request Books
- ✅ Track Request Status (Pending, Approved, Issued, Rejected, Returned)
- ✅ View Request History

### Admin Features
- ✅ Admin Dashboard
- ✅ Complete Book Management (CRUD)
- ✅ User Management
- ✅ View All Book Requests
- ✅ Approve/Reject Requests
- ✅ Mark Books as Issued
- ✅ Mark Books as Returned
- ✅ Stock Management

## 📁 Project Structure

```
Library Management/
├── backend/
│   ├── models/              # MongoDB schemas
│   │   ├── User.js
│   │   ├── Book.js
│   │   └── Request.js
│   ├── controllers/         # Business logic
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   ├── requestController.js
│   │   └── userController.js
│   ├── routes/              # API endpoints
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── requestRoutes.js
│   │   └── userRoutes.js
│   ├── middlewares/         # Authentication & authorization
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   ├── config/              # Database connection
│   │   └── database.js
│   ├── utils/               # Helper functions
│   │   ├── jwt.js
│   │   └── validators.js
│   ├── server.js            # Express app entry
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── app/                 # Next.js App Router
    │   ├── page.js          # Home page
    │   ├── layout.js        # Root layout
    │   ├── login/page.js
    │   ├── signup/page.js
    │   ├── dashboard/page.js
    │   ├── my-requests/page.js
    │   └── admin/
    │       ├── dashboard/page.js
    │       ├── books/page.js
    │       ├── requests/page.js
    │       └── users/page.js
    ├── components/          # Reusable components
    │   ├── Navbar.jsx
    │   ├── BookCard.jsx
    │   ├── Modal.jsx
    │   ├── StatusBadge.jsx
    │   └── Toast.jsx
    ├── services/            # API integration
    │   ├── api.js
    │   └── index.js
    ├── context/             # React context
    │   └── AuthContext.js
    ├── styles/
    │   └── globals.css      # Tailwind + custom styles
    ├── package.json
    └── .env.local
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (local or cloud - MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend folder:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables (.env):**
```env
MONGO_URI=mongodb://localhost:27017/library-management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

4. **Start MongoDB (if local):**
```bash
# Windows
mongod

# macOS/Linux
mongod
```

5. **Start the server:**
```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend folder:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. **Start development server:**
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "user": { "id": "...", "name": "...", "email": "...", "role": "user" },
  "accessToken": "...",
  "refreshToken": "..."
}
```

#### Refresh Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "..."
}
```

### Book Endpoints

#### Get All Books
```http
GET /api/books?search=title&category=Fiction
```

#### Get Single Book
```http
GET /api/books/:id
```

#### Create Book (Admin Only)
```http
POST /api/books
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "Book Title",
  "author": "Author Name",
  "description": "Description",
  "category": "Fiction",
  "isbn": "978-3-16-148410-0",
  "stock": 5,
  "coverImageUrl": "https://..."
}
```

#### Update Book (Admin Only)
```http
PUT /api/books/:id
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "Updated Title",
  "stock": 10
}
```

#### Delete Book (Admin Only)
```http
DELETE /api/books/:id
Authorization: Bearer <accessToken>
```

### Request Endpoints

#### Create Request (User)
```http
POST /api/requests
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "bookId": "..."
}
```

#### Get User Requests
```http
GET /api/requests/user
Authorization: Bearer <accessToken>
```

#### Get All Requests (Admin)
```http
GET /api/requests?status=Pending
Authorization: Bearer <accessToken>
```

#### Update Request Status (Admin)
```http
PUT /api/requests/:id
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "status": "Approved" // or "Issued", "Rejected"
}
```

#### Mark Book as Returned (Admin)
```http
PUT /api/requests/:id/return
Authorization: Bearer <accessToken>
```

### User Endpoints (Admin Only)

#### Get All Users
```http
GET /api/users
Authorization: Bearer <accessToken>
```

#### Get Single User
```http
GET /api/users/:id
Authorization: Bearer <accessToken>
```

#### Update User
```http
PUT /api/users/:id
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "name": "Updated Name",
  "role": "admin"
}
```

#### Delete User
```http
DELETE /api/users/:id
Authorization: Bearer <accessToken>
```

## 🔐 User Roles

### User Role
- Can browse books
- Can search and filter books
- Can request books
- Can view their own request status
- Cannot access admin features

### Admin Role
- Can perform all user actions
- Can access admin dashboard
- Can create, update, delete books
- Can view all user requests
- Can approve/reject requests
- Can mark books as issued
- Can mark books as returned
- Can manage users

## 🎨 Design System

### Glassmorphism UI Components

The system uses a modern glassmorphism design with:

- **Glass Cards**: Transparent cards with backdrop blur effect
- **Gradient Buttons**: Blue to purple gradient with hover effects
- **Glass Input**: Transparent input fields with blur effect
- **Status Badges**: Color-coded status indicators
  - Pending: Yellow
  - Approved: Blue
  - Issued: Purple
  - Rejected: Red
  - Returned: Green

### Tailwind CSS Utilities

Custom utility classes defined in `styles/globals.css`:

```css
.glass-card          /* Glassmorphic card */
.glass-button        /* Glassmorphic button */
.glass-input         /* Glassmorphic input */
.status-pending      /* Status badge styles */
.status-approved
.status-issued
.status-rejected
.status-returned
.gradient-text       /* Gradient text effect */
```

## 🧪 Demo Credentials

### User Account
```
Email: user@example.com
Password: password123
```

### Admin Account
```
Email: admin@example.com
Password: admin123
```

**Note**: You can register new accounts through the signup page.

## 📦 Technologies Used

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Joi** - Data validation
- **CORS** - Cross-origin handling

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **Lucide React** - Icons

## 🚀 Deployment

### Backend Deployment (Heroku/Render)

1. **Create .env file with production values**
2. **Use MongoDB Atlas for cloud database**
3. **Deploy to Heroku/Render/AWS**

### Frontend Deployment (Vercel/Netlify)

1. **Update NEXT_PUBLIC_API_URL to production backend URL**
2. **Deploy to Vercel**: `vercel deploy`
3. **Or Netlify**: Push to GitHub and connect

## 📝 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "user" | "admin",
  createdAt: Date,
  updatedAt: Date
}
```

### Book Model
```javascript
{
  title: String,
  author: String,
  description: String,
  category: String,
  isbn: String (unique),
  stock: Number,
  coverImageUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Request Model
```javascript
{
  userId: ObjectId (ref: User),
  bookId: ObjectId (ref: Book),
  status: "Pending" | "Approved" | "Issued" | "Rejected" | "Returned",
  requestDate: Date,
  issueDate: Date,
  returnDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔄 Request Flow

1. **User requests a book**
   - Status: Pending
   - Stock remains unchanged

2. **Admin approves request**
   - Status: Approved
   - Stock decreases by 1

3. **Admin marks as Issued**
   - Status: Issued
   - issueDate is recorded

4. **Admin marks as Returned**
   - Status: Returned
   - returnDate is recorded
   - Stock increases by 1

5. **Admin rejects request**
   - Status: Rejected
   - Stock remains unchanged

## 🐛 Troubleshooting

### Backend Connection Issues
```bash
# Check MongoDB connection
mongosh
use library-management
```

### Frontend API Connection Issues
- Verify NEXT_PUBLIC_API_URL in .env.local
- Ensure backend is running
- Check CORS configuration in backend

### Token Expiration
- Tokens auto-refresh on 401 response
- Check localStorage for tokens
- Clear browser cache if needed

## 📱 Responsive Design

- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+

All components are fully responsive and tested across devices.

## 🎯 Future Enhancements

- [ ] Book ratings and reviews
- [ ] Wishlist functionality
- [ ] Email notifications
- [ ] Book recommendations
- [ ] Advanced search filters
- [ ] Renewal system for issued books
- [ ] Fine management
- [ ] Book reservation system

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check console for error messages
4. Verify environment variables

---

**Happy Library Management! 📚**
