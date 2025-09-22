# Task Management API Documentation

## Base URL

- **Local Development:**
  - `http://localhost:3000/api`
- **Production/Deployed:**
  - 'https://week22-task-management-deploy-m2ef.onrender.com/api'

---

## Authentication

- **Type:** Bearer Token (JWT)
- **How to use:**
  - For all protected endpoints, include the following header:
    - `Authorization: Bearer <your_token>`
- **How to obtain a token:**
  - Register or login via `/auth/register` or `/auth/login` endpoints to receive a JWT token in the response.
- **Token Expiry:** 1 hour (default)
- **Error Responses:**
  - If token is missing, invalid, or expired, you will receive a 401 Unauthorized error.

---

## Endpoints

### 1. Authentication

#### Register a New User
- **URL:** `/auth/register`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourPassword"
  }
  ```
- **Response (201):**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "string",
        "email": "user@example.com"
      },
      "token": "<jwt_token>"
    }
  }
  ```
- **Errors:**
  - 400: User already exists, invalid input
  - 500: Server error

#### Login
- **URL:** `/auth/login`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourPassword"
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "string",
        "email": "user@example.com"
      },
      "token": "<jwt_token>"
    }
  }
  ```
- **Errors:**
  - 400: Invalid email or password
  - 500: Server error

#### Get Current User Profile
- **URL:** `/auth/me`
- **Method:** `GET`
- **Headers:**
  - `Authorization: Bearer <jwt_token>`
- **Response (200):**
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "email": "user@example.com",
      "name": "string" // if set
    }
  }
  ```
- **Errors:**
  - 401: Invalid or missing token
  - 500: Server error

---

### 2. Tasks

> **All task endpoints require authentication.**

#### Get All Tasks
- **URL:** `/tasks`
- **Method:** `GET`
- **Headers:**
  - `Authorization: Bearer <jwt_token>`
- **Response (200):**
  ```json
  {
    "success": true,
    "count": 2,
    "data": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "status": "pending|in_progress|completed|cancelled",
        "priority": "low|medium|high|urgent",
        "dueDate": "2025-09-22T00:00:00.000Z",
        "assignedTo": "string",
        "createdAt": "2025-09-22T00:00:00.000Z",
        "updatedAt": "2025-09-22T00:00:00.000Z",
        "userId": "string",
        "subtasks": [ ... ]
      }
    ]
  }
  ```

#### Get Task by ID
- **URL:** `/tasks/:id`
- **Method:** `GET`
- **Headers:**
  - `Authorization: Bearer <jwt_token>`
- **Response (200):**
  ```json
  {
    "success": true,
    "data": { ...taskObject }
  }
  ```
- **Errors:**
  - 404: Task not found
  - 500: Server error

#### Create Task
- **URL:** `/tasks`
- **Method:** `POST`
- **Headers:**
  - `Authorization: Bearer <jwt_token>`
- **Body:**
  ```json
  {
    "title": "string",
    "description": "string",
    "status": "pending|in-progress|completed|cancelled", // 'in-progress' will be converted to 'in_progress'
    "priority": "low|medium|high|urgent",
    "dueDate": "2025-09-22T00:00:00.000Z", // optional
    "assignedTo": "string", // optional
    "subtasks": [
      {
        "title": "string",
        "description": "string",
        "completed": false
      }
    ]
  }
  ```
- **Response (201):**
  ```json
  {
    "success": true,
    "data": { ...taskObject }
  }
  ```
- **Errors:**
  - 400: Validation error
  - 500: Server error

#### Update Task
- **URL:** `/tasks/:id`
- **Method:** `PUT`
- **Headers:**
  - `Authorization: Bearer <jwt_token>`
- **Body:**
  ```json
  {
    "title": "string", // optional
    "description": "string", // optional
    "status": "pending|in-progress|completed|cancelled", // optional
    "priority": "low|medium|high|urgent", // optional
    "dueDate": "2025-09-22T00:00:00.000Z", // optional
    "assignedTo": "string" // optional
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "data": { ...taskObject }
  }
  ```
- **Errors:**
  - 404: Task not found
  - 400: Validation error
  - 500: Server error

#### Delete Task
- **URL:** `/tasks/:id`
- **Method:** `DELETE`
- **Headers:**
  - `Authorization: Bearer <jwt_token>`
