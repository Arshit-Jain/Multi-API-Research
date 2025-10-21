================================================================================
  AI RESEARCH ASSISTANT - DUAL AI RESEARCH PLATFORM
================================================================================

A full-stack application combining ChatGPT (OpenAI) and Gemini (Google AI)
for comprehensive dual-perspective research reports.

================================================================================
  TECHNOLOGY STACK
================================================================================

FRONTEND
  - React 19.1.1          | Modern UI framework
  - Vite 7.1.7            | Fast build tool
  - React Router 7.9.4    | Client-side routing
  - Axios 1.12.2          | HTTP client with JWT
  - CSS Modules           | Scoped styling

BACKEND
  - Node.js + Express 4.21 | REST API server
  - PostgreSQL            | Relational database
  - Passport.js 0.7.0     | Authentication
  - JWT (jsonwebtoken)    | Token-based auth
  - OpenAI 6.6.0          | ChatGPT integration
  - Google Generative AI  | Gemini integration
  - SendGrid 8.1.3        | Email service
  - PDFKit 0.15.0         | PDF generation
  - bcryptjs 2.4.3        | Password hashing

================================================================================
  DATABASE SCHEMA (PostgreSQL)
================================================================================

┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: users                                                            │
├──────────────────┬─────────────────────────────────┬───────────────────┤
│ id               │ SERIAL PRIMARY KEY              │                   │
│ username         │ VARCHAR(50) UNIQUE NOT NULL     │                   │
│ email            │ VARCHAR(100) UNIQUE NOT NULL    │                   │
│ password_hash    │ VARCHAR(255) NOT NULL           │ bcrypt hashed     │
│ is_premium       │ BOOLEAN DEFAULT FALSE           │ 5 vs 20 chats/day │
│ created_at       │ TIMESTAMP DEFAULT NOW()         │                   │
│ updated_at       │ TIMESTAMP DEFAULT NOW()         │                   │
└──────────────────┴─────────────────────────────────┴───────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: chats                                                            │
├──────────────────┬─────────────────────────────────┬───────────────────┤
│ id               │ SERIAL PRIMARY KEY              │                   │
│ user_id          │ INTEGER REFERENCES users(id)    │ ON DELETE CASCADE │
│ title            │ VARCHAR(255) NOT NULL           │ AI-generated      │
│ is_completed     │ BOOLEAN DEFAULT FALSE           │ Research complete │
│ has_error        │ BOOLEAN DEFAULT FALSE           │ Error occurred    │
│ created_at       │ TIMESTAMP DEFAULT NOW()         │                   │
│ updated_at       │ TIMESTAMP DEFAULT NOW()         │                   │
└──────────────────┴─────────────────────────────────┴───────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: messages                                                         │
├──────────────────┬─────────────────────────────────┬───────────────────┤
│ id               │ SERIAL PRIMARY KEY              │                   │
│ chat_id          │ INTEGER REFERENCES chats(id)    │ ON DELETE CASCADE │
│ content          │ TEXT NOT NULL                   │ Message text      │
│ is_user          │ BOOLEAN NOT NULL                │ User vs AI        │
│ created_at       │ TIMESTAMP DEFAULT NOW()         │                   │
└──────────────────┴─────────────────────────────────┴───────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: user_daily_chats                                                 │
├──────────────────┬─────────────────────────────────┬───────────────────┤
│ id               │ SERIAL PRIMARY KEY              │                   │
│ user_id          │ INTEGER REFERENCES users(id)    │ ON DELETE CASCADE │
│ date             │ DATE NOT NULL                   │                   │
│ chat_count       │ INTEGER DEFAULT 0               │ Daily counter     │
│ created_at       │ TIMESTAMP DEFAULT NOW()         │                   │
│                  │ UNIQUE(user_id, date)           │ One row per day   │
└──────────────────┴─────────────────────────────────┴───────────────────┘

RELATIONSHIPS:
  users (1) ────< (N) chats ────< (N) messages
  users (1) ────< (N) user_daily_chats

INDEXES:
  - idx_chats_user_id ON chats(user_id)
  - idx_messages_chat_id ON messages(chat_id)
  - idx_user_daily_chats_user_date ON user_daily_chats(user_id, date)

================================================================================
  INSTALLATION GUIDE
================================================================================

PREREQUISITES
  ✓ Node.js v18 or higher
  ✓ PostgreSQL 12 or higher
  ✓ npm or yarn
  ✓ OpenAI API key (ChatGPT)
  ✓ Google AI API key (Gemini)
  ✓ SendGrid API key (Email)
  ✓ Google OAuth credentials (Optional)

--------------------------------------------------------------------------------
STEP 1: CLONE REPOSITORY
--------------------------------------------------------------------------------

git clone <repository-url>
cd project-root

--------------------------------------------------------------------------------
STEP 2: BACKEND SETUP
--------------------------------------------------------------------------------

# Navigate to backend
cd Backend/server

# Install dependencies
npm install

# Create PostgreSQL database
psql -U postgres -c "CREATE DATABASE multi-api-research;"

