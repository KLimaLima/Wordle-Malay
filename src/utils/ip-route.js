const express = require("express");
const ipRouter = express.Router();

ipRouter.route('/ip')
    .get( async (req, res) => {
        res.status(200).send(req.ip);
    });

module.exports = ipRouter;