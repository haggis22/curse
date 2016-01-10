"use strict";

(function(app) {

	app.service('characterService', [ '$resource', 

		function($resource) {

            this.characters = $resource('/api/characters/:id', {}, {
                create: { method: 'POST' }
            });

            this.byCampaign = $resource('/api/characters/campaign/campaignID', { campaignID: '@campaignID' });

            this.stats = $resource('/api/characters/:id/stats');

            this.skills = $resource('/api/characters/:id/skills');

            this.rollup = $resource('/api/characters/rollup/:id', { id: '@id' }, {
                    reroll: { method: 'POST' }
            });

            this.current = null;

            this.all = {};

            this.clear = function() {
                this.all = {};
            };

            this.add = function(character) {

                if (character == null || character._id == null)
                {
                    return;
                }

                this.all[character._id] = character;

            };

            this.getCharacters = function() {

                var array = [];

                for (var prop in this.all)
                {
                    if (this.all.hasOwnProperty(prop))
                    {
                        array.push(this.all[prop]);
                    }
                }

                return array;

            };

		}


	]);
	
}) (angular.module('CurseApp'));
	