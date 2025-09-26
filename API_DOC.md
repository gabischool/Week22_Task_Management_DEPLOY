# 📘 Task Management API Documentation

## Base URL
- **Local**: `http://localhost:3000/api`
- **Production (Render)**: `https://<your-app-name>.onrender.com/api`

---

## 🔑 Authentication
- **Register** (`/auth/register`) and **Login** (`/auth/login`) are public.
- All other routes require a **Bearer Token** in the `Authorization` header:

---

## 📍 Endpoints

### 1. Auth Routes

#### **POST /auth/register**
Register a new user.

- **Request Body**
```json
{
"name": "Abdullahi",
"email": "abdullahi@example.com",
"password": "mypassword123"
}

// RESPONSE 201

{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "uuid",
    "name": "Abdullahi",
    "email": "abdullahi@example.com",
    "createdAt": "2025-09-23T06:00:00.000Z"
  },
  "token": "jwt.token.here"
}
// POST /auth/login
// Login an existing user.

// Request Body

{
  "email": "abdullahi@example.com",
  "password": "mypassword123"
}

// RESPONSE 200
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "uuid",
    "name": "Abdullahi",
    "email": "abdullahi@example.com"
  },
  "token": "jwt.token.here"
}
// GET /auth/me
// Get current user profile (requires token).

// Response (200)

{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Abdullahi",
    "email": "abdullahi@example.com"
  }
}
// GET /tasks
// Get all tasks for the logged-in user.

// Response (200)

{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "task-uuid",
      "title": "Finish API",
      "description": "Complete the API_DOC.md",
      "status": "pending"
    }
  ]
}
// GET /tasks/:id
// Get a single task by ID.

// Response (200)

{
  "success": true,
  "data": {
    "id": "task-uuid",
    "title": "Finish API",
    "description": "Complete the API_DOC.md",
    "status": "pending"
  }
}
// Error (404)

{
  "success": false,
  "error": "Task not found"
}
// POST /tasks
// Create a new task.

// Request Body

{
  "title": "Write documentation",
  "description": "Finish API_DOC.md",
  "status": "pending"
}
// Response (201)

{
  "success": true,
  "data": {
    "id": "task-uuid",
    "title": "Write documentation",
    "description": "Finish API_DOC.md",
    "status": "pending"
  }
}
// PUT /tasks/:id
// Update a task.

// Request Body

{
  "status": "completed"
}
// Response (200)

{
  "success": true,
  "data": {
    "id": "task-uuid",
    "title": "Write documentation",
    "description": "Finish API_DOC.md",
    "status": "completed"
  }
}
// DELETE /tasks/:id
// Delete a task.

// Response (200)

{
  "success": true,
  "data": {
    "id": "task-uuid",
    "title": "Write documentation"
  }
}