# Or using Supabase (recommended for deployment)
# Get connection string from Supabase dashboard

# Create environment file

# ============================================
# DATABASE CONFIGURATION
# ============================================
# Option A: Supabase (recommended)
SUPABASE_DB_URL=postgresql://user:pass@db.project.supabase.co:5432/postgres

# Option B: Local PostgreSQL
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=multi-api-research
# DB_USER=postgres
# DB_PASSWORD=your_password

# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=3000
NODE_ENV=development
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# ============================================
# AUTHENTICATION
# ============================================
SESSION_SECRET=generate-random-string-here
JWT_SECRET=generate-random-jwt-secret-here

# ============================================
# AI SERVICES
# ============================================
OPENAI_API_KEY=sk-...your-openai-api-key
CHATGPT_MODEL=gpt-4o

GEMINI_API_KEY=...your-gemini-api-key
GEMINI_MODEL=gemini-2.0-flash-exp

# ============================================
# EMAIL SERVICE (SendGrid)
# ============================================
SENDGRID_API_KEY=SG...your-sendgrid-api-key
FROM_EMAIL=noreply@yourdomain.com

# ============================================
# GOOGLE OAUTH (Optional)
# ============================================
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret

# Initialize database (creates tables and demo users)
npm run setup-db

# Output:
# ✅ Database setup completed successfully!
# 📊 Tables created:
#   - users (with premium support)
#   - chats (user chat history)
#   - messages (chat messages)
#   - user_daily_chats (daily limits)
# 
# 💡 Free users: 5 chats/day

# Start backend server
npm start

# Server starts on http://localhost:3000
# ✅ Database connection test successful
# ✅ Routes registered successfully

--------------------------------------------------------------------------------
STEP 3: FRONTEND SETUP
--------------------------------------------------------------------------------

# Open new terminal
cd Frontend/client

# Install dependencies
npm install

# Create environment file
VITE_API_URL=http://localhost:3000

# Start development server
npm run dev

# Output:
#   VITE v7.1.7  ready in 500 ms
#   ➜  Local:   http://localhost:5173/
#   ➜  Network: use --host to expose

--------------------------------------------------------------------------------
STEP 4: ACCESS APPLICATION
--------------------------------------------------------------------------------

Open browser: http://localhost:5173

================================================================================
  RESEARCH WORKFLOW
================================================================================

STEP-BY-STEP PROCESS:

1. USER SUBMITS TOPIC
   └─> Enter research question or topic
   └─> Example: "Impact of AI on healthcare"

2. AI GENERATES CLARIFYING QUESTIONS
   └─> ChatGPT analyzes topic
   └─> Generates 2-4 specific questions
   └─> Auto-generates descriptive chat title

3. USER ANSWERS QUESTIONS
   └─> Answer each question sequentially
   └─> Refines research scope and focus

4. DUAL AI RESEARCH (Parallel)
   ├─> ChatGPT generates comprehensive research
   └─> Gemini generates comparative perspective

5. LIVE POLLING
   └─> Frontend polls every 2 seconds
   └─> Updates appear in real-time
   └─> Shows placeholder for pending reports

6. EMAIL DELIVERY
   └─> Click "Send Report via Email"
   └─> PDF generated with clickable links
   └─> Sent via SendGrid to user's email

================================================================================
  API ENDPOINTS
================================================================================

AUTHENTICATION
  POST   /api/auth/register          Register new user
  POST   /api/auth/login             Login with credentials
  GET    /api/auth/google            Google OAuth redirect
  GET    /api/auth/google/callback   OAuth callback
  POST   /api/auth/oauth-complete    Exchange OAuth token for JWT
  POST   /api/auth/logout            Logout user
  GET    /api/auth/status            Check auth status (JWT)

CHAT MANAGEMENT
  GET    /api/chats                  Get user's chats
  POST   /api/chats                  Create new chat
  GET    /api/chats/:id              Get chat info
  GET    /api/chats/:id/messages     Get chat messages
  
RESEARCH WORKFLOW
  POST   /api/chats/:id/research-topic          Submit research topic
  POST   /api/chats/:id/clarification-answer    Answer clarifying question

EMAIL
  POST   /api/chats/:id/send-email   Send research report via email

USER
  GET    /api/user/chat-count        Get daily chat count and limits
  GET    /api/user/profile           Get user profile

HEALTH
  GET    /                           Health check
  GET    /health                     Health status

================================================================================
  PROJECT STRUCTURE
================================================================================

