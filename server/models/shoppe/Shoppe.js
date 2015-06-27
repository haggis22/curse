"use strict";

var Item = require(__dirname + '/../items/Item');
var Weapon = require(__dirname + '/../items/Weapon');
var Armour = require(__dirname + '/../items/Armour');
var Shield = require(__dirname + '/../items/Shield');
var Potion = require(__dirname + '/../items/Potion');


var Shoppe = function (shoppe) {

    this.items = [];

    if (!shoppe) {
        return;
    }

    if (shoppe.weapon) {
        for (var w = 0; w < shoppe.weapon.length; w++) {
            this.items.push(new Weapon(shoppe.weapon[w]));
        }
    }

    if (shoppe.armour) {
        for (var a = 0; a < shoppe.armour.length; a++) {
            this.items.push(new Armour(shoppe.armour[a]));
        }
    }

    if (shoppe.shield) {
        for (var s = 0; s < shoppe.shield.length; s++) {
            this.items.push(new Shield(shoppe.shield[s]));
        }
    }

    if (shoppe.potion) {
        for (var p = 0; p < shoppe.potion.length; p++) {
            this.items.push(new Potion(shoppe.potion[p]));
        }
    }

    if (shoppe.item) {
        for (var i = 0; i < shoppe.item.length; i++) {
            this.items.push(new Item(shoppe.item[i]));
        }
    }

};


module.exports = Shoppe;
