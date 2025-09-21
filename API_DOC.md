# 📘 Task Management API Documentation

## Introduction

The **Task Management API** provides endpoints for managing **users, tasks, and subtasks**.  
It is built with **Node.js, Express, Prisma, and PostgreSQL** and uses **JWT authentication** for security.  

This documentation includes:
- Base URL
- HTTP status codes
- Authentication flow
- Endpoint details with request/response examples
- Error handling
- Quick start guide

---

## 🔗 Base URL

**Local Development:**
```
http://localhost:3000
```

**Production:**
```
https://your-app-name.onrender.com
```


## ⚡ HTTP Status Codes

- `200` – OK (Successful GET, PUT, DELETE)
- `201` – Created (Successful POST)
- `400` – Bad Request (Validation error, missing fields)
- `401` – Unauthorized (Invalid or missing token)
- `404` – Not Found (Resource not found)
- `500` – Internal Server Error

---

## 🔐 Authentication

This API uses **JWT tokens** for authentication.  

### How to Authenticate:

1. **Register** (`POST /api/auth/register`) or **Login** (`POST /api/auth/login`) to get a token.
2. Send the token with each request in the **Authorization header**:

```http
Authorization: Bearer <your-jwt-token>
```

### Token Details:
- **Expiration**: 365 days
- **Format**: JWT (JSON Web Token)
- **Required for**: All endpoints except registration and login

---

## 📋 API Endpoints

### 🔐 Authentication Endpoints

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

#### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

#### Get Current User Profile
```http
GET /api/auth/me
```

**Headers:**
```http
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 📝 Task Management Endpoints

#### Get All Tasks
```http
GET /api/tasks
```

**Headers:**
```http
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "task_id_1",
      "title": "Complete project",
      "description": "Finish the task management system",
      "status": "in_progress",
      "priority": "high",
      "dueDate": "2024-01-15T00:00:00.000Z",
      "assignedTo": "john@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "userId": "user_id",
      "subtasks": []
    }
  ]
}
```

#### Get Task by ID
```http
GET /api/tasks/:id
```

**Headers:**
```http
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "task_id",
    "title": "Complete project",
    "description": "Finish the task management system",
    "status": "in_progress",
    "priority": "high",
    "dueDate": "2024-01-15T00:00:00.000Z",
    "assignedTo": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "userId": "user_id",
    "subtasks": []
  }
}
```

#### Create New Task
```http
POST /api/tasks
```

**Headers:**
```http
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "status": "pending",
  "priority": "medium",
  "dueDate": "2024-01-15T00:00:00.000Z",
  "assignedTo": "john@example.com"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "new_task_id",
    "title": "New Task",
    "description": "Task description",
    "status": "pending",
    "priority": "medium",
    "dueDate": "2024-01-15T00:00:00.000Z",
    "assignedTo": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "userId": "user_id",
    "subtasks": []
  }
}
```

#### Update Task
```http
PUT /api/tasks/:id
```

**Headers:**
```http
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Task",
  "status": "completed",
  "priority": "high"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "task_id",
    "title": "Updated Task",
    "description": "Task description",
    "status": "completed",
    "priority": "high",
    "dueDate": "2024-01-15T00:00:00.000Z",
    "assignedTo": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z",
    "userId": "user_id",
    "subtasks": []
  }
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
```

**Headers:**
```http
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "task_id",
    "title": "Deleted Task",
    "description": "Task description",
    "status": "completed",
    "priority": "high",
    "dueDate": "2024-01-15T00:00:00.000Z",
    "assignedTo": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z",
    "userId": "user_id",
    "subtasks": []
  }
}
```

### 📋 Subtask Management Endpoints

#### Get Subtasks by Task ID
```http
GET /api/tasks/:taskId/subtasks
```

**Headers:**
```http
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "subtask_id_1",
      "title": "Subtask 1",
      "description": "First subtask",
      "completed": false,
      "taskId": "task_id",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Subtask by ID
