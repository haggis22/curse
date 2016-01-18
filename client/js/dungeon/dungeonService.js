"use strict";

(function(app) {

	app.service('dungeonService', [ '$resource', 

		function($resource) {

            return {

                dungeons: $resource('/api/dungeons/:campaignID', { campaignID: '@campaignID' }),

                dungeon: null,
                character: null

            };

		}


	]);
	
}) (angular.module('CurseApp'));
	