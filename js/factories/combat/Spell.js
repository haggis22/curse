"use strict";

(function(app) {

	app.factory('Spell', 

		function() {

			function Spell(spell) {

                for (var prop in spell)
                {
                    if (spell.hasOwnProperty(prop))
                    {
                        this[prop] = spell[prop];
                    }
                }

			};

			return (Spell);

		}

	);
	
}) (angular.module('CurseApp'));
	