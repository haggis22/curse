"use strict";

(function(isNode, isAngular) {

    // This wrappers function returns the contents of the module, with dependencies
    var StatModule = function () {

        var Stat = function (stat) {

            if (stat) {
                this.value = stat.value || 0;
                this.max = stat.max || 0;
                this.adjust = stat.adjust || 0;
            }
            else {
                this.value = this.max = this.adjust = 0;
            }
        };

        Stat.stats = [
            { prop: 'str', name: 'Strength' },
            { prop: 'dex', name: 'Dexterity' },
            { prop: 'int', name: 'Intelligence' },
            { prop: 'pie', name: 'Piety' }
        ];

        Stat.statsOrDefault = function (otherStats) {

            var myStats = {};

            Stat.stats.forEach(function (stat) {

                myStats[stat.prop] = (otherStats == null ? new Stat(null) : new Stat(otherStats[stat.prop]));

            });

            return myStats;

        };

        return Stat;
    
    };

    if (isAngular) 
    {
        // AngularJS module definition
        angular.module('CurseApp').
            factory('Stat', [StatModule]);

    } else if (isNode) {
        // NodeJS module definition
        module.exports = StatModule();
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined'); 
