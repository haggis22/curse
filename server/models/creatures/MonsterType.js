"use strict";

var Sex = require(__dirname + '/Sex');
var Stat = require(__dirname + '/Stat');
var Skill = require(__dirname + '/../skills/Skill');
var Dice = require(__dirname + '/../../core/Dice');
var Creature = require(__dirname + '/Creature');

var extend = require('cloneextend');

var MonsterType = function MonsterType(monsterType) {

    // set all the known values
    for (var prop in monsterType)
    {
        if (monsterType.hasOwnProperty(prop))
        {
            this[prop] = monsterType[prop];
        }
    }

    if (this.sex == null)
    {
        monsterType.sex = Sex.NEUTER;
    }

    if (this.article == null)
    {
        this.article = 'a';
    }

    if (this.numAppearing == null)
    {
        this.numAppearing = { min: 1, max: 1 };
    }

    if (this.numAppearing.min == null) 
    {
        this.numAppearing.min = 1;
    }
    if (this.numAppearing.max == null)
    {
        this.numAppearing.max = 1;
    }

    this.treasure = this.treasure || [];
    this.skillSet = this.skillSet || [];
    this.attacks = this.attacks || [];
    this.images = this.images || [];

};

MonsterType.prototype.spawn = function () {

    var monsters = [];
    var numAppearing = Dice.rollDie(this.numAppearing.min, this.numAppearing.max);

    for (var m = 0; m < numAppearing; m++) {

        var monsterInstance = extend.clone(this);

        for (var s = 0; s < Stat.stats.length; s++) {
            var stat = Stat.stats[s];

            if (typeof this.stats[stat] === 'object') {


                monsterInstance.stats[stat].value = monsterInstance.stats[stat].max = Dice.rollDie(this.stats[stat].min, this.stats[stat].max);

                console.log(' ' + stat + ' is an object, rolling new value: ' + monsterInstance.stats[stat].value);

            }

        }

        var monster = new Creature(monsterInstance);

        if (this.images != null) {
            monster.image = this.images[Dice.rollDie(0, this.images.length - 1)];
        };

        // set up the monster's skills
        /*
        for (var s = 0; s < this.skillSet.length; s++) {
        monster.adjustSkill(this.skillSet[s].name, diceService.averageDie(this.skillSet[s].min, this.skillSet[s].max));
        }
        */

        // set up the monster's items - he may get to use some of them in combat
        /*
        for (var t = 0; t < this.treasure.length; t++) {
        var item = treasureService.randomTreasure(this.treasure[t]);
        var addResult = monster.addItem(item);

        if (addResult.success) {
        //TODO? Allow the monster to pick the best item
        if (item.isEquippableBy(monster)) {
        monster.useItem(item);
        }
        }
        else {
        // TODO: just put it into the room
        console.log(addResult.message);
        }

        }
        */
        monsters.push(monster);
    }

    return monsters;

}    // spawn method


module.exports = MonsterType;
