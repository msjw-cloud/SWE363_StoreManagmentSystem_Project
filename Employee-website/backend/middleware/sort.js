const sortMiddleware = (defaultSort = '-createdAt') => (req, res, next) => {
    req.sortQuery = req.query.sort || defaultSort;
    next();
};

module.exports = sortMiddleware;