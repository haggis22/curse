"use strict";

(function(app) {

	app.factory('Skill', ['SkillType',

		function(SkillType) {

			function Skill(name, level) {
                this.name = name;
                this.level = level;
			};
			
			return (Skill);

		}

	]);
	
}) (angular.module('CurseApp'));
	