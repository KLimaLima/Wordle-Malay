const express = require('express');

const app = express();
app.use(express.json());

const { ip_addr } = require('../db/client.js');

const MAX_REQUESTS = 20;
const WINDOW_MS = 1 * 60 * 1000;

const limiter = async (req, res, next) => {
    const userIP = req.ip;
    const currentTime = Date.now();

    try {
        // Fetch the record for the IP
        const record = await ip_addr.findOne({ ip: userIP });

        if (!record) {
            // New IP: Insert a new record
            await ip_addr.insertOne({
                ip: userIP,
                requestCount: 1,
                firstRequestTimestamp: currentTime,
            });
            next();
        } else {
            // Existing IP: Check request count and time window
            const timeElapsed = currentTime - record.firstRequestTimestamp;

            if (timeElapsed < WINDOW_MS) {
                // Within time window
                if (record.requestCount >= MAX_REQUESTS) {
                    res.status(429).send('Too many requests. Please try again later.');
                } else {
                    // Increment request count
                    await ip_addr.updateOne(
                        { ip: userIP },
                        { $inc: { requestCount: 1 } }
                    );
                    next();
                }
            } else {
                // Outside time window: Reset request count and timestamp
                await ip_addr.updateOne(
                    { ip: userIP },
                    {
                        $set: {
                            requestCount: 1,
                            firstRequestTimestamp: currentTime,
                        },
                    }
                );
                next();
            }
        }
    } catch (error) {
        console.error('Rate limiter error:', error);
        res.status(500).send('Internal server error.');
    }
};

module.exports = { limiter };