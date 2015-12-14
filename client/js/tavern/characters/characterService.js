"use strict";

(function(app) {

	app.service('characterService', [ '$resource', 

		function($resource) {

            return {
            
                characters: $resource('/api/characters/:id', {}, {
                    create: { method: 'POST' }
                }),

                stats: $resource('/api/characters/:id/stats'),

                skills: $resource('/api/characters/:id/skills'),

                rollup: $resource('/api/characters/rollup/:id', {}, {
                    reroll: { method: 'POST' }
                }),

                current: null
            
            };

		}


	]);
	
}) (angular.module('CurseApp'));
	