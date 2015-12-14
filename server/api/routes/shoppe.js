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

    CharacterManager.fetchByID(req.user, characterID, function (err, character) {

        if (err) {
            return res.status(500).send(err).end();
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

            var payResult = character.payMoney(cost);

            if (payResult.success) {

                // the character successfully buys the item!
                // add the item to his pack
                var addResult = character.addItem(item);
                if (addResult.success) {

                    CharacterManager.update(character, function (err, newChar) {

                        if (err) {
                            return res.status(500).send(err).end();
                        }

                        // we added the item!
                        return res.status(200).json({ success: true, character: character, item: item, message: character.getName(true) + ' bought ' + item.getName(true) });

                    });   // CharacterManager.update callback

                }
                else {

                    // this will be a not-successful result object
                    return res.status(200).json(addResult);
                }

            }
            else {

                // the character does not have enough money
                //                return res.status(400).json({ error: character.getName(true) + ' does not have enough money to purchase ' + item.getName(true) }).end();
                return res.status(200).json(payResult).end();
            }

        });

    });

});

module.exports = router;
