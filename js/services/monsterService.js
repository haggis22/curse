"use strict";

(function(app) {

	app.service('monsterService', ['Monster', 'Sex', 'BodyShape', 'diceService', 'treasureService', 'Attack',
		function(Monster, Sex, BodyShape, diceService, treasureService, Attack) {

			this.monsters = [

                // name, species, bodyShape, article, sex, str, int, dex, health, isUndead, frequency, treasure, images
                new Monster({ species: 'goblin', str: 5, int: 4, dex: 10, health: 5, frequency: 15, numAppearing: { max: 4 }, treasure: ['A'], images: ['goblin1.jpg', 'goblin2.png']}),
                new Monster({ species: 'orc', article: 'an', str: 8, int: 5, dex: 11, health: 10, frequency: 15, numAppearing: { max: 3 }, treasure: ['A'], images: ['orc.png']}),
                new Monster({ species: 'troll', str: 13, int: 4, dex: 8, health: 15, frequency: 9, numAppearing: { max: 2 }, treasure: ['A','B'], images: ['troll.png']}),
                new Monster({ species: 'ogre', article: 'an', str: 14, int: 3, dex: 7, health: 17, frequency: 7, treasure: ['B'], images: ['ogre.png']}),
                new Monster({ species: 'skeleton', isUndead: true, str: 7, int: 0, dex: 9, health: 6, frequency: 14, numAppearing: { max: 3 }, treasure: ['E'], images: ['skeleton1.jpg', 'skeleton2.jpg', 'skeleton3.jpg']}),
                new Monster({ species: 'warlock', str: 10, int: 18, dex: 12, health: 18, frequency: 3, treasure: ['C'], images: ['warlock.png']}),
                new Monster({ species: 'scorchfire dragon', bodyShape: BodyShape.prototype.WINGED_QUADRUPED, str: 18, int: 16, dex: 14, health: 22, frequency: 1, attacks: [ new Attack({ type: Attack.prototype.BITE, damage: 5, weapon: 'bites' }) ], treasure: ['A','D'], images: ['dragon.png']}),
                new Monster({ species: 'giant serpent', bodyShape: BodyShape.prototype.SNAKE, str: 10, int: 0, dex: 8, health: 12, frequency: 8, attacks: [ new Attack({ type: Attack.prototype.BITE, damage: 2, weapon: 'bites' }) ], images: ['serpent.png']}),
                new Monster({ species: 'demon', str: 20, int: 22, dex: 15, health: 24, frequency: 0.5, treasure: ['A','C'], images: ['demon.png']}),
                new Monster({ species: 'runty goblin', str: 2, int: 2, dex: 6, health: 4, frequency: 6, numAppearing: { min: 2, max: 5 }, images: ['runty.png']}),
                new Monster({ species: 'basilisk', bodyShape: BodyShape.prototype.QUADRUPED, str: 6, int: 1, dex: 12, health: 8, frequency: 2, treasure: ['A'], images: ['basilisk.png']}),
                new Monster({ species: 'bugbear', str: 10, int: 6, dex: 9, health: 13, frequency: 8, numAppearing: { max: 3 }, treasure: ['A'], images: ['bugbear.png']}),
                new Monster({ species: 'chimera', bodyShape: BodyShape.prototype.WINGED_QUADRUPED, str: 15, int: 6, dex: 12, health: 18, frequency: 1, attacks: [ new Attack({ type: Attack.prototype.CLAW, damage: 4, weapon: 'claws' }) ], treasure: ['C','D'], images: ['chimera.png']}),
                new Monster({ species: 'ettin', article: 'an', str: 15, int: 3, dex: 12, health: 14, frequency: 3, treasure: ['B'], images: ['Ettin.png']}),
                new Monster({ species: 'gargoyle', bodyShape: BodyShape.prototype.WINGED_HUMANOID, str: 14, int: 5, dex: 9, health: 14, frequency: 3, treasure: ['A'], images: ['gargoyle.png']}),
                new Monster({ species: 'ghoul', isUndead: true, str: 11, int: 2, dex: 9, health: 9, frequency: 3, numAppearing: { max: 3 }, treasure: ['A'], images: ['ghoul.png']}),
                new Monster({ species: 'giant', str: 17, int: 4, dex: 10, health: 18, frequency: 3, treasure: ['A','B'], images: ['giant.png']}),
                new Monster({ species: 'golem', str: 17, int: 0, dex: 12, health: 18, frequency: 3, treasure: ['B'], images: ['golem.png']}),
                new Monster({ species: 'harpy', bodyShape: BodyShape.prototype.WINGED_HUMANOID, str: 7, int: 8, dex: 14, health: 8, frequency: 4, attacks: [ new Attack({ type: Attack.prototype.CLAW, damage: 3, weapon: 'claws' }) ], treasure: ['A','A'], images: ['harpy.png']}),
                new Monster({ species: 'griffin', bodyShape: BodyShape.prototype.WINGED_QUADRUPED, str: 15, int: 3, dex: 12, health: 15, frequency: 3, attacks: [ new Attack({ type: Attack.prototype.CLAW, damage: 4, weapon: 'claws' }) ], treasure: ['A','B','C'], images: []}),
                new Monster({ species: 'hobgoblin', str: 8, int: 5, dex: 11, health: 8, frequency: 12, numAppearing: { max: 3 }, treasure: ['A'], images: ['hobgoblin.png']}),
                new Monster({ species: 'kobold', str: 4, int: 5, dex: 11, health: 4, frequency: 16, numAppearing: { min: 2, max: 5 }, treasure: ['A'], images: ['kobold.png', 'kobold2.png']}),
                new Monster({ species: 'lich', isUndead: true, str: 13, int: 17, dex: 12, health: 18, frequency: 2, treasure: ['C','D'], images: ['lich.png']}),
                new Monster({ species: 'lizard man', str: 8, int: 5, dex: 11, health: 9, frequency: 15, numAppearing: { max: 3 }, treasure: ['A','B'], images: ['lizard_man.png']}),
                new Monster({ species: 'werewolf', str: 14, int: 7, dex: 14, health: 14, frequency: 6, attacks: [ new Attack({ type: Attack.prototype.CLAW, damage: 4, weapon: 'claws' }) ], treasure: ['A','B'], images: ['werewolf.png']}),
                new Monster({ species: 'manticore', bodyShape: BodyShape.prototype.WINGED_QUADRUPED, str: 15, int: 6, dex: 13, health: 15, frequency: 5, attacks: [ new Attack({ type: Attack.prototype.WEAPON, damage: 3, weapon: 'spiked tail' }) ], treasure: ['A','B'], images: ['manticore.png']}),
                new Monster({ species: 'minotaur', str: 16, int: 4, dex: 13, health: 14, frequency: 5, treasure: ['A','B'], images: ['minotaur.png']}),
                new Monster({ species: 'mummy', isUndead: true, str: 12, int: 0, dex: 6, health: 12, frequency: 8, treasure: ['A','B'], images: ['mummy.png']}),
                new Monster({ species: 'vampire', isUndead: true, str: 14, int: 15, dex: 15, health: 15, frequency: 6, treasure: ['A','C','D'], images: ['vampire.png']}),
                new Monster({ species: 'zombie', isUndead: true, str: 12, int: 0, dex: 6, health: 12, frequency: 12, numAppearing: { max: 3 }, treasure: ['A'], images: ['zombie.png']}),
                new Monster({ species: 'gorgon', str: 12, int: 6, dex: 12, health: 16, frequency: 2, treasure: ['B'], images: ['gorgon.png']}),
                new Monster({ species: 'Medusa', article: '', str: 13, int: 7, dex: 14, health: 18, frequency: 1, treasure: ['D'], images: ['Medusa.png']})
			];

			this.randomMonster = function() {
				
				var monster = diceService.randomElement(this.monsters);
				
/*
				// if he has a list of images, then choose one at random
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
*/				
                return monster;
				
			};


		}

	]);
	
}) (angular.module('CurseApp'));
	