"use strict";

(function(app) {

	app.service('shoppeService', [ '$resource',

		function($resource) {

            var types = [
                    { category: 'weapons', itemName: 'weapon' },
                    { category: 'armour', itemName: 'armour' },
                    { category: 'potions', itemName: 'potion' },
                    { category: 'general', itemName: 'item' }
                ];

            return {

                shoppe: $resource('/api/shoppe/'),

                purchase: $resource('/api/shoppe/:characterID/:itemID', { characterID: '@characterID', itemID: '@itemID' }, {
                    
                    buy: { method: 'POST' }

                }),

                itemTypes: types,

                display: types[0],

                setDisplay: function(type) {
                    this.display = type;
                }

            };

		}

	]);
	
}) (angular.module('CurseApp'));
	