"use strict";

(function(app) {

	app.service('dungeonService', [ '$resource', 

		function($resource) {

            return {

                dungeons: $resource('/api/dungeons/:campaignID', { campaignID: '@campaignID' }),

                exit: $resource('/api/dungeons/exit/:campaignID/:exitID', { campaignID: '@campaignID', exitID: '@exitID' }, {
                    take: { method: 'POST' }
                }),

                take: $resource('/api/dungeons/items/take/:campaignID/:characterID/:itemID', 
                        { campaignID: '@campaignID', characterID: '@characterID', itemID: '@itemID' }, {
                    take: { method: 'POST' }
                }),

                drop: $resource('/api/dungeons/items/drop/:campaignID/:characterID/:itemID', 
                        { campaignID: '@campaignID', characterID: '@characterID', itemID: '@itemID' }, {
                    drop: { method: 'POST' }
                }),

                campaignID: null,
                dungeon: null,
                character: null

            };

		}


	]);
	
}) (angular.module('CurseApp'));
	