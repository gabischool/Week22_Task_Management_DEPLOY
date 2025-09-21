# Week 22: Task Management Deployment

## Introduction

- You have learned almost everything you need to know on how to build a backend application with NodeJS, now it's time to deploy your project to the internet so people can access the endpoints you created.

### Task 1: Project Setup

1. Fork and Clone this project repository in your terminal
2. CD into the project base directory `cd Week22_Task_Management_DEPLOY`
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory with your database URL and JWT secret
5. Complete the authentication middleware and routes (see tasks below)
6. Generate Prisma client and push schema to database:
   ```bash
   npm run db:generate
   npm run db:push
   ```
7. Start the server:
   ```bash
   npm run dev
   ```
8. The server will run on `http://localhost:3000`

### Task 2: MVP: Add HTTP Status Codes

In the `routes/tasks.js` file, you need to add proper HTTP status codes to all the response objects. Currently, all responses are missing status codes and only return JSON data.

**Requirements:**

- Add appropriate HTTP status codes to all `res.json()` calls
- Use the correct status codes for different scenarios:
  - `200` for successful GET, PUT, DELETE operations
  - `201` for successful POST operations (resource creation)
  - `400` for bad requests (validation errors)
  - `404` for not found errors
  - `500` for server errors
- Look for the TODO comments in the code that indicate where status codes need to be added

### Task 3: MVP: API Documentation


## Task 4: MVP: Deployment to Render.com

Deploy your Task Management API to Render.com:

### Step 1: Create Render.com Account

1. Go to [render.com](https://render.com)
2. Sign up for a free account using your GitHub account
3. Verify your email address

### Step 2: Deploy Your Application

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Choose your repository and branch
4. Configure the following settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

### Step 3: Environment Variables

In your Render dashboard, add the following environment variables:

- `DATABASE_URL`: Your Supabase database connection URL
- `JWT_SECRET`: Your JWT secret key
- `PORT`: 10000 (Render's default port)

### Step 4: Database Setup

Make sure your Supabase database is accessible from Render and run the following commands in your Render build process:

```bash
npm run db:generate
npm run db:push
```

Your API will be available at the URL provided by Render (e.g., `https://your-app-name.onrender.com`)

Good luck with your implementation! 🚀
