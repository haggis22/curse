var express = require('express');
var router = express.Router();

var log4js = require('log4js');
log4js.configure(__dirname + '/../../log4js_config.json', {});
var logger = log4js.getLogger('curse');

// log any request that comes through curseapi
router.use(function (req, res, next) {

    logger.debug(req.method + ' ' + req.url + ', requesting IP: ' + req.ip);
    next();

});

router.use('/characters', require('./characters'));
router.use('/campaigns', require('./campaigns'));
router.use('/skills', require('./skills'));


module.exports = router;