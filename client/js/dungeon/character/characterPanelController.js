"use strict";

(function(app) {


	app.controller('dungeon.characterPanelController', ['$scope', 

		function($scope) {

        }

	]);	
    
	app.directive('characterPanel', [
    
        function() {

            return {

                restrict: 'E',
                scope:
                {
                    character: '='
                },
                templateUrl: '/js/dungeon/character/character-panel.html?v=' + (new Date()).getTime(),
                controller: 'dungeon.characterPanelController',
                link: function($scope, $element, $attrs)  {

                }

            };

        }
    
    ]);
    		
	
}) (angular.module('CurseApp'));

