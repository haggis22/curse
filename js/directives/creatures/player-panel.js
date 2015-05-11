"use strict";

(function(app) {

	app.directive('playerPanel', ['skillService', 
    
        function(skillService) {

/*
        var directive = {}
        directive.restrict = 'E';
        directive.scope = { player: '=' };
        directive.templateUrl = '/partials/creatures/player-panel.html';

        return directive;
*/
            return {

                restrict: 'E',
                scope: { player: '=' },
                templateUrl: '/partials/creatures/player-panel.html',
                controller: function($scope) {
                    $scope.skillService = skillService;
                },
                link: function($scope, $element, $attrs)  {

                }

            };

        }
    
    ]);
	
}) (angular.module('CurseApp'));




