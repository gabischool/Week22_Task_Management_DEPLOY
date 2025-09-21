Task Management API Documentation

Overview
This API provides endpoints for managing tasks and subtasks for authenticated users. Users own tasks; each task can have multiple subtasks. All task-related endpoints are protected and require a valid JWT bearer token.

Important notes about current implementation
- Authentication endpoints (/api/auth/register and /api/auth/login) are scaffolded but not implemented. They do not currently return tokens. See Authentication section for guidance.
- Task and Subtask routes are protected by JWT middleware and require an Authorization: Bearer <token> header.
- In the current code, some routes respond without explicit HTTP status codes (defaulting to 200), even on error. The “Intended status codes” are documented below as guidance for production behavior.

Base URL
- Local development :`https://week22-task-management-deploy-4pcd.onrender.com`
- API base path: /api
- Full examples:
  - Tasks list: GET `http://localhost:3000/api/tasks`
  - Auth profile: GET `http://localhost:3000/api/auth/me`

Content types
- Request and Response format: JSON
- Required headers for requests with a body:
  - Content-Type: application/json
  - Accept: application/json

Authentication
- Scheme: Bearer JWT (HS256)
- Header: Authorization: Bearer <token>
- Required claim: userId (string). The middleware expects decoded.userId to exist and will look up the user by this id.
- Token expiration: Supported by middleware (TokenExpiredError handled) if the token includes an exp claim. The current code that issues tokens is not implemented; if you mint tokens externally, include exp as desired.
- User object in request: After successful authentication, req.user contains { id, email, name } of the current user.

Obtaining a token (current state)
- The following endpoints are mounted but currently not implemented (no response body is returned due to TODOs):
  - POST /api/auth/register
  - POST /api/auth/login
- For testing, you must seed a user in the database and mint a JWT externally using the same JWT_SECRET with payload similar to:
  {
    "userId": "<cuid-of-existing-user>",
    "iat": 1730000000,
    "exp": 1732592000
  }
- Example to mint a token in Node.js REPL:
  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ userId: '<user-id>' }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });

Environment variables
- PORT: Port the server listens on (default 3000)
- DATABASE_URL: PostgreSQL connection string for Prisma
- JWT_SECRET: Secret used to sign/verify JWT tokens (default "your-secret-key"; do not use default in production)
- NODE_ENV: development | production

Data models (Prisma)
User
- id: string (cuid)
- email: string (unique)
- password: string
- name: string
- createdAt: DateTime
- updatedAt: DateTime
- tasks: Task[]

Task
- id: string (cuid)
- title: string (required)
- description: string (required)
- status: enum TaskStatus (required)
  - Values: pending | in_progress | completed | cancelled
  - Input convenience: API accepts "in-progress" and converts to "in_progress" internally
- priority: enum Priority (required)
  - Values: low | medium | high | urgent
- dueDate: DateTime? (ISO 8601 string in requests)
- assignedTo: string? (free-form)
- userId: string (owner)
- createdAt: DateTime
- updatedAt: DateTime
- subtasks: Subtask[]

Subtask
- id: string (cuid)
- title: string (required)
- description: string (required)
- completed: boolean (default false)
- taskId: string (parent task id)
- createdAt: DateTime
- updatedAt: DateTime

Cascades
- Deleting a Task cascades to delete its Subtasks.

Error format (current behavior)
- On errors, routes typically return:
  {
    "success": false,
    "error": "<message>"
  }
- Note: Some error responses currently return HTTP 200 due to missing status codes in early route definitions. Intended status codes are listed per endpoint below.

Authentication routes
POST /api/auth/register  [NOT IMPLEMENTED]
- Description: Register a new user and return a JWT.
- Auth: Public
- Request body (JSON):
  {
    "email": "user@example.com",
    "password": "<strong-password>",
    "name": "Jane Doe"
  }
- Intended success response 201:
  {
    "success": true,
    "data": {
      "user": { "id": "usr_cuid", "email": "user@example.com", "name": "Jane Doe" },
      "token": "<jwt>"
    }
  }
