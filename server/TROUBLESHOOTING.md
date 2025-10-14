# PostgreSQL Connection Troubleshooting

## Quick Diagnosis

Run the connection test:
```bash
npm run test-connection
```

This will show you exactly what's wrong with your connection.

## Common Issues & Solutions

### 1. Password Authentication Failed (28P01)

**Error**: `password authentication failed for user "postgres"`

**Solutions**:

#### Option A: Reset PostgreSQL Password
```bash
# Connect as postgres user
sudo -u postgres psql

# Reset password
ALTER USER postgres PASSWORD 'your_new_password';

# Exit
\q
```

#### Option B: Use Trust Authentication (Development Only)
Edit PostgreSQL config file:
```bash
# Find config file
sudo find / -name "pg_hba.conf" 2>/dev/null

# Edit the file (replace with your path)
sudo nano /etc/postgresql/*/main/pg_hba.conf
```

Change this line:
```
local   all             postgres                                peer
```
To:
```
local   all             postgres                                trust
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

### 2. Database Does Not Exist (3D000)

**Error**: `database "multi-api research" does not exist`

**Solution**:
```bash
# Create the database
createdb "multi-api research"

# Or using psql
psql -U postgres -c "CREATE DATABASE \"multi-api research\";"
```

### 3. Connection Refused (ECONNREFUSED)

**Error**: `connect ECONNREFUSED`

**Solutions**:

#### macOS:
```bash
# Install PostgreSQL
brew install postgresql

# Start service
brew services start postgresql

# Or start manually
pg_ctl -D /usr/local/var/postgres start
```

#### Linux (Ubuntu/Debian):
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Windows:
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Install with default settings
3. Start PostgreSQL service from Services

### 4. Permission Denied

**Error**: `permission denied for database`

**Solution**:
```bash
# Grant permissions
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE \"multi-api research\" TO postgres;"
```

## Environment Configuration

Create `.env` file in server directory:
```bash
# Copy example
cp env.example .env

# Edit with your credentials
nano .env
```

Example `.env` content:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=multi-api research
DB_USER=postgres
DB_PASSWORD=your_actual_password
SESSION_SECRET=your-secret-key
```

## Manual Database Setup

If automatic setup fails, create database manually:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE "multi-api research";

# Exit psql
\q

# Run setup
npm run setup-db
```

## Testing Your Setup

1. **Test Connection**:
   ```bash
   npm run test-connection
   ```

2. **Test Database Creation**:
   ```bash
   npm run setup-db
   ```

3. **Test Server**:
   ```bash
   npm start
   ```

## Alternative: Use Different Database Name

If spaces in database name cause issues, use underscore:

1. Update `.env`:
   ```
   DB_NAME=multi_api_research
   ```

2. Create database:
   ```bash
   createdb multi_api_research
   ```

3. Run setup:
   ```bash
   npm run setup-db
   ```

## Still Having Issues?

1. **Check PostgreSQL Status**:
   ```bash
   # macOS
   brew services list | grep postgresql
   
   # Linux
   sudo systemctl status postgresql
   ```

2. **Check Port Usage**:
   ```bash
   lsof -i :5432
   ```

3. **Check PostgreSQL Logs**:
   ```bash
   # macOS
   tail -f /usr/local/var/log/postgres.log
   
   # Linux
   sudo tail -f /var/log/postgresql/postgresql-*.log
   ```

4. **Try Different User**:
   Create a new PostgreSQL user:
   ```bash
   sudo -u postgres createuser --interactive
   ```

## Quick Fix Commands

```bash
# 1. Stop any running PostgreSQL
sudo systemctl stop postgresql  # Linux
brew services stop postgresql   # macOS

# 2. Start PostgreSQL
sudo systemctl start postgresql  # Linux
brew services start postgresql   # macOS

# 3. Create database
createdb "multi-api research"

# 4. Test connection
npm run test-connection

# 5. Setup database
npm run setup-db
```
