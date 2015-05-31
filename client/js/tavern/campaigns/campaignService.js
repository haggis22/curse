"use strict";

(function(app) {

	app.service('campaignService', [ '$resource', 

		function($resource) {

            return $resource('/api/campaigns/:id', {}, {
                create: { method: 'POST' },
                update: { method: 'PUT' }
            });

		}


	]);
	
}) (angular.module('CurseApp'));
	