const express = require('express');
const leaderboardRouter = express.Router();

const { game_data } = require('../db/client');

leaderboardRouter.get('/leaderboard', async(req, res) => {

    let total_tries_1 = await game_data.countDocuments(
        {
            successful: true,
            attempt: 1
        }
    )

    let total_tries_2 = await game_data.countDocuments(
        {
            successful: true,
            attempt: 2
        }
    )

    let total_tries_3 = await game_data.countDocuments(
        {
            successful: true,
            attempt: 3
        }
    )

    let total_tries_4 = await game_data.countDocuments(
        {
            successful: true,
            attempt: 4
        }
    )

    let total_tries_5 = await game_data.countDocuments(
        {
            successful: true,
            attempt: 5
        }
    )

    const leaderboard_json = {
        description: 'Number of attempts that players have taken to get the answer',
        one_attempt: total_tries_1,
        two_attempt: total_tries_2,
        three_attempt: total_tries_3,
        four_attempt: total_tries_4,
        five_attempt: total_tries_5
    }

    console.log('REQUESTS:');
    console.log(JSON.stringify(req.headers));

    res.send(`${leaderboard_json}\n${JSON.stringify(req.headers)}`)
})

module.exports = leaderboardRouter