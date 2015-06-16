"use strict";

(function(app) {

	app.service('skillService', [ '$resource',

		function($resource) {

            return $resource('/api/skills/:name');

		}

	]);
	
}) (angular.module('CurseApp'));
	