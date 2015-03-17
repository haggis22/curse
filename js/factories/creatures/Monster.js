"use strict";

(function(app) {

	app.factory('Monster', ['Creature',

		function(Creature) {


			function Monster(name, species, bodyShape, article, sex, str, int, dex, health, frequency, treasure, images) {

                Creature.call(this, name, species, bodyShape, sex, str, int, dex, health);
                this.article = article;
                this.frequency = frequency;
                this.treasure = treasure;
                this.images = images;

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
	