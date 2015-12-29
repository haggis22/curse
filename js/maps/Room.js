"use strict";

(function(isNode, isAngular) {

    // This wrappers function returns the contents of the module, with dependencies
    var RoomModule = function () {

        var Room = function (room) {

            this._id = room._id;
            this.name = room.name;

            this.updated = room.updated;
            this.userID = room.userID;
            this.characters = room.characters || [];
            this.locationID = room.locationID;

        };

        return Room;

    };

    if (isAngular) 
    {
        // AngularJS module definition
        angular.module('CurseApp').
            factory('Room', [RoomModule]);

    } else if (isNode) {
        // NodeJS module definition
        module.exports = RoomModule();
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined'); 
