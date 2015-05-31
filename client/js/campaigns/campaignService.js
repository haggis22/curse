"use strict";

(function(app) {

	app.service('campaignService', [ '$resource', 

		function($resource) {

            return $resource('/api/campaigns/:id', {}, {
                'save': { method: 'PUT' }
            });

		}


	]);
	
}) (angular.module('CurseApp'));
	