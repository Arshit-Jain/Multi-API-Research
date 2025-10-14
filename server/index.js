import express from "express";
import cors from "cors";
import session from "express-session";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { userQueries, chatQueries, messageQueries, dailyChatQueries } from "./database/queries.js";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Initialize passport, must be after session middleware
app.use(passport.initialize());
app.use(passport.session());

// Serialize user (via ID)
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const user = await userQueries.findById(id);
        done(null, user);
    } catch (e) {
        done(e);
    }
});

// Passport Google Strategy
passport.use(new GoogleStrategy.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Use Google ID as username fallback
        let user = await userQueries.findByEmail(profile.emails[0].value);
        if (!user) {
            user = await userQueries.create(
                profile.displayName || profile.id,
                profile.emails[0].value,
                "google-oauth",
                false
            );
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

// Auth endpoint for Google
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
// Google callback
app.get("/auth/google/callback", passport.authenticate("google", {
    failureRedirect: "/login",
    session: true,
}), (req, res) => {
    // For API: Set session and respond with success (if you want frontend to handle it differently, adjust here)
    req.session.userId = req.user.id;
    req.session.username = req.user.username;
    // Instruct browser to redirect to client app after login
    res.redirect("http://localhost:5173"); // Or your frontend base URL
});

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: 'Authentication required', redirect: '/login' });
    }
};

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/welcome", (req, res) => {
  res.json({ message: "Welcome to the server" });
});

// Authentication routes
app.post("/api/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Basic validation
        if (!username || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                error: 'All fields are required' 
            });
        }
        
        // Check if username already exists
        const existingUser = await userQueries.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                error: 'Username already exists' 
            });
        }
        
        // Check if email already exists
        const existingEmail = await userQueries.findByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ 
                success: false, 
                error: 'Email already exists' 
            });
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid email format' 
            });
        }
        
        // Password length validation
        if (password.length < 6) {
            return res.status(400).json({ 
                success: false, 
                error: 'Password must be at least 6 characters long' 
            });
        }
        
        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);
        
        // Create new user
        const newUser = await userQueries.create(username, email, passwordHash, false);
        
        // Auto-login after registration
        req.session.userId = newUser.id;
        req.session.username = newUser.username;
        
        res.json({ 
            success: true, 
            user: { 
                id: newUser.id, 
                username: newUser.username, 
                email: newUser.email,
                is_premium: newUser.is_premium
            } 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});

app.post("/api/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await userQueries.findByUsername(username);
        
        if (user && await bcrypt.compare(password, user.password_hash)) {
            req.session.userId = user.id;
            req.session.username = user.username;
            
            // Update last login
            await userQueries.updateLastLogin(user.id);
            
            res.json({ 
                success: true, 
                user: { 
                    id: user.id, 
                    username: user.username, 
                    email: user.email,
                    is_premium: user.is_premium
                } 
            });
        } else {
            res.status(401).json({ 
                success: false, 
                error: 'Invalid credentials' 
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});

app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({ success: false, error: 'Could not log out' });
        } else {
            res.json({ success: true, message: 'Logged out successfully' });
        }
    });
});

app.get("/api/auth/status", async (req, res) => {
    try {
        if (req.session.userId) {
            const user = await userQueries.findById(req.session.userId);
            if (user) {
                res.json({ 
                    authenticated: true, 
                    user: { 
                        id: user.id, 
                        username: user.username, 
                        email: user.email,
                        is_premium: user.is_premium
                    } 
                });
            } else {
                res.json({ authenticated: false });
            }
        } else {
            res.json({ authenticated: false });
        }
    } catch (error) {
        console.error('Auth status error:', error);
        res.json({ authenticated: false });
    }
});

// Get user chats
app.get("/api/chats", requireAuth, async (req, res) => {
    try {
        const chats = await chatQueries.findByUserId(req.session.userId);
        res.json({ success: true, chats });
    } catch (error) {
        console.error('Get chats error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch chats' });
    }
});

// Create new chat
app.post("/api/chats", requireAuth, async (req, res) => {
    try {
        const { title } = req.body;
        const userId = req.session.userId;
        
        // Get user info to check premium status
        const user = await userQueries.findById(userId);
        
        // Check if user can create new chat
        const canCreate = await dailyChatQueries.canCreateChat(userId, user.is_premium);
        
        if (!canCreate) {
            const limit = user.is_premium ? 20 : 5;
            return res.status(403).json({ 
                success: false, 
                error: `Daily chat limit reached. You can create ${limit} chats per day.` 
            });
        }
        
        // Create new chat
        const newChat = await chatQueries.create(userId, title || "New Chat");
        
        // Increment daily chat count
        await dailyChatQueries.incrementTodayCount(userId);
        
        res.json({ success: true, chat: newChat });
    } catch (error) {
        console.error('Create chat error:', error);
        res.status(500).json({ success: false, error: 'Failed to create chat' });
    }
});

// Get chat messages
app.get("/api/chats/:chatId/messages", requireAuth, async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.session.userId;
        
        // Verify chat belongs to user
        const chat = await chatQueries.findById(chatId);
        if (!chat || chat.user_id !== userId) {
            return res.status(404).json({ success: false, error: 'Chat not found' });
        }
        
        const messages = await messageQueries.findByChatId(chatId);
        res.json({ success: true, messages });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch messages' });
    }
});

// Send message to chat
app.post("/api/chats/:chatId/messages", requireAuth, async (req, res) => {
    try {
        const { chatId } = req.params;
        const { message } = req.body;
        const userId = req.session.userId;
        
        // Verify chat belongs to user
        const chat = await chatQueries.findById(chatId);
        if (!chat || chat.user_id !== userId) {
            return res.status(404).json({ success: false, error: 'Chat not found' });
        }
        
        // Save user message
        await messageQueries.create(chatId, message, true);
        
        // Simulate AI response
        const responses = [
            "I understand your question. Let me help you with that!",
            "That's an interesting point. Here's what I think...",
            "I can help you with that. Let me provide some information.",
            "Great question! Here's my response...",
            "I'd be happy to assist you with that topic."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        // Save AI response
        const aiMessage = await messageQueries.create(chatId, randomResponse, false);
        
        res.json({ 
            success: true, 
            response: randomResponse,
            user: req.session.username 
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ success: false, error: 'Failed to send message' });
    }
});

// Get user's daily chat count
app.get("/api/user/chat-count", requireAuth, async (req, res) => {
    try {
        const userId = req.session.userId;
        const user = await userQueries.findById(userId);
        const todayCount = await dailyChatQueries.getTodayCount(userId);
        const maxChats = user.is_premium ? 20 : 5;
        
        res.json({ 
            success: true, 
            todayCount, 
            maxChats, 
            isPremium: user.is_premium 
        });
    } catch (error) {
        console.error('Get chat count error:', error);
        res.status(500).json({ success: false, error: 'Failed to get chat count' });
    }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});