# Task Management API Documentation

## Base URL

**Local Development:** `http://localhost:3000`  
**Production:** `https://your-app-name.onrender.com` (Update with your Render.com URL)

---

## Authentication

Most endpoints require authentication using JWT (JSON Web Tokens). Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Getting Started

1. **Register** a new user to get a JWT token
2. **Login** to get a JWT token if you already have an account
3. Use the token in the Authorization header for all protected endpoints

---

## API Endpoints

### Authentication Endpoints

#### 1. Register a New User

**Endpoint:** `POST /api/auth/register`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "clx123abc456",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields or user already exists
```json
{
  "success": false,
  "message": "Email, password, and name are required"
}
```

- `500 Internal Server Error`: Server error
```json
{
  "success": false,
  "message": "Error registering user",
  "error": "Error message"
}
```

---

#### 2. Login

**Endpoint:** `POST /api/auth/login`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "clx123abc456",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing email or password
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

- `401 Unauthorized`: Invalid credentials
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

- `500 Internal Server Error`: Server error
```json
{
  "success": false,
  "message": "Error logging in",
  "error": "Error message"
}
```

---

#### 3. Get Current User Profile

**Endpoint:** `GET /api/auth/me`

**Authentication:** Required (Bearer Token)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clx123abc456",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
```json
{
  "success": false,
  "message": "Access token required"
}
```

- `500 Internal Server Error`: Server error
```json
{
  "success": false,
  "message": "Error retrieving user profile",
  "error": "Error message"
}
```

---

### Task Endpoints

All task endpoints require authentication. Include the JWT token in the Authorization header.

#### 4. Get All Tasks

**Endpoint:** `GET /api/tasks`

**Authentication:** Required (Bearer Token)

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "clx456def789",
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation",
      "status": "in_progress",
      "priority": "high",
      "dueDate": "2024-01-20T00:00:00.000Z",
      "assignedTo": "john@example.com",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-16T14:20:00.000Z",
      "userId": "clx123abc456",
      "subtasks": []
    }
  ]
}
```

**Error Responses:**
- `500 Internal Server Error`: Server error
```json
{
  "success": false,
  "error": "Error message"
}
```

---

#### 5. Get Task by ID

**Endpoint:** `GET /api/tasks/:id`

**Authentication:** Required (Bearer Token)

**URL Parameters:**
- `id` (string): Task ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clx456def789",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "in_progress",
    "priority": "high",
    "dueDate": "2024-01-20T00:00:00.000Z",
    "assignedTo": "john@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-16T14:20:00.000Z",
    "userId": "clx123abc456",
    "subtasks": [
      {
        "id": "clx789ghi012",
        "title": "Write authentication section",
        "description": "Document all auth endpoints",
        "completed": true,
        "taskId": "clx456def789",
        "createdAt": "2024-01-15T11:00:00.000Z",
        "updatedAt": "2024-01-15T12:00:00.000Z"
      }
    ]
  }
}
```

**Error Responses:**
- `404 Not Found`: Task not found
```json
{
  "success": false,
  "error": "Task not found"
}
```

- `500 Internal Server Error`: Server error
```json
{
  "success": false,
  "error": "Error message"
}
```

---

#### 6. Create Task

**Endpoint:** `POST /api/tasks`

