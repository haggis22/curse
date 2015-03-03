var player = 
{
	name: 'Zogarth',
	strength: 20,
	dexterity: 13,
	health: 20,
	gold: 0,
	pack: 
	[
		{ id: 0, type: 'weapon', name: 'dirk', damage: 2, equipped: true },
		{ id: 1, type: 'potion', use: 'heal', name: 'a healing potion', amount:1, frequency: 1, damage: 5 }
	],
	itemCount: 2,
	weapon: null,
	addItem: function(item)
	{
		switch (item.type)
		{
			case 'gold':
				actions.push('You found ' + item.amount + ' gold pieces!');
				player.gold += item.amount;
				break;

			default:
				actions.push('You found ' + item.name );
				// give each item a unique
				item.id = player.itemCount++;
				player.pack.push(item); 
				break; 
		}
		
	},
	checkArmor: function(part)
	{
		for (var a=0; a < player.pack.length; a++)
		{
			var item = player.pack[a];
			if ((item.type == 'armor') && (item.protects == part) && (item.equipped))
			{
				return item;
			}
		}
		
		return null;
	},
	checkWeapon: function()
	{
		for (var a=0; a < player.pack.length; a++)
		{
			var item = player.pack[a];
			if ((item.type == 'weapon') && (item.equipped))
			{
				return item;
			}
		}
		
		return null;
	}

};

function rollDie(min, max)
{
	return Math.floor(Math.random() * (max-min)) + min;
}

function rollStat()
{
	return rollDie(3,8) + rollDie(3,8) + rollDie(3,8);
}

function rollCharacter()
{
	player.strength = rollStat();
	player.dexterity = rollStat();
	player.health = rollStat();
	updatePlayer();
}


function updatePlayer()
{
	$('#window-player .name').text(player.name);
	$('#window-player .strength').text(player.strength);
	$('#window-player .dexterity').text(player.dexterity);
	if (player.health > 0)
	{
		$('#window-player .health').text(player.health);
	}
	else
	{
		$('#window-player .health').html('<span class="dead">DEAD</dead>');
	}			

	$('#window-pack .gold').text(player.gold + ' gold');
	
	var packHTML = '';
	if (player.pack.length == 0)
	{
		packHTML = '[ EMPTY ]';
	}
	else
	{	
		packHTML += '<ul>';
		for (var i=0; i < player.pack.length; i++)
		{
			var item = player.pack[i];
			var itemString = '<li><input type="hidden" name="id" value="' + item.id + '" />' + item.name;
			if (item.equipped)
			{
				itemString += ' (*)';
			}
			itemString += '</li>';
			packHTML += itemString;
		}
		packHTML += '</ul>';
	}
	$('#pack').html(packHTML);
	
}

function lookupItem(itemID)
{
	for (var i=0; i < player.pack.length; i++)
	{
		if (player.pack[i].id == itemID)
		{
			return player.pack[i];
		}
	}
	
	return null;
}
	
function drink(potion)
{
	switch (potion.use)
	{
		case 'heal':
			player.health += potion.damage;
			actions.push('The potion cured you of ' + potion.damage);
			break;
			
	}  // end switch
	
	updateDisplay();
}	
	

function use(itemID)
{
	var item = lookupItem(itemID);
	if (item == null)
	{
		console.error('ItemID ' + itemID + ' not found');
		return;
	}
	
	switch (item.type)
	{
		case 'armor':
			removeArmor(item.protects);
			item.equipped = true;
			break;

		case 'weapon':
			unequip(item.type);
			item.equipped = true;
			break;

		case 'potion':
			drink(item);
			break;

	}  // end switch
	
	updatePlayer();

}

function removeArmor(protects)
{
	for (var a=0; a < player.pack.length; a++)
	{
		var item = player.pack[a];
		if ((item.type == 'armor') && (item.protects == protects))
		{
			item.equipped = false;
		}

	}  // end for
	
}  // removeArmor

function unequip(type)
{
	for (var a=0; a < player.pack.length; a++)
	{
		var item = player.pack[a];
		if (item.type == type)
		{
			item.equipped = false;
		}

	}  // end for
	
}  // removeArmor




$('#pack').on('click', 'li', function() { 

	var itemID = $(this).find('input[name="id"]').val();
	use(itemID);
	
});


