var express = require('express');
var router = express.Router();

var log4js = require('log4js');
log4js.configure(__dirname + '/../../log4js_config.json', {});
var logger = log4js.getLogger('curse');

var SkillManager = require(__dirname + '/../../models/skills/SkillManager');

router.get('/', function (req, res) {

    SkillManager.fetchAll()
        .then(function(skillsMap) {

            // convert the map into an array
            var skillsArray = [];
            for (var prop in skillsMap) {
                if (skillsMap.hasOwnProperty(prop)) {
                    skillsArray.push(skillsMap[prop]);
                }
            }

            skillsArray.sort(function (a, b) { return ((a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0)); });

            return res.json(skillsArray);

        })
        .catch(function(err) {
            return res.status(500).send(err).end();
        });

});

module.exports = router;