**Authentication:** Required (Bearer Token)

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description here",
  "status": "pending",
  "priority": "medium",
  "dueDate": "2024-01-25T00:00:00.000Z",
  "assignedTo": "team@example.com",
  "subtasks": [
    {
      "title": "Subtask 1",
      "description": "Subtask description",
      "completed": false
    }
  ]
}
```

**Field Descriptions:**
- `title` (string, required): Task title
- `description` (string, required): Task description
- `status` (enum, required): `pending`, `in_progress`, `completed`, `cancelled`
  - Note: Use `in-progress` (kebab-case) in request, it will be converted to `in_progress`
- `priority` (enum, required): `low`, `medium`, `high`, `urgent`
- `dueDate` (string, optional): ISO 8601 date string
- `assignedTo` (string, optional): Email address
- `subtasks` (array, optional): Array of subtask objects

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "clx456def789",
    "title": "New Task",
    "description": "Task description here",
    "status": "pending",
    "priority": "medium",
    "dueDate": "2024-01-25T00:00:00.000Z",
    "assignedTo": "team@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "userId": "clx123abc456",
    "subtasks": []
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation error
```json
{
  "success": false,
  "error": "Error message"
}
```

- `500 Internal Server Error`: Server error
```json
{
  "success": false,
  "error": "Error message"
}
```

---

#### 7. Update Task

**Endpoint:** `PUT /api/tasks/:id`

**Authentication:** Required (Bearer Token)

**URL Parameters:**
- `id` (string): Task ID

**Request Body:**
```json
{
  "title": "Updated Task Title",
  "status": "in-progress",
  "priority": "high"
}
```

**Note:** All fields are optional. Only include fields you want to update.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clx456def789",
    "title": "Updated Task Title",
    "description": "Task description here",
    "status": "in_progress",
    "priority": "high",
    "dueDate": "2024-01-25T00:00:00.000Z",
    "assignedTo": "team@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-16T15:00:00.000Z",
    "userId": "clx123abc456",
    "subtasks": []
  }
}
```

**Error Responses:**
- `404 Not Found`: Task not found
```json
{
  "success": false,
  "error": "Task not found"
}
```

- `400 Bad Request`: Validation error
```json
{
  "success": false,
  "error": "Error message"
}
```

---

#### 8. Delete Task

**Endpoint:** `DELETE /api/tasks/:id`

**Authentication:** Required (Bearer Token)

**URL Parameters:**
- `id` (string): Task ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clx456def789",
    "title": "Task to delete",
    "description": "This task will be deleted",
    "status": "pending",
    "priority": "medium",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "userId": "clx123abc456",
    "subtasks": []
  }
}
```

**Note:** Deleting a task will also delete all associated subtasks (cascade delete).

**Error Responses:**
- `404 Not Found`: Task not found
```json
{
  "success": false,
  "error": "Task not found"
}
```

- `500 Internal Server Error`: Server error
```json
{
  "success": false,
  "error": "Error message"
}
```

---

### Subtask Endpoints

All subtask endpoints require authentication. Include the JWT token in the Authorization header.

#### 9. Get All Subtasks for a Task

**Endpoint:** `GET /api/tasks/:taskId/subtasks`

**Authentication:** Required (Bearer Token)

**URL Parameters:**
- `taskId` (string): Task ID

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "clx789ghi012",
      "title": "Subtask 1",
      "description": "Subtask description",
      "completed": false,
      "taskId": "clx456def789",
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `404 Not Found`: Task not found or access denied
```json
{
  "success": false,
  "error": "Task not found or access denied"
}
```

- `500 Internal Server Error`: Server error
```json
{
  "success": false,
  "error": "Error message"
}
```

---

#### 10. Get Subtask by ID

**Endpoint:** `GET /api/subtasks/:id`

**Authentication:** Required (Bearer Token)

**URL Parameters:**
- `id` (string): Subtask ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clx789ghi012",
    "title": "Subtask 1",
    "description": "Subtask description",
    "completed": false,
    "taskId": "clx456def789",
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z",
    "task": {
      "id": "clx456def789",
      "title": "Parent Task",
      "userId": "clx123abc456"
    }
  }
}
```

**Error Responses:**
- `404 Not Found`: Subtask not found or access denied
```json
{
  "success": false,
  "error": "Subtask not found or access denied"
}
```

- `500 Internal Server Error`: Server error
```json
{
  "success": false,
  "error": "Error message"
}
```

---

#### 11. Create Subtask

**Endpoint:** `POST /api/tasks/:taskId/subtasks`

**Authentication:** Required (Bearer Token)

**URL Parameters:**
- `taskId` (string): Task ID

**Request Body:**
```json
{
  "title": "New Subtask",
  "description": "Subtask description",
  "completed": false
}
```

**Field Descriptions:**
- `title` (string, required): Subtask title
- `description` (string, required): Subtask description
- `completed` (boolean, optional): Completion status (default: `false`)

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "clx789ghi012",
    "title": "New Subtask",
    "description": "Subtask description",
    "completed": false,
    "taskId": "clx456def789",
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Error Responses:**
- `404 Not Found`: Task not found or access denied
```json
{
  "success": false,
  "error": "Task not found or access denied"
}
```

