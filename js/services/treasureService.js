"use strict";

(function(app) {

	app.service('treasureService', ['diceService', 'Item', 'Armour', 'Weapon', 'Shield', 'Potion', 'BodyPart', 

		function(diceService, Item, Armour, Weapon, Shield, Potion, BodyPart) {

            // function Item(type, name, damage, use, amount, frequency, protects) 

			this.treasures = 
			{
				'A' : [
                        new Item({ type: Item.prototype.GOLD, name: 'gold', article: '', amount: { min: 5, max: 20 } }),
                        new Armour({ name: 'magic codpiece', damage: 5, protects: BodyPart.prototype.GROIN }),
                        new Armour({ name: 'steel underwear', article: '', damage: 3, protects: BodyPart.prototype.BUTT }),
                        new Weapon({ name: 'club', damage: 2 }),
                        new Weapon({ name: 'short sword', damage: 3 })
					  ],
				'B' : [
						// B is weapons and armour
                        new Weapon({ name: 'broadsword', damage: 4 }),
                        new Weapon({ name: 'mace', damage: 3 }),
                        new Armour({ name: 'breastplate', damage: 3, protects: BodyPart.prototype.TORSO }),
                        new Armour({ name: 'helm', damage: 3, protects: BodyPart.prototype.HEAD })
					  ],
				'C' : [
						// C is magic treasure!
                        new Weapon({ name: 'Excalibur', article: '', damage: 6 }),
                        new Item({ type: Item.prototype.NECK, name: 'mystic talisman' }),
                        new Potion({ name: 'healing potion', effects: { type: Potion.prototype.EFFECTS_HEAL, damage: { min: 2, max: 4 } }, amount: 1 })
					  ],
				'D' : [
                        new Item({ type: Item.prototype.WEALTH, name: 'jewels', article: '', amount: { min: 1, max: 3 } }),
                        new Armour({ name: 'mithril armour', article: '', damage: 7, protects: BodyPart.prototype.TORSO }),
                        new Weapon({ name: 'gilded sword', damage: 4 })
					  ],
				'E' : [
                        new Armour({ name: 'rusty chainmail', article: '', damage: 2, protects: BodyPart.prototype.TORSO }),
                        new Shield({ name: 'cracked shield', damage: 1 }),
                        new Weapon({ name: 'bent knife', damage: 1 })
					  ]
			};
			
			this.randomTreasure = function(treasureType)
            {
                if (!this.treasures.hasOwnProperty(treasureType))
                {
                    return null;
                }

                var item = diceService.randomElement(this.treasures[treasureType]);
                if (typeof item.amount === 'object')
                {
                    item.amount = diceService.rollDie(item.amount.min, item.amount.max);
                }

                return item;
            
            }

		}

	]);
	
}) (angular.module('CurseApp'));
	