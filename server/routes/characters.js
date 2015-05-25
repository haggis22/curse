var characters = [
        { name: 'Zogarth', class: 'Fighter' },
        { name: 'Zachary', class: 'Thief' },
        { name: 'Quasimatium', class: 'Cleric' }
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

