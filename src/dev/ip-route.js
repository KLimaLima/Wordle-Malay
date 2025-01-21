const express = require("express");
const ipRouter = express.Router();

const { verify_jwt } = require('../utils/verify-jwt.js');

ipRouter.route('/dev/ip')
    .get(async (req, res) => {
        res.status(200).send(req.ip);
    });

module.exports = ipRouter;