"use strict";

(function(app) {

	app.service('spellService', [ 'SpellType',
		function(SpellType) {

            this.spells = 
            {
                'missile': new SpellType({ name: 'missile', target: true, speed: 20, damage: { min: 0.1, max: 0.3 }, power: 2 }),
                'fireball': new SpellType({ name: 'fireball', target: true, speed: 10, damage: { min: 0.6, max: 1 }, power: 5 })

			};


            this.getSpell = function(spellName)
            {
                spellName = spellName.toLowerCase();

                if (this.spells.hasOwnProperty(spellName))
                {
                    return this.spells[spellName];
                }

                return null;
				
			};


		}

	]);
	
}) (angular.module('CurseApp'));
	