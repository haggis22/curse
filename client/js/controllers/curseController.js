"use strict";

(function(app) {

	app.controller('curseController', [ '$scope', '$rootScope', '$state', 'errorService', 'userService', 'Session', 'constants', '$cookies',

		function($scope, $rootScope, $state, errorService, userService, Session, constants, $cookies) {

            $scope.userService = userService;

            console.log('userService.isReady() = ' + userService.isReady());

            if (userService.isReady())
            {
                console.log('Sending to login');
                $state.go('login');
            }

            $scope.checkSession = function () {

                if (userService.isReady()) {

                    // either there was no previous token, or it has already been resolved.  Nothing to do here.
                    return;
                }

                userService.session.check({},

                    function (response) {

                        if (response == null)
                        {
                            // unknown session
                            userService.setSession(null);
                        }
                        else
                        {
                            userService.setSession(new Session(response));
                        }

                    },
                    function (error) {

                        // userService.setSession(null);
                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not load user session", error) });

                    }
                );


            };

            $scope.checkSession();
	
            $scope.logout = function() {

                userService.setSession(null);

            };

            $scope.$on(constants.events.SESSION_CHANGE, function (event, args) {

                if (args.session)
                {
                    return $state.go('tavern');
                }

                $state.go('login');

            });
		

		}  // outer function

	]);			
	
}) (angular.module('CurseApp'));

