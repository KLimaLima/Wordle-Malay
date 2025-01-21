const rateLimit = require('express-rate-limit');

function give_ip(req, res) {

	let string_ip = req.ip

	string_ip = string_ip.split(":", 1)

	return string_ip
}

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minutes
	limit: 20, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	keyGenerator: (req, res) => give_ip,
})

module.exports = limiter;