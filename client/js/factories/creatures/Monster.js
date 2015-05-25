"use strict";

(function(app) {

	app.factory('Monster', ['Creature',  'Sex',

		function(Creature, Sex) {

		    function Monster(monster) {

                Creature.call(this, monster);

                this.article = monster.article;
                this.image = monster.image;
                this.sex = monster.sex == null ? Sex.prototype.NEUTER : monster.sex;


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
	