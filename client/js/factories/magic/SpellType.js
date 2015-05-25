"use strict";

(function(app) {

	app.factory('SpellType', 

		function() {

			function SpellType(spell) {

                this.type = spell.type;
                this.incantation = spell.incantation;
                this.targeted = spell.targeted;
                this.power = spell.power;
                this.castingTime = spell.castingTime;
                this.damage = spell.damage;


                for (var prop in spell)
                {
                    if (spell.hasOwnProperty(prop))
                    {
                        this[prop] = spell[prop];
                    }
                }

                this.requireTarget = this.requireTarget || false;
                this.damage = this.damage || { min: 0, max: 0 };


			};

            SpellType.prototype = 
            {
                constructor: SpellType,

                TYPE_ATTACK: 1,

                isTargeted: function() {
                    return this.targeted;
                },

                getType: function() {
                    return this.type;
                },

                getIncantation: function() {
                    return this.incantation;
                }

            };

			return (SpellType);

		}

	);
	
}) (angular.module('CurseApp'));
	