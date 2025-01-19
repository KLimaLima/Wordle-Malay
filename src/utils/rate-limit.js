// const express = require('express');
const rateLimit = require('express-rate-limit');
// const requestIp = require('request-ip');

// const app = express();
// app.use(requestIp.mw());

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minutes
	limit: 20, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

module.exports = limiter;