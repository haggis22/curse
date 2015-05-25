"use strict";

(function(app) {

	app.service('skillService', [ 'SkillType',

		function(SkillType) {

            this.skills = {};

            this.addSkill = function(skillType) 
            {
                this.skills[skillType.name] = skillType;
            };

            this.getSkill = function(skillName)
            {
                if (this.skills.hasOwnProperty(skillName))
                {
                    return this.skills[skillName];
                }

                return null;
            };
            
            this.addSkill(new SkillType({ name: 'melee', description: 'melee' }));
            this.addSkill(new SkillType({ name: 'sword', description: 'swordfighting' }));
            this.addSkill(new SkillType({ name: 'magic', description: 'magic' }));
            this.addSkill(new SkillType({ name: 'faith', description: 'faith' }));

            this.getSkillList = function()
            {
                var list = [];
                for (var prop in this.skills)
                {
                    if (this.skills.hasOwnProperty(prop))
                    {
                        list.push(this.skills[prop]);
                    }
                }

                list.sort(function(a, b) { return a.description < b.description ? -1 : 1; });

                return list;
            }

		}

	]);
	
}) (angular.module('CurseApp'));
	