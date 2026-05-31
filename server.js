import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import session from 'express-session';
import { testConnection } from './src/models/db.js';
import { initializeDatabase } from './src/models/dbSetup.js';
import router from './src/routes.js';
import flash from './src/middleware/flash.js';
import 'dotenv/config';

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'cse340-default-dev-secret-change-in-production';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ─── Session management (must come first) ────────────────────────────────────
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

// ─── Flash messages (must come after session) ─────────────────────────────────
app.use(flash);

// ─── Body parsers (must come before routes) ───────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ─── Static files ─────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ─── View engine ──────────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// ─── Request logger (development) ─────────────────────────────────────────────
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

// ─── Make NODE_ENV and auth state available to all EJS templates ─────────────
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    res.locals.isLoggedIn = false;
    res.locals.user = null;
    if (req.session && req.session.user) {
        res.locals.isLoggedIn = true;
        res.locals.user = req.session.user;
    }
    next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use(router);

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);

    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';

    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack
    };

    res.status(status).render(`errors/${template}`, context);
});

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, async () => {
    try {
        await testConnection();
        await initializeDatabase();
        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('Startup error:', error.message);
    }
});
