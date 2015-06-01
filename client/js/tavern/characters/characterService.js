"use strict";

(function(app) {

	app.service('characterService', [ '$resource', 

		function($resource) {

            return {
            
                characters: $resource('/api/characters/:id', {}, {
                    create: { method: 'POST' },
                    update: { method: 'PUT' }
                }),

                rollup: $resource('/api/characters/rollup/:id', { id: '@id' }, {
                    reroll: { method: 'POST' }
                })
            
            };

		}


	]);
	
}) (angular.module('CurseApp'));
	