"use strict";

var Creature = function (creature) {

    this.name = creature.name;
    this.species = creature.species == null ? 'human' : creature.species;
    this.class = creature.class;
    this.str = creature.str == null ? 0 : creature.str;
    this.int = creature.int == null ? 0 : creature.int;
    this.dex = creature.dex == null ? 0 : creature.dex;

};
			
Creature.prototype = {
				
    getName: function(useDefiniteArticle)
    {
        return this.name;
    }

};  // prototype

module.exports = Creature;
