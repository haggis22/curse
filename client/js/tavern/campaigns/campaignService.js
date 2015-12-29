"use strict";

(function(app) {

	app.service('campaignService', [ '$resource', 

		function($resource) {

            return {

                modules: $resource('/api/campaigns/modules'),

                moduleStart: $resource('/api/campaigns/start/:id', { id: '@id' }, {
                                start: { method: 'POST' }
                            }),

                campaigns: $resource('/api/campaigns/:id', {}, {
                                update: { method: 'PUT' }
                            })

            };

		}


	]);
	
}) (angular.module('CurseApp'));
	