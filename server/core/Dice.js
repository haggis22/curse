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

module.exports = Dice;