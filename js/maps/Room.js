"use strict";

(function(isNode, isAngular) {

    // This wrappers function returns the contents of the module, with dependencies
    var RoomModule = function (Exit, ItemFactory) {

        var Room = function (room) {

            if (room)
            {
                this._id = room._id;
                this.name = room.name;
                this.prep = room.prep;
                this.campaignID = room.campaignID;
                this.exits = room.exits ? room.exits.map(function(exit) { return new Exit(exit); }) : [];
                this.items = room.items ? room.items.map(function(item) { return ItemFactory.createItem(item); }) : [];
            }

            if (!this.exits)
            {
                this.exits = [];
            }

            if (!this.items)
            {
                this.items = [];
            }

        };

        Room.prototype.findExit = function(exitID)
        {
            for (var x=0; x < this.exits.length; x++)
            {
                if (this.exits[x]._id.toString() == exitID)
                {
                    return this.exits[x];
                }
            }

            return null;

        };

        Room.prototype.findItem = function(itemID)
        {
            for (var i=0; i < this.items.length; i++)
            {
                if (this.items[i]._id.toString() == itemID)
                {
                    return this.items[i];
                }
            }

            return null;

        };

        Room.prototype.removeItem = function(itemID)
        {
            var newItems = [];

            for (var i=0; i < this.items.length; i++)
            {
                if (this.items[i]._id.toString() != itemID)
                {
                    newItems.push(this.items[i]);
                }
            }

            this.items = newItems;

        };

        return Room;

    };

    if (isAngular) 
    {
        // AngularJS module definition
        angular.module('CurseApp').
            factory('Room', ['Exit', 'ItemFactory', RoomModule]);

    } else if (isNode) {
        // NodeJS module definition
        module.exports = RoomModule
        (
            require(__dirname + '/Exit'),
            require(__dirname + '/../items/ItemFactory')
        );
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined'); 
