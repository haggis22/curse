"use strict";

(function(app) {

	app.service('monsterService', ['MonsterType', 'Sex', 'BodyShape', 'diceService', 'treasureService', 'Attack', 'SkillType', 'Skill',
		function(MonsterType, Sex, BodyShape, diceService, treasureService, Attack, SkillType, Skill) {

			this.monsters = [

                // name, species, bodyShape, article, sex, str, int, dex, health, isUndead, frequency, treasure, images
                new MonsterType({ species: 'goblin', str: 5, int: 4, dex: 10, health: 5, skillSet: [ { type: SkillType.prototype.ID_MELEE, min: 15, max: 25} ], frequency: 15, numAppearing: { max: 4 }, treasure: ['A'], images: ['goblin1.jpg', 'goblin2.png']}),
                new MonsterType({ species: 'orc', article: 'an', str: 8, int: 5, dex: 11, health: 10, frequency: 15, numAppearing: { max: 3 }, treasure: ['A'], images: ['orc.png']}),
                new MonsterType({ species: 'troll', str: 13, int: 4, dex: 8, health: 15, frequency: 9, numAppearing: { max: 2 }, treasure: ['A','B'], images: ['troll.png']}),
                new MonsterType({ species: 'ogre', article: 'an', str: 14, int: 3, dex: 7, health: 17, frequency: 7, treasure: ['B'], images: ['ogre.png']}),
                new MonsterType({ species: 'skeleton', isUndead: true, str: 7, int: 0, dex: 9, health: 6, frequency: 14, numAppearing: { max: 3 }, treasure: ['E'], images: ['skeleton1.jpg', 'skeleton2.jpg', 'skeleton3.jpg']}),
                new MonsterType({ species: 'warlock', str: 10, int: 18, dex: 12, health: 18, frequency: 3, treasure: ['C'], images: ['warlock.png']}),
                new MonsterType({ species: 'scorchfire dragon', bodyShape: BodyShape.prototype.WINGED_QUADRUPED, str: 18, int: 16, dex: 14, health: 22, frequency: 1, attacks: [ new Attack({ type: Attack.prototype.BITE, damage: 5, weapon: 'bites' }) ], treasure: ['A','D'], images: ['dragon.png']}),
                new MonsterType({ species: 'giant serpent', bodyShape: BodyShape.prototype.SNAKE, str: 10, int: 0, dex: 8, health: 12, frequency: 8, attacks: [ new Attack({ type: Attack.prototype.BITE, damage: 2, weapon: 'bites' }) ], images: ['serpent.png']}),
                new MonsterType({ species: 'demon', str: 20, int: 22, dex: 15, health: 24, frequency: 0.5, treasure: ['A','C'], images: ['demon.png']}),
                new MonsterType({ species: 'runty goblin', str: 2, int: 2, dex: 6, health: 4, frequency: 6, numAppearing: { min: 2, max: 5 }, images: ['runty.png']}),
                new MonsterType({ species: 'basilisk', bodyShape: BodyShape.prototype.QUADRUPED, str: 6, int: 1, dex: 12, health: 8, frequency: 2, treasure: ['A'], images: ['basilisk.png']}),
                new MonsterType({ species: 'bugbear', str: 10, int: 6, dex: 9, health: 13, frequency: 8, numAppearing: { max: 3 }, treasure: ['A'], images: ['bugbear.png']}),
                new MonsterType({ species: 'chimera', bodyShape: BodyShape.prototype.WINGED_QUADRUPED, str: 15, int: 6, dex: 12, health: 18, frequency: 1, attacks: [ new Attack({ type: Attack.prototype.CLAW, damage: 4, weapon: 'claws' }) ], treasure: ['C','D'], images: ['chimera.png']}),
                new MonsterType({ species: 'ettin', article: 'an', str: 15, int: 3, dex: 12, health: 14, frequency: 3, treasure: ['B'], images: ['Ettin.png']}),
                new MonsterType({ species: 'gargoyle', bodyShape: BodyShape.prototype.WINGED_HUMANOID, str: 14, int: 5, dex: 9, health: 14, frequency: 3, treasure: ['A'], images: ['gargoyle.png']}),
                new MonsterType({ species: 'ghoul', isUndead: true, str: 11, int: 2, dex: 9, health: 9, frequency: 3, numAppearing: { max: 3 }, treasure: ['A'], images: ['ghoul.png']}),
                new MonsterType({ species: 'giant', str: 17, int: 4, dex: 10, health: 18, frequency: 3, treasure: ['A','B'], images: ['giant.png']}),
                new MonsterType({ species: 'golem', str: 17, int: 0, dex: 12, health: 18, frequency: 3, treasure: ['B'], images: ['golem.png']}),
                new MonsterType({ species: 'harpy', bodyShape: BodyShape.prototype.WINGED_HUMANOID, str: 7, int: 8, dex: 14, health: 8, frequency: 4, attacks: [ new Attack({ type: Attack.prototype.CLAW, damage: 3, weapon: 'claws' }) ], treasure: ['A','A'], images: ['harpy.png']}),
                new MonsterType({ species: 'griffin', bodyShape: BodyShape.prototype.WINGED_QUADRUPED, str: 15, int: 3, dex: 12, health: 15, frequency: 3, attacks: [ new Attack({ type: Attack.prototype.CLAW, damage: 4, weapon: 'claws' }) ], treasure: ['A','B','C'], images: []}),
                new MonsterType({ species: 'hobgoblin', str: 8, int: 5, dex: 11, health: 8, frequency: 12, numAppearing: { max: 3 }, treasure: ['A'], images: ['hobgoblin.png']}),
                new MonsterType({ species: 'kobold', str: 4, int: 5, dex: 11, health: 4, frequency: 16, numAppearing: { min: 2, max: 5 }, treasure: ['A'], images: ['kobold.png', 'kobold2.png']}),
                new MonsterType({ species: 'lich', isUndead: true, str: 13, int: 17, dex: 12, health: 18, frequency: 2, treasure: ['C','D'], images: ['lich.png']}),
                new MonsterType({ species: 'lizard man', str: 8, int: 5, dex: 11, health: 9, frequency: 15, numAppearing: { max: 3 }, treasure: ['A','B'], images: ['lizard_man.png']}),
                new MonsterType({ species: 'werewolf', str: 14, int: 7, dex: 14, health: 14, frequency: 6, attacks: [ new Attack({ type: Attack.prototype.CLAW, damage: 4, weapon: 'claws' }) ], treasure: ['A','B'], images: ['werewolf.png']}),
                new MonsterType({ species: 'manticore', bodyShape: BodyShape.prototype.WINGED_QUADRUPED, str: 15, int: 6, dex: 13, health: 15, frequency: 5, attacks: [ new Attack({ type: Attack.prototype.WEAPON, damage: 3, weapon: 'spiked tail' }) ], treasure: ['A','B'], images: ['manticore.png']}),
                new MonsterType({ species: 'minotaur', str: 16, int: 4, dex: 13, health: 14, frequency: 5, treasure: ['A','B'], images: ['minotaur.png']}),
                new MonsterType({ species: 'mummy', isUndead: true, str: 12, int: 0, dex: 6, health: 12, frequency: 8, treasure: ['A','B'], images: ['mummy.png']}),
                new MonsterType({ species: 'vampire', isUndead: true, str: 14, int: 15, dex: 15, health: 15, frequency: 6, treasure: ['A','C','D'], images: ['vampire.png']}),
                new MonsterType({ species: 'zombie', isUndead: true, str: 12, int: 0, dex: 6, health: 12, frequency: 12, numAppearing: { max: 3 }, treasure: ['A'], images: ['zombie.png']}),
                new MonsterType({ species: 'gorgon', str: 12, int: 6, dex: 12, health: 16, frequency: 2, treasure: ['B'], images: ['gorgon.png']}),
                new MonsterType({ species: 'Medusa', article: '', str: 13, int: 7, dex: 14, health: 18, frequency: 1, treasure: ['D'], images: ['Medusa.png']})
			];

			this.randomMonster = function() {
				
				return diceService.randomElement(this.monsters);
				
			};


		}

	]);
	
}) (angular.module('CurseApp'));
	