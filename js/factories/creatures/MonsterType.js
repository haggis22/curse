"use strict";

(function(app) {

	app.factory('MonsterType', ['Monster', 'Sex', 'Skill', 'diceService',  'treasureService',

		function(Monster, Sex, Skill, diceService, treasureService) {

		    function MonsterType(monsterType) {

                // set all the known values
                for (var prop in monsterType)
                {
                    if (monsterType.hasOwnProperty(prop))
                    {
                        this[prop] = monsterType[prop];
                    }
                }

                if (this.sex == null)
                {
                    monsterType.sex = Sex.prototype.NEUTER;
                }

                if (this.article == null)
                {
                    this.article = 'a';
                }

                if (this.numAppearing == null)
                {
                    this.numAppearing = { min: 1, max: 1 };
                }

                if (this.numAppearing.min == null) 
                {
                    this.numAppearing.min = 1;
                }
                if (this.numAppearing.max == null)
                {
                    this.numAppearing.max = 1;
                }

                this.treasure == this.treasure || [];
                this.skillSet = this.skillSet || [];
                this.attacks = this.attacks || [];
                this.images = this.images || [];

			};
			
            MonsterType.prototype.constructor = MonsterType;

            MonsterType.prototype.spawn = function() {

                var monsters = [];
                var numAppearing = diceService.rollDie(this.numAppearing.min, this.numAppearing.max);

                for (var m=0; m < numAppearing; m++)
                {
                    var monster = new Monster($.extend(true, {}, this));

                    if (this.images != null)
				    {
					    monster.image = this.images[diceService.rollDie(0, this.images.length - 1)];
				    };

                    // set up the monster's skills
                    for (var s=0; s < this.skillSet.length; s++)
                    {
                        monster.skills.push(new Skill(this.skillSet[s].type, diceService.averageDie(this.skillSet[s].min, this.skillSet[s].max)));
                    }

                    // set up the monster's items - he may get to use some of them in combat
                    for (var t=0; t < this.treasure.length; t++)
                    {
                        var item = treasureService.randomTreasure(this.treasure[t]);
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

			return (MonsterType);

		}

	]);
	
}) (angular.module('CurseApp'));
	