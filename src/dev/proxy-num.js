const express = require("express");
const proxyNum = express.Router();

const { ip_addr } = require('../db/client');

proxyNum.route('/dev/proxy_num')
    .post( async (req, res) => {

        let change = ip_addr.updateOne(
            { parameter: 'proxy_num' },
            {
                $set: {
                    num: req.num
                }
            },
            { upsert: true }
        )

        res.status(200).send(req.ip);
    });

module.exports = proxyNum;