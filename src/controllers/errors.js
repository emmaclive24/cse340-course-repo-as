// Test route for 500 errors — used during development only
const testErrorPage = (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
};

export { testErrorPage };
