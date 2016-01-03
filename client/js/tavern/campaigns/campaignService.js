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
                            }),

                characters: $resource('/api/campaigns/:action/:campaignID/:characterID', { action: '@action', campaignID: '@campaignID', characterID: '@characterID' }, {
                                save: { method: 'POST' }
                            })

            };

		}


	]);
	
}) (angular.module('CurseApp'));
	