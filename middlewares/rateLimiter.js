const ipRequests = new Map();
const RATE_LIMIT = 50;
const TIME_WINDOW = 60000;

const rateLimiter = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const currentTime = Date.now();

    if (!ipRequests.has(ip)) {
        ipRequests.set(ip, { count: 1, startTime: currentTime });
    } else {
        const data = ipRequests.get(ip);
        if (currentTime - data.startTime < TIME_WINDOW) {
            data.count++;
            if (data.count > RATE_LIMIT) {
                return res.status(429).json({ error: 'Too Many Requests' });
            }
        } else {
            ipRequests.set(ip, { count: 1, startTime: currentTime });
        }
    }
    next();
};

module.exports = rateLimiter;