- Intended error responses:
  - 400 Bad Request (validation)
  - 409 Conflict (email already in use)
  - 500 Server Error

POST /api/auth/login  [NOT IMPLEMENTED]
- Description: Authenticate a user and return a JWT.
- Auth: Public
- Request body (JSON):
  {
    "email": "user@example.com",
    "password": "<password>"
  }
- Intended success response 200:
  {
    "success": true,
    "data": {
      "user": { "id": "usr_cuid", "email": "user@example.com", "name": "Jane Doe" },
      "token": "<jwt>"
    }
  }
- Intended error responses:
  - 401 Unauthorized (invalid credentials)
  - 400 Bad Request (validation)
  - 500 Server Error

GET /api/auth/me
- Description: Get profile of the authenticated user.
- Auth: Bearer token required
- Headers: Authorization: Bearer <token>
- Success response 200:
  {
    "success": true,
    "data": { "id": "usr_cuid", "email": "user@example.com", "name": "Jane Doe" }
  }
- Error responses:
  - 401 Unauthorized: { "success": false, "message": "Access token required" | "Invalid token" | "Token expired" | "User not found" }
  - 500 Server Error

Protected example route
GET /api/protected
- Description: Example protected route showing shape of req.user after authentication.
- Auth: Bearer token required
- Success response 200:
  {
    "success": true,
    "message": "This is a protected route",
    "user": { "id": "usr_cuid", "email": "user@example.com", "name": "Jane Doe" }
  }

Tasks routes (all protected)
Common headers
- Authorization: Bearer <token>
- Accept: application/json

Model notes
- Task listing is ordered by createdAt desc.
- Subtask listing by task is ordered by createdAt asc.
- Status input supports "in-progress" convenience value; otherwise use enum literals listed above.
- dueDate accepts ISO 8601 strings; server converts to Date.

GET /api/tasks
- Description: List all tasks for the authenticated user (includes subtasks).
- Query params: none (no pagination/filters are currently implemented)
- Success response (current behavior): 200
  {
    "success": true,
    "count": <number>,
    "data": [
      {
        "id": "task_cuid",
        "title": "...",
        "description": "...",
        "status": "pending" | "in_progress" | "completed" | "cancelled",
        "priority": "low" | "medium" | "high" | "urgent",
        "dueDate": "2025-01-31T00:00:00.000Z" | null,
        "assignedTo": "..." | null,
        "userId": "usr_cuid",
        "createdAt": "...",
        "updatedAt": "...",
        "subtasks": [ { "id": "sub_cuid", "title": "...", "description": "...", "completed": false, "taskId": "task_cuid", "createdAt": "...", "updatedAt": "..." } ]
      }
    ]
  }
- Error responses (current behavior): 200 with success=false and error message on server error
- Intended status codes: 200 success, 500 server error

GET /api/tasks/:id
- Description: Get a single task by id (includes subtasks). Only tasks you own are visible.
- Path params: id (string cuid)
- Success response (current behavior): 200 success with data
- Not found (current behavior): 200 { success: false, error: "Task not found" }
- Intended status codes: 200 success, 404 not found, 500 server error

POST /api/tasks
- Description: Create a new task (optionally with subtasks).
- Request body (JSON):
  {
    "title": "Write docs",
    "description": "Create API documentation",
    "status": "pending" | "in-progress" | "completed" | "cancelled",
    "priority": "low" | "medium" | "high" | "urgent",
    "dueDate": "2025-01-31T00:00:00.000Z",      // optional
    "assignedTo": "jane@example.com",            // optional
    "subtasks": [                                  // optional
      { "title": "Outline", "description": "...", "completed": false }
    ]
  }
- Success response (current behavior): 200 with created task in data
- Validation error (current behavior): 200 with success=false and error
- Intended status codes: 201 created, 400 bad request

