"use strict";

(function(app) {


	app.controller('dungeon.partyPanelController', ['$scope', '$rootScope', '$state', 'dungeonService', 

		function($scope, $rootScope, $state, dungeonService) {

            $scope.dungeonService = dungeonService;


            $scope.showCharacter = function(character)
            {
                dungeonService.character = character;
            }

        }

	]);	
    
	app.directive('partyPanel', [
    
        function() {

            return {

                restrict: 'E',
//                scope: { player: '=' },
                templateUrl: '/js/dungeon/party/party-panel.html?v=' + (new Date()).getTime(),
                controller: 'dungeon.partyPanelController',
                link: function($scope, $element, $attrs)  {

                }

            };

        }
    
    ]);
    		
	
}) (angular.module('CurseApp'));

