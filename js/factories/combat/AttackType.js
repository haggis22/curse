"use strict";

(function (app) {

    app.factory('AttackType', [

		function () {

		    function AttackType(attackType) 
            {
                this.skills = {};
		    };

            AttackType.prototype.getSkills = function()
            {
                var skills = [];

                for (var prop in this.skills)
                {
                    if (this.skills.hasOwnProperty(prop))
                    {
                        skills.push(this.skills[prop]);
                    }
                }

                return skills;
            }

            AttackType.prototype.addRelevantSkill = function(skillName)
            {
                this.skills[skillName] = skillName;
            };


		    return (AttackType);

		}

	]);

})(angular.module('CurseApp'));
	

