var express = require('express');
var router = express.Router();

var log4js = require('log4js');
log4js.configure(__dirname + '/../../log4js_config.json', {});
var logger = log4js.getLogger('curse');

var UserManager = require(__dirname + '/../../models/users/UserManager');
var Session = require(__dirname + '/../../../js/users/Session');

router.post('/login', function (req, res) {

    UserManager.login(req.body.username, req.body.password)

        .then(function (session) {

            // return the newly-created user session data
            return res.send(session).end();

        })
        .catch(function(err) {
            return res.status(500).send('Could not log in').end();
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
