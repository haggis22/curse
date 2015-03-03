var actions = [];

function clearActions()
{
	actions.length = 0;
}

function enterDungeon()
{
	var nameInput = $('#window-player').find('input[name="name"]');
	player.name = nameInput.val();
	nameInput.hide();
	$('#window-player').find('div.name').show();
	
	updateDisplay('move');
}


function lookForTrouble()
{
	
	monster = randomMonster();
	clearActions();
	updateDisplay('battle');

}

function updateDisplay(group)
{
	updatePlayer();
	updateMonster();
	
	var actionHtml = '<ul>';
	for (var a=0; a < actions.length; a++)
	{
		actionHtml += '<li>' + actions[a] + '</li>';
	}
	actionHtml += '<ul>';

	// show the actions in an unorderered list
	$('#window-actions').html(actionHtml);
	
	if (group != null)
	{
		$('#window-buttons div.group.' + group).show();
		$('#window-buttons div.group:not(.' + group + ')').hide();
	}
}


$(function() {

	$('#button-stats').click(rollCharacter);
	$('#button-enter').click(enterDungeon);
	$('#button-trouble').click(lookForTrouble);
	$('#button-attack').click(fightRound);
	$('#button-retreat').click(retreat);
	$('#button-loot').click(searchForTreasure);

	rollCharacter();
	updateDisplay('create');
	
});
