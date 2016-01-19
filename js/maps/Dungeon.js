"use strict";

(function(isNode, isAngular) {

    // This wrappers function returns the contents of the module, with dependencies
    var DungeonModule = function (Campaign, Room, Creature) {

        var Dungeon = function (dungeon) {

            if (dungeon)
            {
                this.campaign = new Campaign(dungeon.campaign);
                this.room = new Room(dungeon.room);
                if (dungeon.party)
                {
                    this.party = dungeon.party.map(function(character) { return new Creature(character); });
                }

            }

            // make sure the party is at least an empty array at the end of this
            this.party = this.party || [];

        };

        return Dungeon;

    };

    if (isAngular) 
    {
        // AngularJS module definition
        angular.module('CurseApp').
            factory('Dungeon', ['Campaign', 'Room', 'Creature', DungeonModule]);

    } else if (isNode) {
        // NodeJS module definition
        module.exports = DungeonModule(
            require(__dirname + '/../campaigns/Campaign'),
            require(__dirname + '/Room'),
            require(__dirname + '/../creatures/Creature')
        );
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined'); 
