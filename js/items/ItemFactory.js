"use strict";

(function(isNode, isAngular) {

    // This wrappers function returns the contents of the module, with dependencies
    var ItemFactoryModule = function (Item, Armour, Weapon, Shield, Potion) {

        var ItemFactory = function () {

        }

        ItemFactory.createItem = function(item) {

            if ((item.isArmour) || (item.isShield))
            {
                return new Armour(item);
            }
            
            if (item.isWeapon)
            {
                return new Weapon(item);
            }
            
            if (item.isPotion)
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
            factory('ItemFactory', ['Item', 'Armour', 'Weapon', 'Shield', 'Potion', ItemFactoryModule]);

    } else if (isNode) {

        // NodeJS module definition
        module.exports = ItemFactoryModule(
            require(__dirname + '/Item'),
            require(__dirname + '/Armour'),
            require(__dirname + '/Weapon'),
            require(__dirname + '/Shield'),
            require(__dirname + '/Potion')
        );
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined'); 
