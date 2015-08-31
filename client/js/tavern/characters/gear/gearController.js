"use strict";

(function(app) {


	app.controller('tavern.gearController', ['$scope', '$rootScope', '$state', 'errorService', 'shoppeService', 
		function($scope, $rootScope, $state, errorService, shoppeService) {

            // calls the method in tavern.singleController
            $scope.pullCharacter($scope.characterID);

        }   // end controller function

	]);			
	
}) (angular.module('CurseApp'));

