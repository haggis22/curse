var Stat = require(__dirname + '/models/creatures/Stat');
var Creature = require(__dirname + '/models/creatures/Creature');

var Item = require(__dirname + '/models/items/Item');
var Weapon = require(__dirname + '/models/items/Weapon');
var Armour = require(__dirname + '/models/items/Armour');
var Shield = require(__dirname + '/models/items/Shield');
var Potion = require(__dirname + '/models/items/Potion');

var BodyShape = require(__dirname + '/models/creatures/BodyShape');

var MonsterType = require(__dirname + '/models/creatures/MonsterType');


var shield = new Shield({ name: 'cracked shield' });

console.log('I am holding ' + shield.getName(false) + '. It is my friend.');

/*

var danny = new Creature({ name: 'Danny the Magnificent', health: new Stat({ value: 14, max: 36 }) });

// console.log('New Creature: ' + danny.getName());

var potion = new Potion({ name: 'healing potion', effects: { type: Potion.EFFECTS.ANTIVENOM, damage: { min: 2, max: 14} }, amount: 1, weight: 3 });

var result = potion.use(danny);

// console.log('result.success = ' + result.success);
// console.log('message: ' + result.message);


var goblinType = new MonsterType({ species: 'goblin', stats: { str: { min: 4, max: 6 }, int: { min: 3, max: 5 }, dex: { min: 7, max: 11} }, health: { min: 4, max: 6 }, skillSet: [{ name: "melee", min: 15, max: 25}], frequency: 15, numAppearing: { min: 2, max: 4 }, treasure: ['A'], images: ['goblin1.jpg', 'goblin2.png'] });

var monsters = goblinType.spawn();

console.log('There are ' + monsters.length + ' goblin(s)');

monsters.forEach(function (monster, index) {

    console.log(monster.getName(null) + ' #' + index);
    for (var prop in monster.stats) {
        if (monster.stats.hasOwnProperty(prop)) {
            console.log('  ' + prop + ': ' + monster.stats[prop].value + ' / ' + monster.stats[prop].max);
        }
    }

});

*/



