var express = require('express');
var router = express.Router();

var log4js = require('log4js');
log4js.configure(__dirname + '/../../log4js_config.json', {});
var logger = log4js.getLogger('curse');

var ShoppeManager = require(__dirname + '/../../models/shoppe/ShoppeManager');
var CharacterManager = require(__dirname + '/../../models/creatures/CharacterManager');

router.get('/', function (req, res) {

    ShoppeManager.fetch(function (err, shoppe) {

        if (err) {
            return res.status(500).send(err).end();
        }
        else {

            return res.json(shoppe);

        }

    });

});

// Method for a character to buy an item in the shoppe
router.post('/:characterID/:itemID', function (req, res) {

    var characterID = req.params.characterID;
    var itemID = req.params.itemID;

    console.log('character: ' + characterID);
    console.log('item id: ' + itemID);

    CharacterManager.fetchByID(characterID, function (err, character) {

        if (err) {
            return res.status(500).send(err).end();
        }

        if (character == null) {
            return res.status(400).send({ error: "Could not find character" }).end();
        }

        // now fetch the item
        ShoppeManager.fetchItem(itemID, function (err, item) {

            if (err) {
                return res.status(500).send(err).end();
            }

            logger.debug('Found ' + item.getName(true) + ' in the shoppe!');

            var cost = item.value.getCoppers();
            var money = character.countMoney();

            logger.debug('Item costs ' + cost + ' copper pieces');
            logger.debug(character.getName(true) + ' has ' + money + ' copper pieces!');

            if (cost > money) {

                // the character does not have enough money
                return res.status(400).json({ error: character.getName(true) + ' does not have enough money to purchase ' + item.getName(true) }).end();
            }

            // the character successfully buys the item!
            // First, add the item to his pack
            var result = character.addItem(item);
            if (result.success) {

                CharacterManager.savePack(character, function (err, newChar) {

                    if (err) {
                        return res.status(500).send(err).end();
                    }

                    // we added the item!
                    return res.status(200).json({ success: true, item: item, message: character.getName(true) + ' bought ' + item.getName(true) });

                });

            }
            else {
                // this will be a not-successful result object
                return res.status(200).json(result);
            }

        });

    });

});

module.exports = router;
