"use strict";

(function(app) {

	app.factory('Monster', ['Creature', 'Sex',

		function(Creature, Sex) {


			function Monster(monster) {

                if (monster.sex == null)
                {
                    monster.sex = Sex.prototype.NEUTER;
                }

                Creature.call(this, monster);

                this.article = monster.article == null ? 'a' : monster.article;
                this.frequency = monster.frequency;
                this.treasure = monster.treasure == null ? [] : monster.treasure;
                this.images = monster.images;

			};
			
			Monster.prototype = Object.create(Creature.prototype);
            
            Monster.prototype.constructor = Monster;

            Monster.prototype.getName = function(useDefiniteArticle) {

                // if we know the name of the monster, then use that instead
                if (this.name != null)
                {  
                    return this.name;
                }

                var text = '';

                if (useDefiniteArticle != null)
                {
                    text += (useDefiniteArticle ? 'the' : this.article) + ' ';
                }
                
                text += this.species;

                return text;

            };

            Monster.prototype.spawn = function() {
				return $.extend(true, {}, this);
            }

			return (Monster);

		}

	]);
	
}) (angular.module('CurseApp'));
	