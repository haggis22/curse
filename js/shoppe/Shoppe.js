"use strict";

(function(isNode, isAngular) {

    // This wrappers function returns the contents of the module, with dependencies
    var ShoppeModule = function (Value, Item, ItemFactory) {

        var Shoppe = function (itemArray) {

            // convert the array of Javascript objects to actual Item objects, or just an empty list if there are none
            this.items = itemArray ? itemArray.map(function(item) { return ItemFactory.createItem(item); } ) : [];

        };

        Shoppe.prototype.buyItem = function(creature, item) {

            debugger;

            if (creature == null)
            {
                return { success: false, message: 'Creature is null' };
            }

            if (item == null)
            {
                // nothing to do
                return { success: false, message: 'Cannot buy null item' };
            }

            var creatureMoney = creature.countMoney();
            var coppersOwed = item.value ? item.value.getCoppers() : 0;

            if (coppersOwed > creatureMoney)
            {
                return { success: false, message: creature.getName(true) + ' does not have enough money' };
            }

            // put all his money in a pile...
            var cash = {};

            // make sure that "this" refers to this creature, and not the item
            Value.denominations.forEach(function(denom) { 

                var stack = Item.prototype.findItemsOfStackableType(denom, creature.pack);
                if (stack != null)
                {
                    // ...track it separately...
                    cash[denom] = stack;
                }
                
            }, this);

            // ...and take it out of his pack
            for (var prop in cash)
            {
                if (cash.hasOwnProperty(prop))
                {
                    // TODO: what if he can't drop the money?
                    var dropResult = creature.dropItem(cash[prop], cash[prop].stackable.amount);
                }
                
            }

            var changeAmount = creatureMoney - coppersOwed;

            var changeBags = Item.colorUp(changeAmount);

            for (var m=0; m < changeBags.length; m++) {

                creature.addItem(changeBags[m]);
            }

            // add the item to his pack
            var addResult = creature.addItem(item);

            return { success: true, item: item }

        };


        return Shoppe;

    };

    if (isAngular) 
    {
        // AngularJS module definition
        angular.module('CurseApp').
            factory('Shoppe', ['Value', 'Item', 'ItemFactory', ShoppeModule]);

    } else if (isNode) {
        // NodeJS module definition
        module.exports = ShoppeModule(
            require(__dirname + '/../items/Value'),
            require(__dirname + '/../items/Item'),
            require(__dirname + '/../items/ItemFactory')
        );
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined'); 

