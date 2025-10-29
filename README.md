# AI Research Assistant – Dual AI Research Platform
**A full-stack web app combining ChatGPT (OpenAI) and Gemini (Google AI) for dual-perspective research reports.**

---

## 🚀 Tech Stack

| **Frontend** | **Backend** | **Database & Auth** | **Integrations** |
|---------------|-------------|----------------------|------------------|
| React 19.1.1 | Node.js + Express 4.21 | PostgreSQL | OpenAI API (ChatGPT) |
| Vite 7.1.7 | Passport.js 0.7.0 | JWT + bcryptjs | Google Generative AI (Gemini) |
| React Router 7.9.4 | PDFKit 0.15.0 |  | SendGrid Email |
| Axios 1.12.2 |  |  |  |
| CSS Modules |  |  |  |

---

## 🧩 Database Schema (PostgreSQL)

### **users**
| Column | Type | Details |
|--------|------|----------|
| id | SERIAL PRIMARY KEY | |
| username | VARCHAR(50) UNIQUE NOT NULL | |
| email | VARCHAR(100) UNIQUE NOT NULL | |
| password_hash | VARCHAR(255) NOT NULL | bcrypt-hashed |
| is_premium | BOOLEAN DEFAULT FALSE | 5 vs 20 chats/day |
| created_at | TIMESTAMP DEFAULT NOW() | |
| updated_at | TIMESTAMP DEFAULT NOW() | |

---

### **chats**
| Column | Type | Details |
|--------|------|----------|
| id | SERIAL PRIMARY KEY | |
| user_id | INTEGER REFERENCES users(id) ON DELETE CASCADE | |
| title | VARCHAR(255) NOT NULL | AI-generated |
| is_completed | BOOLEAN DEFAULT FALSE | |
| has_error | BOOLEAN DEFAULT FALSE | |
| created_at | TIMESTAMP DEFAULT NOW() | |
| updated_at | TIMESTAMP DEFAULT NOW() | |

---

### **messages**
| Column | Type | Details |
|--------|------|----------|
| id | SERIAL PRIMARY KEY | |
| chat_id | INTEGER REFERENCES chats(id) ON DELETE CASCADE | |
| content | TEXT NOT NULL | |
| is_user | BOOLEAN NOT NULL | User or AI |
| created_at | TIMESTAMP DEFAULT NOW() | |

---

### **user_daily_chats**
| Column | Type | Details |
|--------|------|----------|
| id | SERIAL PRIMARY KEY | |
| user_id | INTEGER REFERENCES users(id) ON DELETE CASCADE | |
| date | DATE NOT NULL | |
| chat_count | INTEGER DEFAULT 0 | Daily counter |
| created_at | TIMESTAMP DEFAULT NOW() | |
| UNIQUE(user_id, date) | | One row per day |

---

**Relationships**
```
users (1) ───< (N) chats ───< (N) messages  
users (1) ───< (N) user_daily_chats
```

**Indexes**
```
idx_chats_user_id ON chats(user_id)
idx_messages_chat_id ON messages(chat_id)
idx_user_daily_chats_user_date ON user_daily_chats(user_id, date)
```

---

## ⚙️ Installation Guide

### **Prerequisites**
- Node.js v18+
- PostgreSQL 12+
- npm or yarn
- OpenAI API key
- Google AI API key
- SendGrid API key
- (Optional) Google OAuth credentials

---

### **Step 1: Clone Repository**
```bash
git clone <repository-url>
cd project-root
```

---

### **Step 2: Backend Setup**
```bash
cd Backend/server
npm install
```

Create your database:
```bash
psql -U postgres -c "CREATE DATABASE multi-api-research;"
```

Or use **Supabase** (recommended):
```env
SUPABASE_DB_URL=postgresql://user:pass@db.project.supabase.co:5432/postgres
```

