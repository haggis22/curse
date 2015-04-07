"use strict";

(function(app) {

	app.factory('SpellType', 

		function() {

			function SpellType(spell) {

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

            SpellType.prototype.constructor = SpellType;

            SpellType.prototype.requiresTarget = function()
            {
                return this.requireTarget; 
            };


			return (SpellType);

		}

	);
	
}) (angular.module('CurseApp'));
	