import bcrypt from 'bcrypt';
import { createUser, authenticateUser, getAllUsers } from '../models/users.js';

const SALT_ROUNDS = 10;

// ─── Registration ──────────────────────────────────────────────────────────────

/**
 * Renders the user registration form.
 */
const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

/**
 * Handles registration form submission.
 * Hashes the password and saves the new user to the database.
 */
const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        await createUser(name, email, passwordHash);
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/login');
    } catch (error) {
        if (error.code === '23505') {
<<<<<<< HEAD
            // Unique constraint violation — duplicate email
=======
>>>>>>> a52ab31 (week 5 fix)
            req.flash('error', 'An account with that email already exists.');
        } else {
            console.error('Registration error:', error.message);
            req.flash('error', 'Registration failed. Please try again.');
        }
        res.redirect('/register');
    }
};

// ─── Login / Logout ───────────────────────────────────────────────────────────

/**
 * Renders the login form.
 */
const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

/**
 * Handles login form submission.
 * Authenticates credentials, stores user in session, and redirects.
 */
const processLoginForm = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await authenticateUser(email, password);
        if (user) {
            req.session.user = user;
            console.log('User logged in:', user);
            req.flash('success', 'Login successful! Welcome back.');
            res.redirect('/dashboard');
        } else {
            req.flash('error', 'Invalid email or password. Please try again.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Login error:', error.message);
        req.flash('error', 'Login failed. Please try again.');
        res.redirect('/login');
    }
};

/**
 * Destroys the session and logs the user out.
<<<<<<< HEAD
=======
 * FIX: Flash must be set BEFORE session.destroy() because the session
 * is gone after destroy() completes. We use res.redirect after destroying.
>>>>>>> a52ab31 (week 5 fix)
 */
const processLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destroy error:', err.message);
        }
<<<<<<< HEAD
        req.flash('success', 'You have been logged out.');
=======
        // After session is destroyed we cannot use req.flash() —
        // instead redirect directly; a new session will start on the next request.
>>>>>>> a52ab31 (week 5 fix)
        res.redirect('/login');
    });
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

/**
 * Renders the dashboard page for logged-in users.
 * Protected by requireLogin middleware.
 */
const showDashboard = (req, res) => {
    const { name, email } = req.session.user;
    res.render('dashboard', { title: 'Dashboard', name, email });
};

// ─── Users Admin Page ─────────────────────────────────────────────────────────

/**
 * Renders the admin users list page.
 * Protected by requireLogin + requireRole('admin') middleware.
 */
<<<<<<< HEAD
const showUsersPage = async (req, res) => {
=======
const showUsersPage = async (req, res, next) => {
>>>>>>> a52ab31 (week 5 fix)
    try {
        const users = await getAllUsers();
        res.render('users', { title: 'All Users', users });
    } catch (error) {
<<<<<<< HEAD
        console.error('Users page error:', error.message);
        const err = new Error('Failed to load users.');
        err.status = 500;
        throw err;
=======
        next(error);
>>>>>>> a52ab31 (week 5 fix)
    }
};

// ─── Middleware ───────────────────────────────────────────────────────────────

/**
 * Middleware that checks if a user is logged in.
 * Redirects to /login with a flash message if not authenticated.
 */
const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    req.flash('error', 'You must be logged in to access that page.');
    res.redirect('/login');
};

/**
 * Middleware factory that checks if the logged-in user has a specific role.
 * Returns a middleware function that redirects to / with a flash message
 * if the user does not have the required role.
 *
<<<<<<< HEAD
 * This must be a factory (function that returns a function) because the
 * required role name must be passed as a parameter. A standard middleware
 * function has no way to accept custom parameters.
=======
 * This must be a factory (function returning a function) so that the required
 * role name can be passed as a parameter at route-definition time.
 *
 * @param {string} role - The role name required (e.g. 'admin')
 * @returns {Function} Express middleware function
>>>>>>> a52ab31 (week 5 fix)
 */
const requireRole = (role) => {
    return (req, res, next) => {
        if (req.session && req.session.user && req.session.user.role_name === role) {
            return next();
        }
        req.flash('error', 'You do not have permission to access that page.');
        res.redirect('/');
    };
};

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    showDashboard,
    showUsersPage,
    requireLogin,
    requireRole
};
