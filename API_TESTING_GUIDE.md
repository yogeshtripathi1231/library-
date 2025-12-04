# API Testing Guide

This guide shows how to test all endpoints using curl, Postman, or any HTTP client.

## Base URL
```
http://localhost:5000/api
```

## Authentication

Most endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <accessToken>
```

---

## 🔐 Auth Endpoints

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "accessToken": "...",
  "refreshToken": "..."
}
```

---

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "accessToken": "...",
  "refreshToken": "..."
}
```

---

### 3. Refresh Token
```bash
curl -X POST http://localhost:5000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your_refresh_token"
  }'
```

**Response:**
```json
{
  "accessToken": "new_access_token"
}
```

---

## 📚 Book Endpoints

### 1. Get All Books (with search & filter)
```bash
# Get all books
curl http://localhost:5000/api/books

# Search by title/author
curl "http://localhost:5000/api/books?search=gatsby"

# Filter by category
curl "http://localhost:5000/api/books?category=Fiction"

# Combine search and filter
curl "http://localhost:5000/api/books?search=gatsby&category=Fiction"
```

**Response:**
```json
{
  "books": [
    {
      "_id": "...",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "category": "Fiction",
      "stock": 5,
      "isbn": "978-0743273565",
      "description": "...",
      "coverImageUrl": "..."
    }
  ]
}
```

---

### 2. Get Single Book
```bash
curl http://localhost:5000/api/books/:id
```

---

### 3. Create Book (Admin Only)
```bash
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "New Book",
    "author": "Author Name",
    "description": "Book description",
    "category": "Fiction",
    "isbn": "978-0000000000",
    "stock": 5,
    "coverImageUrl": "https://example.com/image.jpg"
  }'
```

---

### 4. Update Book (Admin Only)
```bash
curl -X PUT http://localhost:5000/api/books/:id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "Updated Title",
    "stock": 10
  }'
```

---

### 5. Delete Book (Admin Only)
```bash
curl -X DELETE http://localhost:5000/api/books/:id \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## 📋 Request Endpoints

### 1. Create Request (User)
```bash
curl -X POST http://localhost:5000/api/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -d '{
    "bookId": "book_id_here"
  }'
```

**Response:**
```json
{
  "message": "Request created successfully",
  "request": {
    "_id": "...",
    "userId": {...},
    "bookId": {...},
    "status": "Pending",
    "requestDate": "2024-01-01T10:00:00Z"
  }
}
```

---

### 2. Get User's Requests
```bash
curl http://localhost:5000/api/requests/user \
  -H "Authorization: Bearer YOUR_USER_TOKEN"
```

---

### 3. Get All Requests (Admin Only)
```bash
# Get all requests
curl http://localhost:5000/api/requests \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Filter by status
curl "http://localhost:5000/api/requests?status=Pending" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Possible status values:**
- Pending
- Approved
- Issued
- Rejected
- Returned

---

### 4. Update Request Status (Admin Only)
```bash
curl -X PUT http://localhost:5000/api/requests/:id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "status": "Approved"
  }'
```

**Valid statuses:**
- `Pending` → User creates request
- `Approved` → Admin approves (stock -1)
- `Issued` → Admin marks as given
- `Rejected` → Admin rejects request
- `Returned` → Admin marks as returned (stock +1)

---

### 5. Mark Book as Returned (Admin Only)
```bash
curl -X PUT http://localhost:5000/api/requests/:id/return \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Action:**
- Status changes to "Returned"
- returnDate is set to current timestamp
- Book stock increases by 1

---

## 👥 User Endpoints (Admin Only)

### 1. Get All Users
```bash
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

### 2. Get Single User
```bash
curl http://localhost:5000/api/users/:id \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

### 3. Update User
```bash
curl -X PUT http://localhost:5000/api/users/:id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "New Name",
    "email": "newemail@example.com",
    "role": "admin"
  }'
```

---

### 4. Delete User
```bash
curl -X DELETE http://localhost:5000/api/users/:id \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## 🧪 Testing Workflow

### Step 1: Register/Login
```bash
# Login
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }')

# Extract token (use jq if available)
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
```

### Step 2: Create a Request
```bash
curl -X POST http://localhost:5000/api/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "bookId": "BOOK_ID_HERE"
  }'
```

### Step 3: Admin Approves Request
```bash
# Get admin token first
ADMIN_TOKEN="..." # Get from admin login

curl -X PUT http://localhost:5000/api/requests/REQUEST_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "status": "Approved"
  }'
```

---

## 📊 Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (admin only) |
| 404 | Not Found |
| 500 | Server Error |

---

## 🔧 Useful Tools

### Postman
1. Import the collection
2. Set variables for tokens
3. Use environment variables

### curl with jq
```bash
curl http://localhost:5000/api/books | jq '.'
```

### Thunder Client (VS Code)
- Lightweight alternative to Postman
- Built into VS Code
- Good for quick testing

---

## 💡 Tips

1. **Save tokens**: Copy accessToken and use in Authorization header
2. **Validate Input**: Check error messages for validation failures
3. **Check Status**: Use filter `?status=` to organize requests
4. **Admin Required**: Always use admin token for admin operations
5. **Stock Management**: Monitor book stock when approving requests

---

**Happy Testing! 🚀**
