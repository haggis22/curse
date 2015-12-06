"use strict";

(function(app) {

	app.controller('curseController', [ '$scope', '$rootScope', '$state', 'errorService', 'userService', 'Session', 'constants', '$cookies',

		function($scope, $rootScope, $state, errorService, userService, Session, constants, $cookies) {


            $scope.userService = userService;

            $scope.checkSession = function () {

                if (!userService.hasPreviousSession()) {

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

                // if the session is empty then send them to the login screen
                if (!args.session)
                {
                    return $state.go('login');
                }

                // they are on the login screen and have just logged in, then send them to the tavern
                if ($state.is('login') && (args.session))
                {
                    return $state.go('tavern');
                }

                // otherwise they have auto-logged in, so just leave them where they are
                return;


            });
		

		}  // outer function

	]);			
	
}) (angular.module('CurseApp'));