Create `.env` file:
```env
# ============================================
# DATABASE CONFIGURATION
# ============================================
DB_HOST=localhost
DB_PORT=5432
DB_NAME=multi-api-research
DB_USER=postgres
DB_PASSWORD=your_password

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
SESSION_SECRET=generate-random-string
JWT_SECRET=generate-random-jwt-secret

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
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Initialize database:
```bash
npm run setup-db
```

Start server:
```bash
npm start
```
✅ Runs at [http://localhost:3000](http://localhost:3000)

---

### **Step 3: Frontend Setup**
```bash
cd Frontend/client
npm install
```

Create `.env`:
```env
VITE_API_URL=http://localhost:3000
```

Run dev server:
```bash
npm run dev
```

✅ Runs at [http://localhost:5173](http://localhost:5173)

---

## 🧠 Research Workflow

| Step | Description |
|------|--------------|
| 1️⃣ | User submits a research topic |
| 2️⃣ | ChatGPT generates clarifying questions |
| 3️⃣ | User answers those questions |
| 4️⃣ | Dual AI (ChatGPT + Gemini) generate parallel research |
| 5️⃣ | Frontend polls every 2 seconds for updates |
| 6️⃣ | User can email themselves a PDF report (SendGrid) |

---

## 🔗 API Endpoints

### **Authentication**
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/status` | Check auth status |
| GET | `/api/auth/google` | Google OAuth redirect |
| GET | `/api/auth/google/callback` | OAuth callback |
| POST | `/api/auth/oauth-complete` | Exchange OAuth token for JWT |
| POST | `/api/auth/logout` | Logout user |

---

### **Chat Management**
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/chats` | Get user’s chats |
| POST | `/api/chats` | Create new chat |
| GET | `/api/chats/:id` | Get chat info |
| GET | `/api/chats/:id/messages` | Get messages |

---

### **Research Workflow**
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/chats/:id/research-topic` | Submit research topic |
| POST | `/api/chats/:id/clarification-answer` | Submit clarifying question answer |

---

### **Email**
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/chats/:id/send-email` | Send research report via email |

---

### **User**
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/user/chat-count` | Get daily chat usage |
| GET | `/api/user/profile` | Get user profile |

---

### **Health**
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/` | Health check |
| GET | `/health` | Server status |

---

## 📁 Project Structure

```
project-root/
├── Backend/
│   └── server/
│       ├── config/
│       ├── database/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       ├── index.js
│       └── setup-db.js
│
└── Frontend/
    └── client/
        ├── src/
        │   ├── components/
        │   ├── hooks/
        │   ├── pages/
        │   ├── services/
        │   └── main.jsx
```

---

## 🌟 Key Features

✅ **Authentication**
- Local & Google OAuth  
- JWT-based auth (7-day expiry)  
- bcrypt password hashing  

✅ **Chat Management**
- Unlimited chat history  
- Daily chat limits (5 free / 20 premium)  
- Auto-generated titles  

✅ **Dual AI Research**
- Clarifying questions  
- Parallel ChatGPT + Gemini processing  
- Real-time polling every 2s  

✅ **Email Reports**
- PDFKit for report generation  
- Clickable links  
- Executive summary & AI comparison  
- Sent via SendGrid  

✅ **UI/UX**
- Responsive design  
- Smooth chat scrolling  
- Keyboard shortcuts  
- Real-time loading states  

---

## 🧰 Development Commands

**Backend**
```bash
cd Backend/server
npm install
npm run setup-db
npm start
```

**Frontend**
```bash
cd Frontend/client
npm install
npm run dev
npm run build
npm run preview
```

---

## ☁️ Deployment

### **Backend (Render.com)**
1. Push to GitHub  
2. Connect to Render  
3. Select **Web Service**  
4. Build: `npm install`  
5. Start: `node index.js`  
6. Add `.env` variables  
7. Deploy 🚀

### **Frontend (Vercel)**
1. Import project  
2. Framework: **Vite**  
3. Root: `Frontend/client`  
4. Build: `npm run build`  
5. Output: `dist`  
6. Add env: `VITE_API_URL=<backend-url>`  
7. Deploy 🚀

### **Database (Supabase)**
1. Create project  
2. Copy connection string  
3. Add to `.env`  
4. Run:
```bash
npm run setup-db
```

---

## ✨ Author
**Arshit Jain**  
💻 Full-stack Developer | AI Enthusiast  
📧 [Contact via Email](arshit@ualberta.ca)
