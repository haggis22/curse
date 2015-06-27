var express = require('express');
var router = express.Router();

var log4js = require('log4js');
log4js.configure(__dirname + '/../../log4js_config.json', {});
var logger = log4js.getLogger('curse');

var ShoppeManager = require(__dirname + '/../../models/shoppe/ShoppeManager');

router.get('/', function (req, res) {

    ShoppeManager.fetch(function (err, shoppe) {

        if (err) {
            return res.status(500).send(err).end();
        }
        else {

            return res.json(shoppe);

        }

    });




});

module.exports = router;
