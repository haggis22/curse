"use strict";

(function(app) {

	app.service('dungeonService', [ '$resource', 

		function($resource) {

            return {

                dungeons: $resource('/api/dungeons/:campaignID', { campaignID: '@campaignID' }),

                exit: $resource('/api/dungeons/exit/:campaignID/:exitID', { campaignID: '@campaignID', exitID: '@exitID' }, {
                    take: { method: 'POST' }
                }),


                dungeon: null,
                character: null

            };

		}


	]);
	
}) (angular.module('CurseApp'));
	