"use strict";

(function(isNode, isAngular) {

    // This wrappers function returns the contents of the module, with dependencies
    var SexModule = function () {

        var Sex = function() {};

        Sex.FEMALE = 1;
        Sex.MALE = 2;
        Sex.NEUTER = 3;

        Sex.getSex = function(sex)
        {
            switch (sex)
            {
                case Sex.FEMALE:
                    return 'female';
                case Sex.MALE:
                    return 'male';
                default:
                    return 'neuter';
            }
        };

        Sex.getSexAbbr = function(sex)
        {
            switch (sex)
            {
                case Sex.FEMALE:
                    return 'F';
                case Sex.MALE:
                    return 'M';
                default:
                    return '-';
            }
        };

        Sex.getNominative = function(sex)
        {
            switch (sex)
            {
                case Sex.FEMALE:
                    return 'she';
                case Sex.MALE:
                    return 'he';
                default:
                    return 'it'
            }
        };

        Sex.getObjective = function (sex) {
            switch (sex) {
                case Sex.FEMALE:
                    return 'her';
                case Sex.MALE:
                    return 'him';
                default:
                    return 'it'
            }
        };

        Sex.getPossessive = function (sex) {
            switch (sex) {
                case Sex.FEMALE:
                    return 'her';
                case Sex.MALE:
                    return 'his';
                default:
                    return 'its'
            }
        };

        return Sex;

    };

    if (isAngular) 
    {
        // AngularJS module definition
        angular.module('CurseApp').
            factory('Sex', [SexModule]);

    } else if (isNode) {
        // NodeJS module definition
        module.exports = SexModule();
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined'); 
