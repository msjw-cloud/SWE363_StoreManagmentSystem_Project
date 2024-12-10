const roleAuth = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: 'Not authorized to access this resource' 
            });
        }

        next();
    };
};

module.exports = roleAuth;