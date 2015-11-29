"use strict";

(function(app) {

	app.controller('loginController', ['$scope', '$rootScope', '$state', 'errorService', 'userService',

		function($scope, $rootScope, $state, errorService, userService) {
			
            $scope.login = function() {

                console.log('I am attempting to log in');

                
                userService.login.login({ username: $scope.username, password: $scope.password },

                    function(response) {

                        console.log('Login successful!');

                    },
                    function(error) {

                        console.error('Login failed: ' + error);

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not log in", error) });

                    });

            };

        }  // outer function

	]);			
	
}) (angular.module('CurseApp'));

