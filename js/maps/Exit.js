"use strict";

(function(isNode, isAngular) {

    // This wrappers function returns the contents of the module, with dependencies
    var ExitModule = function () {

        var Exit = function (exit) {

            if (exit)
            {
                this._id = exit._id;
                this.name = exit.name;

                // destination indicates the locationID of the room to which this exits leads
                this.destination = exit.destination;
            }

        };

        return Exit;

    };

    if (isAngular) 
    {
        // AngularJS module definition
        angular.module('CurseApp').
            factory('Exit', [ExitModule]);

    } else if (isNode) {
        // NodeJS module definition
        module.exports = ExitModule();
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined'); 
