"use strict";

(function(app) {


    app.controller('dungeon.character.bioController', ['$scope', 'Sex', 'Stat',

		function($scope, Sex, Stat) {

            $scope.Sex = Sex;
            $scope.Stat = Stat;

        }   // end controller function

	]);			

	app.directive('characterBio', function() {

        return {

            scope: 
            {
                character: '='
            },
            restrict: 'E',
            replace: true,
            templateUrl: '/js/dungeon/character/bio/bio.html?v=' + (new Date()).getTime(),
            controller: 'dungeon.character.bioController'
        
        };


    });

	
}) (angular.module('CurseApp'));

