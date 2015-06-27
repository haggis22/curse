"use strict";

(function(app) {

	app.service('shoppeService', [ '$resource',

		function($resource) {

            return $resource('/api/shoppe/');

		}

	]);
	
}) (angular.module('CurseApp'));
	