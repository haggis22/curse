"use strict";

(function(app) {


	app.controller('dungeon.characterPanelController', ['$scope', '$rootScope', '$state', 'dungeonService', 'Sex', 'Stat',

		function($scope, $rootScope, $state, dungeonService, Sex, Stat) {

            $scope.dungeonService = dungeonService;
            $scope.Sex = Sex;
            $scope.Stat = Stat;



        }

	]);	
    
	app.directive('characterPanel', [
    
        function() {

            return {

                restrict: 'E',
//                scope: { player: '=' },
                templateUrl: '/js/dungeon/character/character-panel.html?v=' + (new Date()).getTime(),
                controller: 'dungeon.characterPanelController',
                link: function($scope, $element, $attrs)  {

                }

            };

        }
    
    ]);
    		
	
}) (angular.module('CurseApp'));

