var express = require('express');
var router = express.Router();

var log4js = require('log4js');
log4js.configure(__dirname + '/../../log4js_config.json', {});
var logger = log4js.getLogger('curse');

var ObjectID = require('mongodb').ObjectID;

var ShoppeManager = require(__dirname + '/../../models/shoppe/ShoppeManager');
var CharacterManager = require(__dirname + '/../../models/creatures/CharacterManager');

var Shoppe = require(__dirname + '/../../../js/shoppe/Shoppe');


router.get('/', function (req, res) {

    ShoppeManager.fetch()
        
        .then(function(shoppe) {
            return res.json(shoppe);
        })
        .catch(function(err) {
            return res.status(500).send(err).end();
        });

});

// Method for a character to buy an item in the shoppe
router.post('/:characterID/:itemID', function (req, res) {

    var itemID = req.params.itemID;

    ShoppeManager.buy(req.user, req.params.characterID, req.params.itemID)

        .then(function(result) {
            return res.json(result);
        })
        .catch(function(err) {
            return res.status(500).send(err).end();
        });

});

module.exports = router;
