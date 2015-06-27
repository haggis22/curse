"use strict";

var Sex = function() {};

Sex.FEMALE = 1;
Sex.MALE = 2;
Sex.NEUTER = 3;

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


module.exports = Sex;

	