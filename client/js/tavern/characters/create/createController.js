(function (app) {

    "use strict";

    app.controller('tavern.createController', ['$scope', '$rootScope', '$state', '$timeout', 'errorService', 'characterService', 'skillService', 'Creature', 'Sex',

		function ($scope, $rootScope, $state, $timeout, errorService, characterService, skillService, Creature, Sex) {

		    $scope.characterService = characterService;

		    // set up a brand-new character
		    characterService.current = {};

		    $scope.Creature = Creature;
		    $scope.Sex = Sex;

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

		        characterService.characters.create({}, characterService.current,

                    function (character) {

                        // basically reload the page, using the newly-created ID as part of the URL
                        $state.go('tavern.characters.edit', { characterID: character._id }, { reload: true });

                    },
                    function (error) {

                        console.log(error);
                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not create character", error) });

                    });

		    };

		}

	]);

})(angular.module('CurseApp'));