```http
GET /api/subtasks/:id
```

**Headers:**
```http
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "subtask_id",
    "title": "Subtask Title",
    "description": "Subtask description",
    "completed": false,
    "taskId": "task_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Create New Subtask
```http
POST /api/tasks/:taskId/subtasks
```

**Headers:**
```http
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "New Subtask",
  "description": "Subtask description"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "new_subtask_id",
    "title": "New Subtask",
    "description": "Subtask description",
    "completed": false,
    "taskId": "task_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Update Subtask
```http
PUT /api/subtasks/:id
```

**Headers:**
```http
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Subtask",
  "completed": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "subtask_id",
    "title": "Updated Subtask",
    "description": "Subtask description",
    "completed": true,
    "taskId": "task_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

#### Delete Subtask
```http
DELETE /api/subtasks/:id
```

**Headers:**
```http
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "subtask_id",
    "title": "Deleted Subtask",
    "description": "Subtask description",
    "completed": false,
    "taskId": "task_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 📊 Data Models

### User Model
```typescript
{
  id: string;           // Unique identifier (CUID)
  email: string;        // Unique email address
  password: string;     // Hashed password
  name: string;         // User's full name
  createdAt: DateTime;  // Creation timestamp
  updatedAt: DateTime;  // Last update timestamp
  tasks: Task[];        // Array of user's tasks
}
```

### Task Model
```typescript
{
  id: string;           // Unique identifier (CUID)
  title: string;        // Task title
  description: string;  // Task description
  status: TaskStatus;   // Task status (pending, in_progress, completed, cancelled)
  priority: Priority;   // Task priority (low, medium, high, urgent)
  dueDate?: DateTime;   // Optional due date
  assignedTo?: string;  // Optional assignee email
  createdAt: DateTime;  // Creation timestamp
  updatedAt: DateTime;  // Last update timestamp
  userId: string;       // Owner user ID
  subtasks: Subtask[];  // Array of subtasks
}
```

### Subtask Model
```typescript
{
  id: string;           // Unique identifier (CUID)
  title: string;        // Subtask title
  description: string;  // Subtask description
  completed: boolean;   // Completion status (default: false)
  taskId: string;       // Parent task ID
  createdAt: DateTime;  // Creation timestamp
  updatedAt: DateTime;  // Last update timestamp
}
```

### Enums

#### TaskStatus
- `pending` - Task is not started
- `in_progress` - Task is currently being worked on
- `completed` - Task is finished
- `cancelled` - Task has been cancelled

#### Priority
- `low` - Low priority task
- `medium` - Medium priority task
- `high` - High priority task
- `urgent` - Urgent priority task

---

## ⚠️ Error Handling

### Error Response Format
All error responses follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Common Error Responses

#### 400 Bad Request
```json
{
  "success": false,
  "message": "Name, email, and password are required"
}
```

#### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

#### 404 Not Found
```json
{
  "success": false,
  "error": "Task not found"
}
```

#### 409 Conflict
```json
{
  "success": false,
  "message": "Email already registered"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error registering user",
  "error": "Detailed error message"
}
```

---

## 🚀 Quick Start Guide

### 1. Environment Setup
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/task_management"
 
PORT=3000
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup
```bash
npm run db:generate
npm run db:push
```

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 5. Test the API
```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Create a task (replace TOKEN with actual JWT token)
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"My First Task","description":"This is my first task","status":"pending","priority":"medium"}'
```

### 6. API Testing Tools
- **Postman**: Import the API endpoints for easy testing
- **Thunder Client**: VS Code extension for API testing
- **curl**: Command-line tool for testing endpoints
- **Insomnia**: GUI tool for API testing

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- User passwords are hashed using bcryptjs
- JWT tokens expire after 365 days
- All task and subtask operations are scoped to the authenticated user
- Database uses PostgreSQL with Prisma ORM
- CORS is enabled for all origins

