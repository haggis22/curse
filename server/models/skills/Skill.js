"use strict";

var Skill = function (skill) {

    this._id = skill._id;
    this.name = skill.name;
    this.prereqs = skill.prereqs;

};

	
module.exports = Skill;
