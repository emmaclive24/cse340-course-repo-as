/**
 * Flash Message Middleware
 *
 * Provides temporary message storage that survives redirects but is
 * consumed after a single render. Messages are stored in the session
 * and organized by type (success, error, warning, info).
 *
 * Usage in controllers:
 *   req.flash('success', 'Message text')  // Store a message
 *   req.flash('error')                    // Get all error messages
 *   req.flash()                           // Get all messages (all types)
 */

/**
 * Initialize flash message storage and provide access methods.
 */
const flashMiddleware = (req, res, next) => {
    req.flash = function (type, message) {
        // Initialize flash storage if it doesn't exist
        if (!req.session.flash) {
            req.session.flash = { success: [], error: [], warning: [], info: [] };
        }

        // SETTING: two arguments — store a new message
        if (type && message !== undefined) {
            if (!req.session.flash[type]) {
                req.session.flash[type] = [];
            }
            req.session.flash[type].push(message);
            return;
        }

        // GETTING ONE TYPE: one argument — retrieve and clear that type
        if (type && message === undefined) {
            const messages = req.session.flash[type] || [];
            req.session.flash[type] = [];
            return messages;
        }

        // GETTING ALL: no arguments — retrieve and clear everything
        const allMessages = req.session.flash || { success: [], error: [], warning: [], info: [] };
        req.session.flash = { success: [], error: [], warning: [], info: [] };
        return allMessages;
    };

    next();
};

/**
 * Make flash function available to all EJS templates via res.locals.
 * Must run AFTER flashMiddleware so req.flash already exists.
 */
const flashLocals = (req, res, next) => {
    res.locals.flash = req.flash.bind(req);
    next();
};

/**
 * Combined flash middleware — import and use this single function.
 */
const flash = (req, res, next) => {
    flashMiddleware(req, res, () => {
        flashLocals(req, res, next);
    });
};

export default flash;
