"use strict";

(function(isNode, isAngular) {

    // This wrappers function returns the contents of the module, with dependencies
    var SkillModule = function () {

        var Skill = function (skill) {

            this._id = skill._id;
            this.name = skill.name;
            this.prereqs = skill.prereqs;

        };

	    return Skill;

    };

    if (isAngular) 
    {
        // AngularJS module definition
        angular.module('CurseApp').
            factory('Skill', [SkillModule]);

    } else if (isNode) {
        // NodeJS module definition
        module.exports = SkillModule();
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined'); 
