"use strict";

(function (app) {

    app.filter('capFirst', function() {

        return function (text) {

            if (text == null)
            {
                return '';
            }

            var myText = text.toString();
            return myText.substring(0, 1).toUpperCase() + myText.substring(1);
            
		};

	});

})(angular.module('CurseApp'));
	

