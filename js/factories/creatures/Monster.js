"use strict";

(function(app) {

	app.factory('Monster', ['Creature', 

		function(Creature) {

		    function Monster(monster) {

                Creature.call(this, monster);

                this.article = monster.article;
                this.attacks = monster.attacks;
                this.image = monster.image;

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

			return (Monster);

		}

	]);
	
}) (angular.module('CurseApp'));
	