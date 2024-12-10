const searchMiddleware = (fields) => (req, res, next) => {
    if (req.query.search) {
        const searchQuery = req.query.search;
        const searchObject = {
            $or: fields.map(field => ({
                [field]: { $regex: searchQuery, $options: 'i' }
            }))
        };
        req.searchQuery = searchObject;
    }
    next();
};

module.exports = searchMiddleware;