project-root/
│
├── Backend/
│   └── server/
│       ├── config/
│       │   ├── constants.js            # Environment configuration
│       │   └── passport.js             # Google OAuth strategy
│       │
│       ├── database/
│       │   ├── connection.js           # PostgreSQL connection pool
│       │   ├── queries.js              # Database CRUD operations
│       │   └── schema.sql              # Table schemas & indexes
│       │
│       ├── middleware/
│       │   └── auth.js                 # JWT verification middleware
│       │
│       ├── routes/
│       │   ├── auth.js                 # Authentication routes
│       │   ├── chats.js                # Chat CRUD & research
│       │   ├── email.js                # Email sending endpoint
│       │   ├── health.js               # Health check routes
│       │   └── user.js                 # User profile routes
│       │
│       ├── services/
│       │   ├── emailService.js         # SendGrid + PDF generation
│       │   ├── gemini.js               # Google AI integration
│       │   └── openai.js               # ChatGPT integration
│       │
│       ├── .env.example                # Environment variables template
│       ├── .gitignore                  # Git ignore rules
│       ├── index.js                    # Express server entry point
│       ├── package.json                # Backend dependencies
│       ├── setup-db.js                 # Database initialization script
│       └── render.yaml                 # Render.com deployment config
│
└── Frontend/
    └── client/
        ├── src/
        │   ├── components/
        │   │   ├── ChatApp.jsx         # Main chat interface
        │   │   ├── ChatInput.jsx        # Message input component
        │   │   ├── Login.jsx            # Login form
        │   │   ├── Registration.jsx     # Registration form
        │   │   ├── MessageBubble.jsx    # Chat message display
        │   │   ├── Sidebar.jsx          # Chat history sidebar
        │   │   ├── MobileHeader.jsx     # Mobile navigation
        │   │   ├── LoadingScreen.jsx    # Loading indicator
        │   │   └── *.css                # Component styles
        │   │
        │   ├── hooks/
        │   │   ├── useAuth.js           # Authentication state
        │   │   ├── useChat.js           # Chat management
        │   │   └── useUI.js             # UI state management
        │   │
        │   ├── pages/
        │   │   ├── ChatPage.jsx         # Main chat page
        │   │   ├── LoginPage.jsx        # Login page with OAuth
        │   │   └── RegistrationPage.jsx # Registration page
        │   │
        │   ├── services/
        │   │   └── api.js               # Axios HTTP client
        │   │
        │   ├── App.jsx                  # Root component
        │   ├── App.css                  # Global styles
        │   └── main.jsx                 # React entry point
        │
        ├── .env.example                 # Environment template
        ├── .gitignore                   # Git ignore rules
        ├── index.html                   # HTML template
        ├── package.json                 # Frontend dependencies
        ├── vercel.json                  # Vercel deployment config
        └── vite.config.js               # Vite configuration

================================================================================
  KEY FEATURES
================================================================================

AUTHENTICATION
  ✓ Local authentication (username/email + password)
  ✓ Google OAuth 2.0 integration
  ✓ JWT-based stateless authentication (7-day expiry)
  ✓ Automatic token refresh
  ✓ Persistent sessions across browser restarts
  ✓ bcrypt password hashing

CHAT MANAGEMENT
  ✓ Unlimited chat history per user
  ✓ Daily limits: 5 (free) or 20 (premium) chats
  ✓ AI-generated descriptive titles
  ✓ Real-time message updates
  ✓ Chat state tracking (in-progress/completed/error)
  ✓ Mobile-responsive sidebar

RESEARCH WORKFLOW
  ✓ Intelligent topic clarification (2-4 questions)
  ✓ Dual AI perspective (ChatGPT + Gemini)
  ✓ Parallel research generation
  ✓ Live polling for research updates (2-second intervals)
  ✓ Placeholder indicators for pending reports
  ✓ No bold formatting (clean, readable output)

EMAIL REPORTS
  ✓ Professional PDF generation with PDFKit
  ✓ Clickable hyperlinks in PDF
  ✓ Separate sections for each AI
  ✓ Executive summary (AI-generated)
  ✓ Rich formatting (headers, lists, proper spacing)
  ✓ SendGrid delivery with error handling

UI/UX
  ✓ Mobile-first responsive design
  ✓ Smooth scrolling to latest messages
  ✓ Loading indicators and animations
  ✓ Error handling with user-friendly messages
  ✓ Auto-focus on chat input
  ✓ Keyboard shortcuts (Enter to send)

================================================================================
  DEVELOPMENT COMMANDS
================================================================================

BACKEND (Backend/server/)
  npm install              Install dependencies
  npm start                Start server (nodemon)
  npm run setup-db         Initialize database tables

FRONTEND (Frontend/client/)
  npm install              Install dependencies
  npm run dev              Start dev server (Vite)
  npm run build            Build for production
  npm run preview          Preview production build
  npm run lint             Run ESLint

================================================================================
  DEPLOYMENT
================================================================================

BACKEND (Render.com)
  1. Push code to GitHub
  2. Connect GitHub repo to Render
  3. Select "Web Service"
  4. Build Command: npm install
  5. Start Command: node index.js
  6. Add environment variables (see .env.example)
  7. Deploy

FRONTEND (Vercel)
  1. Push code to GitHub
  2. Import project to Vercel
  3. Framework: Vite
  4. Root Directory: Frontend/client
  5. Build Command: npm run build
  6. Output Directory: dist
  7. Add environment variable: VITE_API_URL=<backend-url>
  8. Deploy

DATABASE (Supabase)
  1. Create new project on Supabase
  2. Copy connection string
  3. Add to backend .env as SUPABASE_DB_URL
  4. Run npm run setup-db from local machine
  5. Tables created automatically
