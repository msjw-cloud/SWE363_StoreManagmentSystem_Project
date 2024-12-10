const Activity = require('../models/Activity');

const activityLogger = async (req, res, next) => {
    const originalSend = res.json;
    res.json = function(body) {
        Activity.create({
            user: req.user?._id,
            action: req.method,
            route: req.originalUrl,
            status: res.statusCode,
            details: {
                body: req.body,
                params: req.params,
                query: req.query
            }
        }).catch(console.error);
        
        originalSend.call(this, body);
    };
    next();
};

module.exports = activityLogger;