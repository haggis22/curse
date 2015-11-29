"use strict";

(function(app) {

	app.controller('curseController', [ '$scope', '$rootScope', 'errorService', 'userService', 'Session',

		function($scope, $rootScope, errorService, userService, Session) {

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
                            userService.clearSession();
                        }
                        else
                        {
                            var session = new Session(response);
                            userService.setSession(session);
                        }

                    },
                    function (error) {

                        // viewService.clearSession();
                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not load user session", error) });

                    }
                );


            };

            $scope.checkSession();
	
		
		}  // outer function

	]);			
	
}) (angular.module('CurseApp'));

