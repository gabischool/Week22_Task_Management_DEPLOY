# Deployment Guide for Render.com

This guide will help you deploy your Task Management API to Render.com.

## Prerequisites

1. GitHub account with your project repository
2. Render.com account (free tier available)
3. Supabase database set up and accessible from Render

## Step-by-Step Deployment

### 1. Prepare Your Repository

Make sure your code is pushed to GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Create Render.com Account

1. Go to [render.com](https://render.com)
2. Click "Get Started for Free"
3. Sign up using your GitHub account
4. Verify your email address

### 3. Create a New Web Service

1. In your Render dashboard, click **"New +"**
2. Select **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select your repository: `Week22_Task_Management_DEPLOY`
5. Select the branch (usually `main`)

### 4. Configure Your Service

Use these settings:

**Basic Settings:**
- **Name**: `task-management-api` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `/` (leave blank)

**Build & Deploy:**
- **Build Command**: 
  ```bash
  npm install && npm run db:generate && npm run db:push
  ```
  Or alternatively:
  ```bash
  npm install
  ```
  (The `postinstall` script will automatically run `prisma generate`)

- **Start Command**: 
  ```bash
  npm start
  ```

- **Environment**: Select `Node`

**Advanced Settings:**
- **Auto-Deploy**: `Yes` (deploys automatically on git push)
- **Health Check Path**: `/` (optional, uses root endpoint)

### 5. Set Environment Variables

In the Render dashboard, navigate to **Environment** tab and add:

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | `your-supabase-connection-string` | Your Supabase pooled connection URL (port 6543) |
| `JWT_SECRET` | `your-secret-key` | A secure random string for JWT tokens |
| `PORT` | `10000` | Render's default port (or leave blank, it's auto-detected) |
| `NODE_ENV` | `production` | Environment setting |

**Important Notes:**
- Use the **Connection Pooling URL** from Supabase (port 6543) for `DATABASE_URL`
- Generate a strong `JWT_SECRET` using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Never commit these values to Git!

### 6. Database Setup on Render

The Prisma client generation and database push will happen during the build process. The build command includes:
- `npm install` - Installs dependencies
- `npm run db:generate` - Generates Prisma Client
- `npm run db:push` - Pushes schema to database

**Note:** If `db:push` fails during build, you can:
1. Run it manually via Render Shell after first deploy
2. Or remove `&& npm run db:push` from build command and run it manually once

### 7. Deploy

1. Click **"Create Web Service"**
2. Render will start building your application
3. Monitor the build logs in real-time
4. Once deployed, your API will be available at: `https://your-app-name.onrender.com`

### 8. Verify Deployment

Test your deployment:

**Health Check:**
```bash
curl https://your-app-name.onrender.com/
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Task Management API is running",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Test Registration:**
```bash
curl -X POST https://your-app-name.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User"
  }'
```

## Troubleshooting

### Build Fails

**Issue:** `prisma generate` fails
- **Solution:** Ensure Prisma is in `dependencies` (not just `devDependencies`)

**Issue:** `DATABASE_URL` not found
- **Solution:** Double-check environment variables are set correctly in Render dashboard

**Issue:** Database connection timeout
- **Solution:** Ensure your Supabase database allows connections from Render's IPs (usually enabled by default)

### Deployment Fails

**Issue:** App crashes on start
- **Solution:** Check Render logs for errors. Common issues:
  - Missing environment variables
  - Database connection issues
  - Port configuration problems

**Issue:** Health check fails
- **Solution:** Verify the root endpoint `/` is working locally first

### Database Issues

**Issue:** `db:push` fails during build
- **Solution:** Remove `db:push` from build command and run manually:
  1. Go to Render Shell
  2. Run: `npm run db:push`
  3. This only needs to be done once, or when schema changes

**Issue:** Connection pooler errors
- **Solution:** For migrations, you might need a direct connection. Add `DIRECT_URL` to environment variables and update `prisma/schema.prisma`:
  ```prisma
  datasource db {
    provider  = "postgresql"
    url       = env("DATABASE_URL")
    directUrl = env("DIRECT_URL")
  }
  ```

## Post-Deployment

### Update API Documentation

Update `API_DOC.md` with your production URL:
```markdown
**Production:** `https://your-app-name.onrender.com`
```

### Monitor Your Application

1. Check Render dashboard for metrics
2. Monitor logs for errors
3. Set up alerts if needed
4. Test endpoints regularly

### Keep Database in Sync

When you update your Prisma schema:
1. Update locally
2. Test locally
3. Push to GitHub
4. Render will auto-deploy
5. Run `npm run db:push` via Render Shell if needed

## Render.com Free Tier Limitations

- Services spin down after 15 minutes of inactivity
- First request after spin-down may be slow (~30 seconds)
- 750 hours/month free (enough for continuous uptime)
- Consider upgrading for production apps

## Security Checklist

- [ ] Strong `JWT_SECRET` set
- [ ] `DATABASE_URL` is secure and not committed
- [ ] CORS is properly configured (currently allows all origins)
- [ ] Environment variables are set in Render (not hardcoded)
- [ ] `.env` file is in `.gitignore`
- [ ] Database password is strong

## Next Steps

1. Test all API endpoints
2. Consider adding rate limiting
3. Set up monitoring/alerts
4. Configure custom domain (if needed)
5. Set up CI/CD workflows

## Support

- [Render Documentation](https://render.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)

Good luck with your deployment! 🚀

