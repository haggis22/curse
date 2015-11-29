var express = require('express');
var router = express.Router();

var log4js = require('log4js');
log4js.configure(__dirname + '/../../log4js_config.json', {});
var logger = log4js.getLogger('curse');

var UserManager = require(__dirname + '/../../models/users/UserManager');

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

    UserManager.login(username, password, function (err, user) {

        if (err) {
            return res.status(500).send(err).end();
        }

        if (user == null) {
            // no system error, but login failed
            return res.status(401).send(null).end();
        }

        // return the newly-created session
        return res.status(200).send(user.session).end();

    });


});



module.exports = router;
