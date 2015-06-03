"use strict";

function valueOrDefault(value, defaultValue) {
    return (value == null) ? defaultValue : value;
}

function statsOrDefault(stats) {

    if (stats) {
        return {
            str: valueOrDefault(stats.str, 0),
            int: valueOrDefault(stats.int, 0),
            dex: valueOrDefault(stats.dex, 0),
            health: valueOrDefault(stats.health, 0),
            power: valueOrDefault(stats.power, 0),
            bonus: valueOrDefault(stats.bonus, 0)
        };

    }

    return { str: 0, int: 0, dex: 0, health: 0, power: 0, bonus: 0 };
};


var Creature = function (creature) {

    this._id = creature._id;
    this.name = creature.name;
    this.species = creature.species == null ? 'human' : creature.species;
    this.sex = creature.sex;
    this.class = creature.class;

    this.stats = statsOrDefault(creature.stats);
    this.maxStats = statsOrDefault(creature.maxStats);

};

Creature.valueOrDefault = valueOrDefault;
Creature.statsOrDefault = statsOrDefault;

Creature.getName = function(useDefiniteArticle)
{
    return this.name;
}



module.exports = Creature;
