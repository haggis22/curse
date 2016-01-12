"use strict";

(function(app) {


	app.controller('tavern.charactersController', ['$scope', '$rootScope', '$state', 'errorService', 'characterService', 'Creature', 'Sex',

		function($scope, $rootScope, $state, errorService, characterService, Creature, Sex) {
			
            $scope.Sex = Sex;
            $scope.characterService = characterService;

            $scope.pullCharacters();

        }

	]);			
	
}) (angular.module('CurseApp'));

