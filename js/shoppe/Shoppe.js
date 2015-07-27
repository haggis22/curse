"use strict";

(function(isNode, isAngular) {

    // This wrappers function returns the contents of the module, with dependencies
    var ShoppeModule = function (Item, Weapon, Armour, Shield, Potion) {

        var Shoppe = function (itemArray) {

            this.items = [];

            if (!itemArray || itemArray.length == 0) {
                return;
            }

            itemArray.forEach(function (item) {

                switch (item.type) {

                    case "weapon":
                        this.items.push(new Weapon(item));
                        break;

                    case "armour":
                        this.items.push(new Armour(item));
                        break;

                    case "shield":
                        this.items.push(new Shield(item));
                        break;

                    case "potion":
                        this.items.push(new Potion(item));
                        break;

                    default:
                        this.items.push(new Item(item));
                        break;

                }  // end switch

            }, this);

        };

        return Shoppe;

    };

    if (isAngular) 
    {
        // AngularJS module definition
        angular.module('CurseApp').
            factory('Shoppe', ['Item', 'Weapon', 'Armour', 'Shield', 'Potion', ShoppeModule]);

    } else if (isNode) {
        // NodeJS module definition
        module.exports = ShoppeModule(
            require(__dirname + '/../items/Item'),
            require(__dirname + '/../items/Weapon'),
            require(__dirname + '/../items/Armour'),
            require(__dirname + '/../items/Shield'),
            require(__dirname + '/../items/Potion')
        );
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined'); 

