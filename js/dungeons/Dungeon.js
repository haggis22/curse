"use strict";

(function(isNode, isAngular) {

    // This wrappers function returns the contents of the module, with dependencies
    var DungeonModule = function () {

        var Dungeon = function (dungeon) {

            if (dungeon)
            {
                this.campaign = dungeon.campaign;
                this.room = dungeon.room;
                this.party = dungeon.party;
            }

        };

        return Dungeon;

    };

    if (isAngular) 
    {
        // AngularJS module definition
        angular.module('CurseApp').
            factory('Dungeon', [DungeonModule]);

    } else if (isNode) {
        // NodeJS module definition
        module.exports = DungeonModule();
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined'); 
