"use strict";

(function (isNode, isAngular) {

    // This wrappers function returns the contents of the module, with dependencies
    var OwlModule = function () {
        
        var Owl = function () {

            console.log('Inside the Owl constructor');

            this.hoot = function() {
                console.log('Inner Owl says hoot!');
            };

        };

        return Owl;
    };

    if (isAngular) {
        // AngularJS module definition
        angular.module('CurseApp').factory('Owl', [OwlModule]);
    }
    else if (isNode) {
        // NodeJS module definition
        module.exports = OwlModule();   // could have requires in here
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined');


