var treasures = 
{
	'A' : [
			{ type: 'gold', minAmount: 2, maxAmount: 10, frequency: 1 },
			{ type: 'armor', protects: 'groin', name: 'magic codpiece', amount: 1, frequency: 1, damage: 8 },
			{ type: 'armor', protects: 'butt', name: 'steel underwear', amount: 1, frequency: 1, damage: 3 }
		  ],
	'B' : [
			// B is weapons and armor
			{ type: 'weapon', name: 'a broadsword', amount:1, frequency: 1, damage: 2 },
			{ type: 'weapon', name: 'a mace', amount:1, frequency: 1, damage: 2 },
			{ type: 'armor', protects: 'torso', name: 'a breastplate', amount:1, frequency: 1, damage: 5 },
			{ type: 'armor', protects: 'head', name: 'a helm', amount:1, frequency: 1, damage: 4 }
		  ],
	'C' : [
			// C is magic treasure
			{ type: 'weapon', name: 'Excalibur', amount:1, frequency: 1, damage: 4 },
			{ type: 'neck', name: 'a mystic talisman', amount:1, frequency: 1 },
			{ type: 'potion', use: 'heal', name: 'a healing potion', amount:1, frequency: 1, damage: 5 }
		  ],
	'D' : [
			{ type: 'wealth', name: 'jewels', minAmount: 1, maxAmount: 3, frequency: 1 },
			{ type: 'armor', protects: 'torso', name: 'mithril armor', amount:1, frequency: 1, damage: 10 },
			{ type: 'weapon', name: 'gilded sword', amount:1, frequency: 1, damage: 3 }
		  ],
	'E' : [
			{ type: 'armor', protects: 'torso', name: 'rusty chainmail', amount:1, frequency: 1, damage: 2 },
			{ type: 'shield', name: 'cracked shield', amount:1, frequency: 1 },
			{ type: 'weapon', name: 'bent knife', amount:1, frequency: 1, damage: 1 }
		  ]
}
		  
function randomTreasure(treasureType)
{
	var total = 0;
	for ( var t=0; t < treasures[treasureType].length; t++)
	{
		total= total+treasures[treasureType][t].frequency;
	}
	
	var index =(Math.random() * total);
	total=0;

	var treasure = null;

	for ( var t=0; t< treasures[treasureType].length; t++)
	{
		total= total+treasures[treasureType][t].frequency;
		if(total>index)
		{
			treasure = $.extend(true, {}, treasures[treasureType][t]);
			break;
		}
	}
	
	if (treasure.amount==null)
	{
		treasure.amount = Math.floor(Math.random() * (treasure.maxAmount - treasure.minAmount)) + treasure.minAmount;
	}
	
	return treasure; 
}


function calculateTreasure(treasureTypes)
{
	var loot=[];
	if (treasureTypes==null)
	{
		return loot;
	}
	if (treasureTypes.length==0)
	{
		return loot;
	}

	for (var t=0; t < treasureTypes.length; t++)
	{
		loot.push(randomTreasure(treasureTypes[t]));
	}

	return loot;
}

function searchForTreasure()
{
	clearActions();
	
	var treasures = calculateTreasure(monster.treasure);
	
	if (treasures.length == 0)
	{
		actions.push('You didn\'t find any treasure.');
	}
	else
	{
		for (var t=0; t < treasures.length; t++)
		{
			player.addItem(treasures[t]);
			
		} //end 'for' loop
	} //treasure length greater than 0

	updateDisplay('move');
	
}
