"use strict";

(function(app) {

	app.service('userService', [ '$resource', 

		function($resource) {

            return {
            
                login: $resource('/api/users/login', { username: '@username', password: '@password' }, {
                    login: { method: 'POST' }
                })
            
            };

		}


	]);
	
}) (angular.module('CurseApp'));
	