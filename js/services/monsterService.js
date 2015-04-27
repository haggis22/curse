"use strict";

(function(app) {

	app.service('monsterService', ['MonsterType', 'Sex', 'BodyShape', 'diceService', 'treasureService', 'SkillType', 'BiteAttack', 'WeaponAttack', 'Weapon', 'StoneGaze', 
		function(MonsterType, Sex, BodyShape, diceService, treasureService, SkillType, BiteAttack, WeaponAttack, Weapon, StoneGaze) {

            this.monsters = [

                // name, species, bodyShape, article, sex, str, int, dex, health, isUndead, frequency, treasure, images
                new MonsterType({ species: 'goblin', str: { min: 4, max: 6 }, int: { min: 3, max: 5 }, dex: { min: 7, max: 11 }, health: { min: 4, max: 6 }, skillSet: [ { name: "melee", min: 15, max: 25} ], frequency: 15, numAppearing: { min: 2, max: 4 }, treasure: ['A'], images: ['goblin1.jpg', 'goblin2.png']}),
                new MonsterType({ species: 'orc', article: 'an', str: 8, int: 5, dex: 11, health: 10,skillSet: [ { name: "melee", min: 15, max: 18 } ] , frequency: 15, numAppearing: { max: 3 }, treasure: ['A'], images: ['orc.png']}),
                new MonsterType({ species: 'troll', str: 13, int: 4, dex: 8, health: 15,skillSet: [ { name: "melee", min: 14, max: 18 } ] , frequency: 9, numAppearing: { max: 2 }, treasure: ['A','B'], images: ['troll.png']}),
                new MonsterType({ species: 'ogre', article: 'an', str: 14, int: 3, dex: 7, health: 17,skillSet: [ { name: "melee", min: 14, max: 20 } ] , frequency: 7, treasure: ['B'], images: ['ogre.png']}),
                new MonsterType({ species: 'skeleton', isUndead: true, str: 7, int: 0, dex: 9, health: 6,skillSet: [ { name: "melee", min: 8, max: 10 } ] , frequency: 14, numAppearing: { max: 3 }, treasure: ['E'], images: ['skeleton1.jpg', 'skeleton2.jpg', 'skeleton3.jpg']}),
                new MonsterType({ species: 'warlock', str: 10, int: 18, dex: 12, health: 18,skillSet: [ { name: "melee", min: 16, max: 20} ] , frequency: 3, sex: Sex.prototype.MALE, treasure: ['C'], images: ['warlock.png']}),
                new MonsterType({ species: 'scorchfire dragon', bodyShape: BodyShape.prototype.WINGED_QUADRUPED, str: 18, int: 16, dex: 14, health: 22, skillSet: [ { name: "melee", min: 18, max: 22 } ] ,frequency: 1, attacks: [ new BiteAttack({ damage: { min: 2, max: 5 }, description: 'bites' }) ], treasure: ['A','D'], images: ['dragon.png']}),
                new MonsterType({ species: 'giant serpent', bodyShape: BodyShape.prototype.SNAKE, str: 10, int: 0, dex: 8, health: 12,skillSet: [ { name: "melee", min: 6, max: 8 } ] , frequency: 8, attacks: [ new BiteAttack({ damage: { min: 1, max: 2 }, description: 'bites' }) ], images: ['serpent.png']}),
                new MonsterType({ species: 'demon', str: 20, int: 22, dex: 15, health: 24, skillSet: [ { name: "melee", min: 18, max: 30 } ] ,frequency: 0.5, treasure: ['A','C'], images: ['demon.png']}),
                new MonsterType({ species: 'runty goblin', str: 2, int: 2, dex: 6, health: 4,skillSet: [ { name: "melee", min: 6, max: 8 } ] , frequency: 6, numAppearing: { min: 2, max: 5 }, images: ['runty.png']}),
                new MonsterType({ species: 'basilisk', bodyShape: BodyShape.prototype.QUADRUPED, str: 6, int: 1, dex: 12, health: 8,skillSet: [ { name: "melee", min: 14, max: 15 } ] , frequency: 2, treasure: ['A'], images: ['basilisk.png']}),
                new MonsterType({ species: 'bugbear', str: 10, int: 6, dex: 9, health: 13,skillSet: [ { name: "melee", min: 14, max: 18 } ] , frequency: 8, numAppearing: { max: 3 }, treasure: ['A'], images: ['bugbear.png']}),
                new MonsterType({ species: 'chimera', bodyShape: BodyShape.prototype.WINGED_QUADRUPED, str: 15, int: 6, dex: 12, health: 18,skillSet: [ { name: "melee", min: 16, max: 20 } ] , frequency: 1, attacks: [ new BiteAttack({ damage: { min: 2, max: 4 }, description: 'claws' }) ], treasure: ['C','D'], images: ['chimera.png']}),
                new MonsterType({ species: 'ettin', article: 'an', str: 15, int: 3, dex: 12, health: 14,skillSet: [ { name: "melee", min: 16, max: 18 } ] , frequency: 3, treasure: ['B'], images: ['Ettin.png']}),
                new MonsterType({ species: 'gargoyle', bodyShape: BodyShape.prototype.WINGED_HUMANOID, str: 14, int: 5, dex: 9, health: 14,skillSet: [ { name: "melee", min: 14, max: 17 } ] , frequency: 3, treasure: ['A'], images: ['gargoyle.png']}),
                new MonsterType({ species: 'ghoul', isUndead: true, str: 11, int: 2, dex: 9, health: 9, useWeapons: false, useArmour: false, skillSet: [ { name: "melee", min: 14, max: 16 } ] , frequency: 3, numAppearing: { max: 3 }, treasure: ['A'], images: ['ghoul.png']}),
                new MonsterType({ species: 'giant', str: 17, int: 4, dex: 10, health: 18,skillSet: [ { name: "melee", min: 16, max: 24 } ] , frequency: 3, treasure: ['A','B'], images: ['giant.png']}),
                new MonsterType({ species: 'golem', str: 17, int: 0, dex: 12, health: 18, useWeapons: false, useArmour: false, skillSet: [ { name: "melee", min: 15, max: 28 } ] ,frequency: 3, treasure: ['B'], images: ['golem.png']}),
                new MonsterType({ species: 'harpy', bodyShape: BodyShape.prototype.WINGED_HUMANOID, str: 7, int: 8, dex: 14, health: 8, useWeapons: false, useArmour: false, skillSet: [ { name: "melee", min: 14, max: 16 } ] , frequency: 4, sex: Sex.prototype.FEMALE, attacks: [ new BiteAttack({ damage: { min: 2, max: 3 }, description: 'claws' }) ], treasure: ['A','A'], images: ['harpy.png']}),
                new MonsterType({ species: 'griffin', bodyShape: BodyShape.prototype.WINGED_QUADRUPED, str: 15, int: 3, dex: 12, health: 15, skillSet: [ { name: "melee", min: 15, max: 19 } ] ,frequency: 3, attacks: [ new BiteAttack({ damage: { min: 2, max: 4 }, description: 'claws' }) ], treasure: ['A','B','C'], images: []}),
                new MonsterType({ species: 'hobgoblin', str: 8, int: 5, dex: 11, health: 8, skillSet: [ { name: "melee", min: 16, max: 26 } ] ,frequency: 12, numAppearing: { max: 3 }, treasure: ['A'], images: ['hobgoblin.png']}),
                new MonsterType({ species: 'kobold', str: 4, int: 5, dex: 11, health: 4,skillSet: [ { name: "melee", min: 14, max: 16 } ] , frequency: 16, numAppearing: { min: 2, max: 5 }, treasure: ['A'], images: ['kobold.png', 'kobold2.png']}),
                new MonsterType({ species: 'lich', isUndead: true, str: 13, int: 17, dex: 12, health: 18,skillSet: [ { name: "melee", min: 14, max: 16 } ] , frequency: 2, treasure: ['C','D'], images: ['lich.png']}),
                new MonsterType({ species: 'lizard man', str: 8, int: 5, dex: 11, health: 9,skillSet: [ { name: "melee", min: 14, max: 16 } ] , frequency: 15, numAppearing: { max: 3 }, treasure: ['A','B'], images: ['lizard_man.png']}),
                new MonsterType({ species: 'werewolf', str: 14, int: 7, dex: 14, health: 14, useWeapons: false, useArmour: false, skillSet: [ { name: "melee", min: 14, max: 16 } ] ,frequency: 6, attacks: [ new BiteAttack({ damage: { min: 2, max: 4 }, description: 'claws' }) ], treasure: ['A','B'], images: ['werewolf.png']}),
                new MonsterType({ species: 'manticore', bodyShape: BodyShape.prototype.WINGED_QUADRUPED, str: 15, int: 6, dex: 13, health: 15,skillSet: [ { name: "melee", min: 14, max: 16 } ] , frequency: 5, attacks: [ new BiteAttack({ damage: { min: 2, max: 4 }, description: 'bites' }), new BiteAttack({ damage: { min: 2, max: 3 }, description: 'claws' }), new WeaponAttack({ weapon: new Weapon({ name: 'spiked tail', damage: { min: 2, max: 3 }, skills: [ 'melee' ] }) })], treasure: ['A','B'], images: ['manticore.png']}),
                new MonsterType({ species: 'minotaur', str: 16, int: 4, dex: 13, health: 14,skillSet: [ { name: "melee", min: 14, max: 16 } ] , frequency: 5, treasure: ['A','B'], images: ['minotaur.png']}),
                new MonsterType({ species: 'mummy', isUndead: true, str: 12, int: 0, dex: 6, health: 12, useWeapons: false, useArmour: false, skillSet: [ { name: "melee", min: 6, max: 12 } ] , frequency: 8, treasure: ['A','B'], images: ['mummy.png']}),
                new MonsterType({ species: 'vampire', isUndead: true, str: 14, int: 15, dex: 15, health: 15,skillSet: [ { name: "melee", min: 30, max: 50 } ] , frequency: 6, treasure: ['A','C','D'], images: ['vampire.png']}),
                new MonsterType({ species: 'zombie', isUndead: true, str: 12, int: 0, dex: 6, health: 12, useWeapons: false, useArmour: false, skillSet: [ { name: "melee", min: 7, max: 12 } ] ,frequency: 12, numAppearing: { max: 3 }, treasure: ['A'], images: ['zombie.png']}),
                new MonsterType({ species: 'gorgon', str: 12, int: 6, dex: 12, health: 16,skillSet: [ { name: "melee", min: 14, max: 16 } ] , frequency: 2, sex: Sex.prototype.FEMALE, treasure: ['B'], images: ['gorgon.png']}),
                new MonsterType({ species: 'Medusa', article: '', str: 13, int: 7, dex: 14, health: 18, skillSet: [ { name: "melee", min: 14, max: 16 } ], attacks: [ new StoneGaze() ], frequency: 111111, sex: Sex.prototype.FEMALE, treasure: ['D'], images: ['Medusa.png']}),
                // TODO: Eye Beams are not weapons!
                new MonsterType({ species: "beholder", bodyShape: BodyShape.prototype.SNAKE, str: { min: 9, max: 11 }, int: { min: 7, max: 10 }, dex: { min: 12, max: 14 }, health: { min: 14, max: 15 },skillSet: [ { name: "melee", min: 14, max: 16 } ] , frequency: 4 , attacks: [ new WeaponAttack({ weapon: new Weapon({ name: 'eye beams', article: 'an', damage: { min: 2, max: 4 } }) })] , treasure: [ 'A' ] , images: ['beholder.jpg'] }),
                new MonsterType({ species: "Yuan-ti", str: { min: 10, max: 12 }, int: { min: 6, max: 8 }, dex: { min: 12, max: 15 }, health: { min: 14, max: 16 }, skillSet: [ { name: "melee", min: 14, max: 16 } ] ,frequency: 5 , treasure: [ 'A', 'B' ] , images: ['yuan-ti1.jpg', 'yuan-ti2.jpg' ] }),
                new MonsterType({ species: "zorbo", bodyShape: BodyShape.prototype.QUADRUPED, str: { min: 8, max: 10 }, int: { min: 4, max: 6 }, dex: { min: 8, max: 11 }, health: { min: 8, max: 9 },skillSet: [ { name: "melee", min: 14, max: 16 } ] , frequency: 5 , attacks: [ new BiteAttack({ damage: { min: 1, max: 2 }, description: 'claws' }), new BiteAttack({ damage: { min: 1, max: 3 }, description: 'bites' }) ] , treasure: [ 'E' ] , images: [] }),
                // TODO: psionic attacks are not weapons!
                new MonsterType({ species: "mind flayer", useWeapons: false, str: { min: 14, max: 16 }, int: { min: 10, max: 14 }, dex: { min: 12, max: 15 }, health: { min: 10, max: 18 }, frequency: 3, numAppearing: { min: 1, max: 2 } , skillSet: [ { name: "melee", min: 14, max: 18 } ] , attacks: [ new WeaponAttack({ weapon: new Weapon({ name: 'psionic drain', damage: { min: 4, max: 5 } }) })] , treasure: [ 'A', 'D' ] , images: ['mindflayer1.jpg', 'mindflayer2.jpg'] }),
                new MonsterType({ species: "githyanki captain", sex: Sex.prototype.MALE, str: { min: 12, max: 16 }, int: { min: 8, max: 10 }, dex: { min: 10, max: 14 }, health: { min: 9, max: 13 }, frequency: 3, numAppearing: { min: 1, max: 1 } , skillSet: [ { name: "melee", min: 18, max: 20 } ] , treasure: [ 'A', 'B' ] , images: ['githyanki2.jpg'] }),
                new MonsterType({ species: "githyanki knight", sex: Sex.prototype.MALE, str: { min: 10, max: 14 }, int: { min: 6, max: 8 }, dex: { min: 9, max: 12 }, health: { min: 6, max: 14 }, frequency: 4, numAppearing: { min: 1, max: 2 } , skillSet: [ { name: "melee", min: 16, max: 18 } ] , treasure: [ 'B', 'A' ] , images: ['githyanki1.jpg'] }),
                new MonsterType({ species: "necrophidius", bodyShape: BodyShape.prototype.SNAKE, useWeapons: false, useArmour: false, str: { min: 6, max: 10 }, int: { min: 4, max: 6 }, dex: { min: 8, max: 10 }, health: { min: 3, max: 8 }, frequency: 3, numAppearing: { min: 1, max: 1 } , skillSet: [ { name: "melee", min: 14, max: 15 } ] , attacks: [ new BiteAttack({ damage: { min: 1, max: 8 }, description: 'bites' }) ] , treasure: [ 'D', 'C' ] , images: ['necrophidius.jpg'] }),
                // TODO: Eye Beams are not weapons!
                new MonsterType({ species: "spectator", bodyShape: BodyShape.prototype.SNAKE, useWeapons: false, useArmour: false, str: { min: 6, max: 11 }, int: { min: 8, max: 14 }, dex: { min: 8, max: 12 }, health: { min: 8, max: 14 }, frequency: 3, numAppearing: { min: 1, max: 1 } , skillSet: [ { name: "melee", min: 12, max: 16 } ] , attacks: [ new BiteAttack({ damage: { min: 1, max: 4 }, description: 'bites' }), new WeaponAttack({ weapon: new Weapon({ name: 'eye beams', damage: { min: 2, max: 5 } }) })] , treasure: [ 'D', 'C' ] , images: ['spectator.jpg'] }),
                new MonsterType({ species: "aurumvorax", article: 'an', bodyShape: BodyShape.prototype.QUADRUPED, useWeapons: false, useArmour: false, str: { min: 8, max: 11 }, int: { min: 8, max: 12 }, dex: { min: 9, max: 13 }, health: { min: 8, max: 14 }, frequency: 4, numAppearing: { min: 1, max: 1 } , skillSet: [ { name: "melee", min: 14, max: 16 } ] , attacks: [ new BiteAttack({ damage: { min: 1, max: 4 }, description: 'bites' }), new BiteAttack({ damage: { min: 3, max: 5 }, description: 'claws' }) ] , treasure: [ 'A', 'B' ] , images: ['aurumvorax.jpg'] }),
                new MonsterType({ species: "tribble", bodyShape: BodyShape.prototype.SNAKE, useWeapons: false, useArmour: false, str: { min: 2, max: 8 }, int: { min: 1, max: 2 }, dex: { min: 8, max: 10 }, health: { min: 2, max: 7 }, frequency: 5, numAppearing: { min: 1, max: 12 } , skillSet: [ { name: 'melee', min: 14, max: 18 } ] , attacks: [ new BiteAttack({ description: 'bites', damage: { min: 1, max: 2 } }) ] , images: ['tribble.png'] })
			];

			this.randomMonster = function() {
				
				return diceService.randomElement(this.monsters);
				
			};


		}

	]);
	
}) (angular.module('CurseApp'));
	