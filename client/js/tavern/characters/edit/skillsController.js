"use strict";

(function(app) {


	app.controller('tavern.skillsController', ['$scope', '$rootScope', '$state', '$timeout', 'errorService', 'characterService', 'skillService', 'Creature', 
		function($scope, $rootScope, $state, $timeout, errorService, characterService, skillService, Creature) {
			
            $scope.Creature = Creature;

            $scope.availableSkills = [];

            $scope.pullSkills = function() {

                $scope.availableSkills.length = 0;

                skillService.query({}, 
                    
                    function(response) {

                        $scope.availableSkills = response;

                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not fetch skills", error) });

                    });

            };

            $scope.pullSkills();


            $scope.showPotentialSkill = function(skill)
            {
                if ((characterService.current == null) || (skill == null))
                {
                    return false;
                }

                // check to see whether the character already has the skill in question
                if (characterService.current.getSkill(skill.name))
                {
                    return false;
                }

                // if the skill doesn't have any reqs at all, or only stats pre-reqs, then always show it
                if ((!skill.prereqs) || (!skill.prereqs.skills))
                {
                    return true;
                }

                for (var prop in skill.prereqs.skills)
                {
                    if (skill.prereqs.skills.hasOwnProperty(prop))
                    {
                        // if they don't even have level 1 in the skill, then don't show this sub-skill
                        if (characterService.current.getSkillLevel(prop) == 0)
                        {
                            return false;
                        }
                    }
                }

                return true;
            };


            // this can check both stat and skill pre-requisites
            $scope.hasPreReqs = function(reqs, mapName)
            {
                for (var prop in reqs)
                {
                    if (reqs.hasOwnProperty(prop))
                    {
                        // getStatValue will return 0 if the character does not have that stat at all
                        if (characterService.current.getStatValue(mapName, prop) < parseInt(reqs[prop], 10))
                        {
                            return false;
                        }

                    }
                    
                }  // for each pre-req

                return true;
            }


            // if the character is short of the necessary value in any of
            // the skill minimums, then he can't acquire this skill yet
            $scope.skillEligible = function(skill) 
            {
                if ((characterService.current == null) || (skill == null))
                {
                    return false;
                }

                if (!skill.prereqs)
                {
                    return true;
                }

                return $scope.hasPreReqs(skill.prereqs.stats, 'stats') && $scope.hasPreReqs(skill.prereqs.skills, 'skills');

            };

            $scope.addSkill = function(skill) {

                $scope.skillError = null;

                if (!$scope.skillEligible(skill))
                {
                    $scope.skillError = "You are not eligible for the " + skill.name + " skill.";
                    return;
                }

                if (characterService.current.bonus.skills < 1)
                {
                    $scope.skillError = "You have no skill points to allocate.";
                    return;
                }

                var mySkill = 
                {
                    name: skill.name,
                    value: 1,
                    max: 1,
                    adjust: 0
                };

                // take a point from his skills allocation
                characterService.current.bonus.skills--;

                characterService.current.skills[skill.name] = mySkill;


            };


            $scope.raiseSkill = function(skillName)
            {
                characterService.current.skills[skillName].adjust++;
                characterService.current.bonus.skills--;
            };

            $scope.lowerSkill = function(skillName)
            {
                characterService.current.skills[skillName].adjust--;
                characterService.current.bonus.skills++;
            };


            $scope.saveSkills = function() {

                characterService.skills.save({ id: characterService.current._id }, characterService.current,

                    function(response) {
                        
                        $scope.showUpdateSuccess();

                    },
                    function(error) {

                        console.log(error);
                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not save skills", error) });

                    });

            };

            $scope.showUpdateSuccess = function() {
                // show the success message for a bit
                $scope.showUpdated = true;
                $timeout(function() { $scope.showUpdated = false; }, 1500);
            };


        }

	]);			
	
}) (angular.module('CurseApp'));

