"use strict";

(function (isNode, isAngular) {

    // This wrappers function returns the contents of the module, with dependencies
    var ValueModule = function() {

        var Value = function (value) {

            for (var v = 0; v < Value.denominations.length; v++) {
                var denom = Value.denominations[v];

                this[denom] = (value == null) ? 0 : (value[denom] ? value[denom] : 0);
            }

        };

        Value.denominations = ['gold', 'silver', 'copper'];

        Value.colorUp = function(coppers) {

            var coins = {};
            coins.gold = parseInt(coppers / 100, 10);
            coppers -= coins.gold * 100;

            coins.silver = parseInt(coppers / 10, 10);
            coppers -= coins.silver * 10;

            coins.copper = coppers;

            return coins;

        };

        Value.prototype.getCoppers = function() {

            var coppers = 0;
            
            coppers += (this.hasOwnProperty("gold") ? this.gold * 100 : 0);
            coppers += (this.hasOwnProperty("silver") ? this.silver * 10 : 0);
            coppers += (this.hasOwnProperty("copper") ? this.copper : 0);
    
            return coppers;

        };

        return Value;
    };

    if (isAngular) {
        // AngularJS module definition
        angular.module('CurseApp').factory('Value', [ValueModule]);
    }
    else if (isNode) {
        // NodeJS module definition
        module.exports = ValueModule();   // could have requires in here
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined');
