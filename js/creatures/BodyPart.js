"use strict";

(function(isNode, isAngular) {

    // This wrappers function returns the contents of the module, with dependencies
    var BodyPartModule = function () {

        var BodyPart = function (part) {
            this.name = part.name;
            this.frequency = part.frequency;
            this.damageFactor = part.damageFactor;
        }

        BodyPart.HEAD = "head";
        BodyPart.TORSO = "torso";
        BodyPart.ARM = "arm";
        BodyPart.GROIN = "groin";
        BodyPart.BUTT = "butt";
        BodyPart.LEG = "leg";
        BodyPart.BODY = "body";
        BodyPart.TAIL = "tail";
        BodyPart.WING = "wing";
        BodyPart.NECK = "neck";

        return BodyPart;
    };

    if (isAngular) 
    {
        // AngularJS module definition
        angular.module('CurseApp').
            factory('BodyPart', [BodyPartModule]);

    } else if (isNode) {
        // NodeJS module definition
        module.exports = BodyPartModule();
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined'); 
