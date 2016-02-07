"use strict";

(function(isNode, isAngular) {

    // This wrappers function returns the contents of the module, with dependencies
    var ItemFactoryModule = function (Item, Coin, Armour, Weapon, Shield, Potion) {

        var ItemFactory = function () {

        }

        ItemFactory.createItem = function(item) {

            if (item.type == Coin.prototype.type)
            {
                return new Coin(item);
            }

            if (item.type == Armour.prototype.type)
            {
                return new Armour(item);
            }

            if (item.type == Shield.prototype.type)
            {
                return new Shield(item);
            }

            if (item.type == Weapon.prototype.type)
            {
                return new Weapon(item);
            }

            if (item.type == Potion.prototype.type)
            {
                return new Potion(item);
            }

            return new Item(item);

        };

        return ItemFactory;

    };

    if (isAngular) 
    {
        // AngularJS module definition
        angular.module('CurseApp').
            factory('ItemFactory', ['Item', 'Coin', 'Armour', 'Weapon', 'Shield', 'Potion', ItemFactoryModule]);

    } else if (isNode) {

        // NodeJS module definition
        module.exports = ItemFactoryModule(
            require(__dirname + '/Item'),
            require(__dirname + '/Coin'),
            require(__dirname + '/Armour'),
            require(__dirname + '/Weapon'),
            require(__dirname + '/Shield'),
            require(__dirname + '/Potion')
        );
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined'); 
