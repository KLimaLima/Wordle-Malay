const express = require('express');
const leaderboardRouter = express.Router();

const { game_data } = require('../db/client')

const { jwt_search } = require('../utils/jwt-search.js')
const { verify_jwt } = require('../utils/verify-jwt.js');
const { input_word } = require('../utils/input-word.js');

leaderboardRouter.get('/leaderboard', verify_jwt, jwt_search, input_word, async(req, res) => {

    let total_tries_1 = await game_data.countDocuments(
        {
            successful: true,
            attempts: 1
        }
    )

    let total_tries_2 = await game_data.countDocuments(
        {
            successful: true,
            attempts: 2
        }
    )

    let total_tries_3 = await game_data.countDocuments(
        {
            successful: true,
            attempts: 3
        }
    )

    let total_tries_4 = await game_data.countDocuments(
        {
            successful: true,
            attempts: 4
        }
    )

    let total_tries_5 = await game_data.countDocuments(
        {
            successful: true,
            attempts: 5
        }
    )

    const leaderboard_json = {
        description: 'Number of attempts that players have taken to get the answer',
        one_attemp: total_tries_1,
        two_attemp: total_tries_2,
        three_attemp: total_tries_3,
        four_attemp: total_tries_4,
        five_attempt: total_tries_5
    }

    const leaderboard_to_send = JSON.stringify(leaderboard_json)
    res.send(leaderboard_to_send)

})