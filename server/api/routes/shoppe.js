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

    CharacterManager.fetchByID(req.user, req.params.characterID)

        .then(function (character) {

            // now fetch the item
            ShoppeManager.fetchItem(itemID)

                .then(function(item) {

                    var cost = item.value.getCoppers();
                    var money = character.countMoney();

                    logger.debug('Item costs ' + cost + ' copper pieces');
                    logger.debug(character.getName(true) + ' has ' + money + ' copper pieces!');

                    // The item is not going to be a primary key, so it won't have its own ObjectID created automatically
                    item._id = new ObjectID();

                    var payResult = Shoppe.prototype.buyItem(character, item);

                    console.log('Buy result: ' + JSON.stringify(payResult));

                    if (payResult.success) {

                        // the character successfully buys the item!
                        CharacterManager.updatePack(character)

                            .then(function(result) {
                                
                                if (result) {
                                    return res.status(200).json({ success: true, message: character.getName(true) + ' bought ' + item.getName(true), pack: character.pack, item: item });
                                }

                                return res.status(500).send({ error: 'Save pack failed' }).end();

                            })
                            .catch(function(err) {
                                logger.err('Could not save pack: ' + err);
                                return res.status(500).send({ error: 'Could not buy item' }).end();
                            });

                    }
                    else {

                        // the character does not have enough money
                        //                return res.status(400).json({ error: character.getName(true) + ' does not have enough money to purchase ' + item.getName(true) }).end();
                        return res.status(200).json(payResult).end();
                    }


                })
                .catch(function(err) { 
                    return res.status(500).send(err).end();
                });

        })
        .catch(function(err) {
            return res.status(500).send({ error: 'Purchase failed' }).end();
        });


});

module.exports = router;
