import express from "express";
import cors from "cors";
import session from "express-session";

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
    secret: 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Mock user database (in production, use a real database)
let users = [
    { id: 1, username: 'admin', password: 'password123', email: 'admin@example.com' },
    { id: 2, username: 'user', password: 'user123', email: 'user@example.com' }
];

let nextUserId = 3; // For generating new user IDs

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
app.post("/api/register", (req, res) => {
    const { username, email, password } = req.body;
    
    // Basic validation
    if (!username || !email || !password) {
        return res.status(400).json({ 
            success: false, 
            error: 'All fields are required' 
        });
    }
    
    // Check if username already exists
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.status(400).json({ 
            success: false, 
            error: 'Username already exists' 
        });
    }
    
    // Check if email already exists
    const existingEmail = users.find(u => u.email === email);
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
    
    // Create new user
    const newUser = {
        id: nextUserId++,
        username,
        email,
        password
    };
    
    users.push(newUser);
    
    // Auto-login after registration
    req.session.userId = newUser.id;
    req.session.username = newUser.username;
    
    res.json({ 
        success: true, 
        user: { 
            id: newUser.id, 
            username: newUser.username, 
            email: newUser.email 
        } 
    });
});

app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        req.session.userId = user.id;
        req.session.username = user.username;
        res.json({ 
            success: true, 
            user: { 
                id: user.id, 
                username: user.username, 
                email: user.email 
            } 
        });
    } else {
        res.status(401).json({ 
            success: false, 
            error: 'Invalid credentials' 
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

app.get("/api/auth/status", (req, res) => {
    if (req.session.userId) {
        const user = users.find(u => u.id === req.session.userId);
        res.json({ 
            authenticated: true, 
            user: { 
                id: user.id, 
                username: user.username, 
                email: user.email 
            } 
        });
    } else {
        res.json({ authenticated: false });
    }
});

// Protected chat endpoint
app.post("/api/chat", requireAuth, (req, res) => {
    const { message } = req.body;
    
    // Simulate AI response
    const responses = [
        "I understand your question. Let me help you with that!",
        "That's an interesting point. Here's what I think...",
        "I can help you with that. Let me provide some information.",
        "Great question! Here's my response...",
        "I'd be happy to assist you with that topic."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    res.json({ 
        success: true, 
        response: randomResponse,
        user: req.session.username 
    });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});