- **Response (200):**
  ```json
  {
    "success": true,
    "data": { ...deletedTaskObject }
  }
  ```
- **Errors:**
  - 404: Task not found
  - 500: Server error

---

### 3. Subtasks

> **All subtask endpoints require authentication.**

#### Get All Subtasks for a Task
- **URL:** `/tasks/:taskId/subtasks`
- **Method:** `GET`
- **Headers:**
  - `Authorization: Bearer <jwt_token>`
- **Response (200):**
  ```json
  {
    "success": true,
    "count": 2,
    "data": [ ...subtaskObjects ]
  }
  ```
- **Errors:**
  - 404: Task not found or access denied
  - 500: Server error

#### Get Subtask by ID
- **URL:** `/subtasks/:id`
- **Method:** `GET`
- **Headers:**
  - `Authorization: Bearer <jwt_token>`
- **Response (200):**
  ```json
  {
    "success": true,
    "data": { ...subtaskObject }
  }
  ```
- **Errors:**
  - 404: Subtask not found or access denied
  - 500: Server error

#### Create Subtask
- **URL:** `/tasks/:taskId/subtasks`
- **Method:** `POST`
- **Headers:**
  - `Authorization: Bearer <jwt_token>`
- **Body:**
  ```json
  {
    "title": "string",
    "description": "string",
    "completed": false // optional
  }
  ```
- **Response (201):**
  ```json
  {
    "success": true,
    "data": { ...subtaskObject }
  }
  ```
- **Errors:**
  - 404: Task not found or access denied
  - 400: Validation error
  - 500: Server error

#### Update Subtask
- **URL:** `/subtasks/:id`
- **Method:** `PUT`
- **Headers:**
  - `Authorization: Bearer <jwt_token>`
- **Body:**
  ```json
  {
    "title": "string", // optional
    "description": "string", // optional
    "completed": true // optional
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "data": { ...subtaskObject }
  }
  ```
- **Errors:**
  - 404: Subtask not found or access denied
  - 400: Validation error
  - 500: Server error

#### Delete Subtask
- **URL:** `/subtasks/:id`
- **Method:** `DELETE`
- **Headers:**
  - `Authorization: Bearer <jwt_token>`
- **Response (200):**
  ```json
  {
    "success": true,
    "data": { ...deletedSubtaskObject }
  }
  ```
- **Errors:**
  - 404: Subtask not found or access denied
  - 500: Server error

---

## Error Handling

- All error responses are JSON and include a `success: false` property and an `error` or `message` field.
- Common error status codes:
  - `400`: Bad request (validation, missing fields, etc.)
  - `401`: Unauthorized (missing/invalid/expired token)
  - `404`: Not found (resource does not exist or access denied)
  - `500`: Internal server error

---

## Data Models (Prisma)

### User
- `id` (string)
- `email` (string)
- `password` (string, hashed)
- `name` (string, optional)
- `createdAt` (datetime)
- `updatedAt` (datetime)

### Task
- `id` (string)
- `title` (string)
- `description` (string)
- `status` (enum: pending, in_progress, completed, cancelled)
- `priority` (enum: low, medium, high, urgent)
- `dueDate` (datetime, optional)
- `assignedTo` (string, optional)
- `createdAt` (datetime)
- `updatedAt` (datetime)
- `userId` (string)
- `subtasks` (array of Subtask)

### Subtask
- `id` (string)
- `title` (string)
- `description` (string)
- `completed` (boolean)
- `taskId` (string)
- `createdAt` (datetime)
- `updatedAt` (datetime)

---

## Notes & Best Practices

- Always include the `Authorization` header for all endpoints except `/auth/register` and `/auth/login`.
- Use the exact field names and types as shown in the documentation.
- All dates should be in ISO 8601 format (e.g., `2025-09-22T00:00:00.000Z`).
- Status values for tasks: `pending`, `in-progress` (will be stored as `in_progress`), `completed`, `cancelled`.
- Priority values: `low`, `medium`, `high`, `urgent`.
- All responses are JSON.
- Use Postman or similar tools to interact with the API (no curl required).

---

## Example Error Response
```json
{
  "success": false,
  "error": "Task not found"
}
```
