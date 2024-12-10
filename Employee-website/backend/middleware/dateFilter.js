const dateFilterMiddleware = (dateField = 'createdAt') => (req, res, next) => {
    const { startDate, endDate } = req.query;
    if (startDate || endDate) {
        req.dateFilter = {};
        if (startDate) {
            req.dateFilter[dateField] = { $gte: new Date(startDate) };
        }
        if (endDate) {
            req.dateFilter[dateField] = { ...req.dateFilter[dateField], $lte: new Date(endDate) };
        }
    }
    next();
};

module.exports = dateFilterMiddleware;