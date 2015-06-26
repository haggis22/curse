"use strict";

(function(app) {


	app.controller('tavern.shoppeController', ['$scope', '$rootScope', '$state', '$timeout', 'errorService', 'characterService', 'skillService', 'Creature',
		function($scope, $rootScope, $state, $timeout, errorService, characterService, skillService, Creature) {
			

            $scope.weapons = 
            [
                { name: 'broadsword', price: { gold: 20, silver: 5 } },
                { name: 'mace', price: { gold: 12, silver: 6, copper: 3 } },
                { name: 'axe', price: { gold: 5, silver: 10, copper: 5 } },
                { name: 'kazoo', price: { free: true } }
            ];


        }   // end controller function

	]);			
	
}) (angular.module('CurseApp'));

