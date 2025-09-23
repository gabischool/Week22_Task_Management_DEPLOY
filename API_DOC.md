## Task Management API Documentation

---

### Base URL

```
http://localhost:3000/api
```

---

## Authentication

- **Type:** Bearer Token (JWT)
- **Header:** `Authorization: Bearer <token>`
- Obtain token via `/api/auth/login` or `/api/auth/register`.
- All `/api/*` endpoints (except `/api/auth/*`) require a valid token.

---

## Endpoints

### Auth Endpoints

#### Register User
- **POST** `/api/auth/register`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourPassword",
    "name": "User Name"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "user": {
      "id": "...",
      "email": "...",
      "name": "..."
    },
    "token": "<JWT token>"
  }
  ```

#### Login User
- **POST** `/api/auth/login`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourPassword"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "user": {
      "id": "...",
      "email": "...",
      "name": "..."
    },
    "token": "<JWT token>"
  }
  ```

---

### Task Endpoints (Require Authentication)

#### Get All Tasks
- **GET** `/api/tasks`
- **Response:**
  ```json
  {
    "success": true,
    "count": 2,
    "data": [
      {
        "id": "...",
        "title": "...",
        "description": "...",
        "status": "pending|in_progress|completed|cancelled",
        "priority": "low|medium|high|urgent",
        "dueDate": "2025-09-16T00:00:00.000Z",
        "assignedTo": "...",
        "subtasks": [ ... ]
      }
    ]
  }
  ```

#### Get Task by ID
- **GET** `/api/tasks/:id`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "...",
      "title": "...",
      "description": "...",
      "status": "pending|in_progress|completed|cancelled",
      "priority": "low|medium|high|urgent",
      "dueDate": "2025-09-16T00:00:00.000Z",
      "assignedTo": "...",
      "subtasks": [ ... ]
    }
  }
  ```

#### Create Task
- **POST** `/api/tasks`
- **Request Body:**
  ```json
  {
    "title": "Task Title",
    "description": "Task description",
    "status": "pending|in_progress|completed|cancelled",
    "priority": "low|medium|high|urgent",
    "dueDate": "2025-09-16T00:00:00.000Z",
    "assignedTo": "userId",
    "subtasks": [
      {
        "title": "Subtask Title",
        "description": "Subtask description"
      }
    ]
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "...",
      "title": "...",
      "description": "...",
      "status": "...",
      "priority": "...",
      "dueDate": "...",
      "assignedTo": "...",
      "subtasks": [ ... ]
    }
  }
  ```

#### Update Task
- **PUT** `/api/tasks/:id`
- **Request Body:**
  ```json
  {
    "title": "Updated Title",
    "description": "Updated description",
    "status": "completed",
    "priority": "high",
    "dueDate": "2025-09-17T00:00:00.000Z",
    "assignedTo": "userId"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": { ...updated task... }
  }
  ```

#### Delete Task
- **DELETE** `/api/tasks/:id`
- **Response:**
  ```json
  {
    "success": true,
    "data": { ...deleted task... }
  }
  ```

---

### Subtask Endpoints (Require Authentication)

#### Get Subtasks for a Task
- **GET** `/api/tasks/:taskId/subtasks`
- **Response:**
  ```json
  {
    "success": true,
    "count": 1,
    "data": [ ...subtasks... ]
  }
  ```

#### Get Subtask by ID
- **GET** `/api/subtasks/:id`
- **Response:**
  ```json
  {
    "success": true,
    "data": { ...subtask... }
  }
  ```

#### Create Subtask
- **POST** `/api/tasks/:taskId/subtasks`
- **Request Body:**
  ```json
  {
    "title": "Subtask Title",
    "description": "Subtask description"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": { ...new subtask... }
  }
  ```

#### Update Subtask
- **PUT** `/api/subtasks/:id`
- **Request Body:**
  ```json
  {
    "title": "Updated Subtask Title",
    "description": "Updated description",
    "completed": true
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": { ...updated subtask... }
  }
  ```

#### Delete Subtask
- **DELETE** `/api/subtasks/:id`
- **Response:**
  ```json
  {
    "success": true,
    "data": { ...deleted subtask... }
  }
  ```

---

## Error Handling

- All error responses follow this format:
  ```json
  {
    "success": false,
    "message": "Error message",
    "error": "Detailed error info"
  }
  ```
- Common HTTP status codes:
  - `400 Bad Request`: Invalid input
  - `401 Unauthorized`: Missing/invalid token
  - `404 Not Found`: Resource not found
  - `500 Internal Server Error`: Server error

---

## Data Models

### User
- `id`: string
- `email`: string
- `name`: string
- `password`: string (hashed)

### Task
- `id`: string
- `title`: string
- `description`: string
- `status`: enum (`pending`, `in_progress`, `completed`, `cancelled`)
- `priority`: enum (`low`, `medium`, `high`, `urgent`)
- `dueDate`: DateTime (ISO string)
- `assignedTo`: string (userId)
- `subtasks`: array of Subtask

### Subtask
- `id`: string
- `title`: string
- `description`: string
- `completed`: boolean
- `taskId`: string

---

## Example Usage

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"yourPassword","name":"User Name"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"yourPassword"}'
```

### Get All Tasks
```bash
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <token>"
```

---

## Notes
- All date fields use ISO 8601 format.
- All endpoints (except `/api/auth/*`) require a valid JWT token in the `Authorization` header.
- Passwords are securely hashed.
- Error messages are descriptive for easier debugging.
