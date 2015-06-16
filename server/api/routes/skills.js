var express = require('express');
var router = express.Router();

var log4js = require('log4js');
log4js.configure(__dirname + '/../../log4js_config.json', {});
var logger = log4js.getLogger('curse');

var SkillManager = require('./../../managers/SkillManager');

router.get('/', function (req, res) {

    var callback = function (err, characters) {

        if (err) {
            return res.status(500).send(err).end();
        }
        else {
            return res.json(characters);
        }

    };

    SkillManager.fetchAll(callback);

});

router.get('/:skillID', function (req, res) {

    var skillID = req.params.skillID;

    var callback = function (err, skill) {

        if (err) {
            return res.status(500).send(err).end();
        }
        else {
            return res.json(skill).end();
        }

    };

    SkillManager.fetchByID(campaignID, callback);

});

module.exports = router;
