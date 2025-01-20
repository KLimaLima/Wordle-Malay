var jwt = require('jsonwebtoken');
jwt_secret = `${process.env.JWT_SECRET}`

function verify_jwt(req, res, next) {

    //getting jwt_token
    const authHeader = req.headers.authorization
    const token_jwt = authHeader && authHeader.split(` `)[1]

    //check if server got token
    if (token_jwt == null) {
        res.status(401).send('No jwt token found')
        return
    }

    //verify with secret
    jwt.verify(token_jwt, jwt_secret, (error, jwt_data) => {
        if(error) {
            res.status(400).send('Unauthorized')
            return
        }
        else {
            //keep authorized user data
            res.locals.jwt_data = jwt_data
            next()
        }
    })
}

module.exports = { verify_jwt }