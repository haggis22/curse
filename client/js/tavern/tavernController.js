"use strict";

(function(app) {


	app.controller('tavernController', ['$scope', '$rootScope', '$state', 'errorService', 'userService',

		function($scope, $rootScope, $state, errorService, userService) {

            if (userService.isDefinitelyNotLoggedIn())
            {
                console.log('Sending to login');
                $state.go('login');
            }


        }

	]);			
	
}) (angular.module('CurseApp'));

