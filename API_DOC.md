## Task Management API Documentation

### Base URL

- Local: `http://localhost:3000`
- Production: your deployed Render URL (e.g., `https://week22-task-management-deploy.onrender.com`)

All routes below are relative to the base URL.



### Authentication

- Scheme: JWT Bearer
- Header: `Authorization: Bearer <token>`
- Who needs it: All `/api` routes except `/api/auth/*` (register and login) require a valid token.
- Token payload: Must include `userId` (the middleware reads `decoded.userId`).

If the token is missing or invalid, responses look like:

```json
{
  "success": false,
  "message": "Access token required" | "Invalid token" | "Token expired" | "Authentication error"
}
```

### CORS

- CORS is enabled for all routes. You can call the API from browser-based clients.

### Content Type

- Send JSON bodies with `Content-Type: application/json`.

### Environment Variables

- `DATABASE_URL`: Postgres connection string
- `JWT_SECRET`: Secret used to sign/verify JWTs
- `PORT`: Port the server listens on (defaults to 3000)

### Data Models

User:
```json
{
  "id": "cuid",
  "email": "user@example.com",
  "name": "Jane Doe",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-02T00:00:00.000Z"
}
```

Task:
```json
{
  "id": "cuid",
  "title": "Write docs",
  "description": "Create API documentation",
  "status": "pending | in_progress | completed | cancelled",
  "priority": "low | medium | high | urgent",
  "dueDate": "2025-01-15T00:00:00.000Z",
  "assignedTo": "jane@example.com",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-02T00:00:00.000Z",
  "userId": "cuid",
  "subtasks": [Subtask]
}
```

Subtask:
```json
{
  "id": "cuid",
  "title": "Outline sections",
  "description": "Draft the structure",
  "completed": false,
  "taskId": "task_cuid",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-02T00:00:00.000Z"
}
```

Notes on status formatting:
- Requests may use `in-progress` (kebab-case). The API converts it to `in_progress` internally.
- Responses return the database enum value, e.g., `in_progress`.

### Error Shape

Task and subtask routes typically respond with:
```json
{ "success": false, "error": "Message here" }
```

Auth middleware and some routes use:
```json
{ "success": false, "message": "Message here" }
```

### Authentication Endpoints

Base: `/api/auth`

Note: Register and login logic need to be completed in code. Below is the intended contract.

- POST `/api/auth/register`
  - Public
  - Body:
  ```json
  {
    "email": "user@example.com",
    "password": "StrongPassword123!",
    "name": "Jane Doe"
  }
  ```
  - Response 201/200:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "cuid",
        "email": "user@example.com",
        "name": "Jane Doe"
      },
      "token": "<jwt>"
    }
  }
  ```
  - Errors: 400 (validation), 409 (email exists), 500 (server)

- POST `/api/auth/login`
  - Public
  - Body:
  ```json
  {
    "email": "user@example.com",
    "password": "StrongPassword123!"
  }
  ```
  - Response 200:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "cuid",
        "email": "user@example.com",
        "name": "Jane Doe"
      },
      "token": "<jwt>"
    }
  }
  ```
  - Errors: 400 (validation), 401 (invalid credentials), 500 (server)

- GET `/api/auth/me`
  - Protected (requires `Authorization: Bearer <token>`)
  - Response 200:
  ```json
  {
    "success": true,
    "data": {
      "id": "cuid",
      "email": "user@example.com",
      "name": "Jane Doe"
    }
  }
  ```
  - Errors: 401 (no/invalid token), 500

### Utility Endpoint

- GET `/api/protected`
  - Protected
  - Response 200:
  ```json
  {
    "success": true,
    "message": "This is a protected route",
    "user": {
      "id": "cuid",
      "email": "user@example.com",
      "name": "Jane Doe"
    }
  }
  ```

### Task Endpoints

Base: `/api`

All task and subtask endpoints are protected. Include `Authorization: Bearer <token>`.

- GET `/api/tasks`
  - Query: none
  - Response 200:
  ```json
  {
    "success": true,
    "count": 2,
    "data": [
      {
        "id": "task_cuid",
        "title": "Write docs",
        "description": "Create API documentation",
        "status": "in_progress",
        "priority": "high",
        "dueDate": "2025-01-15T00:00:00.000Z",
        "assignedTo": "jane@example.com",
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-02T00:00:00.000Z",
        "userId": "user_cuid",
        "subtasks": [
          {
            "id": "subtask_cuid",
            "title": "Outline sections",
            "description": "Draft the structure",
            "completed": false,
            "taskId": "task_cuid",
            "createdAt": "2025-01-01T00:00:00.000Z",
            "updatedAt": "2025-01-02T00:00:00.000Z"
          }
        ]
      }
    ]
  }
  ```
  - Errors: 500

