function attack()
{
	var roll = Math.random() * 20;
	if (roll < player.dexterity)
	{
		var weapon = player.checkWeapon();
		if (weapon == null)
		{
			weapon = 
			{
				name: 'fist',
				damage: 0
			};
		}

		var damage = Math.floor(Math.random() * player.strength / 5) + 1;
		if (weapon.damage != null)
		{
			damage += weapon.damage;
		}
		
		actions.push('You hit the ' + monster.name + ' with your ' + weapon.name + ' for ' + damage + ' damage!');

		// Math.max will ensure the health can't go below zero. Negative health would just look weird
		monster.health = Math.max(0, monster.health - damage);
		
		if (monster.health == 0)
		{
			actions.push('You killed the ' + monster.name + '!!!');
		}
		
	}
	else
	{
		actions.push('You tried to hit the ' + monster.name + ' but missed...');
	}
	
	
}

function monsterAttack()
{
	var roll = Math.random() * 20;
	if (roll < monster.dexterity)
	{
		var damage = Math.floor(Math.random() * monster.strength) + 1;
		var bodyPart = determineBodyPart();
		
		actions.push('The ' + monster.name + ' hit you for ' + damage + ' damage in the ' + bodyPart + '!');
		var armor = player.checkArmor(bodyPart);
		if (armor != null)
		{
			var absorbed = Math.min(damage, armor.damage);
			
			actions.push('Your ' + armor.name + ' absorbed ' + absorbed + ' of the damage');
			damage = Math.max(damage - absorbed, 0);
		}

		// Math.max will ensure the health can't go below zero. Negative health would just look weird
		player.health = Math.max(0, player.health - damage);
	}
	else
	{
		actions.push('The ' + monster.name + ' swung and missed...');
	}
	
	if (player.health <= 0)
	{
		actions.push('The monster killed you!!!');
	}
	
}

function fightRound()
{
	clearActions();
	
	if (player.health > 0)
	{
		attack();
	}
	if (monster.health > 0)
	{
		monsterAttack();	
	}

	updateDisplay('battle');
	
	if (monster.health == 0)
	{
		updateDisplay('loot');
		return;
	}
	
	if (player.health == 0)
	{
		updateDisplay('dead');
	}
	
}	

function retreat()
{
	actions.push('The ' + monster.name + ' attacks you as you run away...');
	monsterAttack();

	if (player.health == 0)
	{
		action.push('The ' + monster.name + ' killed you!!!');
		updateDisplay('dead');
	}
	else
	{
		updateDisplay('move');
	}
	
}


function determineBodyPart()
{
	var roll = Math.random();
	if (roll < 0.20)
	{
		return 'head';
	}
	if (roll < 0.70)
	{
		return 'torso';
	}
	if (roll < 0.80)
	{
		return 'arm';
	}
	if (roll < 0.85)
	{
		return 'groin';
	}
	if (roll < 0.9)
	{
		return 'butt';
	}

	return 'leg';
}
