const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();

app.set('trust proxy', 1);

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 20,
    message: 'Too many requests from this IP, please try again after a minute',
    keyGenerator: (req, res) => req.ip,
});

module.exports = { limiter };