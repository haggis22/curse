"use strict";

(function(app) {

	app.service('treasureService', ['diceService', 'Item', 'BodyPart',

		function(diceService, Item, BodyPart) {

            // function Item(type, name, damage, use, amount, frequency, protects) 

			this.treasures = 
			{
				'A' : [
                        new Item({ type: Item.prototype.GOLD, name: 'gold', article: '', amount: { min: 5, max: 20 } }),
                        new Item({ type: Item.prototype.ARMOUR, name: 'magic codpiece', damage: 5, protects: BodyPart.prototype.GROIN }),
                        new Item({ type: Item.prototype.ARMOUR, name: 'steel underwear', article: '', damage: 3, protects: BodyPart.prototype.BUTT }),
                        new Item({ type: Item.prototype.WEAPON, name: 'club', damage: 2 }),
                        new Item({ type: Item.prototype.WEAPON, name: 'short sword', damage: 3 })
					  ],
				'B' : [
						// B is weapons and armour
                        new Item({ type: Item.prototype.WEAPON, name: 'broadsword', damage: 4 }),
                        new Item({ type: Item.prototype.WEAPON, name: 'mace', damage: 3 }),
                        new Item({ type: Item.prototype.ARMOUR, name: 'breastplate', damage: 3, protects: BodyPart.prototype.TORSO }),
                        new Item({ type: Item.prototype.ARMOUR, name: 'helm', damage: 3, protects: BodyPart.prototype.HEAD })
					  ],
				'C' : [
						// C is magic treasure!
                        new Item({ type: Item.prototype.WEAPON, name: 'Excalibur', article: '', damage: 6 }),
                        new Item({ type: Item.prototype.NECK, name: 'mystic talisman' }),
                        new Item({ type: Item.prototype.POTION, name: 'healing potion', damage: 3, use: Item.prototype.USE_HEAL })
					  ],
				'D' : [
                        new Item({ type: Item.prototype.WEALTH, name: 'jewels', article: '', amount: { min: 1, max: 3 } }),
                        new Item({ type: Item.prototype.ARMOUR, name: 'mithril armour', article: '', damage: 7, protects: BodyPart.prototype.TORSO }),
                        new Item({ type: Item.prototype.WEAPON, name: 'gilded sword', damage: 4 })
					  ],
				'E' : [
                        new Item({ type: Item.prototype.ARMOUR, name: 'rusty chainmail', article: '', damage: 2, protects: BodyPart.prototype.TORSO }),
                        new Item({ type: Item.prototype.SHIELD, name: 'cracked shield', damage: 1 }),
                        new Item({ type: Item.prototype.WEAPON, name: 'bent knife', damage: 1 })
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
	