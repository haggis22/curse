var express = require('express');
var router = express.Router();

var log4js = require('log4js');
log4js.configure(__dirname + '/../../log4js_config.json', {});
var logger = log4js.getLogger('curse');

var UserManager = require(__dirname + '/../../models/users/UserManager');
var Session = require(__dirname + '/../../../js/users/Session');

router.post('/login', function (req, res) {

    var username = req.body.username;
    var password = req.body.password;

    var callback = function (err, users) {

        if (err) {
            return res.status(500).send(err).end();
        }
        else {
            return res.json(campaigns);
        }

    };

    UserManager.login(username, password, function (err, session) {

        if (err) {
            return res.status(500).send(err).end();
        }

        if (session == null) {
            // no system error, but login failed
            return res.status(401).send({ error: 'Invalid username or password' }).end();
        }

        // return the newly-created user session data
        return res.status(200).send(session).end();

    });


});


router.get('/session', function (req, res) {

    if (req.user) {

        var session = new Session(req.user);
        return res.status(200).send(session).end();

    }

    return res.status(200).send(null).end();

});



module.exports = router;
