var Creature = require('./../models/creatures/Creature.js');

var characters = [
        new Creature({ name: 'Zogarth', class: 'Fighter'}),
        new Creature({name: 'Zachary', class: 'Thief'}),
        new Creature({name: 'Quasimatium', class: 'Cleric'})
    ];

exports.findAll = function (req, res) {

    res.send(characters);

};


exports.findByName = function (req, res) {

    var char = null;
    for (var c = 0; c < characters.length; c++) {
        if (characters[c].name.toLowerCase() == req.params.name.toLowerCase()) {
            char = characters[c];
            break;
        }
    }

    res.send(char);
};

