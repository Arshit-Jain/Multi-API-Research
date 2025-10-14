# pgAdmin4 Setup Guide

## Step 1: Get Your PostgreSQL Credentials

### From pgAdmin4:
1. **Open pgAdmin4**
2. **Right-click on "PostgreSQL 15"** in the left panel
3. **Select "Properties"**
4. **Go to "Connection" tab**
5. **Copy these values:**
   - **Host**: (usually `localhost`)
   - **Port**: (usually `5432`)
   - **Username**: (usually `postgres`)
   - **Password**: (the password you set during installation)

## Step 2: Create Database in pgAdmin4

### Method 1: Using pgAdmin4 GUI
1. **Right-click on "Databases"** in the left panel
2. **Select "Create" → "Database..."**
3. **Database name**: `multi-api-research`
4. **Click "Save"**

### Method 2: Using SQL Query
1. **Click on "Tools" → "Query Tool"**
2. **Paste this SQL:**
   ```sql
   CREATE DATABASE "multi-api-research";
   ```
3. **Click "Execute" (F5)**

## Step 3: Create .env File

Create a file named `.env` in the server directory with your credentials:

```bash
# Replace with your actual values from pgAdmin4
DB_HOST=localhost
DB_PORT=5432
DB_NAME=multi-api-research
DB_USER=postgres
DB_PASSWORD=your_actual_password_here
SESSION_SECRET=your-secret-key-change-in-production
PORT=3000
```

## Step 4: Test Connection

```bash
cd server
npm run test-connection
```

## Step 5: Setup Database Tables

```bash
npm run setup-db
```

## Step 6: Start Server

```bash
npm start
```

## Troubleshooting

### If you get "password authentication failed":

1. **Check your password in pgAdmin4:**
   - Right-click on PostgreSQL 15 → Properties → Connection
   - Verify the password is correct

2. **Try connecting with psql:**
   ```bash
   psql -U postgres -h localhost -d multi-api-research
   ```

3. **Reset password if needed:**
   - In pgAdmin4, go to Tools → Query Tool
   - Run: `ALTER USER postgres PASSWORD 'newpassword';`

### If you get "database does not exist":

1. **Create database in pgAdmin4:**
   - Right-click on Databases → Create → Database
   - Name: `multi-api-research`

2. **Or use SQL:**
   ```sql
   CREATE DATABASE "multi-api-research";
   ```

### If you get "permission denied":

1. **Grant permissions in pgAdmin4:**
   - Tools → Query Tool
   - Run: `GRANT ALL PRIVILEGES ON DATABASE "multi-api-research" TO postgres;`

## Quick Commands

```bash
# Test connection
npm run test-connection

# Setup database (after connection works)
npm run setup-db

# Start server
npm start
```

## Verification

After setup, you should see these tables in pgAdmin4:
- `users` (with premium support)
- `chats` (user chat history)
- `messages` (chat messages)
- `user_daily_chats` (daily limits)

And these default users:
- `admin` (premium user, password: admin123)
- `user` (free user, password: user123)
