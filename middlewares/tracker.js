const eventBus = require('../events/logger');

const maskSensitiveData = (obj) => {
    const maskedObj = { ...obj };
    const sensitiveKeys = ['password', 'token', 'email'];

    for (let key in maskedObj) {
        if (sensitiveKeys.includes(key.toLowerCase())) {
            maskedObj[key] = '***';
        }
    }
    return maskedObj;
};

const requestTracker = (req, res, next) => {
    const startAt = process.hrtime();
    const originalEnd = res.end;

    res.end = function (chunk, encoding) {
        const diff = process.hrtime(startAt);
        const timeInMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3);
        const isSuccessful = res.statusCode >= 200 && res.statusCode < 300;

        if (isSuccessful) {
            res.setHeader('X-Response-Time', `${timeInMs}ms`);
        }

        res.end = originalEnd;
        res.end(chunk, encoding);

        const stats = {
            timestamp: new Date().toISOString(),
            method: req.method,
            path: req.path,
            pathVariables: maskSensitiveData(req.params),
            queryString: maskSensitiveData(req.query),
            userAgent: req.get('User-Agent') || 'Unknown',
            statusCode: res.statusCode,
            executionTimeMs: isSuccessful ? timeInMs : null
        };

        eventBus.emit('requestCompleted', stats);
    };
    next();
};

module.exports = requestTracker;