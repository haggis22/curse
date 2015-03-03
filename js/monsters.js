var monsters = [

/*
	{ name: 'goblin', strength: 5, dexterity: 10, health: 5, frequency: 15, treasure:['A'], images: ['goblin1.jpg', 'goblin2.png'] },
	{ name: 'orc', strength: 8, dexterity: 11, health: 10, frequency: 12, treasure:['A'], images: ['orc.png'] },
	{ name: 'troll', strength: 13, dexterity: 8, health: 15 , frequency: 9, treasure:['A','B'], images: ['troll.png'] },
    { name: 'ogre', strength: 14, dexterity:7, health: 17 , frequency: 7, treasure:['B'], images: ['ogre.png']},
    { name: 'skeleton', strength: 7, dexterity:9, health: 6 , frequency: 14, treasure:['E'], images: ['skeleton1.jpg', 'skeleton2.jpg', 'skeleton3.jpg'] },
    { name: 'warlock', strength: 18, dexterity:12, health: 18, frequency: 3, treasure:['C'], images: ['warlock.png'] },
    { name: 'scorchfire dragon', strength: 18, dexterity:14, health: 22, frequency: 1, treasure:['A','D'], images: ['dragon.png']},
    { name: 'serpent', strength: 10, dexterity:8, health: 12, frequency: 8, images: ['serpent.png']},
	{ name: 'demon', strength: 20, dexterity:15, health: 24, frequency: 0.5, treasure:['C'], images: ['demon.png'] },
	{ name: 'runty goblin', strength: 2, dexterity:6, health: 4, frequency: 6, images: ['runty.png'] }
*/
	{ name: 'goblin', strength: 5, dexterity: 10, health: 5, frequency: 15, treasure:['A','A','B','B'], images: ['goblin1.jpg', 'goblin2.png'] },
	{ name: 'orc', strength: 8, dexterity: 11, health: 10, frequency: 12, treasure:['A','A','B','B'], images: ['orc.png'] },
	{ name: 'goblin', strength: 5, dexterity: 10, health: 5, frequency: 15, treasure:['A'], images: ['goblin1.jpg', 'goblin2.png'] },
	{ name: 'orc', strength: 8, dexterity: 11, health: 10, frequency: 12, treasure:['A'], images: ['orc.png'] },
	{ name: 'troll', strength: 13, dexterity: 8, health: 15 , frequency: 9, treasure:['A','B'], images: ['troll.png'] },
    { name: 'ogre', strength: 14, dexterity:7, health: 17 , frequency: 7, treasure:['B'], images: ['ogre.png']},
    { name: 'skeleton', strength: 7, dexterity:9, health: 6 , frequency: 14, treasure:['E'], images: ['skeleton1.jpg', 'skeleton2.jpg', 'skeleton3.jpg'] },
    { name: 'warlock', strength: 18, dexterity:12, health: 18, frequency: 3, treasure:['C'], images: ['warlock.png'] },
    { name: 'scorchfire dragon', strength: 18, dexterity:14, health: 22, frequency: 1, treasure:['A','D'], images: ['dragon.png']},
    { name: 'serpent', strength: 10, dexterity:8, health: 12, frequency: 8, images: ['serpent.png']},
	{ name: 'demon', strength: 20, dexterity:15, health: 24, frequency: 0.5, treasure:['C'], images: ['demon.png'] },
	{ name: 'runty goblin', strength: 2, dexterity:6, health: 4, frequency: 6, images: ['runty.png'] }

];

var monster = null;

function updateMonster()
{
	if (monster == null)
	{
		$('#window-monster').hide();
	}
	else
	{
		$('#window-monster .name').text(monster.name);
		$('#window-monster .strength').text(monster.strength);
		$('#window-monster .dexterity').text(monster.dexterity);
		$('#window-monster .health').text(monster.health);

		var imageHTML = '';
		if (monster.image == null)
		{
			$('#window-monster').find('div.image').hide();
		}
		else
		{
			$('#window-monster').find('div.image').html('<img src="images/' + monster.image + '" style="width: 100%; height: 100%;" />').show();
		}

		$('#window-monster').show();
	}
}

function randomMonster()
{
	var total = 0;
	for ( var m=0; m< monsters.length; m++)
	{
		total= total+monsters[m].frequency;
	}
	
	var index =(Math.random() * total);
	total=0;
	for ( var m=0; m< monsters.length; m++)
	{
		total+=monsters[m].frequency;
		if(total>index)
		{
			var monster = $.extend(true, {}, monsters[m]);
			if (monster.images != null)
			{
				monster.image = monster.images[Math.floor(Math.random() * monster.images.length)];
			}
			
			return monster;
		}
	}
	 
}