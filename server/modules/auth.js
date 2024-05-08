// Middleware to check if user is authenticated
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // User is authenticated, proceed to the next middleware
    }
    // User is not authenticated, send an error response
    return res.status(401).json({ message: 'Unauthorized' });
}

// Dashboard route - protected by isLoggedIn middleware

module.exports = router;