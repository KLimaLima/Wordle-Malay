const express = require('express');
const rateLimit = require('express-rate-limit');
const requestIp = require('request-ip');

const app = express();
app.set('trust proxy', true);
app.use(requestIp.mw());

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: 'Too many requests from this IP, please try again after a minute',
    keyGenerator: (req, res) => {
        return req.clientIp;
    }
});

module.exports = limiter;