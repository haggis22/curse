"use strict";

(function(app) {

	app.service('userService', [ '$resource', '$rootScope',

		function($resource, $rootScope) {

            var cookieName = 'session';
            var previousSession = localStorage.getItem(cookieName);

            return {
            
                SESSION_COOKIE: cookieName,

                previousSession: previousSession,
                currentSession: null,

                setSession: function(session) {

                    if (session == null)
                    {
                        localStorage.removeItem(cookieName);
                    }
                    else
                    {
                        // save the session UUID for next time
                        localStorage.setItem(cookieName, session.session);
                    }

                    this.currentSession = session;
                    this.previousSession = null;
                    console.log('broadcasting session: ' + JSON.stringify(session));
                    $rootScope.$broadcast('session-change', { session: session });

                },

                isLoggedIn: function()
                {
                    return this.currentSession !== null;
                },

                isReady: function()
                {
                    return this.previousSession === null;
                },

                login: $resource('/api/users/login', { username: '@username', password: '@password' }, {
                    submit: { method: 'POST' }
                }),

                session: $resource('/api/users/session', {}, {
                    'check': {
                        method: 'GET',
                        headers: { 'session': previousSession }
                    }

                })

            
            };

		}


	]);
	
}) (angular.module('CurseApp'));
	