- GET `/api/tasks/:id`
  - Params: `id` (task id)
  - Response 200:
  ```json
  {
    "success": true,
    "data": { /* Task (with subtasks) */ }
  }
  ```
  - Errors: 404 (not found), 500

- POST `/api/tasks`
  - Body:
  ```json
  {
    "title": "Write docs",
    "description": "Create API documentation",
    "status": "pending | in-progress | completed | cancelled",
    "priority": "low | medium | high | urgent",
    "dueDate": "2025-01-15T00:00:00.000Z",
    "assignedTo": "jane@example.com",
    "subtasks": [
      { "title": "Outline", "description": "Sections", "completed": false }
    ]
  }
  ```
  - Response 201:
  ```json
  {
    "success": true,
    "data": { /* Created Task with subtasks; status returned as in_progress if in-progress supplied */ }
  }
  ```
  - Errors: 400 (bad input), 500

- PUT `/api/tasks/:id`
  - Params: `id`
  - Body: Any updatable task fields. Notes:
    - If you send `status: "in-progress"`, it will be stored and returned as `"in_progress"`.
    - If you send `dueDate`, use an ISO date string.
  - Response 200:
  ```json
  {
    "success": true,
    "data": { /* Updated Task with subtasks */ }
  }
  ```
  - Errors: 404 (task not found), 400 (bad input), 500

- DELETE `/api/tasks/:id`
  - Params: `id`
  - Response 204 with JSON body (implementation detail):
  ```json
  {
    "success": true,
    "data": { /* Deleted Task snapshot */ }
  }
  ```
  - Note: Although status 204 typically has no body, this API currently returns a JSON body alongside 204.
  - Errors: 404 (not found), 500

### Subtask Endpoints

- GET `/api/tasks/:taskId/subtasks`
  - Params: `taskId`
  - Response 200:
  ```json
  {
    "success": true,
    "count": 3,
    "data": [ /* Subtask[] */ ]
  }
  ```
  - Errors: 404 (task not found or access denied), 500

- GET `/api/subtasks/:id`
  - Params: `id`
  - Response 200:
  ```json
  {
    "success": true,
    "data": { /* Subtask */ }
  }
  ```
  - Errors: 404 (not found or access denied), 500

- POST `/api/tasks/:taskId/subtasks`
  - Params: `taskId`
  - Body:
  ```json
  {
    "title": "Outline",
    "description": "Sections",
    "completed": false
  }
  ```
  - Response 201:
  ```json
  {
    "success": true,
    "data": { /* Created Subtask */ }
  }
  ```
  - Errors: 404 (task not found or access denied), 400 (bad input)

- PUT `/api/subtasks/:id`
  - Params: `id`
  - Body: Any updatable subtask fields (`title`, `description`, `completed`)
  - Response 200:
  ```json
  {
    "success": true,
    "data": { /* Updated Subtask */ }
  }
  ```
  - Errors: 404 (not found or access denied), 400 (bad input)

- DELETE `/api/subtasks/:id`
  - Params: `id`
  - Response 204 with JSON body (implementation detail):
  ```json
  {
    "success": true,
    "data": { /* Deleted Subtask snapshot */ }
  }
  ```
  - Errors: 404 (not found or access denied), 500

### Common Headers for Postman

- For public endpoints (register, login):
  - `Content-Type: application/json`
- For protected endpoints:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`

### Status Codes Summary

- 200: Successful GET/PUT
- 201: Resource created
- 204: Resource deleted (note: current implementation still sends JSON body)
- 400: Bad request/validation error
- 401: Unauthorized (missing/invalid/expired token)
- 404: Not found or access denied
- 500: Server error

### Notes and Limitations

- Pagination, filtering, and sorting are not implemented for tasks/subtasks.
- Task status values are enums: `pending`, `in_progress`, `completed`, `cancelled`.
- Priority values are enums: `low`, `medium`, `high`, `urgent`.
- Date fields should be ISO 8601 strings.


