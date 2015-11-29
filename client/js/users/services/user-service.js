"use strict";

(function(app) {

	app.service('userService', [ '$resource', 

		function($resource) {

            var cookieName = 'session';
            var previousSession = localStorage.getItem(cookieName);

            return {
            
                SESSION_COOKIE: cookieName,

                previousSession: previousSession,

                clearSession: function() {

                    localStorage.removeItem(cookieName);
                    this.session = null;
                    this.previousSession = null;

                },

                setSession: function(session) {

                    // save the session UUID for next time
                    localStorage.setItem(cookieName, session.session);

                    this.session = session;

                    this.previousSession = null;

                },

                isReady: function()
                {
                    return this.previousSession == null;
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
	