(function (app) {

    "use strict";

    app.controller('tavern.createController', ['$scope', '$rootScope', '$state', '$timeout', 'errorService', 'characterService', 'playerService', 'skillService', 'Creature', 'Sex',

		function ($scope, $rootScope, $state, $timeout, errorService, characterService, playerService, skillService, Creature, Sex) {

		    // set up a brand-new character
		    characterService.current = {};

		    $scope.Creature = Creature;
		    $scope.Sex = Sex;
		    $scope.playerService = playerService;

		    $scope.availableSpecies = ['dwarf', 'elf', 'hobbit', 'human'];

		    $scope.statArray = [
                { prop: 'str', name: 'Strength' },
                { prop: 'dex', name: 'Dexterity' },
                { prop: 'int', name: 'Intelligence' },
                { prop: 'pie', name: 'Piety' }
            ];

		    $scope.createCharacter = function (isValid) {

		        $scope.submitted = true;
		        if (!isValid) {
		            return;
		        }

		        characterService.characters.create({}, $scope.character,

                    function (character) {

                        // basically reload the page, using the newly-created ID as part of the URL
                        $state.go('tavern.characters.single.edit', { characterID: response._id }, { reload: true });

                    },
                    function (error) {

                        console.log(error);
                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not create character", error) });

                    });

		    };

		}

	]);

})(angular.module('CurseApp'));

