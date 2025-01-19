const express = require('express');
const registerRouter = express.Router();

const bcrypt = require('bcrypt');
salt_rounds = 10;

const { account } = require('../db/client.js');

let { req_search } = require('../utils/req-search.js')
let { enforcePasswordPolicy } = require('../utils/validate-password.js')

registerRouter.route('/register')
    .post(req_search, enforcePasswordPolicy, async (req, res) => {

        let { username, password } = req.body

        if(!password) {
            res.status(400).send('Please enter your password')
            return
        }

        //reject if username already exist
        if(res.locals.user_exist) {
            res.status(404).send('Username already exist!')
            return
        }

        const password_hashed = bcrypt.hashSync(password, salt_rounds)

        //if all pass, insert into database
        let result = await account.insertOne(
            {
                username: username,
                password: password_hashed,
                role: 'player'
            }
        )

        res.status(200).send(`Created account ${username}!`)
    })
    .get(async (req, res) => {
        res.status(204).send('Nothing here')
    })
    .patch(async (req, res) => {
        res.status(204).send('Nothing here')
    })
    .delete(async (req, res) => {
        res.status(204).send('Nothing here')
    })

module.exports = registerRouter;