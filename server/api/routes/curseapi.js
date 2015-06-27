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

router.use('/characters', require(__dirname + '/characters'));
router.use('/campaigns', require(__dirname + '/campaigns'));
router.use('/skills', require(__dirname + '/skills'));
router.use('/shoppe', require(__dirname + '/shoppe'));


module.exports = router;