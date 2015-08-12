"use strict";

(function (app) {

    app.filter('coins', [ 'Value', 
    
        function(Value) {

            return function (amount) {

                if (amount == null)
                {
                    return '';
                }

                if (!isNaN(amount))
                {
                    // this is a single number, so we're going to convert it to a Value object
                    amount = Value.colorUp(amount);
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

	    }]
    );

})(angular.module('CurseApp'));
	

