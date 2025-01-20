const express = require('express');
const gameRouter = express.Router();

const { game_data, word_today } = require('../db/client.js');

const { jwt_search } = require('../utils/jwt-search.js')
const { verify_jwt } = require('../utils/verify-jwt.js');
const { input_word } = require('../utils/input-word.js');

gameRouter.route('/play')
    .post(verify_jwt, jwt_search, input_word, async (req, res) => {
        
        let word = res.locals.word
        let account = res.locals.account

        let user = await game_data.findOne(
            {
                _id: account._id
            }
        )

        if(user) {
            if(user.successful || user.attempt >= 5) {
                res.status(200).send("You've already finished playing.\nPlay again tomorrow!")
                return
            }
        }

        let answer = await word_today.findOne()

        if(word == answer.word) {
            let success = await game_data.updateOne(
                { _id: account._id },
                {
                    $set: {
                        successful: true
                    }
                },
                { upsert: true }
            )
        }

        //if unsuccessful
        let increment_attempt = await game_data.updateOne(
            { _id: account._id },
            {
                $inc: {
                    attempt: 1
                }
            },
            { upsert: true } //to add if not already exist
        )

        res.status(200).send('Please try again')

    })
    .get(verify_jwt, jwt_search, async (req, res) => {

        let account = res.locals.account

        const agg = [
            {
              '$match': {
                '_id': account._id
              }
            }, {
              '$project': {
                '_id': 0
              }
            }
        ];
        
        const cursor = game_data.aggregate(agg);
        const result = await cursor.toArray();

        if(!result) {
            res.status(200).send('You have not played yet.\nStart playing now')
        }

        res.status(200).send(result[0])
    })
    .patch(verify_jwt, jwt_search, async (req, res) => {
        res.status(204).send('Nothing here')
    })
    .delete(verify_jwt, jwt_search, async (req, res) => {
        res.status(204).send('Nothing here')
    })

module.exports = gameRouter