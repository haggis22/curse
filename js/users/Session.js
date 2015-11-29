"use strict";

(function(isNode, isAngular) {

    // This wrappers function returns the contents of the module, with dependencies
    var SessionModule = function () {

        var Session = function (session) {

            this.username = session.username;
            this.sessionHash = session.sessionHash;

        };

        return Session;

    };

    if (isAngular) 
    {
        // AngularJS module definition
        angular.module('CurseApp').
            factory('Session', [SessionModule]);

    } else if (isNode) {
        // NodeJS module definition
        module.exports = SessionModule();
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined'); 
