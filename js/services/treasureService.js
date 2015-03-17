"use strict";

(function(app) {

	app.service('treasureService', ['diceService', 'Item', 'BodyPart',

		function(diceService, Item, BodyPart) {

            // function Item(type, name, damage, use, amount, frequency, protects) 

			this.treasures = 
			{
				'A' : [
                        new Item(Item.prototype.GOLD, 'gold', '', null, null, { min: 2, max: 10 }, 1, null),
                        new Item(Item.prototype.ARMOUR, 'magic codpiece', 'a ', 8, null, 1, 1, BodyPart.prototype.GROIN),
                        new Item(Item.prototype.ARMOUR, 'steel underwear', '', 3, null, 1, 1, BodyPart.prototype.BUTT)
					  ],
				'B' : [
						// B is weapons and armour
                        new Item(Item.prototype.WEAPON, 'broadsword', 'a ', 2, null, 1, 1, null),
                        new Item(Item.prototype.WEAPON, 'mace', 'a ', 2, null, 1, 1, null),
                        new Item(Item.prototype.ARMOUR, 'breastplate', 'a ', 5, null, 1, 1, BodyPart.prototype.TORSO),
                        new Item(Item.prototype.ARMOUR, 'helm', 'a ', 4, null, 1, 1, BodyPart.prototype.HEAD)
					  ],
				'C' : [
						// C is magic treasure!
                        new Item(Item.prototype.WEAPON, 'Excalibur', '', 4, null, 1, 1, null),
                        new Item(Item.prototype.NECK, 'mystic talisman', 'a ', null, null, 1, 1, null),
                        new Item(Item.prototype.POTION, 'healing potion', 'a ', 5, Item.prototype.USE_HEAL, 1, 1, null)
					  ],
				'D' : [
                        new Item(Item.prototype.WEALTH, 'jewels', '', null, null, { min: 1, max: 3 }, 1, null),
                        new Item(Item.prototype.ARMOUR, 'mithril armour', '', 10, null, 1, 1, BodyPart.prototype.TORSO),
                        new Item(Item.prototype.WEAPON, 'gilded sword', 'a ', 3, null, 1, 1, null)
					  ],
				'E' : [
                        new Item(Item.prototype.ARMOUR, 'rusty chainmail', '', 2, null, 1, 1, BodyPart.prototype.TORSO),
                        new Item(Item.prototype.SHIELD, 'cracked shield', 'a ', 1, null, 1, 1, null),
                        new Item(Item.prototype.WEAPON, 'bent knife', 'a ', 1, null, 1, 1, null)
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
	