"use strict";

(function (app) {

    app.filter('floor', function() {

        return function (number) {

            return Math.floor(number);
            
		};

	});

})(angular.module('CurseApp'));
	

