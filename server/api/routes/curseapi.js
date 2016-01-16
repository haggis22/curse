var express = require('express');
var router = express.Router();

var log4js = require('log4js');
log4js.configure(__dirname + '/../../log4js_config.json', {});
var logger = log4js.getLogger('curse');

var constants = require(__dirname + '/../../../js/Constants');
var UserManager = require(__dirname + '/../../models/users/UserManager');


// most requests that come through /curseapi should have a session
// Exceptions: logging in
router.use(function (req, res, next) {

    var sessionHash = null;

    if (req.cookies && req.cookies[constants.cookies.SESSION]) {
        sessionHash = req.cookies[constants.cookies.SESSION];
    }

    UserManager.fetchBySession(sessionHash)

        .then(function (user) {

            req.user = user;
            return next();

        })
        .catch(function(err) {
            logger.error('Could not validate user session: ' + err);
            return res.status(500).json({ error: 'Session error' });
        });


});


router.use('/characters', require(__dirname + '/characters'));
router.use('/campaigns', require(__dirname + '/campaigns'));
router.use('/dungeons', require(__dirname + '/dungeons'));
router.use('/skills', require(__dirname + '/skills'));
router.use('/shoppe', require(__dirname + '/shoppe'));
router.use('/users', require(__dirname + '/users'));

module.exports = router;