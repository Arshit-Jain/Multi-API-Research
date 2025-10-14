# Database Setup Guide

## Prerequisites

1. **Install PostgreSQL** on your system
2. **Create a database** named `multi-api-research`

## Quick Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=chatgpt_clone
   DB_USER=postgres
   DB_PASSWORD=your_password
   SESSION_SECRET=your-secret-key
   ```

3. **Setup database:**
   ```bash
   npm run setup-db
   ```

4. **Start server:**
   ```bash
   npm start
   ```

## Database Schema

### Tables Created:

1. **users** - User accounts with premium support
   - `id` (Primary Key)
   - `username` (Unique)
   - `email` (Unique)
   - `password_hash` (Bcrypt hashed)
   - `is_premium` (Boolean)
   - `created_at`, `updated_at`

2. **chats** - User chat sessions
   - `id` (Primary Key)
   - `user_id` (Foreign Key to users)
   - `title` (Chat title)
   - `created_at`, `updated_at`

3. **messages** - Chat messages
   - `id` (Primary Key)
   - `chat_id` (Foreign Key to chats)
   - `content` (Message text)
   - `is_user` (Boolean: true for user, false for AI)
   - `created_at`

4. **user_daily_chats** - Daily chat limits tracking
   - `id` (Primary Key)
   - `user_id` (Foreign Key to users)
   - `date` (Date)
   - `chat_count` (Number of chats created today)

### Default Users:

- **admin** (Premium user)
  - Username: `admin`
  - Password: `admin123`
  - Email: `admin@example.com`
  - Premium: `true` (20 chats/day)

- **user** (Free user)
  - Username: `user`
  - Password: `user123`
  - Email: `user@example.com`
  - Premium: `false` (5 chats/day)

## Premium Features

### Chat Limits:
- **Free Users**: 5 new chats per day
- **Premium Users**: 20 new chats per day

### API Endpoints:

- `GET /api/chats` - Get user's chats
- `POST /api/chats` - Create new chat (with limit check)
- `GET /api/chats/:id/messages` - Get chat messages
- `POST /api/chats/:id/messages` - Send message
- `GET /api/user/chat-count` - Get daily chat count

## Troubleshooting

1. **Connection Error**: Check PostgreSQL is running and credentials are correct
2. **Permission Error**: Ensure database user has CREATE privileges
3. **Port Conflict**: Change DB_PORT in .env if needed

## Manual Database Creation

If you prefer to create the database manually:

```sql
CREATE DATABASE chatgpt_clone;
```

Then run the setup script to create tables and insert default data.
