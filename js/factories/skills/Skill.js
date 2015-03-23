"use strict";

(function(app) {

	app.factory('Skill', ['SkillType',

		function(SkillType) {

			function Skill(typeID, level) {
                this.typeID = typeID;
                this.level = level == null ? 0 : level;
			};
			
			Skill.prototype.getName = function() {

                var skillType = SkillType.prototype.getSkillType(this.typeID);
                
                return skillType == null ? 'unknown skill' : skillType.name;
            };


            Skill.prototype.getLevel = function() {
                return this.level;
            };

			return (Skill);

		}

	]);
	
}) (angular.module('CurseApp'));
	