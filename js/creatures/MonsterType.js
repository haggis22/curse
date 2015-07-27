"use strict";

(function(isNode, isAngular) {

    // This wrappers function returns the contents of the module, with dependencies
    var MonsterTypeModule = function (Stat, Sex, Skill, Creature) {

        var MonsterType = function MonsterType(monsterType) {

            // set all the known values
            for (var prop in monsterType)
            {
                if (monsterType.hasOwnProperty(prop))
                {
                    this[prop] = monsterType[prop];
                }
            }

            if (this.sex == null)
            {
                monsterType.sex = Sex.NEUTER;
            }

            if (this.article == null)
            {
                this.article = 'a';
            }

            if (this.numAppearing == null)
            {
                this.numAppearing = { min: 1, max: 1 };
            }

            if (this.numAppearing.min == null) 
            {
                this.numAppearing.min = 1;
            }
            if (this.numAppearing.max == null)
            {
                this.numAppearing.max = 1;
            }

            this.treasure = this.treasure || [];
            this.skillSet = this.skillSet || [];
            this.attacks = this.attacks || [];
            this.images = this.images || [];

        };

        return MonsterType;

    }

    if (isAngular) 
    {
        // AngularJS module definition
        angular.module('CurseApp').
            factory('MonsterType', ['Stat', 'Sex', 'Skill', 'Creature', MonsterTypeModule]);

    } else if (isNode) {
        // NodeJS module definition
        module.exports = MonsterTypeModule(
            require(__dirname + '/Stat'),
            require(__dirname + '/Sex'),
            require(__dirname + '/../skills/Skill'),
            require(__dirname + '/Creature')
        );
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined'); 
