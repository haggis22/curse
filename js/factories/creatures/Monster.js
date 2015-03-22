"use strict";

(function(app) {

	app.factory('Monster', ['Creature', 'Sex', 'diceService',  'treasureService',

		function(Creature, Sex, diceService, treasureService) {


			function Monster(monster) {

                if (monster.sex == null)
                {
                    monster.sex = Sex.prototype.NEUTER;
                }

                Creature.call(this, monster);

                this.article = monster.article == null ? 'a' : monster.article;
                this.frequency = monster.frequency;
                this.numAppearing = monster.numAppearing == null ? { min: 1, max: 1 } : monster.numAppearing;
                if (this.numAppearing.min == null) 
                {
                    this.numAppearing.min = 1;
                }
                if (this.numAppearing.max == null)
                {
                    this.numAppearing.max = 1;
                }
                this.treasure = monster.treasure == null ? [] : monster.treasure;
                this.attacks = monster.attacks;
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

                var monsters = [];
                var numAppearing = diceService.rollDie(this.numAppearing.min, this.numAppearing.max);

                for (var m=0; m < numAppearing; m++)
                {
                    var monster = $.extend(true, {}, this);

                    if (monster.images != null)
				    {
					    monster.image = monster.images[diceService.rollDie(0, monster.images.length - 1)];
				    };

                    // set up the monster's items - he may get to use some of them in combat
                    for (var t=0; t < monster.treasure.length; t++)
                    {
                        var item = treasureService.randomTreasure(monster.treasure[t]);
                        monster.addItem(item);
                    
                        //TODO? Allow the monster to pick the best item
                        if (item.isEquippableBy(monster))
                        {
                            monster.useItem(item);
                        }

                    }


                    monsters.push(monster);
                }

                return monsters;

            }

			return (Monster);

		}

	]);
	
}) (angular.module('CurseApp'));
	