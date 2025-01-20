const express = require('express');
const loginRouter = express.Router();

const bcrypt = require('bcrypt');

require('dotenv').config();

var jwt = require('jsonwebtoken');
jwt_secret = `${process.env.JWT_SECRET}`

const { account } = require('../db/client.js');

let { req_search } = require('../utils/req-search.js')
let { validate_password } = require('../utils/validate-password.js')
let { verify_jwt } = require('../utils/verify-jwt.js')
let { enforcePasswordPolicy } = require('../utils/validate-password.js')

//TODO: should implement id so that user can go account/:id or account/login/id: to do all related stuff
// plus we can verify with jwt they give with the 

loginRouter.route('/login')
    .post(req_search, validate_password, async (req, res) => {

        let { username, password } = req.body

        let account_jwt = res.locals.account

        var token = jwt.sign(
            {
                _id: account_jwt._id,
                username: account_jwt.username
            },
            jwt_secret,
            { expiresIn: 60*60*2 } //2 hrs
        )

        res.status(200).send(token)
    })
    //GET /login uses jwt_data to identify who is accessing right now
    //for getting user data
    //admin => get all account
    //gm => can find account by specifying username: 'wanted-username' (maybe can try implement regex)
    //player => can only get self data
    .get(verify_jwt, async (req, res) => {

        let jwt_data = res.locals.jwt_data

        let result = await account.findOne(
            {
                username: jwt_data.username
            }
        )

        let { username } = req.body

        //if there is no username in req
        //basically means that the user (any role) wants self data
        //player role ONLY up to here
        if(!username || result.role == 'player') {
            res.status(200).send(result)
            return
        }

        if(username == 'all' && result.role == 'admin') {

            let find_all = await account.find().toArray()

            res.status(200).send(find_all)
            return
        }

        let find_one = await account.findOne(
            {
                username: username
            }
        )

        if(!find_one) {
            res.status(400).send(`Could not find username ${username}`)
        }

        res.status(200).send(find_one)
    })
    //for change password
    .patch(verify_jwt, enforcePasswordPolicy, async (req, res) => {

        let { username, password, role } = req.body

        let account_to_change = res.locals.jwt_data.username

        let req_user = await account.findOne(
            {
                username: res.locals.jwt_data.username
            }
        )

        if(username && req_user.role == 'admin') {
            account_to_change = username
        }

        let message_role_change = 'Do not share your password'

        //only admin
        if(role && req_user.role == 'admin') {

            let result = await account.updateOne(
                { username: account_to_change },
                {
                    $set: {
                        role: role
                    }
                }
            )

            message_role_change = `Role for user ${account_to_change} changed to ${role}`

            if(!password) {
                res.status(200).send(message_role_change)
                return
            }
        }

        if(!password) {
            res.status(400).send('Please enter a new password')
            return
        }

        const password_hashed = bcrypt.hashSync(password, salt_rounds)

        let result = await account.updateOne(
            { username: account_to_change },
            {
                $set: {
                    password: password_hashed
                }
            }
        )

        if(!result) {
            res.status(400).send('Unable to change password')
            return
        }
        res.status(200).send(`Password for user ${account_to_change} changed\n${message_role_change}`)
    })
    .delete(verify_jwt, async (req, res) => {

        let { username, password } = req.body

        let req_user = await account.findOne(
            {
                username: res.locals.jwt_data.username
            }
        )

        //first by default all will delete self
        to_delete = res.locals.jwt_data.username

        //only if have username AND admin role change to delete selected user
        if(username && req_user.role == 'admin') {

            to_delete = username
        }

        let deleted = await account.deleteOne(
            {
                username: to_delete
            }
        )

        if(!deleted) {
            res.status(400).send(`Unable to delete ${to_delete}`)
            return
        }

        res.status(200).send(`Successfully deleted ${to_delete}`)
    })

module.exports = loginRouter;