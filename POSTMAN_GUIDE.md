# Postman API Testing Guide

This guide will walk you through testing your Task Management API endpoints using Postman.

## Prerequisites

1. **Start your server** first:
   ```bash
   npm run dev
   ```
   The server should be running on `http://localhost:3000`

2. **Open Postman** (download from [postman.com](https://www.postman.com/downloads/) if you don't have it)

---

## Step 1: Test Health Check Endpoint

**Verify your API is running:**

1. Create a new GET request
2. URL: `http://localhost:3000/`
3. Click **Send**
4. Expected Response (200 OK):
   ```json
   {
     "success": true,
     "message": "Task Management API is running",
     "version": "1.0.0",
     "timestamp": "2024-01-15T10:30:00.000Z"
   }
   ```

---

## Step 2: Register a New User

**Create your first user account:**

1. Create a new **POST** request
2. URL: `http://localhost:3000/api/auth/register`
3. Go to **Headers** tab:
   - Key: `Content-Type`
   - Value: `application/json`
4. Go to **Body** tab:
   - Select **raw**
   - Select **JSON** from dropdown
   - Enter:
     ```json
     {
       "email": "john@example.com",
       "password": "password123",
       "name": "John Doe"
     }
     ```
5. Click **Send**
6. **Expected Response (201 Created):**
   ```json
   {
     "success": true,
     "message": "User registered successfully",
     "data": {
       "user": {
         "id": "clx123abc456",
         "email": "john@example.com",
         "name": "John Doe",
         "createdAt": "2024-01-15T10:30:00.000Z",
         "updatedAt": "2024-01-15T10:30:00.000Z"
       },
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     }
   }
   ```
7. **⚠️ IMPORTANT:** Copy the `token` from the response - you'll need it for protected routes!

---

## Step 3: Login (Get a Token)

**If you already have an account:**

1. Create a new **POST** request
2. URL: `http://localhost:3000/api/auth/login`
3. Headers:
   - `Content-Type`: `application/json`
4. Body (raw, JSON):
   ```json
   {
     "email": "john@example.com",
     "password": "password123"
   }
   ```
5. Click **Send**
6. Copy the `token` from the response

---

## Step 4: Set Up Authentication in Postman

**To avoid copying the token for every request:**

### Option A: Environment Variables (Recommended)

1. Click **Environments** in the left sidebar (or the eye icon)
2. Click **+** to create a new environment
3. Name it: `Task Management API`
4. Add a variable:
   - Variable: `token`
   - Initial Value: (paste your token here)
   - Current Value: (will auto-update)
5. Click **Save**
6. Select this environment from the dropdown (top right)

### Option B: Collection Variable

1. Create a new Collection: **Task Management API**
2. Go to the Collection's **Variables** tab
3. Add variable: `token` = (your token value)
4. Save

### Option C: Manual Header (Quick Test)

For each protected request, add:
- Key: `Authorization`
- Value: `Bearer YOUR_TOKEN_HERE`

---

## Step 5: Test Protected Endpoints

### 5.1 Get Current User Profile

1. Create **GET** request
2. URL: `http://localhost:3000/api/auth/me`
3. Headers:
   - `Authorization`: `Bearer {{token}}` (if using environment variable)
   - OR: `Bearer YOUR_TOKEN_HERE`
4. Click **Send**
5. Expected Response (200 OK): Your user data

---

### 5.2 Get All Tasks

1. Create **GET** request
2. URL: `http://localhost:3000/api/tasks`
3. Headers:
   - `Authorization`: `Bearer {{token}}`
4. Click **Send**
5. Expected Response (200 OK): Empty array `[]` if no tasks yet

---

### 5.3 Create a New Task

1. Create **POST** request
2. URL: `http://localhost:3000/api/tasks`
3. Headers:
   - `Authorization`: `Bearer {{token}}`
   - `Content-Type`: `application/json`
4. Body (raw, JSON):
   ```json
   {
     "title": "Complete project documentation",
     "description": "Write comprehensive API documentation for the task management system",
     "status": "pending",
     "priority": "high",
     "dueDate": "2024-01-25T00:00:00.000Z"
   }
   ```
5. Click **Send**
6. Expected Response (201 Created): Created task with ID

**Note:** Status can be: `pending`, `in_progress`, `completed`, `cancelled`  
Priority can be: `low`, `medium`, `high`, `urgent`

---

### 5.4 Get Task by ID

1. Create **GET** request
2. URL: `http://localhost:3000/api/tasks/{taskId}`
   - Replace `{taskId}` with actual task ID from previous response
   - Example: `http://localhost:3000/api/tasks/clx456def789`
3. Headers:
   - `Authorization`: `Bearer {{token}}`
4. Click **Send**
5. Expected Response (200 OK): Task details with subtasks

---

### 5.5 Update a Task

1. Create **PUT** request
2. URL: `http://localhost:3000/api/tasks/{taskId}`
3. Headers:
   - `Authorization`: `Bearer {{token}}`
   - `Content-Type`: `application/json`
4. Body (raw, JSON):
   ```json
   {
     "status": "in_progress",
     "priority": "urgent"
   }
   ```
   (Only include fields you want to update)
5. Click **Send**
6. Expected Response (200 OK): Updated task

**Note:** Use `in-progress` (kebab-case) in request, but API returns `in_progress` (snake_case)

---

### 5.6 Delete a Task

1. Create **DELETE** request
2. URL: `http://localhost:3000/api/tasks/{taskId}`
3. Headers:
   - `Authorization`: `Bearer {{token}}`
4. Click **Send**
5. Expected Response (200 OK): Deleted task details

---

### 5.7 Get All Subtasks for a Task

1. Create **GET** request
2. URL: `http://localhost:3000/api/tasks/{taskId}/subtasks`
3. Headers:
   - `Authorization`: `Bearer {{token}}`
4. Click **Send**
5. Expected Response (200 OK): Array of subtasks

---

### 5.8 Create a Subtask

1. Create **POST** request
2. URL: `http://localhost:3000/api/tasks/{taskId}/subtasks`
3. Headers:
   - `Authorization`: `Bearer {{token}}`
   - `Content-Type`: `application/json`
4. Body (raw, JSON):
   ```json
   {
     "title": "Write authentication section",
     "description": "Document all auth endpoints",
     "completed": false
   }
   ```
5. Click **Send**
6. Expected Response (201 Created): Created subtask

---

### 5.9 Get Subtask by ID

1. Create **GET** request
2. URL: `http://localhost:3000/api/subtasks/{subtaskId}`
3. Headers:
   - `Authorization`: `Bearer {{token}}`
4. Click **Send**
5. Expected Response (200 OK): Subtask details

---

### 5.10 Update a Subtask

1. Create **PUT** request
2. URL: `http://localhost:3000/api/subtasks/{subtaskId}`
3. Headers:
   - `Authorization`: `Bearer {{token}}`
   - `Content-Type`: `application/json`
4. Body (raw, JSON):
   ```json
   {
     "completed": true,
     "title": "Updated subtask title"
   }
   ```
5. Click **Send**
6. Expected Response (200 OK): Updated subtask

---

### 5.11 Delete a Subtask

1. Create **DELETE** request
2. URL: `http://localhost:3000/api/subtasks/{subtaskId}`
3. Headers:
   - `Authorization`: `Bearer {{token}}`
4. Click **Send**
5. Expected Response (200 OK): Deleted subtask details

---

## Common Errors and Solutions

### Error: 401 Unauthorized

**Problem:** Missing or invalid token

**Solution:**
- Check that `Authorization` header is set
- Format: `Bearer YOUR_TOKEN`
- Make sure token is valid (not expired)
- Try logging in again to get a new token

### Error: 404 Not Found

**Problem:** Resource doesn't exist or wrong URL

**Solution:**
- Verify the resource ID is correct
- Check the URL path matches the API documentation
- Ensure you're using the correct HTTP method

### Error: 400 Bad Request

**Problem:** Invalid request data

**Solution:**
- Check JSON format is valid
- Verify required fields are included
- Check field types match expected format
- For status, use: `pending`, `in-progress`, `completed`, `cancelled`

### Error: 500 Internal Server Error

**Problem:** Server error

**Solution:**
- Check server logs in terminal
- Verify database connection
- Ensure server is running

---

## Postman Collection Setup (Optional)

Create a Postman Collection for easy testing:

1. Click **New** → **Collection**
2. Name it: **Task Management API**
3. Add all your requests to this collection
4. Set Collection-level Authorization:
   - Go to Collection → **Authorization** tab
   - Type: **Bearer Token**
   - Token: `{{token}}`
   - This applies to all requests in the collection
5. Add requests as **Collection Requests**

---

## Quick Test Flow

**Complete workflow to test all endpoints:**

1. ✅ `GET /` - Health check
2. ✅ `POST /api/auth/register` - Register user (copy token)
3. ✅ `GET /api/auth/me` - Get profile (use token)
4. ✅ `POST /api/tasks` - Create task (use token, copy task ID)
5. ✅ `GET /api/tasks` - List all tasks (use token)
6. ✅ `GET /api/tasks/{id}` - Get specific task (use token)
7. ✅ `PUT /api/tasks/{id}` - Update task (use token)
8. ✅ `POST /api/tasks/{id}/subtasks` - Create subtask (use token, copy subtask ID)
9. ✅ `GET /api/tasks/{id}/subtasks` - List subtasks (use token)
10. ✅ `PUT /api/subtasks/{id}` - Update subtask (use token)
11. ✅ `DELETE /api/subtasks/{id}` - Delete subtask (use token)
12. ✅ `DELETE /api/tasks/{id}` - Delete task (use token)

---

## Tips

1. **Save Requests:** Save commonly used requests for quick access
2. **Use Variables:** Store IDs in environment variables (e.g., `{{taskId}}`)
3. **Test Scripts:** Add test scripts in Postman to verify responses
4. **Import Collection:** Share collection with team via JSON export
5. **Documentation:** Add descriptions to each request in Postman

---

## Example Postman Test Script

Add this to your requests' **Tests** tab to verify responses:

```javascript
// Check status code
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Check response structure
pm.test("Response has success field", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
});

// Save token automatically (for login/register requests)
if (pm.response.json().data && pm.response.json().data.token) {
    pm.environment.set("token", pm.response.json().data.token);
    console.log("Token saved automatically!");
}
```

---

For more details, see `API_DOC.md` for complete endpoint documentation.

Happy Testing! 🚀

