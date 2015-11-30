"use strict";

(function(app) {

	app.service('userService', [ '$resource', '$rootScope', '$cookies', 'constants',

		function($resource, $rootScope, $cookies, constants) {

            var previousSession = $cookies.get(constants.cookies.SESSION);

            return {
            
                previousSession: previousSession,
                currentSession: null,

                setSession: function(session) {

                    console.log('setting session to ' + JSON.stringify(session));

                    if (session == null)
                    {
                        $cookies.remove(constants.cookies.SESSION);
                    }
                    else
                    {
                        // save the session UUID for next time
                        var expiresDate = new Date();
                        expiresDate.setFullYear(expiresDate.getFullYear() + 1);
                        $cookies.put(constants.cookies.SESSION, session.sessionHash, { expires: expiresDate });
                    }

                    this.currentSession = session;
                    this.previousSession = null;

                    $rootScope.$broadcast(constants.events.SESSION_CHANGE, { session: session });

                },

                isLoggedIn: function()
                {
                    return this.currentSession !== null;
                },

                isReady: function()
                {
                    return this.previousSession === null;
                },

                login: $resource('/api/users/login', {}, {
                    submit: { method: 'POST' }
                }),

                session: $resource('/api/users/session', {}, {
                    'check': { method: 'GET' }

                })

            
            };

		}


	]);
	
}) (angular.module('CurseApp'));
	