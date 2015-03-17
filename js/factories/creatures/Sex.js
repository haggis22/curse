"use strict";

(function(app) {

	app.factory('Sex', 

		function() {

			function Sex() {
			};
			
			Sex.prototype = {

                FEMALE: "1",
                MALE: "2",
                NEUTER: "3",

                getPossessive: function(sex)
                {
                    switch (sex)
                    {
                        case Sex.prototype.FEMALE:
                            return 'her';
                        case Sex.prototype.MALE:
                            return 'his';
                        default:
                            return 'its'
                    }
                }

			};  // Sex prototype

			return (Sex);

		}

	);
	
}) (angular.module('CurseApp'));
	