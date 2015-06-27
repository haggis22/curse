"use strict";

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

module.exports = BodyPart;
