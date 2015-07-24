"use strict";

var Item = require(__dirname + '/../items/Item');
var Weapon = require(__dirname + '/../items/Weapon');
var Armour = require(__dirname + '/../items/Armour');
var Shield = require(__dirname + '/../items/Shield');
var Potion = require(__dirname + '/../items/Potion');


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


module.exports = Shoppe;
