"use strict";

function valueOrDefault(otherStat) {
    if (otherStat)
    {
        return { value: otherStat.value, max: otherStat.max, adjust: otherStat.adjust };
    }

    return { value: 0, max: 0, otherStat: 0 };
}

function statsOrDefault(stats) {

    if (stats) {

        return {
            
            str: valueOrDefault(stats.str),
            dex: valueOrDefault(stats.dex),
            int: valueOrDefault(stats.int),
            pie: valueOrDefault(stats.pie)

        };

    }

    return {
        str: valueOrDefault(null),
        dex: valueOrDefault(null),
        int: valueOrDefault(null),
        pie: valueOrDefault(null)
    };

};


var Creature = function (creature) {

    this._id = creature._id;
    this.name = creature.name;
    this.species = creature.species == null ? 'human' : creature.species;
    this.sex = creature.sex;
    this.class = creature.class;

    this.stats = statsOrDefault(creature.stats);
    this.health = valueOrDefault(creature.health);

    this.skills = creature.skills ? creature.skills : {};

    this.bonus = creature.bonus ? { stats: creature.bonus.stats, skills: creature.bonus.skills} : { stats: 0, skills: 0 };


};

Creature.valueOrDefault = valueOrDefault;
Creature.statsOrDefault = statsOrDefault;

Creature.getName = function(useDefiniteArticle)
{
    return this.name;
}



module.exports = Creature;