- `400 Bad Request`: Validation error
```json
{
  "success": false,
  "error": "Error message"
}
```

---

#### 12. Update Subtask

**Endpoint:** `PUT /api/subtasks/:id`

**Authentication:** Required (Bearer Token)

**URL Parameters:**
- `id` (string): Subtask ID

**Request Body:**
```json
{
  "title": "Updated Subtask Title",
  "completed": true
}
```

**Note:** All fields are optional. Only include fields you want to update.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clx789ghi012",
    "title": "Updated Subtask Title",
    "description": "Subtask description",
    "completed": true,
    "taskId": "clx456def789",
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-16T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `404 Not Found`: Subtask not found or access denied
```json
{
  "success": false,
  "error": "Subtask not found or access denied"
}
```

- `400 Bad Request`: Validation error
```json
{
  "success": false,
  "error": "Error message"
}
```

---

#### 13. Delete Subtask

**Endpoint:** `DELETE /api/subtasks/:id`

**Authentication:** Required (Bearer Token)

**URL Parameters:**
- `id` (string): Subtask ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clx789ghi012",
    "title": "Subtask to delete",
    "description": "This subtask will be deleted",
    "completed": false,
    "taskId": "clx456def789",
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Error Responses:**
- `404 Not Found`: Subtask not found or access denied
```json
{
  "success": false,
  "error": "Subtask not found or access denied"
}
```

- `500 Internal Server Error`: Server error
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": "Error message",
  "message": "Human-readable message (optional)"
}
```

### HTTP Status Codes

- `200 OK`: Successful GET, PUT, DELETE operations
- `201 Created`: Successful POST operations (resource creation)
- `400 Bad Request`: Validation errors, malformed requests
- `401 Unauthorized`: Missing or invalid authentication token
- `404 Not Found`: Resource not found or access denied
- `500 Internal Server Error`: Server errors

### Authentication Errors

If authentication fails, you'll receive one of these responses:

- **Missing Token:**
```json
{
  "success": false,
  "message": "Access token required"
}
```

- **Invalid Token:**
```json
{
  "success": false,
  "message": "Invalid token"
}
```

- **Expired Token:**
```json
{
  "success": false,
  "message": "Token expired"
}
```

- **User Not Found:**
```json
{
  "success": false,
  "message": "User not found"
}
```

---

## Data Models

### User Model
```typescript
{
  id: string;          // CUID
  email: string;       // Unique
  name: string;
  password: string;    // Hashed, never returned in API responses
  createdAt: Date;
  updatedAt: Date;
}
```

### Task Model
```typescript
{
  id: string;          // CUID
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate: Date | null;
  assignedTo: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  subtasks: Subtask[];
}
```

### Subtask Model
```typescript
{
  id: string;          // CUID
  title: string;
  description: string;
  completed: boolean;
  taskId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Example Requests

### Using cURL

**Register User:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123",
    "name": "John Doe"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

**Get All Tasks:**
```bash
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Create Task:**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "New Task",
    "description": "Task description",
    "status": "pending",
    "priority": "medium"
  }'
```

### Using JavaScript (fetch)

```javascript
// Register
const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securePassword123',
    name: 'John Doe'
  })
});

const registerData = await registerResponse.json();
const token = registerData.data.token;

// Create Task
const taskResponse = await fetch('http://localhost:3000/api/tasks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'New Task',
    description: 'Task description',
    status: 'pending',
    priority: 'medium'
  })
});

const taskData = await taskResponse.json();
console.log(taskData);
```

---

## Notes

1. **Status Field:** When sending requests, use `in-progress` (kebab-case), but the API will return `in_progress` (snake_case) as stored in the database.

2. **Date Formats:** All dates are in ISO 8601 format (e.g., `2024-01-15T10:30:00.000Z`).

3. **Token Expiration:** JWT tokens expire after 7 days. Users need to log in again to get a new token.

4. **User Isolation:** Users can only access their own tasks and subtasks. Attempting to access another user's resources will return a 404 error.

5. **Cascade Deletes:** Deleting a task will automatically delete all associated subtasks.

6. **Protected Routes:** All task and subtask endpoints require authentication. Make sure to include the JWT token in the Authorization header for all requests.

---

## Support

For issues or questions, please contact the development team or refer to the project repository.

