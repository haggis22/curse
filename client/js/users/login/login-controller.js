"use strict";

(function(app) {

	app.controller('loginController', ['$scope', '$rootScope', '$state', 'errorService', 'userService', 'Session',

		function($scope, $rootScope, $state, errorService, userService, Session) {
			
            $scope.login = function() {

                console.log('I am attempting to log in');

                
                userService.login.submit({ username: $scope.username, password: $scope.password },

                    function(response) {

                        var session = new Session(response);
                        userService.setSession(session);

                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not log in", error) });

                    });

            };

        }  // outer function

	]);			
	
}) (angular.module('CurseApp'));

