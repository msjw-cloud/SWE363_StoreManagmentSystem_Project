const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes default

const cacheMiddleware = (duration = 300) => (req, res, next) => {
    if (req.method !== 'GET') {
        return next();
    }

    const key = req.originalUrl;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
        return res.json(cachedResponse);
    }

    const originalJson = res.json;
    res.json = body => {
        cache.set(key, body, duration);
        originalJson.call(res, body);
    };

    next();
};

module.exports = cacheMiddleware;