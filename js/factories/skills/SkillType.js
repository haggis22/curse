"use strict";

(function(app) {

	app.factory('SkillType', 

		function() {

			function SkillType(skill) {
                this.name = skill.name;
                this.description = skill.description;
			};

			return (SkillType);

		}

	);
	
}) (angular.module('CurseApp'));
	