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
