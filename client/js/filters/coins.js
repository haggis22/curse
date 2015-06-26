"use strict";

(function (app) {

    app.filter('coins', function() {

        return function (amount) {

            if (amount == null)
            {
                return '';
            }

            var string = '';
            var and = '';

            if (amount.gold)
            {
                string += and + amount.gold + ' gp';
                and = ' / ';
            }

            if (amount.silver)
            {
                string += and + amount.silver + ' sp';
                and = ' / ';
            }

            if (amount.copper)
            {
                string += and + amount.copper + ' cp';
                and = ' / ';
            }

            if (string == '')
            {
                string = 'free';
            }

            return string;
            
		};

	});

})(angular.module('CurseApp'));
	

