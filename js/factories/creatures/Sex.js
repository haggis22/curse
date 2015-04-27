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

                getNominative: function(sex)
                {
                    switch (sex)
                    {
                        case Sex.prototype.FEMALE:
                            return 'she';
                        case Sex.prototype.MALE:
                            return 'he';
                        default:
                            return 'it'
                    }
                },

                getObjective: function(sex)
                {
                    switch (sex)
                    {
                        case Sex.prototype.FEMALE:
                            return 'her';
                        case Sex.prototype.MALE:
                            return 'him';
                        default:
                            return 'it'
                    }
                },

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
	