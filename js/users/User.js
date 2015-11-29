"use strict";

(function(isNode, isAngular) {

    // This wrappers function returns the contents of the module, with dependencies
    var UserModule = function () {

        var User = function (user) {

            this._id = user._id;
            this.username = user.username;
            this.password = user.password;
            this.updated = user.updated;
            this.session = user.session;

        };

        return User;

    };

    if (isAngular) 
    {
        // AngularJS module definition
        angular.module('CurseApp').
            factory('User', [UserModule]);

    } else if (isNode) {
        // NodeJS module definition
        module.exports = UserModule();
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined'); 
