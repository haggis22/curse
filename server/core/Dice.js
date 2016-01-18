"use strict";

var Dice = function () { };

Dice.rollDie = function (min, max) {
    return Math.round(Math.random() * (max - min)) + min;
};

Dice.rollDecimalDie = function (min, max) {
    return (Math.random() * (max - min)) + min;
};

Dice.averageDie = function (min, max) {
    var firstHalf = (max - min) / 2;
    return this.rollDie(min, min + firstHalf) + this.rollDie(0, max - min - firstHalf);
};

Dice.randomElement = function (array) {

    var total = 0;
    for (var a = 0; a < array.length; a++) {
        if (array[a].hasOwnProperty('frequency')) {
            total += array[a].frequency;
        }
        else {
            total += 1;
        }

    }

    var index = (Math.random() * total);
    total = 0;
    for (var a = 0; a < array.length; a++) {
        if (array[a].hasOwnProperty('frequency')) {
            total += array[a].frequency;
        }
        else {
            total += 1;
        }
        if (total > index) {
            return array[a];
        }
    }

};


module.exports = Dice;