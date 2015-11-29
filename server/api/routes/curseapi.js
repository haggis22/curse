var express = require('express');
var router = express.Router();

var log4js = require('log4js');
log4js.configure(__dirname + '/../../log4js_config.json', {});
var logger = log4js.getLogger('curse');

var UserManager = require(__dirname + '/../../models/users/UserManager');


// most requests that come through /curseapi should have a session
// Exceptions: logging in
router.use(function (req, res, next) {

    logger.debug(req.method + ' ' + req.url + ', requesting IP: ' + req.ip);

    var callback = function (err, user) {

        if (err) {

            logger.error('Could not validate user session: ' + err);
            return res.status(500).json({ error: 'Session error' });
        }

        // logger.info('IP ' + req.ip + ' ' + req.url + ' using TATH token ' + token + ' for session ' + req.get('session'));

        req.user = user;
        next();
    };

    var sessionHash = req.get('session') || null;
    UserManager.fetchBySession(sessionHash, callback);

});


router.use('/characters', require(__dirname + '/characters'));
router.use('/campaigns', require(__dirname + '/campaigns'));
router.use('/skills', require(__dirname + '/skills'));
router.use('/shoppe', require(__dirname + '/shoppe'));
router.use('/users', require(__dirname + '/users'));

module.exports = router;