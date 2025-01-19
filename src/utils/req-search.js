const { account } = require('../db/client.js');

//THIS FUNCTION ONLY CHECKS USERNAME BUT DOES NOT EXIT IF NOT FOUND

//IF AND ONLY IF USERNAME EXIST IN DATABASE, WILL PUT DATA IN res.locals.account
async function req_search(req, res, next) {

    let { username } = req.body

    if(!username) {
        res.status(400).send('Please provide a username')
        return
    }

    let result = await account.findOne(
        {
            username: username
        }
    )

    res.locals.user_exist = false

    //if username EXIST in database
    if(result) {
        res.locals.user_exist = true
        res.locals.account = result
    }

    next()
}

module.exports = { req_search }