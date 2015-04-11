"use strict";

(function(app) {

	app.service('spellService', [ 'SpellType',
		function(SpellType) {

            this.spells = 
            {
                'missile': new SpellType({ type: SpellType.prototype.TYPE_ATTACK, name: 'missile', targeted: true, damage: { min: 0.2, max: 0.35 }, power: 2, castingTime: 5 }),
                'fireball': new SpellType({ type: SpellType.prototype.TYPE_ATTACK, name: 'fireball', targeted: true, damage: { min: 0.6, max: 1 }, power: 5 , castingTime: 20 })

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
	