"use strict";

(function(app) {

	app.service('characterService', [ '$resource', 

		function($resource) {

            return $resource('/api/characters/:id', {}, {
                create: { method: 'POST' },
                update: { method: 'PUT' }
            });

		}


	]);
	
}) (angular.module('CurseApp'));
	