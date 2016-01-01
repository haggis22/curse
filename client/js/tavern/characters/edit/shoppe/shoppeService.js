"use strict";

(function(app) {

	app.service('shoppeService', [ '$resource',

		function($resource) {

            return {

                shoppe: $resource('/api/shoppe/'),

                purchase: $resource('/api/shoppe/:characterID/:itemID', { characterID: '@characterID', itemID: '@itemID' }, {
                    
                    buy: { method: 'POST' }

                })


            };

		}

	]);
	
}) (angular.module('CurseApp'));
	