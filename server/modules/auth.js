// Middleware to check if user is authenticated

function isLoggedIn(req,res,next) {
    if (req.isAuthenticated()){
        return next();
    }
    return res.status(401).json({message: 'Unauthorized'});
}

module.exports=isLoggedIn;