PUT /api/tasks/:id
- Description: Update a task by id. Only the owner can update.
- Path params: id (string cuid)
- Request body: Any subset of Task fields; status accepts "in-progress" convenience value; dueDate may be ISO string.
- Success response (current behavior): 200 with updated task in data
- Not found (current behavior): 200 with success=false and error="Task not found"
- Intended status codes: 200 success, 400 bad request, 404 not found

DELETE /api/tasks/:id
- Description: Delete a task by id. Cascades to subtasks. Only the owner can delete.
- Path params: id (string cuid)
- Success response (current behavior): 200 with deleted task snapshot in data (including its subtasks)
- Not found (current behavior): 200 with success=false and error="Task not found"
- Intended status codes: 200 success, 404 not found, 500 server error

Subtasks routes (all protected)
GET /api/tasks/:taskId/subtasks
- Description: List all subtasks for a given task you own.
- Path params: taskId (string cuid)
- Success response (current behavior): 200 with { success, count, data: [ ... ] }
- Not found or access denied (current behavior): 200 with success=false and message containing "not found" or "access denied"
- Intended status codes: 200 success, 404 not found or access denied, 500 server error

GET /api/subtasks/:id
- Description: Get a single subtask by id, only if it belongs to a task you own.
- Path params: id (string cuid)
- Success response (current behavior): 200 with subtask in data
- Not found or access denied (current behavior): 200 with success=false
- Intended status codes: 200 success, 404 not found or access denied, 500 server error

POST /api/tasks/:taskId/subtasks
- Description: Create a subtask under a task you own.
- Path params: taskId (string cuid)
- Request body (JSON):
  {
    "title": "Write curl examples",
    "description": "...",
    "completed": false
  }
- Success response (current behavior): 200 with created subtask in data
- Not found or access denied (current behavior): 200 with success=false
- Intended status codes: 201 created, 404 not found or access denied, 400 bad request

PUT /api/subtasks/:id
- Description: Update a subtask by id, only if it belongs to a task you own.
- Path params: id (string cuid)
- Request body (JSON): Any subset of { title, description, completed }
- Success response (current behavior): 200 with updated subtask in data
- Not found or access denied (current behavior): 200 with success=false
- Intended status codes: 200 success, 404 not found or access denied, 400 bad request

DELETE /api/subtasks/:id
- Description: Delete a subtask by id, only if it belongs to a task you own.
- Path params: id (string cuid)
- Success response (current behavior): 200 with deleted subtask in data
- Not found or access denied (current behavior): 200 with success=false
- Intended status codes: 200 success, 404 not found or access denied, 500 server error



Validation and constraints
- Required fields: Task.title, Task.description, Task.status, Task.priority; Subtask.title, Subtask.description
- Enums: Task.status and Task.priority must match allowed values ("in-progress" accepted and normalized)
- ID format: cuid strings
- Date format: ISO 8601 strings (e.g., 2025-01-31T00:00:00.000Z)

Pagination, filtering, sorting
- Pagination: Not implemented
- Filtering: Not implemented
- Sorting: Fixed order
  - Tasks: createdAt desc
  - Subtasks: createdAt asc

Security considerations
- Always supply Authorization header for protected routes
- Keep JWT_SECRET secure; change default value in production
- Use HTTPS in production environments

Change log / Roadmap (code TODOs observed)
- Implement /api/auth/register and /api/auth/login to return real tokens
- Align all routes to use proper HTTP status codes (some duplicates exist; remove earlier definitions without status codes)
- Add validation at the route level (e.g., using zod or Joi)
- Add pagination and filtering for task listings

Questions answered by this document
- What is the base URL? `https://week22-task-management-deploy-4pcd.onrender.com` (API under /api)
- How do I authenticate? Supply Authorization: Bearer <jwt> with a userId claim signed by JWT_SECRET
- What are the endpoints and payloads? See per-endpoint sections above with request/response examples and schemas
- What errors/status codes should I expect? See current vs intended behavior per endpoint above
